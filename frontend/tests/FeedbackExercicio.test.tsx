import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FeedbackExercicio, type FeedbackAluno } from '../src/features/treinos/FeedbackExercicio'

const aluno = { id: 7, papel: 'ALUNO' } as const
const feedback = { texto: 'Precisei de mais tempo.', autorId: 7, editado: false }
const propriedades = { usuario: aluno, alunoId: 7, statusTreino: 'em-andamento' } as const

describe('Feedback do aluno por exercício — US49 e US50', () => {
  it.each(['', '   ', 'a'.repeat(1001)])('bloqueia o registro de texto inválido', async texto => {
    const salvar = vi.fn()
    render(<FeedbackExercicio {...propriedades} feedback={null} onSalvar={salvar} />)
    const interacao = userEvent.setup()
    await interacao.click(screen.getByRole('button', { name: 'Registrar feedback' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: texto } })
    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(screen.getByRole('alert').textContent).toMatch(/escreva um feedback|1\.000 caracteres/i)
    expect(salvar).not.toHaveBeenCalled()
  })

  it('registra uma vez e passa a oferecer edição do registro existente', async () => {
    const salvar = vi.fn(async () => {})
    function Exercicio() {
      const [registro, setRegistro] = useState<FeedbackAluno | null>(null)
      return <FeedbackExercicio {...propriedades} feedback={registro} onSalvar={async alteracao => {
        await salvar(alteracao)
        setRegistro({ texto: alteracao.texto, autorId: aluno.id, editado: false })
      }} />
    }
    render(<Exercicio />)
    const interacao = userEvent.setup()
    await interacao.click(screen.getByRole('button', { name: 'Registrar feedback' }))
    await interacao.type(screen.getByRole('textbox'), 'Difícil')
    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(salvar).toHaveBeenCalledWith({ tipo: 'registrar', texto: 'Difícil' })
    expect(screen.getByText('Difícil')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Registrar feedback' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Editar feedback' })).toBeTruthy()
  })

  it('preserva o texto ao cancelar ou falhar e indica a edição confirmada', async () => {
    const salvar = vi.fn().mockRejectedValueOnce(new Error('falha')).mockResolvedValueOnce(undefined)
    function Exercicio() {
      const [registro, setRegistro] = useState<FeedbackAluno>(feedback)
      return <FeedbackExercicio {...propriedades} feedback={registro} onSalvar={async alteracao => {
        await salvar(alteracao)
        setRegistro({ ...registro, texto: alteracao.texto, editado: true })
      }} />
    }
    render(<Exercicio />)
    const interacao = userEvent.setup()
    const editar = () => interacao.click(screen.getByRole('button', { name: 'Editar feedback' }))

    await editar()
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nova avaliação' } })
    await interacao.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByText(feedback.texto)).toBeTruthy()
    expect(salvar).not.toHaveBeenCalled()

    await editar()
    expect(screen.getByRole<HTMLTextAreaElement>('textbox').value).toBe(feedback.texto)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Nova avaliação' } })
    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível salvar')
    expect(screen.getByRole<HTMLTextAreaElement>('textbox').value).toBe('Nova avaliação')

    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(salvar).toHaveBeenLastCalledWith({ tipo: 'editar', texto: 'Nova avaliação' })
    expect(screen.getByText('Nova avaliação')).toBeTruthy()
    expect(screen.getByText('editado', { exact: true })).toBeTruthy()
  })

  it.each(['', '   ', 'a'.repeat(1001)])('recusa uma edição inválida e mantém o texto salvo', async texto => {
    const salvar = vi.fn()
    render(<FeedbackExercicio {...propriedades} feedback={feedback} onSalvar={salvar} />)
    const interacao = userEvent.setup()
    await interacao.click(screen.getByRole('button', { name: 'Editar feedback' }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: texto } })
    await interacao.click(screen.getByRole('button', { name: 'Salvar feedback' }))
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(salvar).not.toHaveBeenCalled()
    await interacao.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByText(feedback.texto)).toBeTruthy()
  })

  it('mantém o feedback disponível e somente para leitura após a conclusão', () => {
    render(<FeedbackExercicio {...propriedades} statusTreino="concluido"
      feedback={feedback} onSalvar={vi.fn()} />)
    expect(screen.getByText(feedback.texto)).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.queryByRole('textbox')).toBeNull()
  })

  it('impede a edição pelo treinador e não renderiza o texto para outro aluno', () => {
    const { rerender } = render(<FeedbackExercicio {...propriedades} usuario={{ id: 2, papel: 'TREINADOR' }}
      feedback={feedback} onSalvar={vi.fn()} />)
    expect(screen.getByText(feedback.texto)).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()

    rerender(<FeedbackExercicio {...propriedades} usuario={{ id: 8, papel: 'ALUNO' }}
      feedback={feedback} onSalvar={vi.fn()} />)
    expect(screen.queryByText(feedback.texto)).toBeNull()
    expect(screen.queryByRole('button')).toBeNull()
  })
})
