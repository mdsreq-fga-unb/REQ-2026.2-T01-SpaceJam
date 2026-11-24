import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { api, ApiError, tokenStorage } from '../src/api/client'
import { dadosParaApi } from '../src/features/acesso/cadastro'
import type { Usuario } from '../src/types/usuario'

// Executar somente contra uma cópia descartável do backend, com banco vazio.
const base = process.env.SPACE_JAM_API_TEST_URL
const ativacao = process.env.SPACE_JAM_TEST_ACTIVATION_CODE
const grupo = describe.skipIf(!base || !ativacao)
const senha = 'Acesso#Teste2026'
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
  await screen.findByRole('heading', { name: /Olá, Treinador/ })
  return pessoa
}

grupo('HTTP real pelo proxy do frontend', () => {
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
    await screen.findByRole('heading', { name: /Olá, Aluno/ })
    tela.unmount(); render(<App />)
    expect(await screen.findByRole('heading', { name: /Olá, Aluno/ })).toBeTruthy()
    expect(await api<Usuario>('/auth/me/')).toMatchObject({ id: aluno.id })
  })
  it('US03: encerra pelo botão e o backend rejeita reutilização do refresh', async () => {
    const requisicoes = vi.spyOn(globalThis, 'fetch')
    const pessoa = await entrarTreinador()
    const refresh = localStorage.getItem('refresh_token')
    const access = tokenStorage.get()
    await pessoa.click(screen.getByRole('button', { name: 'Sair da conta' }))
    await screen.findByRole('heading', { name: 'Login', exact: true })
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
    expect((await screen.findByRole('alert')).textContent).toBe('Apelido ou senha inválidos')
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
})
