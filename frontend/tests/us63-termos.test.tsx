/**
 * US63 (RF4812) — Aceitar termos de uso e política de privacidade (RN15, RNF16).
 * CA01 aceite explícito · CA02 bloqueio · CA03 nova versão · CA04 sem cookies opcionais.
 */
import { act, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, enviadosPara, preencherCadastro, simularApi, termosIndisponiveis, termosVigentes } from './apoio'

const aluno: Usuario = {
  id: 2, apelido: 'aluno', first_name: 'Aluno', last_name: 'Teste', email: 'aluno@example.com', telefone: '',
  papel: 'ALUNO', codigo_convite: null, termos_pendentes: false, versao_termos_aceita: '1.0', versao_termos_vigente: '1.0',
}
const treinador: Usuario = { ...aluno, id: 1, apelido: 'treinador', papel: 'TREINADOR', codigo_convite: 'TRN-ABC123' }
const pendente = (usuario: Usuario, vigente = '1.0'): Usuario => ({ ...usuario, termos_pendentes: true, versao_termos_vigente: vigente })
const termosV11 = { ...termosVigentes, versao: '1.1' }

function entrarComSessao(caminho: string, rotas: Parameters<typeof simularApi>[0]) {
  tokenStorage.set('access-teste')
  const requisicoes = simularApi(rotas)
  return { requisicoes, pessoa: abrir(caminho) }
}

async function aceitarNaTela(pessoa: ReturnType<typeof abrir>) {
  await screen.findByRole('link', { name: 'Termos de Uso' })
  await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
  await pessoa.click(screen.getByRole('button', { name: /Aceitar e continuar/i }))
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('CA01 — aceite explícito com documentos e versão vigentes', () => {
  it('exibe no cadastro os documentos e a versão informados pelo backend', async () => {
    simularApi()
    abrir('/cadastro/treinador')
    expect((await screen.findByRole('link', { name: 'Termos de Uso' })).getAttribute('href')).toBe('/termos-de-uso')
    expect(screen.getByRole('link', { name: 'Política de Privacidade' }).getAttribute('href')).toBe('/politica-de-privacidade')
    expect(screen.getByText(/Versão 1\.0/)).toBeTruthy()
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).disabled).toBe(false)
  })

  it('não oferece aceite quando o backend devolve uma URL insegura', async () => {
    simularApi({ 'GET /api/auth/termos/vigentes/': { corpo: { ...termosVigentes, termos_uso_url: 'javascript:alert(1)' } } })
    abrir('/cadastro/treinador')
    expect(await screen.findByText(/ainda não estão disponíveis/i)).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Termos de Uso' })).toBeNull()
  })

  it.each([
    ['ACEITE_OBRIGATORIO', 400, /consulte e aceite os documentos/i],
    ['TERMOS_INDISPONIVEIS', 503, /documentos ficaram indisponíveis/i],
  ])('trata %s do cadastro junto ao aceite, sem exibir o código', async (code, status, mensagem) => {
    const requisicoes = simularApi({
      'POST /api/auth/cadastro/treinador/': { corpo: { detail: 'Recusado pelo servidor.', code }, status },
    })
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(await screen.findByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se' }))

    expect(await screen.findByText(mensagem)).toBeTruthy()
    expect(screen.queryByText(new RegExp(code))).toBeNull()
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).checked).toBe(false)
    expect(screen.queryByText(/conta.*criada/i)).toBeNull()
    expect(enviadosPara(requisicoes, 'GET /api/auth/termos/vigentes/')).toHaveLength(code === 'TERMOS_INDISPONIVEIS' ? 2 : 1)
  })

  it.each([
    ['/termos-de-uso', 'Termos de Uso'],
    ['/politica-de-privacidade', 'Política de Privacidade'],
  ])('publica %s como rascunho provisório acessível sem login', async (caminho, titulo) => {
    simularApi()
    window.history.replaceState({}, '', '/login')
    window.history.pushState({}, '', caminho)
    const pessoa = abrir(caminho)
    expect(screen.getByRole('heading', { name: titulo })).toBeTruthy()
    expect(screen.getByRole('note').textContent).toMatch(/rascunho provisório.*aguarda a publicação oficial/i)
    await pessoa.click(screen.getByRole('button', { name: 'Voltar' }))
    expect(await screen.findByRole('heading', { name: 'Login' })).toBeTruthy()
  })
})

describe('CA02 — bloqueio enquanto houver termos pendentes', () => {
  it.each([
    ['/', aluno], ['/aluno/conta/editar', aluno], ['/conta/senha', aluno],
    ['/treinador/alunos', treinador], ['/treinador/alunos/previa', treinador],
  ])('a rota protegida %s exige o aceite antes da tela', async (caminho, usuario) => {
    entrarComSessao(caminho, { 'GET /api/auth/me/': { corpo: pendente(usuario) } })
    expect(await screen.findByRole('heading', { name: 'Termos de uso' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /Minha conta|Olá|Editar|senha|alunos/i })).toBeNull()
  })

  it('leva ao aceite quando uma rota responde 403 TERMOS_PENDENTES durante a sessão', async () => {
    entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: aluno },
      'GET /api/contas/me/': { corpo: { detail: 'Termos pendentes.', code: 'TERMOS_PENDENTES', versao_atual: '1.1' }, status: 403 },
      'GET /api/auth/termos/vigentes/': { corpo: termosV11 },
    })
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()

    let falha: unknown
    await act(async () => { falha = await api('/contas/me/').catch((erro: unknown) => erro) })

    expect(falha).toBeInstanceOf(ApiError)
    expect((falha as ApiError).codigo).toBe('TERMOS_PENDENTES')
    expect(await screen.findByRole('heading', { name: 'Termos de uso' })).toBeTruthy()
    expect(await screen.findByText(/versão 1\.1 antes de continuar/)).toBeTruthy()
  })

  it('mantém a tela em um 403 de outra regra (ex.: papel)', async () => {
    entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: aluno },
      'GET /api/contas/me/': { corpo: { detail: 'Apenas alunos podem consultar esta rota.' }, status: 403 },
    })
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    await act(async () => { await api('/contas/me/').catch(() => undefined) })
    expect(screen.getByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Termos de uso' })).toBeNull()
  })
})

describe('CA03 — nova versão exige novo aceite', () => {
  it('recarrega a nova versão após 409 e só libera após aceitá-la', async () => {
    const { requisicoes, pessoa } = entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'GET /api/auth/termos/vigentes/': [{ corpo: termosVigentes }, { corpo: termosV11 }],
      'POST /api/auth/aceitar-termos/': [
        { corpo: { detail: 'Versão divergente.', code: 'TERMOS_VERSAO_DIVERGENTE', versao_atual: '1.1' }, status: 409 },
        { corpo: { ...aluno, versao_termos_aceita: '1.1', versao_termos_vigente: '1.1' }, status: 201 },
      ],
    })
    expect(await screen.findByText(/versão 1\.0 antes de continuar/)).toBeTruthy()
    await aceitarNaTela(pessoa)

    expect((await screen.findByRole('alert')).textContent).toMatch(/termos foram atualizados/i)
    expect(await screen.findByText(/versão 1\.1 antes de continuar/)).toBeTruthy()
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).checked).toBe(false)

    await aceitarNaTela(pessoa)
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    expect(enviadosPara(requisicoes, 'POST /api/auth/aceitar-termos/')).toEqual([
      { aceite_termos: true, versao: '1.0' },
      { aceite_termos: true, versao: '1.1' },
    ])
  })

  it('informa 503 e deixa de oferecer o aceite se os documentos saírem do ar', async () => {
    const { pessoa } = entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'GET /api/auth/termos/vigentes/': [{ corpo: termosVigentes }, { corpo: termosIndisponiveis }],
      'POST /api/auth/aceitar-termos/': { corpo: { detail: 'Indisponível.', code: 'TERMOS_INDISPONIVEIS' }, status: 503 },
    })
    await aceitarNaTela(pessoa)
    expect((await screen.findByRole('alert')).textContent).toMatch(/documentos ficaram indisponíveis/i)
    expect(await screen.findByText(/ainda não estão disponíveis/i)).toBeTruthy()
    expect((screen.getByRole('button', { name: /Aceitar e continuar/i }) as HTMLButtonElement).disabled).toBe(true)
  })
})

describe('CA04 — nenhum cookie opcional nem script de monitoramento', () => {
  function semArmazenamentoOpcional() {
    expect(document.cookie).toBe('')
    expect(Object.keys(localStorage).every(chave => ['access_token', 'refresh_token'].includes(chave))).toBe(true)
    expect(document.querySelectorAll('script[src], iframe, img[src^="http"]')).toHaveLength(0)
  }

  it.each(['/cadastro/aluno', '/termos-de-uso', '/politica-de-privacidade'])('%s não grava cookies no primeiro acesso', async caminho => {
    simularApi()
    abrir(caminho)
    await screen.findAllByRole('heading')
    semArmazenamentoOpcional()
    expect(localStorage.length).toBe(0)
  })

  it('o aceite com sessão guarda apenas os tokens necessários', async () => {
    const { pessoa } = entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'POST /api/auth/aceitar-termos/': { corpo: aluno, status: 201 },
    })
    await aceitarNaTela(pessoa)
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    semArmazenamentoOpcional()
  })
})
