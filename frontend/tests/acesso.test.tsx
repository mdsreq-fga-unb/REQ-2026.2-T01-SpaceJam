import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LoginPage } from '../src/pages/LoginPage'
import { AuthContext } from '../src/auth/contexto'
import { AuthProvider } from '../src/auth/AuthContext'
import { useAuth } from '../src/auth/useAuth'
import { ApiError, tokenStorage } from '../src/api/client'

afterEach(() => vi.unstubAllGlobals())

function tela(login = vi.fn().mockResolvedValue(undefined), carregando = false) {
  render(<MemoryRouter><AuthContext.Provider value={{ usuario: null, carregando, login, logout: vi.fn() }}><LoginPage /></AuthContext.Provider></MemoryRouter>)
  return { login, pessoa: userEvent.setup() }
}

async function preencher(pessoa: ReturnType<typeof userEvent.setup>, apelido = 'aluno.teste') {
  await pessoa.type(screen.getByLabelText('Apelido'), apelido)
  await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'Senha#2026')
}

describe('acesso', () => {
  it('usa a mensagem prevista em US04 sem identificar qual credencial falhou', async () => {
    const { pessoa } = tela(vi.fn().mockRejectedValue(new ApiError(401, 'Credenciais inválidas')))
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect((await screen.findByRole('alert')).textContent).toBe('Apelido ou senha inválidos')
  })

  it('permite conferir e ocultar a senha sem perder o valor', async () => {
    const { pessoa } = tela()
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Mostrar senha' }))
    expect((screen.getByLabelText('Senha', { exact: true }) as HTMLInputElement).type).toBe('text')
    await pessoa.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect((screen.getByLabelText('Senha', { exact: true }) as HTMLInputElement).value).toBe('Senha#2026')
  })

  it('retira espaços das extremidades do apelido antes de enviar', async () => {
    const { pessoa, login } = tela()
    await preencher(pessoa, '  aluno.teste  ')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(login).toHaveBeenCalledWith('aluno.teste', 'Senha#2026')
  })

  it('informa falha do serviço sem culpar as credenciais', async () => {
    const { pessoa } = tela(vi.fn().mockRejectedValue(new ApiError(503, 'Indisponível')))
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/serviço|conexão/i)
  })

  it('distingue credenciais inválidas e mantém os campos preenchidos', async () => {
    const { pessoa } = tela(vi.fn().mockRejectedValue(new ApiError(401, 'Unauthorized')))
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(await screen.findByRole('alert')).toBeTruthy()
    expect((screen.getByLabelText('Apelido') as HTMLInputElement).value).toBe('aluno.teste')
  })

  it('aguarda a sessão salva antes de mostrar o formulário', () => {
    tela(undefined, true)
    expect(screen.queryByRole('button', { name: 'Entrar', exact: true })).toBeNull()
    expect(screen.getByRole('status').textContent).toMatch(/sessão/i)
  })

  it('impede um segundo envio enquanto o primeiro não terminou', async () => {
    let terminar!: () => void
    const login = vi.fn(() => new Promise<void>(resolve => { terminar = resolve }))
    const { pessoa } = tela(login)
    await preencher(pessoa)
    await pessoa.dblClick(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(login).toHaveBeenCalledTimes(1)
    expect((screen.getByRole('button', { name: /entrando/i }) as HTMLButtonElement).disabled).toBe(true)
    await act(async () => terminar())
  })
})

function SessaoDeTeste() {
  const { login, usuario, carregando } = useAuth()
  return <><button onClick={() => { void login('aluno.teste', 'Senha#2026').catch(() => {}) }}>Iniciar</button><output>{carregando ? 'aguardando' : usuario?.apelido ?? 'sem sessão'}</output></>
}

describe('sessão', () => {
  it('remove o token se o perfil falhar depois da autenticação', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ access: 'token-de-teste' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ detail: 'Falha' }), { status: 500 })))
    render(<AuthProvider><SessaoDeTeste /></AuthProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'Iniciar' }))
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(tokenStorage.get()).toBeNull())
    expect(screen.getByRole('status').textContent).toBe('sem sessão')
  })

  it('descarta uma sessão expirada e termina o carregamento', async () => {
    tokenStorage.set('expirado')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 401 })))
    render(<AuthProvider><SessaoDeTeste /></AuthProvider>)
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('sem sessão'))
    expect(tokenStorage.get()).toBeNull()
  })
})

describe('acessibilidade dos erros de acesso', () => {
  it('bloqueia apelido composto apenas por espaços e devolve o foco ao campo', async () => {
    const { pessoa, login } = tela()
    await preencher(pessoa, '   ')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(login).not.toHaveBeenCalled()
    expect(document.activeElement).toBe(screen.getByLabelText('Apelido'))
    expect(screen.getByLabelText('Apelido').getAttribute('aria-invalid')).toBe('true')
  })

  it('identifica os dois campos quando as credenciais são rejeitadas', async () => {
    const { pessoa } = tela(vi.fn().mockRejectedValue(new ApiError(401, 'Credenciais inválidas')))
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    await screen.findByRole('alert')
    expect(screen.getByLabelText('Apelido').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByLabelText('Senha', { exact: true }).getAttribute('aria-invalid')).toBe('true')
  })

  it('não marca os dados como inválidos quando o serviço está indisponível', async () => {
    const { pessoa } = tela(vi.fn().mockRejectedValue(new ApiError(503, 'Serviço indisponível')))
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    await screen.findByRole('alert')
    expect(screen.getByLabelText('Apelido').getAttribute('aria-invalid')).toBeNull()
    expect(screen.getByLabelText('Senha', { exact: true }).getAttribute('aria-invalid')).toBeNull()
  })
})


describe('acesso de treinador conforme RN24', () => {
  it('oferece o e-mail no acesso do treinador sem enviá-lo como username', async () => {
    const { pessoa, login } = tela()
    await pessoa.click(screen.getByRole('link', { name: 'Treinador', exact: true }))
    const email = screen.getByLabelText('E-mail') as HTMLInputElement
    expect(email.type).toBe('email')
    await pessoa.type(email, 'treinador@example.com')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'Senha#2026')
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    expect(login).toHaveBeenCalledWith('treinador@example.com', 'Senha#2026', 'TREINADOR')
    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByRole('link', { name: 'Criar conta' }).getAttribute('href')).toBe('/cadastro/treinador')
  })

  it('descarta credenciais ao alternar entre aluno e treinador', async () => {
    const { pessoa } = tela()
    await preencher(pessoa)
    await pessoa.click(screen.getByRole('link', { name: 'Treinador', exact: true }))
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).value).toBe('')
    expect((screen.getByLabelText('Senha', { exact: true }) as HTMLInputElement).value).toBe('')
    await pessoa.click(screen.getByRole('link', { name: 'Aluno', exact: true }))
    expect(screen.getByLabelText('Apelido')).toBeTruthy()
    expect(screen.queryByLabelText('E-mail')).toBeNull()
  })

  it('identifica o apelido no acesso do aluno', () => {
    tela()
    expect(screen.getByLabelText('Apelido')).toBeTruthy()
  })
})
