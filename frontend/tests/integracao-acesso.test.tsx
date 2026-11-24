import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { api, tokenStorage } from '../src/api/client'

const treinador = { id: 1, apelido: 'treinador', first_name: 'Treinador', last_name: 'Teste', email: 'treinador@example.com', telefone: '61999990000', papel: 'TREINADOR', codigo_convite: 'TRN-ABC123', termos_pendentes: false }
const aluno = { ...treinador, id: 2, apelido: 'aluno', papel: 'ALUNO', codigo_convite: null }
const resposta = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status })
function abrir(caminho: string) {
  window.history.replaceState({}, '', caminho)
  render(<App />)
  return userEvent.setup()
}
async function preencherCadastro(pessoa: ReturnType<typeof userEvent.setup>, perfil = 'aluno', nascimento = '2000-01-01') {
  const campos = perfil === 'aluno'
    ? { Nome: 'Aluno', Sobrenome: 'Teste', Apelido: 'aluno', 'E-mail': 'aluno@example.com', Senha: 'Senha#2026', 'Código do treinador': 'TRN-ABC123', 'Altura (cm)': '185', 'Peso (kg)': '80,5', 'Envergadura (cm)': '190', 'Frequência de atividade física (dias por semana)': '3', Objetivos: 'Melhorar o arremesso' }
    : { Nome: 'Treinador', Sobrenome: 'Teste', Apelido: 'treinador', 'E-mail': 'treinador@example.com', Telefone: '61999990000', Senha: 'Senha#2026', 'Código de ativação': 'ativacao-de-teste' }
  for (const [nome, valor] of Object.entries(campos)) await pessoa.type(screen.getByLabelText(nome, { exact: true }), valor)
  if (perfil === 'aluno') await pessoa.type(screen.getByLabelText('Data de nascimento'), nascimento)
}
beforeEach(() => {
  vi.stubEnv('VITE_TERMOS_USO_URL', '/documentos/termos-teste.html')
  vi.stubEnv('VITE_POLITICA_PRIVACIDADE_URL', '/documentos/privacidade-teste.html')
})
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
    expect(await screen.findByRole('heading', { name: /Olá, Treinador/ })).toBeTruthy()
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
    await screen.findByRole('heading', { name: /Olá/ })
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
    const requisicoes = vi.fn().mockResolvedValue(resposta(aluno, 201))
    vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/cadastro/aluno')
    await preencherCadastro(pessoa)
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText(/conta.*criada/i)).toBeTruthy()
    const [url, opcoes] = requisicoes.mock.calls[0]
    expect(url).toBe('/api/auth/cadastro/aluno/')
    expect(JSON.parse(opcoes.body)).toEqual({ nome: 'Aluno', sobrenome: 'Teste', apelido: 'aluno', email: 'aluno@example.com', senha: 'Senha#2026', codigo_treinador: 'TRN-ABC123', data_nascimento: '2000-01-01', altura: '1.85', peso: '80.5', envergadura: '1.9', frequencia_semanal: 3, objetivos: 'Melhorar o arremesso', aceite_termos: true })
    expect(localStorage.length).toBe(0)
  })
  it('mostra o código de convite devolvido pelo cadastro do treinador', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(treinador, 201)))
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText('TRN-ABC123')).toBeTruthy()
    expect(screen.queryByLabelText('Senha', { exact: true })).toBeNull()
  })
  it('apresenta e foca o erro de unicidade devolvido pela API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta({ email: ['Este e-mail já está em uso.'] }, 400)))
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(await screen.findByText('Este e-mail já está em uso.')).toBeTruthy()
    expect(document.activeElement).toBe(screen.getByLabelText('E-mail'))
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('treinador@example.com')
  })
  it('não envia aceite se os documentos não estiverem disponíveis', async () => {
    vi.stubEnv('VITE_TERMOS_USO_URL', ''); vi.stubEnv('VITE_POLITICA_PRIVACIDADE_URL', '')
    const requisicoes = vi.fn(); vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/cadastro/treinador')
    await preencherCadastro(pessoa, 'treinador')
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect((screen.getByRole('checkbox', { name: /aceito/i }) as HTMLInputElement).disabled).toBe(true)
    expect(requisicoes).not.toHaveBeenCalled()
    expect(screen.queryByText(/conta.*criada/i)).toBeNull()
  })
  it('não transforma uma marcação simples em comprovação do consentimento de menores', async () => {
    const requisicoes = vi.fn(); vi.stubGlobal('fetch', requisicoes)
    const pessoa = abrir('/cadastro/aluno')
    await preencherCadastro(pessoa, 'aluno', '2015-01-01')
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(screen.getByRole('alert').textContent).toMatch(/responsável/i)
    expect(requisicoes).not.toHaveBeenCalled()
  })
  it('exige renovar termos antes de mostrar a conta e só prossegue após confirmação do servidor', async () => {
    tokenStorage.set('access-teste')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(resposta({ ...aluno, termos_pendentes: true })).mockResolvedValueOnce(resposta(aluno)))
    const pessoa = abrir('/')
    expect(await screen.findByRole('heading', { name: /Termos de uso/i })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: /Dados pessoais/ })).toBeNull()
    await pessoa.click(screen.getByRole('checkbox', { name: /aceito/i }))
    await pessoa.click(screen.getByRole('button', { name: /Aceitar e continuar/i }))
    expect(await screen.findByRole('heading', { name: /Dados pessoais/ })).toBeTruthy()
  })
  it('usa a base configurada e normaliza a barra final da URL', async () => {
    vi.stubEnv('VITE_API_URL', 'https://api.example.com/api/')
    const requisicoes = vi.fn().mockResolvedValue(resposta({ status: 'ok' })); vi.stubGlobal('fetch', requisicoes)
    await api('/health/')
    expect(requisicoes.mock.calls[0][0]).toBe('https://api.example.com/api/health/')
  })
})
