import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DetalheTreino, type ConsultaTreino } from '../src/features/treinos/DetalheTreino'

const detalhe = {
  estado: 'disponivel',
  status: 'feito',
  nome: 'Controle de bola',
  alunoId: 7,
  exercicios: [
    { id: 1, nome: 'Drible baixo', feedback: { autorId: 7, texto: 'Precisei de mais tempo.', editado: true } },
    { id: 2, nome: 'Mudança de direção', feedback: null },
  ],
} satisfies ConsultaTreino

describe('Detalhe do treino', () => {
  it('encaminha o feedback ao exercício selecionado', async () => {
    const salvar = vi.fn(async () => {})
    render(<DetalheTreino consulta={detalhe} usuario={{ id: 7, papel: 'ALUNO' }} onSalvarFeedback={salvar} />)
    const interacao = userEvent.setup()
    const navegacao = screen.getByRole('navigation', { name: 'Seções do aluno' })
    expect(navegacao.querySelector('[aria-current="page"]')?.textContent).toBe('Treinos')
    await interacao.click(screen.getByRole('button', { name: 'Ver exercício: Mudança de direção' }))
    await interacao.click(screen.getByRole('button', { name: 'Registrar feedback' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Seu feedback' })).toBeTruthy()
    expect(screen.getByText('Mudança de direção · Controle de bola')).toBeTruthy()
    expect(screen.queryByRole('list', { name: 'Exercícios do treino' })).toBeNull()
    await interacao.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Mudança de direção' }))
    await interacao.click(screen.getByRole('button', { name: 'Registrar feedback' }))
    await interacao.type(screen.getByRole('textbox'), 'Treino bom')
    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(salvar).toHaveBeenCalledWith(2, { tipo: 'registrar', texto: 'Treino bom' })
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Mudança de direção' }))
  })

  it('abre novamente o mesmo treino concluído com os feedbacks em modo de leitura', async () => {
    function Treino() {
      const [concluido, setConcluido] = useState(false)
      return (
        <>
          <button type="button" onClick={() => setConcluido(true)}>Atualizar consulta</button>
          <DetalheTreino consulta={{ ...detalhe, status: concluido ? 'concluido' : 'feito' }}
            usuario={{ id: 7, papel: 'ALUNO' }} onSalvarFeedback={vi.fn()} />
        </>
      )
    }

    render(<Treino />)
    expect(screen.getByRole('button', { name: 'Ver exercício: Drible baixo' })).toBeTruthy()
    await userEvent.setup().click(screen.getByRole('button', { name: 'Atualizar consulta' }))
    expect(screen.getByText('Concluído', { exact: true })).toBeTruthy()
    expect(screen.getByText('Precisei de mais tempo.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /editar feedback|registrar feedback/i })).toBeNull()
  })

  it('descarta o detalhe se os dados não forem do aluno autenticado', () => {
    render(<DetalheTreino consulta={detalhe} usuario={{ id: 8, papel: 'ALUNO' }} />)
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível consultar')
    expect(screen.queryByText('Controle de bola')).toBeNull()
    expect(screen.queryByText('Precisei de mais tempo.')).toBeNull()
  })
})
