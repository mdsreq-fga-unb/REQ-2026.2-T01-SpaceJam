
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MinhaContaAluno } from '../src/features/alunos/MinhaContaAluno'
import type { Usuario } from '../src/types/usuario'

const aluno: Usuario = {
  id: 1,
  apelido: 'beatriz.costa',
  first_name: 'Beatriz',
  last_name: 'Costa',
  email: 'beatriz@example.com',
  telefone: '61999990000',
  papel: 'ALUNO',
  perfil_aluno: {
    altura: '1.85',
    peso: '80.50',
    envergadura: '1.90',
    frequencia_semanal: 3,
    objetivos: 'Melhorar o arremesso',
  },
}

describe('US53 — Consultar próprios dados cadastrais', () => {
  it('exibe os dados reais do aluno', () => {
    render(<MinhaContaAluno usuario={aluno} logout={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Minha conta' })).toBeTruthy()
    expect(screen.getByText('beatriz.costa')).toBeTruthy()
    expect(screen.getByText('beatriz@example.com')).toBeTruthy()
    expect(screen.getByText('185 cm')).toBeTruthy()
    expect(screen.getByText('80,5 kg')).toBeTruthy()
    expect(screen.getByText('190 cm')).toBeTruthy()
    expect(screen.getByText('3 dias por semana')).toBeTruthy()
    expect(screen.getByText('Melhorar o arremesso')).toBeTruthy()
  })

  it('não inventa valores quando faltam informações', () => {
    const semPerfil: Usuario = {
      ...aluno,
      email: '',
      telefone: '',
      perfil_aluno: null,
    }

    render(<MinhaContaAluno usuario={semPerfil} logout={vi.fn()} />)

    expect(screen.getAllByText('Não informado').length).toBeGreaterThan(0)
    expect(screen.queryByText('185 cm')).toBeNull()
    expect(screen.queryByText('Melhorar o arremesso')).toBeNull()
  })

  it('permite sair da conta', async () => {
    const logout = vi.fn()

    render(<MinhaContaAluno usuario={aluno} logout={logout} />)

    await userEvent.setup().click(
      screen.getByRole('button', { name: 'Sair da conta' }),
    )

    expect(logout).toHaveBeenCalledOnce()
  })
})
