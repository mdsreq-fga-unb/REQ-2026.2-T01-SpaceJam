import { screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import type { Usuario } from '../src/types/usuario'
import { abrir, simularApi } from './apoio'

const aluno: Usuario = {
  id: 21, apelido: 'bia', first_name: 'Beatriz', last_name: 'Costa',
  email: 'bia@example.invalid', telefone: '', papel: 'ALUNO', termos_pendentes: false,
}

const treino = {
  id: 4, nome: 'Treino A', status: 'FEITO', status_display: 'Feito', total_exercicios: 2,
  exercicios: [
    {
      id: 7, exercicio: 9, ordem: 1, nome: 'Prancha', objetivo: 'Estabilidade',
      fundamento: 'CONDICIONAMENTO_FISICO', orientacoes: '', erros_comuns: '',
      erros_orientacoes: [], video_base: '', series: 2, repeticoes: null,
      duracao_segundos: 45, status: 'FEITO',
    },
    {
      id: 8, exercicio: null, ordem: 2, nome: 'Drible entre cones', objetivo: 'Controle de bola',
      fundamento: 'DRIBLE', orientacoes: 'Mantenha a cabeça erguida.',
      erros_comuns: 'Olhar para a bola',
      erros_orientacoes: [{ erro: 'Perder o equilíbrio', orientacao_corretiva: 'Flexione os joelhos.' }],
      video_base: 'https://example.com/drible', series: 3, repeticoes: 12,
      duracao_segundos: null, status: 'A_FAZER',
    },
  ],
}
const planejamento = { id: 5, nome: 'Controle de bola', criado_em: '2026-11-26T12:00:00Z', treinos: [treino] }

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  tokenStorage.clear()
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

function simularConsulta(resposta: { corpo: unknown; status?: number } | { corpo: unknown; status?: number }[]) {
  return simularApi({
    'GET /api/auth/me/': { corpo: aluno },
    'GET /api/contas/me/': { corpo: aluno },
    'GET /api/treinos/meu-planejamento/': resposta,
  })
}

describe('US60 — Meu planejamento do aluno', () => {
  it('abre a lista de treinos pelo menu da conta', async () => {
    simularConsulta({ corpo: { planejamento } })
    const pessoa = abrir('/')

    await pessoa.click(await screen.findByRole('link', { name: 'Treinos' }))

    expect(await screen.findByRole('heading', { name: 'Meu planejamento' })).toBeVisible()
    expect(await screen.findByRole('heading', { name: 'Controle de bola' })).toBeVisible()
    expect(screen.getByText('Feito')).toBeVisible()
    expect(screen.getByText('2 exercícios')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Treinos' })).toHaveAttribute('aria-current', 'page')
  })

  it('abre o treino e exibe os exercícios prescritos na ordem com suas orientações', async () => {
    simularConsulta({ corpo: { planejamento } })
    const pessoa = abrir('/treinos')

    await pessoa.click(await screen.findByRole('link', { name: /Treino A/ }))

    expect(await screen.findByRole('heading', { name: 'Treino A' })).toBeVisible()
    expect(window.location.pathname).toBe('/treinos/planejamento/4')
    const lista = screen.getByRole('list', { name: 'Exercícios prescritos' })
    const exercicios = within(lista).getAllByRole('listitem')
    expect(within(exercicios[0]).getByRole('heading', { name: 'Prancha' })).toBeVisible()
    expect(within(exercicios[0]).getByText('2 séries · 45 s')).toBeVisible()
    expect(within(exercicios[1]).getByRole('heading', { name: 'Drible entre cones' })).toBeVisible()
    expect(within(exercicios[1]).getByText('3 séries · 12 repetições')).toBeVisible()
    expect(screen.getByText('Mantenha a cabeça erguida.')).toBeVisible()
    expect(screen.getByText('Olhar para a bola')).toBeVisible()
    expect(screen.getByText('Perder o equilíbrio')).toBeVisible()
    expect(screen.getByText('Flexione os joelhos.')).toBeVisible()

    await pessoa.click(screen.getByRole('link', { name: 'Voltar aos treinos' }))
    expect(await screen.findByRole('link', { name: /Treino A/ })).toBeVisible()
  })

  it('aceita abrir diretamente o detalhe de um treino vigente', async () => {
    simularConsulta({ corpo: { planejamento } })
    abrir('/treinos/planejamento/4')

    expect(await screen.findByRole('heading', { name: 'Treino A' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Abrir execução do treino' })).toHaveAttribute('href', '/treinos/4')
  })

  it('informa quando não há planejamento vigente', async () => {
    simularConsulta({ corpo: { planejamento: null } })
    abrir('/treinos')

    expect(await screen.findByRole('heading', { name: 'Nenhum planejamento vigente' })).toBeVisible()
    expect(screen.getByText('Nenhum treino planejado.')).toBeVisible()
  })

  it('informa quando o planejamento vigente ainda não tem treinos', async () => {
    simularConsulta({ corpo: { planejamento: { ...planejamento, treinos: [] } } })
    abrir('/treinos')

    expect(await screen.findByRole('heading', { name: 'Controle de bola' })).toBeVisible()
    expect(screen.getByText('Este planejamento ainda não tem treinos.')).toBeVisible()
  })

  it('permite voltar quando o treino está fora do planejamento vigente', async () => {
    simularConsulta({ corpo: { planejamento } })
    abrir('/treinos/planejamento/13')

    expect(await screen.findByRole('heading', { name: 'Treino indisponível' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Voltar aos treinos' })).toHaveAttribute('href', '/treinos')
  })

  it('permite consultar de novo após falha de conexão', async () => {
    simularConsulta([{ corpo: { detail: 'Erro temporário' }, status: 503 }, { corpo: { planejamento } }])
    const pessoa = abrir('/treinos')

    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível consultar seu planejamento.')
    await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByRole('heading', { name: 'Controle de bola' })).toBeVisible()
  })

  it('redireciona o treinador para a própria conta ao acessar a rota de aluno', async () => {
    simularApi({ 'GET /api/auth/me/': { corpo: { ...aluno, papel: 'TREINADOR' } } })
    abrir('/treinos')

    expect(await screen.findByRole('heading', { name: 'Minha conta' })).toBeVisible()
    expect(window.location.pathname).toBe('/')
  })
})
