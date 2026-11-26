import { cleanup, render, screen } from '@testing-library/react'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { api, ApiError, tokenStorage } from '../src/api/client'
import { dadosParaApi } from '../src/features/acesso/cadastro'
import type { Usuario } from '../src/types/usuario'

// Executar somente contra uma cópia descartável do backend, com banco vazio.
const base = process.env.SPACE_JAM_API_TEST_URL
const ativacao = process.env.SPACE_JAM_TEST_ACTIVATION_CODE
const pastaEmails = process.env.SPACE_JAM_TEST_MAIL_DIR
const grupo = describe.skipIf(!base || !ativacao)
const senha = 'Acesso#Teste2026'
const senhaAlterada = 'Integracao#Segura456'
const senhaRecuperada = 'Recuperacao#Segura789'
const esperaHttp = { timeout: 5000 }
let treinador: Usuario
let aluno: Usuario

function abrir(caminho: string) {
  window.history.replaceState({}, '', caminho)
  const tela = render(<App />)
  return { pessoa: userEvent.setup(), tela }
}
async function entrarTreinador() {
  const { pessoa } = abrir('/login?perfil=treinador')
  await pessoa.type(screen.getByLabelText('E-mail'), 'treinador.integracao@example.com')
  await pessoa.type(screen.getByLabelText('Senha', { exact: true }), senha)
  await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
  await screen.findByRole('heading', { name: 'Minha conta' }, esperaHttp)
  return pessoa
}

async function entrarAluno() {
  const { pessoa } = abrir('/login')
  await pessoa.type(screen.getByLabelText('Apelido'), 'aluno.integracao')
  await pessoa.type(screen.getByLabelText('Senha', { exact: true }), senha)
  await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
  await screen.findByRole('heading', { name: 'Minha conta' }, esperaHttp)
  return pessoa
}

function loginAluno(senhaInformada: string) {
  return api('/auth/login/aluno/', {
    method: 'POST',
    body: JSON.stringify({ apelido: 'aluno.integracao', senha: senhaInformada }),
  }, false)
}

grupo('HTTP real pelo proxy do frontend', { timeout: 15000 }, () => {
  beforeAll(() => {
    const alvo = new URL(base!)
    if (!['127.0.0.1', 'localhost'].includes(alvo.hostname)) throw new Error('Use somente um ambiente local descartável.')
    vi.stubEnv('VITE_API_URL', base!)
  })
  afterAll(() => { vi.unstubAllEnvs(); window.history.replaceState({}, '', '/') })

  it('US02: cadastra treinador e devolve seu código persistido', async () => {
    treinador = await api<Usuario>('/auth/cadastro/treinador/', { method: 'POST', body: JSON.stringify(dadosParaApi('TREINADOR', {
      nome: 'Treinador', sobrenome: 'Integração', apelido: 'treinador.integracao', email: 'treinador.integracao@example.com', telefone: '61999990000', senha, codigoAtivacao: ativacao!,
    }, true)) }, false)
    expect(treinador.codigo_convite).toMatch(/^TRN-[A-Z0-9]{6}$/)
    expect(treinador.papel).toBe('TREINADOR')
    expect(treinador.termos_pendentes).toBe(false)
  })
  it('US01: cadastra aluno adulto com medidas e vínculo reais', async () => {
    aluno = await api<Usuario>('/auth/cadastro/aluno/', { method: 'POST', body: JSON.stringify(dadosParaApi('ALUNO', {
      nome: 'Aluno', sobrenome: 'Integração', apelido: 'aluno.integracao', email: 'aluno.integracao@example.com', senha, codigoTreinador: treinador.codigo_convite!, dataNascimento: '2000-01-01', altura: '185', peso: '80,5', envergadura: '190', frequencia: '3', objetivos: 'Melhorar o arremesso',
    }, true)) }, false)
    expect(aluno.papel).toBe('ALUNO')
    expect(aluno).toMatchObject({ treinador: treinador.id, perfil_aluno: { altura: '1.85', peso: '80.50', envergadura: '1.90', frequencia_semanal: 3 } })
  })
  it('US05: entra por e-mail e recupera o perfil real do treinador', async () => {
    await entrarTreinador()
    expect(screen.getByText('treinador.integracao@example.com')).toBeTruthy()
    expect(tokenStorage.get()).toBeTruthy()
    expect(localStorage.getItem('refresh_token')).toBeTruthy()
    expect(await api<Usuario>('/auth/me/')).toMatchObject({ id: treinador.id, codigo_convite: treinador.codigo_convite })
  })
  it('US04: entra por apelido e restaura a sessão após remontar a aplicação', async () => {
    const { pessoa, tela } = abrir('/login')
    await pessoa.type(screen.getByLabelText('Apelido'), 'aluno.integracao')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), senha)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    await screen.findByRole('heading', { name: 'Minha conta' }, esperaHttp)
    tela.unmount(); render(<App />)
    expect(await screen.findByRole('heading', { name: 'Minha conta' }, esperaHttp)).toBeTruthy()
    expect(await api<Usuario>('/auth/me/')).toMatchObject({ id: aluno.id })
  })
  it('US03: encerra pelo botão e o backend rejeita reutilização do refresh', async () => {
    const requisicoes = vi.spyOn(globalThis, 'fetch')
    const pessoa = await entrarTreinador()
    const refresh = localStorage.getItem('refresh_token')
    const access = tokenStorage.get()
    await pessoa.click(screen.getByRole('button', { name: 'Sair da conta' }))
    await screen.findByRole('heading', { name: 'Login', exact: true }, esperaHttp)
    const indiceSaida = requisicoes.mock.calls.findIndex(([url]) => String(url).endsWith('/auth/logout/'))
    expect(indiceSaida).toBeGreaterThanOrEqual(0)
    const respostaSaida = await requisicoes.mock.results[indiceSaida].value as Response
    expect(respostaSaida.status).toBe(200)
    const encerrado = await fetch(`${base}/auth/refresh/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh }) })
    expect(encerrado.status).toBe(401)
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(tokenStorage.get()).toBeNull()
    // O access usado no logout também deve ser rejeitado pelo servidor.
    const anterior = await fetch(`${base}/auth/me/`, { headers: { Authorization: `Bearer ${access}` } })
    expect(anterior.status).toBe(401)
  })
  it('rejeita credenciais inválidas sem criar sessão local', async () => {
    const { pessoa } = abrir('/login')
    await pessoa.type(screen.getByLabelText('Apelido'), 'aluno.integracao')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'incorreta')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect((await screen.findByRole('alert', {}, esperaHttp)).textContent).toBe('Apelido ou senha inválidos')
    expect(tokenStorage.get()).toBeNull()
  })
  it('preserva o erro real de apelido duplicado para apresentação no campo', async () => {
    try {
      await api('/auth/cadastro/aluno/', { method: 'POST', body: JSON.stringify(dadosParaApi('ALUNO', {
        nome: 'Outro', sobrenome: 'Aluno', apelido: 'aluno.integracao', email: 'outro@example.com', senha, codigoTreinador: treinador.codigo_convite!, dataNascimento: '2000-01-01', altura: '185', peso: '80', envergadura: '190', frequencia: '3', objetivos: 'Treinar',
      }, true)) }, false)
      throw new Error('A API aceitou um apelido duplicado.')
    } catch (erro) {
      expect(erro).toBeInstanceOf(ApiError)
      expect((erro as ApiError).campos.apelido).toEqual(['Este apelido já está em uso.'])
    }
  })
  it('registra aceite explícito pelo endpoint e devolve a situação vigente', async () => {
    await entrarTreinador()
    const perfil = await api<Usuario>('/auth/aceitar-termos/', { method: 'POST', body: JSON.stringify({ aceite_termos: true }) })
    expect(perfil.termos_pendentes).toBe(false)
    expect(perfil.id).toBe(treinador.id)
  })

  it('US53: consulta os próprios dados na API e mantém o acesso restrito', async () => {
    const sessoes = abrir('/')
    await screen.findByRole('heading', { name: 'Login', exact: true }, esperaHttp)
    sessoes.tela.unmount()

    const requisicoes = vi.spyOn(globalThis, 'fetch')
    const inicio = performance.now()
    await entrarAluno()
    await screen.findByText('Treinador Integração', {}, esperaHttp)
    expect(performance.now() - inicio).toBeLessThan(5000)
    expect(screen.queryByText('Senha:')).not.toBeInTheDocument()
    const indice = requisicoes.mock.calls.findIndex(([url]) => String(url).endsWith('/contas/me/'))
    expect(indice).toBeGreaterThanOrEqual(0)
    const dados = await api('/contas/me/')
    expect(dados).toMatchObject({ id: aluno.id, data_nascimento: '2000-01-01' })
    expect(dados).not.toHaveProperty('password')

    await expect(api('/contas/alunos/' + (aluno.id + 1) + '/')).rejects.toMatchObject({ status: 403 })
  })

  it('US61: o treinador consulta a rota real de um aluno vinculado', async () => {
    await entrarTreinador()
    cleanup()
    abrir('/treinador/alunos/' + aluno.id)
    expect(await screen.findByRole('heading', { name: 'Aluno Integração' }, esperaHttp)).toBeInTheDocument()
    expect(screen.getByText('01/01/2000')).toBeInTheDocument()
    expect(screen.getByText('aluno.integracao@example.com')).toBeInTheDocument()
    await expect(api('/contas/alunos/999999/')).rejects.toMatchObject({ status: 404 })
  })

  it('US07: salva pela tela e relê os dados persistidos', async () => {
    const pessoa = await entrarAluno()
    await pessoa.click(screen.getByRole('button', { name: 'Editar meus dados' }))
    const nome = screen.getByLabelText(/^Nome\b/)
    await pessoa.clear(nome)
    await pessoa.type(nome, 'Estudante')
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))
    await screen.findByText('Alterações salvas com sucesso.', {}, esperaHttp)
    expect(await api('/contas/me/')).toMatchObject({ first_name: 'Estudante' })
    await expect(api('/contas/alunos/' + (aluno.id + 1) + '/editar/', {
      method: 'PATCH',
      body: JSON.stringify({ nome: 'Outro' }),
    })).rejects.toMatchObject({ status: 403 })
  })

  it('US08: troca a senha pela tela e encerra a sessão anterior', async () => {
    const pessoa = await entrarAluno()
    const refresh = tokenStorage.getRefresh()
    const access = tokenStorage.get()
    await pessoa.click(screen.getByRole('button', { name: 'Trocar senha' }))
    await pessoa.type(screen.getByLabelText(/^Senha atual\b/), senha)
    await pessoa.type(screen.getByLabelText(/^Nova senha\b/), senhaAlterada)
    await pessoa.type(screen.getByLabelText(/^Confirmar nova senha\b/), senhaAlterada)
    await pessoa.click(screen.getByRole('button', { name: 'Alterar senha' }))
    await screen.findByRole('heading', { name: 'Login', exact: true }, esperaHttp)
    expect(tokenStorage.get()).toBeNull()
    expect(screen.queryByText(/não foi possível confirmar o encerramento/i)).not.toBeInTheDocument()
    await expect(api('/auth/me/', { headers: { Authorization: 'Bearer ' + access } }, false))
      .rejects.toMatchObject({ status: 401 })
    await expect(api('/auth/refresh/', {
      method: 'POST', body: JSON.stringify({ refresh }),
    }, false)).rejects.toMatchObject({ status: 401 })
    await expect(loginAluno(senha)).rejects.toMatchObject({ status: 401 })
    await expect(loginAluno(senhaAlterada)).resolves.toHaveProperty('access')
  })

  it.skipIf(!pastaEmails)('US10: usa o link emitido por e-mail e impede sua reutilização', async () => {
    const caminhoEmails = pastaEmails!
    const { pessoa, tela } = abrir('/recuperar-senha')
    await pessoa.type(screen.getByLabelText('E-mail'), 'aluno.integracao@example.com')
    await pessoa.click(screen.getByRole('button', { name: 'Enviar instruções' }))
    await screen.findByText(/você receberá instruções/i, {}, esperaHttp)
    const arquivos = await readdir(caminhoEmails)
    const emails = await Promise.all(arquivos.map(arquivo => readFile(join(caminhoEmails, arquivo), 'utf8')))
    const link = emails.map(email => email.match(/https?:\/\/[^\s]+\/redefinir-senha\?token=[^\s]+/)?.[0]).find(Boolean)
    const destino = new URL(link!)
    const token = destino.searchParams.get('token')
    expect(token).toBeTruthy()

    tela.unmount()
    const redefinicao = abrir(destino.pathname + destino.search)
    await redefinicao.pessoa.type(screen.getByLabelText('Nova senha', { exact: true }), senhaRecuperada)
    await redefinicao.pessoa.type(screen.getByLabelText('Confirmar nova senha'), senhaRecuperada)
    await redefinicao.pessoa.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    await screen.findByText(/sua senha foi redefinida/i, {}, esperaHttp)
    expect(window.location.search).toBe('')
    await expect(api('/auth/redefinir-senha/', {
      method: 'POST',
      body: JSON.stringify({ token, nova_senha: senhaRecuperada, confirmacao_senha: senhaRecuperada }),
    }, false)).rejects.toMatchObject({ status: 400 })
    await expect(loginAluno(senhaRecuperada)).resolves.toHaveProperty('access')
  })
})
