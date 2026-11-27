import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { AssociarErrosOrientacoes } from '../src/features/exercicios/AssociarErrosOrientacoes'

const pares = [
  { id: 1, erro: 'Olhar para a bola', orientacaoCorretiva: 'Olhar à frente' },
  { id: 2, erro: 'Drible alto', orientacaoCorretiva: 'Aproximar a bola do corpo' },
]

describe('Associar erros e orientações — US33', () => {
  it('só envia após selecionar ao menos um par e permite associar mais de um de uma vez', async () => {
    const usuario = userEvent.setup()
    const salvar = vi.fn().mockResolvedValue(undefined)
    render(<AssociarErrosOrientacoes pares={pares} voltar="/exercicios/1/erros-orientacoes"
      onAssociar={salvar} />, { wrapper: MemoryRouter })

    const associar = screen.getByRole('button', { name: 'Associar seleção' })
    expect(associar).toBeDisabled()
    await usuario.click(screen.getByRole('checkbox', { name: /olhar para a bola/i }))
    await usuario.click(screen.getByRole('checkbox', { name: /drible alto/i }))
    await usuario.click(associar)
    expect(salvar).toHaveBeenCalledExactlyOnceWith([1, 2])
    expect(screen.getByRole('status')).toHaveTextContent('2 pares associados.')
  })

  it('impede associar um erro sem orientação e preserva a seleção após uma falha', async () => {
    const usuario = userEvent.setup()
    const salvar = vi.fn().mockRejectedValue(new Error())
    render(<AssociarErrosOrientacoes pares={[...pares, { id: 3, erro: 'Apoio baixo', orientacaoCorretiva: ' ' }]}
      voltar="/exercicios/1/erros-orientacoes" onAssociar={salvar} />, { wrapper: MemoryRouter })

    const invalido = screen.getByRole('checkbox', { name: 'Apoio baixo' })
    expect(invalido).toBeDisabled()
    expect(invalido).toHaveAccessibleDescription('Orientação corretiva obrigatória.')
    expect(screen.getByText('Orientação corretiva obrigatória.')).toBeVisible()
    const par = screen.getByRole('checkbox', { name: /drible alto/i })
    await usuario.tab()
    await usuario.tab()
    expect(par).toHaveFocus()
    await usuario.keyboard(' ')
    await usuario.click(screen.getByRole('button', { name: 'Associar seleção' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível associar')
    expect(par).toBeChecked()
  })

  it('distingue os pares associados das opções que ainda podem ser selecionadas', () => {
    render(<AssociarErrosOrientacoes pares={pares} associados={[pares[0]]}
      voltar="/exercicios/1/erros-orientacoes" onAssociar={vi.fn()} />, { wrapper: MemoryRouter })

    const lista = screen.getByRole('region', { name: 'Pares associados ao exercício' })
    expect(within(lista).getByText('Olhar para a bola')).toBeVisible()
    expect(screen.queryByRole('checkbox', { name: /olhar para a bola/i })).not.toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /drible alto/i })).toBeEnabled()
  })
})
