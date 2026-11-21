import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'

const treinador: Usuario = {
  id: 1,
  apelido: 'lucas',
  first_name: 'Lucas',
  last_name: 'Treinador',
  email: 'lucas@example.invalid',
  telefone: '',
  papel: 'TREINADOR',
  termos_pendentes: false,
}

function abrirComTreinador(rota: string) {
  tokenStorage.set('token-teste')
  const buscar = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(treinador), { status: 200 }),
  )
  vi.stubGlobal('fetch', buscar)
  window.history.replaceState({}, '', rota)
  render(<App />)
  return buscar
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('Integração de navegação entre as US52 e US61', () => {
  it('o treinador navega da conta para a lista de alunos', async () => {
    const requisicoes = abrirComTreinador('/')
    const botao = await screen.findByRole('button', { name: 'Consultar meus alunos' })
    fireEvent.click(botao)
    await waitFor(() => expect(window.location.pathname).toBe('/treinador/alunos'))
    expect(await screen.findByRole('heading', { name: 'Seus alunos' })).toBeTruthy()
    expect(screen.getByText('Lista de alunos indisponível')).toBeTruthy()
    expect(requisicoes).toHaveBeenCalledTimes(1)
  })

  it('o treinador volta do perfil demonstrativo para a lista real', async () => {
    const requisicoes = abrirComTreinador('/treinador/alunos/previa')
    expect(await screen.findByRole('heading', { name: 'Beatriz Costa' })).toBeTruthy()
    const voltar = screen.getByRole('button', { name: 'Voltar aos alunos' })
    fireEvent.click(voltar)
    await waitFor(() => expect(window.location.pathname).toBe('/treinador/alunos'))
    expect(await screen.findByRole('heading', { name: 'Seus alunos' })).toBeTruthy()
    expect(requisicoes).toHaveBeenCalledTimes(1)
  })
})
