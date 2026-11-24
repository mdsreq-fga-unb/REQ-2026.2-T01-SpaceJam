/**
 * US63 (RF4812) — Aceitar termos de uso e política de privacidade (RN15, RNF16).
 * CA01 aceite explícito · CA02 bloqueio · CA03 nova versão · CA04 sem cookies opcionais.
 */
import { act, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, tokenStorage } from '../src/api/client'
import { CHAVE_PREFERENCIAS_PRIVACIDADE } from '../src/features/conta/consentimentoCookies'
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
    expect(await screen.findByRole('heading', { name: 'Termos e privacidade' })).toBeTruthy()
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
    expect(await screen.findByRole('heading', { name: 'Termos e privacidade' })).toBeTruthy()
    expect(await screen.findByText(/versão vigente \(1\.1\)/)).toBeTruthy()
  })

  it('mantém a tela em um 403 de outra regra (ex.: papel)', async () => {
    entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: aluno },
      'GET /api/contas/me/': { corpo: { detail: 'Apenas alunos podem consultar esta rota.' }, status: 403 },
    })
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    await act(async () => { await api('/contas/me/').catch(() => undefined) })
    expect(screen.getByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Termos e privacidade' })).toBeNull()
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
    expect(await screen.findByText(/versão vigente \(1\.0\)/)).toBeTruthy()
    await aceitarNaTela(pessoa)

    expect((await screen.findByRole('alert')).textContent).toMatch(/termos foram atualizados/i)
    expect(await screen.findByText(/versão vigente \(1\.1\)/)).toBeTruthy()
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).checked).toBe(false)

    await aceitarNaTela(pessoa)
    expect(await screen.findByRole('heading', { name: /Minha conta/ })).toBeTruthy()
    expect(enviadosPara(requisicoes, 'POST /api/auth/aceitar-termos/')).toEqual([
      { aceite_termos: true, versao: '1.0' },
      { aceite_termos: true, versao: '1.1' },
    ])
  })

  it('informa 503 e passa a bloquear o acesso se os documentos saírem do ar', async () => {
    const { pessoa } = entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'GET /api/auth/termos/vigentes/': [{ corpo: termosVigentes }, { corpo: termosIndisponiveis }],
      'POST /api/auth/aceitar-termos/': { corpo: { detail: 'Indisponível.', code: 'TERMOS_INDISPONIVEIS' }, status: 503 },
    })
    await aceitarNaTela(pessoa)
    expect((await screen.findByRole('alert')).textContent).toMatch(/documentos ficaram indisponíveis/i)
    expect(await screen.findByRole('heading', { name: 'Não foi possível carregar os documentos' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Aceitar e continuar/i })).toBeNull()
  })
})

describe('Termos e privacidade — documentos indisponíveis', () => {
  it('mostra o alerta, o bloqueio e volta ao login encerrando a sessão', async () => {
    const { pessoa } = entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'GET /api/auth/termos/vigentes/': { corpo: termosIndisponiveis },
    })
    expect(await screen.findByRole('heading', { name: 'Não foi possível carregar os documentos' })).toBeTruthy()
    expect(screen.getByText(/precisam estar disponíveis antes do aceite/)).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Acesso bloqueado' })).toBeTruthy()
    expect(screen.getByText(/Nenhuma funcionalidade deve ser liberada/)).toBeTruthy()
    expect(screen.queryByRole('checkbox', { name: /aceito/i })).toBeNull()

    await pessoa.click(screen.getByRole('button', { name: 'Voltar ao login' }))
    expect(await screen.findByRole('heading', { name: 'Login' })).toBeTruthy()
    expect(tokenStorage.get()).toBeNull()
  })

  it('trata falha na consulta dos documentos como indisponível', async () => {
    entrarComSessao('/', {
      'GET /api/auth/me/': { corpo: pendente(aluno) },
      'GET /api/auth/termos/vigentes/': { corpo: { detail: 'Erro interno.' }, status: 500 },
    })
    expect(await screen.findByRole('heading', { name: 'Acesso bloqueado' })).toBeTruthy()
    expect(screen.queryByRole('checkbox', { name: /aceito/i })).toBeNull()
  })
})

describe('Preferências de privacidade (CA04 / RNF16)', () => {
  const sessao = (usuario: Usuario) => entrarComSessao('/conta/privacidade', { 'GET /api/auth/me/': { corpo: usuario } })
  const opcao = (nome: string) => screen.getByRole('button', { name: nome })
  const salvo = () => JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS_PRIVACIDADE) ?? 'null')

  it('começa em "Não permitir" sem nada gravado (opt-in explícito)', async () => {
    sessao(aluno)
    expect(await screen.findByRole('heading', { name: 'Preferências de privacidade' })).toBeTruthy()
    expect(screen.getByText('Você pode alterar sua escolha a qualquer momento.')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Cookies necessários' })).toBeTruthy()
    expect(opcao('Não permitir').getAttribute('aria-pressed')).toBe('true')
    expect(opcao('Permitir').getAttribute('aria-pressed')).toBe('false')
    expect(screen.getByText(/ficam desativados até você permitir/)).toBeTruthy()
    expect(salvo()).toBeNull()
    expect(document.cookie).toBe('')
  })

  it('permite, salva com confirmação e depois revoga', async () => {
    const { pessoa } = sessao(aluno)
    await screen.findByRole('heading', { name: 'Preferências de privacidade' })

    await pessoa.click(opcao('Permitir'))
    expect(opcao('Permitir').getAttribute('aria-pressed')).toBe('true')
    expect(salvo()).toBeNull() // nada muda antes de salvar
    await pessoa.click(screen.getByRole('button', { name: 'Salvar preferências' }))
    expect(screen.getByRole('status').textContent).toMatch(/cookies opcionais estão permitidos/i)
    expect(salvo().cookiesOpcionais).toBe(true)
    expect(screen.getByText(/pode revogar essa permissão a qualquer momento/)).toBeTruthy()

    await pessoa.click(opcao('Não permitir'))
    expect(screen.queryByRole('status')).toBeNull()
    await pessoa.click(screen.getByRole('button', { name: 'Salvar preferências' }))
    expect(screen.getByRole('status').textContent).toMatch(/continuam desativados/i)
    expect(salvo().cookiesOpcionais).toBe(false)
    expect(document.cookie).toBe('')
  })

  it('restaura a escolha salva ao voltar à página', async () => {
    localStorage.setItem(CHAVE_PREFERENCIAS_PRIVACIDADE, JSON.stringify({ cookiesOpcionais: true, atualizadoEm: '2026-11-24T00:00:00Z' }))
    sessao(aluno)
    await screen.findByRole('heading', { name: 'Preferências de privacidade' })
    expect(opcao('Permitir').getAttribute('aria-pressed')).toBe('true')
  })

  it.each([
    ['aluno', aluno, 'Treinos'],
    ['treinador', treinador, 'Alunos'],
  ] as const)('é acessível pela conta do %s', async (_papel, usuario, secao) => {
    const { pessoa } = entrarComSessao('/', { 'GET /api/auth/me/': { corpo: usuario } })
    await pessoa.click(await screen.findByRole('button', { name: 'Preferências de privacidade' }))
    expect(await screen.findByRole('heading', { name: 'Preferências de privacidade' })).toBeTruthy()
    expect(within(screen.getByRole('navigation', { name: 'Seções da conta' })).getByText(secao)).toBeTruthy()
    await pessoa.click(screen.getByRole('button', { name: 'Voltar à conta' }))
    expect(await screen.findByRole('button', { name: 'Preferências de privacidade' })).toBeTruthy()
  })

  it('também exige o aceite dos termos antes de abrir', async () => {
    sessao(pendente(aluno))
    expect(await screen.findByRole('heading', { name: 'Termos e privacidade' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Preferências de privacidade' })).toBeNull()
  })
})

describe('CA04 — nenhum cookie opcional nem script de monitoramento', () => {
  function semArmazenamentoOpcional() {
    expect(document.cookie).toBe('')
    const permitidas = ['access_token', 'refresh_token', CHAVE_PREFERENCIAS_PRIVACIDADE]
    expect(Object.keys(localStorage).every(chave => permitidas.includes(chave))).toBe(true)
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
