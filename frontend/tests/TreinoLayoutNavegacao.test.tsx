import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import { simularApi } from './apoio'

const aluno = { corpo: { id: 2, papel: 'ALUNO', first_name: 'Beatriz', apelido: 'bia', termos_pendentes: false } }

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('Menu do TreinoLayout', () => {
  it('troca de seção pelo roteador, sem recarregar o app nem consultar a sessão de novo', async () => {
    tokenStorage.set('token-ficticio')
    const fetch = simularApi({
      'GET /api/auth/me/': aluno,
      'GET /api/treinos/meus-videos/': { corpo: [] },
      'GET /api/treinos/meu-planejamento/': { corpo: { planejamento: null } },
    })
    window.history.replaceState({}, '', '/treinos/meus-videos')
    render(<App />)
    const pessoa = userEvent.setup()

    await screen.findByRole('heading', { name: 'Nenhum vídeo enviado' })
    const menu = screen.getByRole('navigation', { name: 'Seções do aluno' })
    const treinos = menu.querySelector('a[href="/treinos"]')
    expect(treinos).not.toBeNull()
    await pessoa.click(treinos as HTMLAnchorElement)

    expect(await screen.findByRole('heading', { name: 'Meu planejamento' })).toBeVisible()
    expect(window.location.pathname).toBe('/treinos')
    // Uma única consulta da sessão: a navegação não recarregou o app (sem a tela "SPACE JAM").
    expect(fetch.mock.calls.filter(([url]) => url === '/api/auth/me/')).toHaveLength(1)
  })
})
