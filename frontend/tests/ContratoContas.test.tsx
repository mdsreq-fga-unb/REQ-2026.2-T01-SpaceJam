import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { ApiError, tokenStorage } from '../src/api/client'
import { MinhaContaAluno } from '../src/features/alunos/MinhaContaAluno'
import { RedefinirSenha } from '../src/features/conta/RedefinirSenha'
import type { Usuario } from '../src/types/usuario'

const treinador: Usuario = {
  id: 1, first_name: 'Carlos', last_name: 'Silva', apelido: 'coach',
  email: 'coach@example.com', telefone: '', papel: 'TREINADOR', termos_pendentes: false,
}
const aluno: Usuario = { ...treinador, papel: 'ALUNO', id: 2, apelido: 'aluno' }

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('Complementos do contrato de backend da iteracao 2', () => {
  it('US53 exibe treinador vinculado e historico de lesoes vazio sem inventar registros', () => {
    render(<MinhaContaAluno usuario={aluno} logout={vi.fn()}
      treinadorVinculado={{ id: 1, nome: 'Carlos Silva', codigo_convite: 'TRN-ABC123' }}
      historicoLesoes={[]} />, { wrapper: MemoryRouter })
    expect(screen.getByText('Treinador vinculado:')).toBeTruthy()
    expect(screen.getByText('Nenhuma lesão registrada.')).toBeTruthy()
  })

  it('US08 permite ao treinador navegar ate a pagina de troca de senha', async () => {
    tokenStorage.set('token-ficticio')
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(
      new Response(JSON.stringify(treinador), { status: 200 }),
    )))
    window.history.replaceState({}, '', '/')
    render(<App />)
    const atalho = await screen.findByRole('button', { name: 'Trocar senha' })
    fireEvent.click(atalho)
    expect(await screen.findByRole('heading', { name: 'Trocar minha senha' })).toBeTruthy()
  })

  it.each([
    ['token_expirado', /expirou/i],
    ['token_usado', /utilizado ou revogado/i],
    ['token_invalido', /inválido/i],
  ])('US10 trata erro de API %s com mensagem apropriada', async (codigo, frase) => {
    const callback = vi.fn().mockRejectedValue(new ApiError(400, 'Token inválido', { codigo: [codigo] }))
    render(<MemoryRouter><RedefinirSenha token="token-ficticio" onRedefinir={callback} /></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: 'NovaSenha#2026' } })
    fireEvent.change(screen.getByLabelText('Confirmar nova senha'), { target: { value: 'NovaSenha#2026' } })
    fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(frase))
    expect(screen.getByRole('link', { name: 'Solicitar outro link' })).toBeTruthy()
  })
})
