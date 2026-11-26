import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, tokenStorage } from '../src/api/client'
import { abrir, enviadosPara, preencherCadastro, simularApi, termosIndisponiveis } from './apoio'

const treinador = { id: 1, apelido: 'treinador', first_name: 'Treinador', last_name: 'Teste', email: 'treinador@example.com', telefone: '61999990000', papel: 'TREINADOR', codigo_convite: 'TRN-ABC123', termos_pendentes: false }
const aluno = { ...treinador, id: 2, apelido: 'aluno', papel: 'ALUNO', codigo_convite: null }
const resposta = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status })
afterEach(() => {
  vi.unstubAllGlobals(); vi.unstubAllEnvs()
  window.history.replaceState({}, '', '/')
})

describe('contrato de acesso do backend', () => {
  it('autentica treinador por e-mail e mantém o refresh para encerrar no servidor', async () => {
    const requisicoes = vi.fn().mockResolvedValueOnce(resposta({ access: 'access-teste', refresh: 'refresh-teste', usuario: treinador })).mockResolvedValueOnce(resposta(treinador))
    vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/login?perfil=treinador')
    await pessoa.type(screen.getByLabelText('E-mail'), 'treinador@example.com')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'Senha#2026')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(await screen.findByRole('heading', { name: 'Minha conta' })).toBeTruthy()
    const [url, opcoes] = requisicoes.mock.calls[0]
    expect(url).toBe('/api/auth/login/treinador/')
    expect(JSON.parse(opcoes.body)).toEqual({ email: 'treinador@example.com', senha: 'Senha#2026' })
    expect(localStorage.getItem('refresh_token')).toBe('refresh-teste')
  })
  it('não envia um token antigo ao autenticar novamente', async () => {
    tokenStorage.set('access-antigo')
    const requisicoes = vi.fn().mockResolvedValue(resposta({ detail: 'Expirado' }, 401))
    vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/login')
    await screen.findByRole('heading', { name: 'Login', exact: true })
    tokenStorage.set('access-antigo')
    await pessoa.type(screen.getByLabelText('Apelido'), 'aluno')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'Senha#2026')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    await screen.findByRole('alert')
    const [, opcoes] = requisicoes.mock.calls.at(-1)!
    expect(opcoes.headers.has('Authorization')).toBe(false)
  })
  it('envia refresh e autenticação ao sair e limpa ambos os tokens', async () => {
    tokenStorage.set('access-teste'); localStorage.setItem('refresh_token', 'refresh-teste')
    const requisicoes = vi.fn().mockResolvedValueOnce(resposta(treinador)).mockResolvedValueOnce(resposta({ detail: 'Sessão encerrada com sucesso.' }))
    vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/')
    await screen.findByRole('heading', { name: 'Minha conta' })
    await pessoa.click(screen.getByRole('button', { name: 'Sair da conta' }))
    await waitFor(() => expect(requisicoes).toHaveBeenCalledTimes(2))
    const [url, opcoes] = requisicoes.mock.calls[1]
    expect(url).toBe('/api/auth/logout/')
    expect(JSON.parse(opcoes.body)).toEqual({ refresh: 'refresh-teste' })
    expect(opcoes.headers.get('Authorization')).toBe('Bearer access-teste')
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
    expect(await screen.findByRole('heading', { name: 'Login', exact: true })).toBeTruthy()
  })
  it('avisa quando só a saída local foi possível', async () => {
    tokenStorage.set('access-teste'); localStorage.setItem('refresh_token', 'refresh-teste')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(resposta(aluno)).mockRejectedValueOnce(new TypeError('Sem rede')))
    const pessoa = abrir('/')
    await screen.findByRole('heading', { name: /Minha conta/ })
    await pessoa.click(screen.getByRole('button', { name: 'Sair da conta' }))
    expect(await screen.findByText(/não foi possível confirmar.*servidor/i)).toBeTruthy()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })
  it('envia cadastro de aluno com unidades e nomes aceitos pelo servidor', async () => {
    const requisicoes = simularApi({ 'POST /api/auth/cadastro/aluno/': { corpo: aluno, status: 201 } })
    const pessoa = abrir('/cadastro/aluno')
    await preencherCadastro(pessoa)
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText(/conta.*criada/i)).toBeTruthy()
    expect(enviadosPara(requisicoes, 'POST /api/auth/cadastro/aluno/')).toEqual([{ nome: 'Aluno', sobrenome: 'Teste', apelido: 'aluno', email: 'aluno@example.com', senha: 'Senha#2026', codigo_treinador: 'TRN-ABC123', data_nascimento: '2000-01-01', altura: '1.85', peso: '80.5', envergadura: '1.9', frequencia_semanal: 3, objetivos: 'Melhorar o arremesso', aceite_termos: true }])
    expect(localStorage.length).toBe(0)
  })
  it('mostra o código de convite devolvido pelo cadastro do treinador', async () => {
    simularApi({ 'POST /api/auth/cadastro/treinador/': { corpo: treinador, status: 201 } })
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText('TRN-ABC123')).toBeTruthy()
    expect(screen.queryByLabelText('Senha', { exact: true })).toBeNull()
  })
  it('apresenta e foca o erro de unicidade devolvido pela API', async () => {
    simularApi({ 'POST /api/auth/cadastro/treinador/': { corpo: { email: ['Este e-mail já está em uso.'] }, status: 400 } })
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText('Este e-mail já está em uso.')).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByLabelText('E-mail'))
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('treinador@example.com')
  })
  it('não envia aceite se os documentos não estiverem disponíveis', async () => {
    const requisicoes = simularApi({ 'GET /api/auth/termos/vigentes/': { corpo: termosIndisponiveis } })
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).disabled).toBe(true)
    expect(enviadosPara(requisicoes, 'POST /api/auth/cadastro/treinador/')).toEqual([])
    expect(screen.queryByText(/conta.*criada/i)).toBeNull()
  })
  it('não transforma uma marcação simples em comprovação do consentimento de menores', async () => {
    const requisicoes = simularApi()
    const pessoa = abrir('/cadastro/aluno')
    await preencherCadastro(pessoa, 'aluno', '2015-01-01')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(screen.getByRole('alert').textContent).toMatch(/responsável/i)
    expect(enviadosPara(requisicoes, 'POST /api/auth/cadastro/aluno/')).toEqual([])
  })
  it('exige renovar termos antes de mostrar a conta e só prossegue após confirmação do servidor', async () => {
    tokenStorage.set('access-teste')
    const requisicoes = simularApi({
      'GET /api/auth/me/': { corpo: { ...aluno, termos_pendentes: true } },
      'POST /api/auth/aceitar-termos/': { corpo: aluno, status: 201 },
    })
    const pessoa = abrir('/')
    expect(await screen.findByRole('heading', { name: /Termos e privacidade/i })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /Dados pessoais/ })).toBeNull()
    await screen.findByRole('link', { name: 'Termos de Uso' })
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: /Aceitar e continuar/i }))
    expect(await screen.findByRole('heading', { name: /Dados pessoais/ })).toBeTruthy()
    expect(enviadosPara(requisicoes, 'POST /api/auth/aceitar-termos/')).toEqual([{ aceite_termos: true, versao: '1.0' }])
  })
  it('usa a base configurada e normaliza a barra final da URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/api/')
    const requisicoes = vi.fn().mockResolvedValue(resposta({ status: 'ok' })); vi.stubGlobal('fetch', requisicoes)
    await api('/health/')
    expect(requisicoes.mock.calls[0][0]).toBe('https://api.example.com/api/health/')
  })
})
