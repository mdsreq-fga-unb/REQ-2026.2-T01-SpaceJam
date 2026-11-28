import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { HistoricoTreinos, RegistroTreinoHistorico } from '../src/features/treinos/HistoricoTreinos'

const treino = { id: 1, nome: 'Controle de bola', data: '2026-11-17', status: 'Concluído', quantidadeExercicios: 1 }

describe('Histórico de treinos — US28 e US58', () => {
  it('mostra o histórico do aluno e abre o registro pelo link de consulta', () => {
    render(<HistoricoTreinos consulta={{ estado: 'disponivel', treinos: [treino] }}
      rotaTreino={id => '/historico/' + id} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Meu histórico' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Meu histórico' })).toHaveFocus()
    expect(screen.getByText(/17\/11\/2026.*Concluído/)).toBeVisible()
    expect(screen.getByRole('link', { name: 'Consultar Controle de bola' })).toHaveAttribute('href', '/historico/1')
  })

  it('identifica o aluno acompanhado e distingue resultado vazio de falha', () => {
    const props = { alunoNome: 'Aluno de exemplo', rotaTreino: (id: number) => '/historico/' + id }
    const { rerender } = render(<HistoricoTreinos {...props}
      consulta={{ estado: 'disponivel', treinos: [] }} />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Histórico de treinos' })).toBeVisible()
    expect(screen.getByText('Aluno de exemplo')).toBeVisible()
    expect(screen.getByText('Nenhum treino realizado no histórico.')).toBeVisible()
    const tentarNovamente = vi.fn()
    rerender(<HistoricoTreinos {...props} consulta={{ estado: 'erro', mensagem: 'Consulta indisponível.', tentarNovamente }} />)
    expect(screen.getByRole('alert')).toHaveTextContent('Consulta indisponível.')
    expect(screen.queryByText('Nenhum treino realizado no histórico.')).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(tentarNovamente).toHaveBeenCalledOnce()
  })

  it('mostra o treino prescrito da época, as dificuldades e os feedbacks sem ações de edição', () => {
    render(<RegistroTreinoHistorico treino={{ ...treino, exercicios: [{
      id: 9, nome: 'Drible da prescrição original', parametros: '3 séries · 8 repetições',
      orientacoes: 'Mantenha o olhar à frente.', dificuldade: 3,
      errosOrientacoes: [{ erro: 'Olhar para a bola', orientacaoCorretiva: 'Olhe para a frente.' }],
      feedbacks: [{ autor: 'Aluno', texto: 'Tive dificuldade na segunda série.', editado: true }],
    }] }} voltar="/historico" />, { wrapper: MemoryRouter })

    expect(screen.getByRole('heading', { name: 'Drible da prescrição original' })).toBeVisible()
    expect(screen.getByRole('heading', { name: treino.nome })).toHaveFocus()
    expect(screen.getByText('3 séries · 8 repetições')).toBeVisible()
    expect(screen.getByText('Mantenha o olhar à frente.')).toBeVisible()
    expect(screen.getByText('3 de 5')).toBeVisible()
    expect(screen.getByText('Olhe para a frente.')).toBeVisible()
    expect(screen.getByText('Tive dificuldade na segunda série.')).toBeVisible()
    expect(screen.getByText('Aluno · editado')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Voltar ao histórico' })).toHaveAttribute('href', '/historico')
    expect(screen.queryByRole('button', { name: /editar|concluir/i })).not.toBeInTheDocument()
  })
})
