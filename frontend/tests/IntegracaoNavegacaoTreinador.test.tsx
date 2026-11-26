import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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

function abrirComTreinador(rota: string, responder?: (url: string) => Response | undefined) {
  tokenStorage.set('token-teste')
  const buscar = vi.fn(async (url: string) => responder?.(url) ?? Response.json(treinador))
  vi.stubGlobal('fetch', buscar)
  window.history.replaceState({}, '', rota)
  render(<App />)
  return buscar
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('Integração de navegação do treinador', () => {
  it('o treinador navega da conta para a lista de alunos', async () => {
    const requisicoes = abrirComTreinador('/')
    const botao = await screen.findByRole('button', { name: 'Consultar alunos' })
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

  it.each(['Menu do treinador', 'Seções do treinador'])('abre a biblioteca a partir de %s', async (menu) => {
    abrirComTreinador('/treinador/alunos', (url) => {
      if (url.endsWith('/api/exercicios/')) return Response.json([])
    })
    const navegacao = await screen.findByRole('navigation', { name: menu })
    fireEvent.click(within(navegacao).getByRole('link', { name: 'Biblioteca' }))
    expect(await screen.findByRole('heading', { name: 'Biblioteca de exercícios' })).toBeTruthy()
    expect(window.location.pathname).toBe('/exercicios')
    fireEvent.click(screen.getByRole('link', { name: 'Alunos' }))
    expect(await screen.findByRole('heading', { name: 'Seus alunos' })).toBeTruthy()
  })

  it('mostra o erro ao abrir o endereço de um exercício inexistente', async () => {
    abrirComTreinador('/exercicios/999', (url) => {
      if (url.endsWith('/api/exercicios/999/')) {
        return Response.json({ detail: 'Exercício não encontrado.' }, { status: 404 })
      }
      if (url.endsWith('/api/exercicios/')) return Response.json([])
    })
    expect((await screen.findByRole('alert')).textContent).toBe('Exercício não encontrado.')
    expect(window.location.pathname).toBe('/exercicios/999')
  })
})
