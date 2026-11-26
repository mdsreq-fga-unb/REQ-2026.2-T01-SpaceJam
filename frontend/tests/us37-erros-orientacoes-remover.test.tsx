import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import ErroOrientacaoPage from '../src/features/exercicios/ErroOrientacaoPage'
import ErrosOrientacoesExercicio from '../src/features/exercicios/ErrosOrientacoesExercicio'
import RemoverErroOrientacaoPage from '../src/features/exercicios/RemoverErroOrientacaoPage'
import { consultarExercicio, removerErroOrientacao } from '../src/features/exercicios/exerciciosApi'
import type { ErroOrientacao, Exercicio } from '../src/types/exercicio'

// US37 — remover erro comum com confirmação (CA02, RN22, RN23).

let itens: ErroOrientacao[] = []

const base: Exercicio = {
  id: 1,
  nome: 'Drible com deslocamento',
  fundamento: 'Drible',
  objetivo: 'Conduzir a bola em movimento.',
}

vi.mock('../src/features/exercicios/exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/exercicios/exerciciosApi')>()),
  consultarExercicio: vi.fn(async () => ({ ...base, errosOrientacoes: itens.map((item) => ({ ...item })) })),
  removerErroOrientacao: vi.fn(async (_exercicioId: number, erroId: number) => {
    itens = itens.filter((item) => item.id !== erroId)
  }),
}))

function Endereco() {
  return <div data-testid="endereco">{useLocation().pathname}</div>
}

function abrir(rota: string) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/exercicios/:exercicioId/erros-orientacoes" element={<ErrosOrientacoesExercicio />} />
        <Route path="/exercicios/:exercicioId/erros-orientacoes/:erroId/editar" element={<ErroOrientacaoPage key="editar" />} />
        <Route path="/exercicios/:exercicioId/erros-orientacoes/:erroId/remover" element={<RemoverErroOrientacaoPage />} />
      </Routes>
      <Endereco />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  itens = [
    { id: 1, erro: 'Olhar somente para a bola.', orientacaoCorretiva: 'Mantenha o olhar à frente.' },
    { id: 2, erro: 'Bater a bola muito alta.', orientacaoCorretiva: 'Flexione os joelhos.' },
  ]
  vi.mocked(consultarExercicio).mockClear()
  vi.mocked(removerErroOrientacao).mockClear()
})

describe('US37 — remover erro e orientação (CA02)', () => {
  it('"Remover orientação" na edição abre a confirmação com o item e o escopo, sem remover ainda', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/1/editar')

    await usuario.click(await screen.findByRole('button', { name: 'Remover orientação' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes/1/remover')
    expect(await screen.findByRole('heading', { name: 'Remover orientação?' })).toBeInTheDocument()
    expect(screen.getByText('Drible com deslocamento')).toBeInTheDocument()
    const escopo = screen.getByRole('region', { name: 'Escopo da alteração' })
    expect(within(escopo).getByText('Olhar somente para a bola.')).toBeInTheDocument()
    expect(within(escopo).getByText('Mantenha o olhar à frente.')).toBeInTheDocument()
    expect(within(escopo).getByText(/Prescrições anteriores são preservadas/)).toBeInTheDocument()
    expect(removerErroOrientacao).not.toHaveBeenCalled()
  })

  it('a tela de adicionar não mostra "Remover orientação"', async () => {
    render(
      <MemoryRouter initialEntries={['/exercicios/1/erros-orientacoes/novo']}>
        <Routes>
          <Route path="/exercicios/:exercicioId/erros-orientacoes/novo" element={<ErroOrientacaoPage key="novo" />} />
        </Routes>
      </MemoryRouter>,
    )
    await screen.findByRole('heading', { name: 'Adicionar nova orientação' })
    expect(screen.queryByRole('button', { name: 'Remover orientação' })).not.toBeInTheDocument()
  })

  it('CA02: confirmar remove o item, que some da consulta, e mantém os demais', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))

    expect(removerErroOrientacao).toHaveBeenCalledWith(1, 1)
    expect(await screen.findByText('Erro comum removido.')).toHaveAttribute('role', 'status')
    expect(screen.getByTestId('endereco')).toHaveTextContent(/\/erros-orientacoes$/)
    expect(screen.queryByText('Olhar somente para a bola.')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Editar erro comum: Bater a bola muito alta.' })).toBeInTheDocument()
    expect(screen.getByText('1 item · selecione um item para editar')).toBeInTheDocument()
  })

  it('RN22: remover o último item deixa o exercício válido, com o estado vazio', async () => {
    const usuario = userEvent.setup()
    itens = [itens[0]]
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))

    expect(await screen.findByText('Nenhum erro comum cadastrado')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('cancelar volta para a edição sem remover', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Cancelar' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes/1/editar')
    expect(await screen.findByRole('heading', { name: 'Editar orientação' })).toBeInTheDocument()
    expect(removerErroOrientacao).not.toHaveBeenCalled()
  })

  it('CA04: 403 mostra o aviso e não remove', async () => {
    const usuario = userEvent.setup()
    vi.mocked(removerErroOrientacao).mockRejectedValueOnce(new ApiError(403, 'Sem permissão.'))
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Apenas treinadores podem editar erros e orientações.')
    expect(screen.getByTestId('endereco')).toHaveTextContent('/remover')
    expect(itens).toHaveLength(2)
  })

  it('item já removido por outra pessoa: 404 ao confirmar mostra o aviso', async () => {
    const usuario = userEvent.setup()
    vi.mocked(removerErroOrientacao).mockRejectedValueOnce(new ApiError(404, 'Not found.'))
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro comum não encontrado. Ele pode ter sido removido.')
  })

  it('endereço de item inexistente não mostra o botão de confirmar', async () => {
    abrir('/exercicios/1/erros-orientacoes/99/remover')

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro comum não encontrado. Ele pode ter sido removido.')
    expect(screen.queryByRole('button', { name: 'Confirmar remoção' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar aos erros e orientações' }))
      .toHaveAttribute('href', '/exercicios/1/erros-orientacoes')
  })

  it('bloqueia o duplo clique enquanto remove', async () => {
    const usuario = userEvent.setup()
    let concluir!: () => void
    vi.mocked(removerErroOrientacao).mockImplementationOnce(() => new Promise<void>((resolve) => {
      concluir = () => { itens = itens.filter((item) => item.id !== 1); resolve() }
    }))
    abrir('/exercicios/1/erros-orientacoes/1/remover')

    await usuario.click(await screen.findByRole('button', { name: 'Confirmar remoção' }))
    const botao = screen.getByRole('button', { name: 'Removendo…' })
    expect(botao).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    await usuario.click(botao)
    expect(removerErroOrientacao).toHaveBeenCalledTimes(1)

    await act(async () => concluir())
    expect(await screen.findByText('Erro comum removido.')).toBeInTheDocument()
  })
})
