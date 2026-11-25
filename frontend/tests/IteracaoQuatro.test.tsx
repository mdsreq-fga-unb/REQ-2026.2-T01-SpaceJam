import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DificuldadeDoAluno } from '../src/features/registros-treino/DificuldadeDoAluno'
import { ExecucaoDoAluno } from '../src/features/registros-treino/ExecucaoDoAluno'
import { ExcluirDadosAluno, SolicitacaoExclusaoRegistrada } from '../src/features/conta/ExcluirDadosAluno'

const aluno = { id: 1, papel: 'ALUNO', first_name: 'Beatriz' } as const
const treinador = { id: 2, papel: 'TREINADOR', first_name: 'Lucas' } as const
const exercicio = 'Drible com deslocamento'
const treino = 'Treino A'

describe('US13 e US14 — Dificuldade do exercício', () => {
  it('registra uma nota inteira escolhida pelo aluno', async () => {
    const salvar = vi.fn(async () => 4 as const)
    render(<DificuldadeDoAluno usuario={aluno} exercicio={exercicio} treino={treino} nota={null}
      treinoConcluido={false} executado onSalvar={salvar} onVoltar={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Registrar dificuldade' }))
    expect(screen.getAllByRole('radio')).toHaveLength(5)
    expect(screen.getByRole('button', { name: 'Salvar nota' })).toHaveProperty('disabled', true)
    fireEvent.click(screen.getByRole('radio', { name: '4 · Difícil' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nota' }))

    expect(await screen.findByText('4 de 5 · Difícil')).toBeTruthy()
    expect(salvar).toHaveBeenCalledWith({ operacao: 'registrar', nota: 4 })
  })

  it('mantém a nota anterior se salvar falhar e permite tentar de novo', async () => {
    const salvar = vi.fn().mockRejectedValueOnce(new Error()).mockResolvedValueOnce(5)
    render(<DificuldadeDoAluno usuario={aluno} exercicio={exercicio} treino={treino} nota={3}
      treinoConcluido={false} executado onSalvar={salvar} onVoltar={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Editar dificuldade' }))
    expect(screen.getByRole('radio', { name: '3 · Moderado' })).toHaveProperty('checked', true)
    fireEvent.click(screen.getByRole('radio', { name: '5 · Muito difícil' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nota' }))
    expect(await screen.findByRole('alert')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(screen.getByText('3 de 5 · Moderado')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Editar dificuldade' }))
    fireEvent.click(screen.getByRole('radio', { name: '5 · Muito difícil' }))
    fireEvent.click(screen.getByRole('button', { name: 'Salvar nota' }))
    expect(await screen.findByText('5 de 5 · Muito difícil')).toBeTruthy()
    expect(salvar).toHaveBeenLastCalledWith({ operacao: 'editar', nota: 5 })
  })

  it('esconde o registro antes de executar e esconde a edição após a conclusão', () => {
    const props = { usuario: aluno, exercicio, treino, onVoltar: vi.fn(), onSalvar: vi.fn() }
    const { rerender } = render(<DificuldadeDoAluno {...props} nota={null}
      treinoConcluido={false} executado={false} />)
    expect(screen.queryByRole('button', { name: 'Registrar dificuldade' })).toBeNull()
    rerender(<DificuldadeDoAluno {...props} nota={3} treinoConcluido executado />)
    expect(screen.getByText('3 de 5 · Moderado')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Editar dificuldade' })).toBeNull()
  })
})

describe('US12 e US51 — Consulta do treinador', () => {
  it('mostra a nota e o feedback editado em modo somente leitura', () => {
    render(<ExecucaoDoAluno usuario={treinador} onVoltar={vi.fn()} consulta={{
      estado: 'disponivel', aluno: 'Beatriz', exercicio, treino, nota: 3,
      feedback: { texto: 'Perdi o controle na mudança de direção.', editado: true },
    }} />)
    expect(screen.getByText('3 de 5 · Moderado')).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Feedback do aluno · editado' })).toBeTruthy()
    expect(screen.getByText('Perdi o controle na mudança de direção.')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /editar|excluir/i })).toBeNull()
  })

  it('distingue um exercício sem registro de uma consulta sem acesso', () => {
    const props = { usuario: treinador, onVoltar: vi.fn() }
    const { rerender } = render(<ExecucaoDoAluno {...props} consulta={{
      estado: 'disponivel', aluno: 'Beatriz', exercicio, treino, nota: null, feedback: null,
    }} />)
    expect(screen.getByText('Não registrada.')).toBeTruthy()
    expect(screen.getByText('Nenhum feedback registrado.')).toBeTruthy()
    rerender(<ExecucaoDoAluno {...props} consulta={{ estado: 'sem-acesso' }} />)
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.queryByText(/Beatriz/)).toBeNull()
  })
})

describe('US64 — Exclusão dos próprios dados', () => {
  it('só solicita após confirmação explícita e sinaliza o sucesso depois da resposta', async () => {
    const manter = vi.fn()
    let confirmar!: () => void
    const solicitar = vi.fn(() => new Promise<void>(resolve => { confirmar = resolve }))
    const encerrarSessao = vi.fn()
    render(<ExcluirDadosAluno usuario={aluno} onManter={manter} onSolicitar={solicitar}
      onSolicitacaoRegistrada={encerrarSessao} />)
    expect(screen.getByRole('heading', { name: 'Esta ação é irreversível' })).toBeTruthy()
    expect(solicitar).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Manter minha conta' }))
    expect(manter).toHaveBeenCalledOnce()
    expect(solicitar).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão dos meus dados' }))
    expect(screen.getByRole('button', { name: 'Enviando solicitação…' })).toHaveProperty('disabled', true)
    expect(encerrarSessao).not.toHaveBeenCalled()
    await act(async () => confirmar())
    await waitFor(() => expect(encerrarSessao).toHaveBeenCalledOnce())
  })

  it('mostra o erro e preserva a sessão quando a solicitação falha', async () => {
    const encerrarSessao = vi.fn()
    render(<ExcluirDadosAluno usuario={aluno} onManter={vi.fn()}
      onSolicitar={vi.fn().mockRejectedValue(new Error())} onSolicitacaoRegistrada={encerrarSessao} />)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão dos meus dados' }))
    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(encerrarSessao).not.toHaveBeenCalled()
  })

  it('apresenta o protocolo como uma solicitação em processamento', () => {
    render(<SolicitacaoExclusaoRegistrada onVoltarLogin={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Solicitação registrada' })).toBeTruthy()
    expect(screen.getByText('A exclusão dos seus dados está em processamento.')).toBeTruthy()
  })
})
