import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EstadoTreino, type StatusTreino } from '../src/features/treinos/EstadoTreino'

describe('Estado do treino — US23, US29 e US15', () => {
  it.each([
    ['em-andamento', 'Em andamento'],
    ['feito', 'Feito'],
    ['concluido', 'Concluído'],
  ] as const)('mostra o estado %s informado pela consulta ao treinador', (status, rotulo) => {
    render(<EstadoTreino papel="TREINADOR" consulta={{ estado: 'disponivel', status }} />)
    expect(screen.getByText(rotulo, { exact: true })).toBeTruthy()
    if (status !== 'concluido') {
      const estado = screen.getByRole('status')
      expect(estado.querySelector('[data-status="' + status + '"]')).toHaveTextContent(rotulo)
      if (status === 'feito') expect(estado).toHaveTextContent(/aguardando sua avaliação/i)
    }
  })

  it('anuncia carregamento e permite repetir uma consulta que falhou', async () => {
    const consultar = vi.fn()
    const { rerender } = render(<EstadoTreino papel="TREINADOR" consulta={{ estado: 'carregando' }} />)
    expect(screen.getByRole('status').textContent).toContain('Carregando')
    rerender(<EstadoTreino papel="TREINADOR" consulta={{ estado: 'erro', tentarNovamente: consultar }} />)
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível consultar')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(consultar).toHaveBeenCalledOnce()
  })

  it('só exibe Feito quando recebe o novo estado do treino e mostra que falta avaliação', async () => {
    let finalizar!: () => void
    const marcar = vi.fn(() => new Promise<void>(resolver => { finalizar = resolver }))
    function TreinoDoAluno() {
      const [status, setStatus] = useState<StatusTreino>('em-andamento')
      return (
        <EstadoTreino papel="ALUNO" consulta={{ estado: 'disponivel', status }}
          onMarcarFeito={async () => { await marcar(); setStatus('feito') }} />
      )
    }

    render(<TreinoDoAluno />)
    const interacao = userEvent.setup()
    await interacao.click(screen.getByRole('button', { name: 'Marcar treino como feito' }))
    expect(screen.getByText('Em andamento', { exact: true })).toBeTruthy()
    expect(screen.queryByText('Feito', { exact: true })).toBeNull()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Salvando…' }).disabled).toBe(true)

    finalizar()
    await waitFor(() => expect(screen.getByText('Feito', { exact: true })).toBeTruthy())
    expect(screen.getByRole('heading', { level: 1, name: 'Treino marcado como feito' })).toBeTruthy()
    expect(screen.getByText(/aguarda a avaliação/i)).toBeTruthy()
    expect(screen.queryByText('Concluído', { exact: true })).toBeNull()
    expect(marcar).toHaveBeenCalledOnce()
  })

  it.each(['ALUNO', 'TREINADOR'] as const)('retira as ações de %s depois da conclusão', papel => {
    render(<EstadoTreino papel={papel} consulta={{ estado: 'disponivel', status: 'concluido' }}
      onMarcarFeito={vi.fn()} onConcluir={vi.fn()} />)
    expect(screen.queryByRole('button')).toBeNull()
    expect(screen.getByRole('heading', {
      name: papel === 'ALUNO' ? 'Registro somente para consulta' : 'Histórico preservado',
    })).toBeTruthy()
  })

  it.each(['em-andamento', 'feito'] as const)('permite ao treinador confirmar a conclusão a partir de %s', async status => {
    const concluir = vi.fn(async () => {})
    render(<EstadoTreino papel="TREINADOR" consulta={{ estado: 'disponivel', status }}
      onMarcarFeito={vi.fn()} onConcluir={concluir} />)
    expect(screen.queryByRole('button', { name: 'Marcar treino como feito' })).toBeNull()
    const interacao = userEvent.setup()

    await interacao.click(screen.getByRole('button', { name: 'Concluir treino' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Concluir este treino?' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Após concluir' })).toBeTruthy()
    expect(screen.getByText(/execução presencialmente/i)).toBeTruthy()
    await interacao.click(screen.getByRole('button', { name: 'Continuar avaliação' }))
    expect(concluir).not.toHaveBeenCalled()

    await interacao.click(screen.getByRole('button', { name: 'Concluir treino' }))
    await interacao.click(screen.getByRole('button', { name: 'Confirmar conclusão' }))
    expect(concluir).toHaveBeenCalledOnce()
  })

  it('preserva o estado quando o registro falha e permite tentar de novo', async () => {
    const marcar = vi.fn(async () => { throw new Error('falha') })
    render(<EstadoTreino papel="ALUNO" consulta={{ estado: 'disponivel', status: 'em-andamento' }}
      onMarcarFeito={marcar} onConcluir={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Concluir treino' })).toBeNull()

    await userEvent.setup().click(screen.getByRole('button', { name: 'Marcar treino como feito' }))
    expect(screen.getByRole('alert').textContent).toContain('Não foi possível marcar')
    expect(screen.getByText('Em andamento', { exact: true })).toBeTruthy()
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Marcar treino como feito' }).disabled).toBe(false)
  })
})
