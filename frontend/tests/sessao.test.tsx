import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../src/auth/AuthContext'
import { useAuth } from '../src/auth/useAuth'
import { tokenStorage } from '../src/api/client'

const aluno = {
  id: 1, apelido: 'aluno.teste', first_name: 'Aluno', last_name: 'Teste',
  email: '', telefone: '', papel: 'ALUNO',
}
const treinador = {
  id: 2, apelido: 'treinador.teste', first_name: 'Treinador', last_name: 'Teste',
  email: 'treinador@example.com', telefone: '', papel: 'TREINADOR',
}

function resposta(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), { status })
}

function pendente<T>() {
  let resolver!: (value: T) => void
  const promessa = new Promise<T>(resolve => { resolver = resolve })
  return { promessa, resolver }
}

function ControleSessao() {
  const { usuario, carregando, login, logout } = useAuth()
  return <>
    <output>{carregando ? 'aguardando' : usuario?.apelido ?? 'sem sessão'}</output>
    <button onClick={() => { void login('aluno.teste', 'Senha#2026').catch(() => {}) }}>Entrar</button>
    <button onClick={() => { void login('treinador.teste', 'Senha#2026').catch(() => {}) }}>Trocar conta</button>
    <button onClick={logout}>Sair</button>
  </>
}

function abrir() {
  render(<AuthProvider><ControleSessao /></AuthProvider>)
  return userEvent.setup()
}

async function mudarEmOutraAba(valor: string | null, key: string | null = 'access_token') {
  await act(async () => {
    const anterior = tokenStorage.get()
    if (valor) tokenStorage.set(valor)
    else tokenStorage.clear()
    window.dispatchEvent(new StorageEvent('storage', {
      key, oldValue: anterior, newValue: valor, storageArea: localStorage,
    }))
  })
}

afterEach(() => vi.unstubAllGlobals())

describe('encerramento e troca de sessão', () => {
  it('não restaura o perfil quando a consulta termina depois da saída', async () => {
    const perfil = pendente<Response>()
    tokenStorage.set('sessao-anterior')
    vi.stubGlobal('fetch', vi.fn(() => perfil.promessa))
    const pessoa = abrir()
    await pessoa.click(screen.getByRole('button', { name: 'Sair', exact: true }))
    await act(async () => perfil.resolver(resposta(aluno)))
    expect(screen.getByRole('status').textContent).toBe('sem sessão')
    expect(tokenStorage.get()).toBeNull()
  })

  it('não salva credenciais de um login encerrado antes da resposta', async () => {
    const acesso = pendente<Response>()
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(() => acesso.promessa)
      .mockResolvedValueOnce(resposta(aluno)))
    const pessoa = abrir()
    await pessoa.click(screen.getByRole('button', { name: 'Entrar', exact: true }))
    await pessoa.click(screen.getByRole('button', { name: 'Sair', exact: true }))
    await act(async () => acesso.resolver(resposta({ access: 'acesso-atrasado' })))
    expect(tokenStorage.get()).toBeNull()
    expect(screen.getByRole('status').textContent).toBe('sem sessão')
  })

  it('preserva a conta nova se a consulta da sessão anterior falhar depois', async () => {
    const perfilAntigo = pendente<Response>()
    tokenStorage.set('sessao-antiga')
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(() => perfilAntigo.promessa)
      .mockResolvedValueOnce(resposta({ access: 'sessao-nova' }))
      .mockResolvedValueOnce(resposta(treinador)))
    const pessoa = abrir()
    await pessoa.click(screen.getByRole('button', { name: 'Trocar conta' }))
    await act(async () => perfilAntigo.resolver(resposta({ detail: 'Expirado' }, 401)))
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('treinador.teste'))
    expect(tokenStorage.get()).toBe('sessao-nova')
  })

  it('encerra a sessão desta aba quando a pessoa sai em outra', async () => {
    tokenStorage.set('sessao-ativa')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(aluno)))
    abrir()
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('aluno.teste'))
    await mudarEmOutraAba(null)
    expect(screen.getByRole('status').textContent).toBe('sem sessão')
  })

  it('não mostra dados da conta anterior enquanto carrega a conta aberta em outra aba', async () => {
    const proximoPerfil = pendente<Response>()
    tokenStorage.set('sessao-aluno')
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(resposta(aluno))
      .mockImplementationOnce(() => proximoPerfil.promessa))
    abrir()
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('aluno.teste'))
    await mudarEmOutraAba('sessao-treinador')
    expect(screen.getByRole('status').textContent).toBe('aguardando')
    await act(async () => proximoPerfil.resolver(resposta(treinador)))
    expect(screen.getByRole('status').textContent).toBe('treinador.teste')
  })

  it('encerra a sessão quando os dados do navegador são limpos em outra aba', async () => {
    tokenStorage.set('sessao-ativa')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(resposta(aluno)))
    abrir()
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('aluno.teste'))
    await mudarEmOutraAba(null, null)
    expect(screen.getByRole('status').textContent).toBe('sem sessão')
  })
})
