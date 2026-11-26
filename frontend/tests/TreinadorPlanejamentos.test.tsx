import { screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, enviadosPara, simularApi } from './apoio'

const treinador: Usuario = {
  id: 1, apelido: 'lucas', first_name: 'Lucas', last_name: 'Treinador',
  email: 'lucas@example.invalid', telefone: '', papel: 'TREINADOR', termos_pendentes: false,
}

const carteira = [
  { id: 21, nome: 'Beatriz Costa', planejamento_vigente: { id: 5, nome: 'Controle de bola' } },
  { id: 22, nome: 'André Lima', planejamento_vigente: null },
]

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('US27 — lista de planejamentos da carteira', () => {
  it('mostra cada aluno com o planejamento vigente ou a indicação de que não há', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/': { corpo: carteira },
    })
    abrir('/treinador/planejamentos')

    const lista = await screen.findByLabelText('Planejamentos por aluno')
    const beatriz = within(lista).getByRole('link', { name: /Beatriz Costa/ })
    expect(beatriz.textContent).toContain('Controle de bola · Planejamento vigente')
    expect(beatriz.getAttribute('href')).toBe('/treinador/alunos/21/planejamento')
    expect(within(lista).getByRole('link', { name: /André Lima/ }).textContent).toContain('Nenhum planejamento vigente')
  })

  it('não exibe dados fictícios e leva a "Novo planejamento"', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/': { corpo: [] },
    })
    const pessoa = abrir('/treinador/planejamentos')

    expect(await screen.findByRole('heading', { name: 'Nenhum aluno na carteira' })).toBeTruthy()
    expect(screen.queryByText('Beatriz Costa')).toBeNull()
    await pessoa.click(screen.getByRole('link', { name: 'Novo planejamento' }))
    await waitFor(() => expect(window.location.pathname).toBe('/treinador/novo-planejamento'))
  })

  it('distingue falha da API de carteira vazia', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/': { corpo: { detail: 'Indisponível' }, status: 503 },
    })
    abrir('/treinador/planejamentos')

    expect(await screen.findByRole('heading', { name: 'Planejamentos indisponíveis' })).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Nenhum aluno na carteira' })).toBeNull()
  })

  it('o menu Treinos do layout do treinador leva à lista de planejamentos', async () => {
    simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/alunos-acompanhados/': { corpo: { alunos: [], codigo_convite: null } },
      'GET /api/treinos/alunos/': { corpo: carteira },
    })
    const pessoa = abrir('/treinador/alunos')

    const menu = await screen.findByRole('navigation', { name: 'Menu do treinador' })
    await pessoa.click(within(menu).getByRole('link', { name: 'Treinos' }))
    await waitFor(() => expect(window.location.pathname).toBe('/treinador/planejamentos'))
  })
})

describe('US18 — novo planejamento', () => {
  function abrirNovo(caminho = '/treinador/novo-planejamento', extras = {}) {
    const fetch = simularApi({
      'GET /api/auth/me/': { corpo: treinador },
      'GET /api/treinos/alunos/': { corpo: carteira },
      ...extras,
    })
    return { pessoa: abrir(caminho), fetch }
  }

  it('bloqueia o envio e destaca os campos obrigatórios (CA03)', async () => {
    const { pessoa, fetch } = abrirNovo()
    await screen.findByRole('button', { name: 'Beatriz Costa' })

    await pessoa.click(screen.getByRole('button', { name: 'Criar planejamento' }))

    expect(screen.getByText('Selecione o aluno.')).toBeTruthy()
    expect(screen.getByText('Informe o nome do planejamento.')).toBeTruthy()
    expect(enviadosPara(fetch, 'POST /api/treinos/planejamentos/')).toHaveLength(0)
  })

  it('cria o planejamento do aluno escolhido e abre o planejamento dele', async () => {
    const { pessoa, fetch } = abrirNovo('/treinador/novo-planejamento', {
      'POST /api/treinos/planejamentos/': { corpo: { id: 9, aluno: 22, nome: 'Arremesso' }, status: 201 },
      'GET /api/treinos/alunos/22/planejamento-vigente/': {
        corpo: { aluno: { id: 22, nome: 'André Lima' }, planejamento: { id: 9, nome: 'Arremesso', criado_em: '2026-11-26T12:00:00Z', treinos: [] } },
      },
    })

    await pessoa.click(await screen.findByRole('button', { name: 'André Lima' }))
    await pessoa.type(screen.getByLabelText('Nome do planejamento *'), '  Arremesso  ')
    await pessoa.click(screen.getByRole('button', { name: 'Criar planejamento' }))

    await waitFor(() => expect(window.location.pathname).toBe('/treinador/alunos/22/planejamento'))
    expect(enviadosPara(fetch, 'POST /api/treinos/planejamentos/')).toEqual([{ aluno: 22, nome: 'Arremesso' }])
    expect(await screen.findByRole('heading', { name: 'Arremesso' })).toBeTruthy()
  })

  it('mostra o erro de campo devolvido pela API (400)', async () => {
    const { pessoa } = abrirNovo('/treinador/novo-planejamento', {
      'POST /api/treinos/planejamentos/': { corpo: { nome: ['O nome do planejamento deve ter no máximo 255 caracteres.'] }, status: 400 },
    })

    await pessoa.click(await screen.findByRole('button', { name: 'André Lima' }))
    await pessoa.type(screen.getByLabelText('Nome do planejamento *'), 'x')
    await pessoa.click(screen.getByRole('button', { name: 'Criar planejamento' }))

    expect(await screen.findByText('O nome do planejamento deve ter no máximo 255 caracteres.')).toBeTruthy()
    expect(window.location.pathname).toBe('/treinador/novo-planejamento')
  })

  it('pré-seleciona o aluno do endereço e avisa que o vigente irá para o histórico (CA04)', async () => {
    abrirNovo('/treinador/novo-planejamento?aluno=21')

    const botao = await screen.findByRole('button', { name: /Beatriz Costa/ })
    expect(botao.getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText(/já tem o planejamento vigente "Controle de bola"/)).toBeTruthy()
  })
})