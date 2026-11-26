import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, enviadosPara, simularApi } from './apoio'

const treinador: Usuario = {
  id: 1, apelido: 'lucas', first_name: 'Lucas', last_name: 'Treinador',
  email: 'lucas@example.invalid', telefone: '', papel: 'TREINADOR', termos_pendentes: false,
}

const biblioteca = [
  { id: 1, nome: 'Drible em zigue-zague', objetivo: 'Controle', fundamento: 'DRIBLE', fundamento_nome: 'Drible', orientacoes: '', erros_comuns: '', video_base: '' },
  { id: 2, nome: 'Arremesso parado', objetivo: 'Precisão', fundamento: 'ARREMESSO', fundamento_nome: 'Arremesso', orientacoes: '', erros_comuns: '', video_base: '' },
]

const ROTA = '/treinador/alunos/21/planejamento/5/novo-treino'
const POST = 'POST /api/treinos/planejamentos/5/treinos/'

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

function abrirNovoTreino(extras = {}) {
  const fetch = simularApi({
    'GET /api/auth/me/': { corpo: treinador },
    'GET /api/exercicios/': { corpo: biblioteca },
    'GET /api/treinos/alunos/21/planejamento-vigente/': {
      corpo: { aluno: { id: 21, nome: 'Beatriz Costa' }, planejamento: { id: 5, nome: 'Controle de bola', criado_em: '2026-11-26T12:00:00Z', treinos: [] } },
    },
    ...extras,
  })
  return { pessoa: abrir(ROTA), fetch }
}

describe('US24 — criar treino com exercícios da biblioteca', () => {
  it('bloqueia o envio e indica o campo de cada exercício (CA02, CA04)', async () => {
    const { pessoa, fetch } = abrirNovoTreino()
    await screen.findByRole('option', { name: /Drible em zigue-zague/ })

    await pessoa.clear(screen.getByLabelText('Séries do exercício 1'))
    await pessoa.click(screen.getByRole('button', { name: 'Salvar treino' }))

    expect(screen.getByText('Informe o nome do treino.')).toBeTruthy()
    expect(screen.getByText('Selecione o exercício.')).toBeTruthy()
    expect(screen.getByText('As séries devem ser no mínimo 1.')).toBeTruthy()
    expect(screen.getByText('As repetições devem ser no mínimo 1.')).toBeTruthy()
    expect(enviadosPara(fetch, POST)).toHaveLength(0)
  })

  it('exige ao menos um exercício (CA03)', async () => {
    const { pessoa, fetch } = abrirNovoTreino()
    await screen.findByRole('option', { name: /Drible em zigue-zague/ })

    await pessoa.type(screen.getByLabelText('Nome do treino *'), 'Treino A')
    await pessoa.click(screen.getByRole('button', { name: 'Remover exercício 1' }))
    await pessoa.click(screen.getByRole('button', { name: 'Salvar treino' }))

    expect(screen.getByText('Selecione ao menos um exercício.')).toBeTruthy()
    expect(enviadosPara(fetch, POST)).toHaveLength(0)
  })

  it('envia os exercícios na ordem escolhida, com repetições ou duração (CA01, CA05)', async () => {
    const { pessoa, fetch } = abrirNovoTreino({
      [POST]: { corpo: { id: 7, planejamento: 5, nome: 'Treino A' }, status: 201 },
    })
    await screen.findByRole('option', { name: /Drible em zigue-zague/ })

    await pessoa.type(screen.getByLabelText('Nome do treino *'), '  Treino A ')
    await pessoa.selectOptions(screen.getByLabelText('Exercício 1'), '1')
    await pessoa.type(screen.getByLabelText('Repetições do exercício 1'), '12')

    await pessoa.click(screen.getByRole('button', { name: 'Adicionar exercício' }))
    await pessoa.selectOptions(screen.getByLabelText('Exercício 2'), '1')
    await pessoa.clear(screen.getByLabelText('Séries do exercício 2'))
    await pessoa.type(screen.getByLabelText('Séries do exercício 2'), '2')
    await pessoa.selectOptions(screen.getByLabelText('Meta do exercício 2'), 'duracao_segundos')
    await pessoa.type(screen.getByLabelText('Duração em segundos do exercício 2'), '45')

    await pessoa.click(screen.getByRole('button', { name: 'Salvar treino' }))

    await waitFor(() => expect(window.location.pathname).toBe('/treinador/alunos/21/planejamento'))
    expect(enviadosPara(fetch, POST)).toEqual([{
      nome: 'Treino A',
      exercicios: [
        { exercicio: 1, series: 3, repeticoes: 12 },
        { exercicio: 1, series: 2, duracao_segundos: 45 },
      ],
    }])
  })

  it('mostra o erro por exercício devolvido pela API (400)', async () => {
    const { pessoa } = abrirNovoTreino({
      [POST]: {
        corpo: { exercicios: [{}, { exercicio: ['Exercício não encontrado na biblioteca.'] }] },
        status: 400,
      },
    })
    await screen.findByRole('option', { name: /Drible em zigue-zague/ })

    await pessoa.type(screen.getByLabelText('Nome do treino *'), 'Treino A')
    await pessoa.selectOptions(screen.getByLabelText('Exercício 1'), '1')
    await pessoa.type(screen.getByLabelText('Repetições do exercício 1'), '10')
    await pessoa.click(screen.getByRole('button', { name: 'Adicionar exercício' }))
    await pessoa.selectOptions(screen.getByLabelText('Exercício 2'), '2')
    await pessoa.type(screen.getByLabelText('Repetições do exercício 2'), '10')
    await pessoa.click(screen.getByRole('button', { name: 'Salvar treino' }))

    expect(await screen.findByText('Exercício não encontrado na biblioteca.')).toBeTruthy()
    expect(window.location.pathname).toBe(ROTA)
  })

  it('mostra a recusa de planejamento histórico (RN27)', async () => {
    const { pessoa } = abrirNovoTreino({
      [POST]: { corpo: { detail: 'Só é possível criar treinos em um planejamento vigente.' }, status: 400 },
    })
    await screen.findByRole('option', { name: /Drible em zigue-zague/ })

    await pessoa.type(screen.getByLabelText('Nome do treino *'), 'Treino A')
    await pessoa.selectOptions(screen.getByLabelText('Exercício 1'), '1')
    await pessoa.type(screen.getByLabelText('Repetições do exercício 1'), '10')
    await pessoa.click(screen.getByRole('button', { name: 'Salvar treino' }))

    expect(await screen.findByText('Só é possível criar treino em um planejamento vigente.'.replace('treino ', 'treinos '))).toBeTruthy()
  })
})