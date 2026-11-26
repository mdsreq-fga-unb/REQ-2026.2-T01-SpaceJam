import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, simularApi } from './apoio'

const treinador: Usuario = {
  id: 1, apelido: 'lucas', first_name: 'Lucas', last_name: 'Treinador',
  email: 'lucas@example.invalid', telefone: '', papel: 'TREINADOR', termos_pendentes: false,
}

const aluno = { id: 21, nome: 'Beatriz Costa' }
const criado_em = '2026-11-26T12:00:00Z'

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

function abrirPlanejamento(corpo: unknown, status = 200) {
  simularApi({
    'GET /api/auth/me/': { corpo: treinador },
    'GET /api/treinos/alunos/21/planejamento-vigente/': { corpo, status },
  })
  return abrir('/treinador/alunos/21/planejamento')
}

describe('US27 — planejamento vigente do aluno', () => {
  it('lista os treinos com estado e quantidade de exercícios (CA03)', async () => {
    abrirPlanejamento({
      aluno,
      planejamento: {
        id: 5, nome: 'Controle de bola', criado_em,
        treinos: [
          { id: 1, nome: 'Treino A', status: 'FEITO', status_display: 'Feito', total_exercicios: 3 },
          { id: 2, nome: 'Treino B', status: 'EM_ANDAMENTO', status_display: 'Em andamento', total_exercicios: 1 },
        ],
      },
    })

    expect(await screen.findByRole('heading', { name: 'Controle de bola' })).toBeTruthy()
    expect(screen.getByText('Planejamento de Beatriz Costa')).toBeTruthy()
    expect(screen.getByText('Feito · aguardando avaliação · 3 exercícios')).toBeTruthy()
    expect(screen.getByText('Em andamento · 1 exercício')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Adicionar treino' }).getAttribute('href')).toBe(
      '/treinador/alunos/21/planejamento/5/novo-treino',
    )
  })

  it('mostra os exercícios prescritos com seus parâmetros (CA02)', async () => {
    abrirPlanejamento({
      aluno,
      planejamento: {
        id: 5, nome: 'Controle de bola', criado_em,
        treinos: [{
          id: 1, nome: 'Treino A', status: 'FEITO', status_display: 'Feito', total_exercicios: 2,
          exercicios: [
            { id: 7, nome: 'Drible alternado', series: 3, repeticoes: 10, duracao_segundos: null },
            { id: 8, nome: 'Prancha', series: 1, repeticoes: null, duracao_segundos: 45 },
          ],
        }],
      },
    })

    await userEvent.setup().click(await screen.findByText('Ver exercícios'))
    expect(screen.getByText('Drible alternado')).toBeVisible()
    expect(screen.getByText('3 séries · 10 repetições')).toBeVisible()
    expect(screen.getByText('Prancha')).toBeVisible()
    expect(screen.getByText('1 série · 45 s')).toBeVisible()
  })

  it('não mostra ações fora do MVP', async () => {
    abrirPlanejamento({ aluno, planejamento: { id: 5, nome: 'Controle de bola', criado_em, treinos: [] } })

    await screen.findByRole('heading', { name: 'Controle de bola' })
    for (const nome of ['Editar planejamento', 'Histórico de planejamentos', 'Vincular objetivo', 'Excluir planejamento']) {
      expect(screen.queryByText(nome)).toBeNull()
    }
  })

  it('indica quando o planejamento vigente ainda não tem treinos (CA04)', async () => {
    abrirPlanejamento({ aluno, planejamento: { id: 5, nome: 'Controle de bola', criado_em, treinos: [] } })

    expect(await screen.findByText('Este planejamento ainda não tem treinos.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Adicionar treino' })).toBeTruthy()
  })

  it('oferece criar planejamento quando o aluno não tem vigente (CA05)', async () => {
    abrirPlanejamento({ aluno, planejamento: null })

    expect(await screen.findByRole('heading', { name: 'Nenhum planejamento vigente' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Criar planejamento' }).getAttribute('href')).toBe(
      '/treinador/novo-planejamento?aluno=21',
    )
    expect(screen.getByRole('link', { name: 'Voltar aos alunos' }).getAttribute('href')).toBe('/treinador/planejamentos')
  })

  it('informa quando o aluno não pertence à carteira (404)', async () => {
    abrirPlanejamento({ detail: 'Não encontrado.' }, 404)

    expect((await screen.findByRole('alert')).textContent).toContain('Aluno não encontrado na sua carteira.')
  })
})