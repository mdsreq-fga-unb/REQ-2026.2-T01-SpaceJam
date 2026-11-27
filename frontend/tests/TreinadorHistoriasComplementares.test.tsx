import { screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, enviadosPara, simularApi } from './apoio'
import '@testing-library/jest-dom/vitest'

const treinador: Usuario = {
  id: 1, apelido: 'lucas', first_name: 'Lucas', last_name: 'Treinador',
  email: 'lucas@example.invalid', telefone: '', papel: 'TREINADOR', termos_pendentes: false,
}
const aluno = { id: 21, nome: 'Beatriz Costa' }
const criado_em = '2026-11-26T12:00:00Z'
const exercicio = (id: number, nome: string, status = 'A_FAZER', repeticoes: number | null = 10) => ({
  id, nome, series: 3, repeticoes, duracao_segundos: repeticoes ? null : 30, status,
})
const vigente = {
  aluno,
  planejamento: {
    id: 5, nome: 'Controle de bola', criado_em,
    treinos: [
      { id: 1, nome: 'Treino A', status: 'EM_ANDAMENTO', status_display: 'Em andamento', total_exercicios: 2,
        exercicios: [exercicio(11, 'Drible alternado', 'FEITO'), exercicio(12, 'Mudança de direção', 'A_FAZER', null)] },
      { id: 2, nome: 'Treino B', status: 'EM_ANDAMENTO', status_display: 'Em andamento', total_exercicios: 1,
        exercicios: [exercicio(21, 'Arremesso')] },
      { id: 3, nome: 'Treino C', status: 'CONCLUIDO', status_display: 'Concluído', total_exercicios: 1,
        exercicios: [exercicio(31, 'Passe', 'CONCLUIDO')] },
    ],
  },
}
const URL_VIGENTE = 'GET /api/treinos/alunos/21/planejamento-vigente/'

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('US19 — editar planejamento', () => {
  it('salva o novo nome e volta ao planejamento (CA01)', async () => {
    const fetch = simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      [URL_VIGENTE]: { corpo: vigente },
      'PATCH /api/treinos/planejamentos/5/': { corpo: { id: 5, nome: 'Arremesso' } },
    })
    const pessoa = abrir('/treinador/alunos/21/planejamento/5/editar')

    const campo = await screen.findByLabelText('Nome do planejamento *')
    expect(campo).toHaveValue('Controle de bola')
    await pessoa.clear(campo)
    await pessoa.type(campo, 'Arremesso')
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(enviadosPara(fetch, 'PATCH /api/treinos/planejamentos/5/')).toEqual([{ nome: 'Arremesso' }])
    expect(await screen.findByRole('heading', { name: 'Controle de bola' })).toBeTruthy()
  })

  it('bloqueia nome vazio sem chamar a API (CA02)', async () => {
    const fetch = simularApi({ 'GET /api/auth/me/': { corpo: treinador }, [URL_VIGENTE]: { corpo: vigente } })
    const pessoa = abrir('/treinador/alunos/21/planejamento/5/editar')

    await pessoa.clear(await screen.findByLabelText('Nome do planejamento *'))
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Informe o nome do planejamento.')).toBeTruthy()
    expect(enviadosPara(fetch, 'PATCH /api/treinos/planejamentos/5/')).toEqual([])
  })

  it('só oferece remover treino não executado e remove após confirmar (CA04, CA05)', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      [URL_VIGENTE]: { corpo: vigente },
      'DELETE /api/treinos/planejamentos/5/treinos/2/': { corpo: {} },
    })
    const pessoa = abrir('/treinador/alunos/21/planejamento/5/editar')

    await screen.findByLabelText('Nome do planejamento *')
    expect(screen.queryByRole('button', { name: 'Remover Treino A' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Remover Treino C' })).toBeNull()
    await pessoa.click(screen.getByRole('button', { name: 'Remover Treino B' }))
    await pessoa.click(screen.getByRole('button', { name: 'Confirmar remoção' }))

    expect(await screen.findByText(/Treino A/)).toBeTruthy()
    expect(screen.queryByText(/Treino B/)).toBeNull()
  })

  it('mostra aviso quando o planejamento não é o vigente (CA06)', async () => {
    simularApi({ 'GET /api/auth/me/': { corpo: treinador }, [URL_VIGENTE]: { corpo: vigente } })
    abrir('/treinador/alunos/21/planejamento/99/editar')

    expect(await screen.findByText('Este planejamento está no histórico e é somente leitura.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).toBeNull()
  })
})

describe('US21 — planejamentos anteriores', () => {
  it('lista o histórico e consulta os treinos de um planejamento (CA02)', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/21/planejamentos-historico/': {
        corpo: { aluno, planejamentos: [
          { id: 7, nome: 'Fundamentos', criado_em, encerrado_em: '2026-11-20T12:00:00Z', total_treinos: 2 },
        ] },
      },
      'GET /api/treinos/alunos/21/planejamentos-historico/7/': {
        corpo: { aluno, planejamento: { id: 7, nome: 'Fundamentos', criado_em, encerrado_em: null, treinos: [
          { id: 9, nome: 'Treino antigo', status: 'CONCLUIDO', status_display: 'Concluído', total_exercicios: 2, exercicios: [] },
        ] } },
      },
    })
    const pessoa = abrir('/treinador/alunos/21/planejamentos-anteriores')

    const botao = await screen.findByRole('button', { name: /Fundamentos/ })
    expect(botao).toHaveTextContent('2 treinos')
    await pessoa.click(botao)

    expect(await screen.findByText('Treino antigo · Concluído · 2 exercícios')).toBeTruthy()
  })

  it('informa quando não há planejamento anterior (CA03)', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/21/planejamentos-historico/': { corpo: { aluno, planejamentos: [] } },
    })
    abrir('/treinador/alunos/21/planejamentos-anteriores')

    expect(await screen.findByText('Nenhum planejamento anterior.')).toBeTruthy()
  })
})

describe('US25 — editar treino', () => {
  function abrirEdicao(rota = '/treinador/alunos/21/planejamento/5/treinos/1/editar', extras = {}) {
    const fetch = simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      [URL_VIGENTE]: { corpo: vigente },
      'GET /api/exercicios/': { corpo: [] },
      ...extras,
    })
    return { fetch, pessoa: abrir(rota) }
  }

  it('trava exercício já executado e envia os parâmetros alterados', async () => {
    const { fetch, pessoa } = abrirEdicao(undefined, {
      'PUT /api/treinos/treinos/1/': { corpo: { id: 1, nome: 'Treino A' } },
    })

    const executado = (await screen.findByText(/Drible alternado · já executado/)).closest('fieldset')!
    expect(within(executado).getByLabelText('Séries *')).toBeDisabled()
    expect(within(executado).queryByRole('button', { name: /Remover/ })).toBeNull()

    const editavel = screen.getByText(/Mudança de direção/).closest('fieldset')!
    const duracao = within(editavel).getByLabelText('Duração (segundos) *')
    await pessoa.clear(duracao)
    await pessoa.type(duracao, '45')
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(enviadosPara(fetch, 'PUT /api/treinos/treinos/1/')).toEqual([{
      nome: 'Treino A',
      exercicios: [
        { id: 11, series: 3, repeticoes: 10 },
        { id: 12, series: 3, duracao_segundos: 45 },
      ],
    }])
  })

  it('bloqueia parâmetro inválido sem chamar a API', async () => {
    const { fetch, pessoa } = abrirEdicao()

    const editavel = (await screen.findByText(/Mudança de direção/)).closest('fieldset')!
    await pessoa.clear(within(editavel).getByLabelText('Séries *'))
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(screen.getByText('As séries devem ser no mínimo 1.')).toBeTruthy()
    expect(enviadosPara(fetch, 'PUT /api/treinos/treinos/1/')).toEqual([])
  })

  it('mostra a mensagem do servidor quando a edição é bloqueada (409)', async () => {
    const { pessoa } = abrirEdicao(undefined, {
      'PUT /api/treinos/treinos/1/': {
        corpo: { detail: 'Treino concluído é somente leitura.', code: 'EDICAO_BLOQUEADA' }, status: 409,
      },
    })

    await screen.findByText(/Mudança de direção/)
    await pessoa.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Treino concluído é somente leitura.')
  })

  it('não abre o formulário para treino concluído', async () => {
    abrirEdicao('/treinador/alunos/21/planejamento/5/treinos/3/editar')

    expect(await screen.findByText('Treino concluído é somente leitura.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).toBeNull()
  })
})