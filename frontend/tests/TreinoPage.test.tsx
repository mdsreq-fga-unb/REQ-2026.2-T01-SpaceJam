import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import type { Papel } from '../src/types/usuario'

const estados = {
  EM_ANDAMENTO: ['em-andamento', 'Em andamento'],
  FEITO: ['feito', 'Feito'],
  CORRIGIR_REFAZER: ['corrigir-refazer', 'Corrigir/Refazer'],
  CONCLUIDO: ['concluido', 'Concluído'],
} as const

type Status = keyof typeof estados

function abrirTreino(papel: Papel, statusInicial: Status, statusHttp = 200, falhaNaGravacao = false) {
  let status = statusInicial
  const json = (dados: unknown, codigo = 200) => new Response(JSON.stringify(dados), { status: codigo })
  const dadosStatus = () => ({
    id: 14, alunoId: 2, nome: 'Treino de drible', status,
    statusSlug: estados[status][0], statusLabel: estados[status][1], realizadoEm: null,
  })
  const buscar = vi.fn(async (entrada: RequestInfo | URL, opcoes?: RequestInit) => {
    const rota = String(entrada)
    if (rota === '/api/auth/me/') {
      return json({ id: papel === 'ALUNO' ? 2 : 1, papel, first_name: 'Teste', termos_pendentes: false })
    }
    if (rota === '/api/treinos/14/') {
      if (statusHttp !== 200) return json({ detail: 'Erro de consulta' }, statusHttp)
      return json({
        ...dadosStatus(), titulo: '', alunoNome: 'Aluno de teste', treinadorNome: 'Treinador de teste',
        data: '2026-11-26', objetivo: 'Controle de bola',
        exercicios: [{ id: 42, ordem: 1, nome: 'Drible alternado', parametros: '3 séries',
          resumo: '', orientacoes: 'Mantenha a cabeça erguida.', errosComuns: 'Olhar para a bola.' }],
      })
    }
    if (rota === '/api/treinos/14/feito/' || rota === '/api/treinos/14/concluir/') {
      if (falhaNaGravacao) {
        status = 'CONCLUIDO'
        return json({ detail: 'O treino já foi concluído.' }, 409)
      }
      const dados = JSON.parse(String(opcoes?.body)) as { status: Status }
      status = dados.status
      return json(dadosStatus())
    }
    throw new Error('Rota inesperada no teste: ' + rota)
  })
  tokenStorage.set('token-ficticio')
  vi.stubGlobal('fetch', buscar)
  window.history.replaceState({}, '', '/treinos/14')
  render(<App />)
  return { buscar, pessoa: userEvent.setup() }
}

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('Treino integrado às rotas das US23, US29 e US15', () => {
  it('consulta o treino devolvido e deixa o aluno remarcar e desfazer a marcação', async () => {
    const { buscar, pessoa } = abrirTreino('ALUNO', 'CORRIGIR_REFAZER')
    await screen.findByText('Corrigir/Refazer', { exact: true })
    expect(screen.getByText('26/11/2026')).toBeInTheDocument()
    expect(screen.queryByText(/exercícios marcados como feitos/)).not.toBeInTheDocument()

    await pessoa.click(screen.getByRole('button', { name: 'Ver exercício: Drible alternado' }))
    expect(screen.getByText('Mantenha a cabeça erguida.')).toBeInTheDocument()
    expect(screen.queryByText(/nenhum feedback registrado/i)).not.toBeInTheDocument()
    await pessoa.click(screen.getByRole('button', { name: 'Voltar ao treino' }))

    await pessoa.click(screen.getByRole('button', { name: 'Marcar treino como feito' }))
    await screen.findByRole('heading', { name: 'Treino marcado como feito' })
    expect(buscar).toHaveBeenCalledWith('/api/treinos/14/feito/', expect.objectContaining({
      method: 'PATCH', body: '{"status":"FEITO"}',
    }))
    await pessoa.click(screen.getByRole('button', { name: 'Voltar ao treino' }))
    await pessoa.click(screen.getByRole('button', { name: 'Desfazer marcação' }))
    await screen.findByText('Em andamento', { exact: true })
    expect(buscar).toHaveBeenCalledWith('/api/treinos/14/feito/', expect.objectContaining({
      method: 'PATCH', body: '{"status":"EM_ANDAMENTO"}',
    }))
  })

  it('envia devolução e conclusão explícitas pelo treinador', async () => {
    const { buscar, pessoa } = abrirTreino('TREINADOR', 'FEITO')
    await pessoa.click(await screen.findByRole('button', { name: 'Devolver para correção' }))
    await screen.findByText('Corrigir/Refazer', { exact: true })
    expect(buscar).toHaveBeenCalledWith('/api/treinos/14/concluir/', expect.objectContaining({
      method: 'PATCH', body: '{"status":"CORRIGIR_REFAZER"}',
    }))

    await pessoa.click(screen.getByRole('button', { name: 'Concluir treino' }))
    expect(screen.getByRole('heading', { name: 'Concluir este treino?' })).toBeInTheDocument()
    await pessoa.click(screen.getByRole('button', { name: 'Confirmar conclusão' }))
    await screen.findByRole('heading', { name: 'Treino concluído' })
    expect(buscar).toHaveBeenCalledWith('/api/treinos/14/concluir/', expect.objectContaining({
      method: 'PATCH', body: '{"status":"CONCLUIDO"}',
    }))
    expect(screen.queryByRole('button', { name: 'Devolver para correção' })).not.toBeInTheDocument()
  })

  it('atualiza o status se o backend recusar a marcação por um conflito de estado', async () => {
    const { pessoa } = abrirTreino('ALUNO', 'EM_ANDAMENTO', 200, true)
    await pessoa.click(await screen.findByRole('button', { name: 'Marcar treino como feito' }))
    await screen.findByRole('heading', { name: 'Treino concluído' })
    expect(screen.queryByRole('button', { name: 'Marcar treino como feito' })).not.toBeInTheDocument()
  })

  it.each([
    [403, 'Você não tem permissão para consultar este treino.'],
    [404, 'Treino não encontrado.'],
  ])('mostra o retorno da API %s na tela do treino', async (codigo, mensagem) => {
    abrirTreino('ALUNO', 'EM_ANDAMENTO', codigo)
    expect(await screen.findByRole('alert')).toHaveTextContent(mensagem)
    expect(screen.queryByRole('button', { name: 'Marcar treino como feito' })).not.toBeInTheDocument()
  })
})
