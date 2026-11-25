import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import BibliotecaExercicios from '../src/features/exercicios/BibliotecaExercicios'
import ErrosOrientacoesExercicio from '../src/features/exercicios/ErrosOrientacoesExercicio'
import ExerciseDetails from '../src/features/exercicios/components/ExerciseDetails'
import { consultarExercicio } from '../src/features/exercicios/exerciciosApi'
import type { Exercicio } from '../src/types/exercicio'

// US37 — tela "Erros comuns e orientações" e navegação a partir do detalhe.

vi.mock('../src/features/exercicios/exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/exercicios/exerciciosApi')>()),
  listarExercicios: vi.fn(async () => []),
  consultarExercicio: vi.fn(),
}))

const drible: Exercicio = {
  id: 1,
  nome: 'Drible com deslocamento',
  fundamento: 'Drible',
  objetivo: 'Conduzir a bola em movimento mantendo o controle.',
  orientacoes: 'Manter o corpo baixo.',
  errosOrientacoes: [
    { id: 1, erro: 'Olhar somente para a bola.', orientacaoCorretiva: 'Mantenha o olhar à frente.' },
    { id: 2, erro: 'Bater a bola muito alta.', orientacaoCorretiva: 'Flexione os joelhos.' },
  ],
}

function Endereco() {
  const local = useLocation()
  return (
    <>
      <div data-testid="endereco">{local.pathname}</div>
      <div data-testid="estado">{JSON.stringify(local.state ?? null)}</div>
    </>
  )
}

function abrir(rota: string | { pathname: string; state: unknown }) {
  return render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/exercicios/:exercicioId?" element={<BibliotecaExercicios />} />
        <Route path="/exercicios/:exercicioId/erros-orientacoes" element={<ErrosOrientacoesExercicio />} />
      </Routes>
      <Endereco />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  vi.mocked(consultarExercicio).mockReset()
  vi.mocked(consultarExercicio).mockResolvedValue(drible)
})

describe('US37 — tela de erros e orientações', () => {
  it('mostra o exercício, o contexto e os itens na ordem de cadastro', async () => {
    abrir('/exercicios/1/erros-orientacoes')

    expect(await screen.findByRole('heading', { level: 1, name: 'Drible com deslocamento' })).toBeInTheDocument()
    expect(screen.getByText('Drible')).toBeInTheDocument()
    expect(screen.getByText('Conduzir a bola em movimento mantendo o controle.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Erros comuns e orientações' })).toBeInTheDocument()
    expect(screen.getByText('2 itens · selecione um item para editar')).toBeInTheDocument()

    const itens = screen.getAllByRole('link', { name: /^Editar erro comum:/ })
    expect(itens).toHaveLength(2)
    expect(within(itens[0]).getByText('Olhar somente para a bola.')).toBeInTheDocument()
    expect(within(itens[0]).getByText('Mantenha o olhar à frente.')).toBeInTheDocument()
    expect(within(itens[1]).getByText('Bater a bola muito alta.')).toBeInTheDocument()
    expect(consultarExercicio).toHaveBeenCalledWith(1)
  })

  it('RN22: exercício sem itens mostra o estado vazio, sem erro', async () => {
    vi.mocked(consultarExercicio).mockResolvedValue({ ...drible, orientacoes: undefined, errosOrientacoes: [] })
    abrir('/exercicios/1/erros-orientacoes')

    expect(await screen.findByText('Nenhum erro comum cadastrado')).toBeInTheDocument()
    expect(screen.getByText('Nenhum item cadastrado')).toBeInTheDocument()
    expect(screen.getByText('Não informado')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('o aviso de sucesso aparece uma vez e sai do histórico (não volta ao recarregar)', async () => {
    abrir({ pathname: '/exercicios/1/erros-orientacoes', state: { aviso: 'Alterações salvas.' } })

    expect(await screen.findByText('Alterações salvas.')).toHaveAttribute('role', 'status')
    expect(screen.getByTestId('estado')).toHaveTextContent('null')
    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes')
  })

  it('exercício inexistente mostra o aviso', async () => {
    vi.mocked(consultarExercicio).mockRejectedValue(new ApiError(404, 'Not found.'))
    abrir('/exercicios/999/erros-orientacoes')

    expect(await screen.findByRole('alert')).toHaveTextContent('Exercício não encontrado.')
  })

  it('endereço inválido não consulta a API', async () => {
    abrir('/exercicios/abc/erros-orientacoes')

    expect(await screen.findByRole('alert')).toHaveTextContent('Exercício não encontrado.')
    expect(consultarExercicio).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Voltar à biblioteca' })).toHaveAttribute('href', '/exercicios')
  })

  it('textos com HTML aparecem como texto, sem serem interpretados', async () => {
    vi.mocked(consultarExercicio).mockResolvedValue({
      ...drible,
      errosOrientacoes: [{ id: 3, erro: '<b>negrito</b>', orientacaoCorretiva: '<img src=x onerror=alert(1)>' }],
    })
    abrir('/exercicios/1/erros-orientacoes')

    expect(await screen.findByText('<b>negrito</b>')).toBeInTheDocument()
    expect(screen.getByText('<img src=x onerror=alert(1)>')).toBeInTheDocument()
    expect(document.querySelector('ul b, ul img')).toBeNull()
  })

  it('o botão "Erros e orientações" do detalhe abre a tela, e o voltar retorna ao exercício', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1')

    await usuario.click(await screen.findByRole('button', { name: 'Erros e orientações' }))
    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes')
    expect(await screen.findByText(/^2 itens/)).toBeInTheDocument()

    await usuario.click(screen.getByRole('link', { name: 'Voltar ao exercício' }))
    expect(screen.getByTestId('endereco')).toHaveTextContent(/^\/exercicios\/1$/)
    expect(await screen.findByRole('button', { name: /editar exercício/i })).toBeInTheDocument()
  })
})

describe('US37 — botão no detalhe do exercício', () => {
  it('chama a navegação quando recebida, sem depender de Router', async () => {
    const usuario = userEvent.setup()
    const onErrosOrientacoes = vi.fn()
    render(<ExerciseDetails exercicio={drible} onEditar={vi.fn()} onErrosOrientacoes={onErrosOrientacoes} />)

    await usuario.click(screen.getByRole('button', { name: 'Erros e orientações' }))
    expect(onErrosOrientacoes).toHaveBeenCalledTimes(1)
  })

  it('sem a navegação, mantém o link interno de antes', () => {
    render(<ExerciseDetails exercicio={drible} onEditar={vi.fn()} />)
    expect(screen.getByRole('link', { name: 'Erros e orientações' })).toHaveAttribute('href', '#orientacoes-exercicio')
  })
})
