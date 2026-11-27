
import React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router'
import {
  TreinadorEditarPlanejamento,
  TreinadorPlanejamentosAnteriores,
  TreinadorEditarTreino,
} from '../src/features/treinador/TreinadorHistoriasComplementares'

vi.mock('../src/auth/useAuth', () => ({
  useAuth: () => ({
    usuario: {
      id: 1,
      apelido: 'lucas',
      first_name: 'Lucas',
      last_name: 'Treinador',
    },
  }),
}))

function renderizarTela(
  componente: React.ReactNode,
  rota = '/treinador/alunos/21/planejamento/5/editar',
) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route
          path="/treinador/alunos/:alunoId/planejamento/:planejamentoId/*"
          element={componente}
        />
        <Route
          path="/treinador/alunos/:alunoId/planejamentos-anteriores"
          element={componente}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('US19 — editar planejamento', () => {
  it('exibe o planejamento e os treinos vinculados', () => {
    renderizarTela(<TreinadorEditarPlanejamento />)

    expect(screen.getByText(/Controle de bola/i)).toBeTruthy()
    expect(screen.getByText(/Beatriz Costa/i)).toBeTruthy()
  })

  it('permite alterar e salvar o nome do planejamento', async () => {
    const user = userEvent.setup()

    renderizarTela(<TreinadorEditarPlanejamento />)

    const campoNome = screen.getByDisplayValue('Controle de bola')

    await user.clear(campoNome)
    await user.type(campoNome, 'Fundamentos de basquete')

    const botaoSalvar = screen.getByRole('button', {
      name: /salvar/i,
    })

    await user.click(botaoSalvar)

    expect(
      screen.getByDisplayValue('Fundamentos de basquete'),
    ).toBeTruthy()

    expect(
      screen.getByRole('status').textContent,
    ).toMatch(/Alterações registradas nesta demonstração/i)
  })
})

describe('US21 — consultar planejamentos anteriores', () => {
  it('apresenta os planejamentos anteriores do aluno', () => {
    renderizarTela(
      <TreinadorPlanejamentosAnteriores />,
      '/treinador/alunos/21/planejamentos-anteriores',
    )

    expect(screen.getByText(/Fundamentos de drible/i)).toBeTruthy()
    expect(screen.getByText(/Base de arremesso/i)).toBeTruthy()
  })

  it('permite consultar e recolher os treinos de um planejamento', async () => {
    const user = userEvent.setup()

    renderizarTela(
      <TreinadorPlanejamentosAnteriores />,
      '/treinador/alunos/21/planejamentos-anteriores',
    )

    const botao = screen.getByRole('button', {
      name: /Fundamentos de drible/i,
    })

    await user.click(botao)

    expect(
      screen.getByText('Treino A · Controle de bola'),
    ).toBeTruthy()

    expect(
      screen.getByText('Treino B · Mudança de direção'),
    ).toBeTruthy()

    await user.click(botao)

    expect(
      screen.queryByText('Treino A · Controle de bola'),
    ).toBeNull()

    expect(
      screen.queryByText('Treino B · Mudança de direção'),
    ).toBeNull()
  })

  it('oferece acesso ao planejamento vigente', () => {
    renderizarTela(
      <TreinadorPlanejamentosAnteriores />,
      '/treinador/alunos/21/planejamentos-anteriores',
    )

    const link = screen.getByRole('link', {
      name: /planejamento vigente/i,
    })

    expect(link.getAttribute('href')).toBe(
      '/treinador/alunos/21/planejamento',
    )
  })
})

describe('US25 — editar treino', () => {
  it('apresenta os exercícios e os parâmetros do exercício selecionado', () => {
    renderizarTela(<TreinadorEditarTreino />)

    expect(screen.getByText(/Treino A/i)).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: /Drible alternado/i,
      }),
    ).toBeTruthy()

    expect(
      screen.getByRole('button', {
        name: /Drible com deslocamento/i,
      }),
    ).toBeTruthy()
  })

  it('permite alterar a quantidade de repetições', async () => {
    const user = userEvent.setup()

    renderizarTela(<TreinadorEditarTreino />)

    const campoRepeticoes = screen.getByDisplayValue('10')

    await user.clear(campoRepeticoes)
    await user.type(campoRepeticoes, '15')

    expect(
      screen.getByDisplayValue('15'),
    ).toBeTruthy()
  })

  it('permite alterar a duração de um exercício', async () => {
    const user = userEvent.setup()

    renderizarTela(<TreinadorEditarTreino />)

    const exercicio = screen.getByRole('button', {
      name: /Drible alternado/i,
    })

    await user.click(exercicio)

    const campoDuracao = screen.getByDisplayValue('30')

    await user.clear(campoDuracao)
    await user.type(campoDuracao, '45')

    expect(
      screen.getByDisplayValue('45'),
    ).toBeTruthy()
  })

  it('permite salvar as alterações do treino e apresenta confirmação', async () => {
    const user = userEvent.setup()

    renderizarTela(<TreinadorEditarTreino />)

    const botaoSalvar = screen.getByRole('button', {
      name: /salvar/i,
    })

    await user.click(botaoSalvar)

    expect(
      await screen.findByRole('status'),
    ).toBeTruthy()

    expect(
      screen.getByRole('status').textContent,
    ).toMatch(/Alterações registradas nesta demonstração/i)
  })
})
