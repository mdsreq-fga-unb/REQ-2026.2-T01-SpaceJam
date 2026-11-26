import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import ErroOrientacaoPage from '../src/features/exercicios/ErroOrientacaoPage'
import ErrosOrientacoesExercicio from '../src/features/exercicios/ErrosOrientacoesExercicio'
import {
  atualizarErroOrientacao,
  consultarExercicio,
  criarErroOrientacao,
} from '../src/features/exercicios/exerciciosApi'
import type { ErroOrientacao, Exercicio } from '../src/types/exercicio'

// US37 — adicionar e editar erro comum + orientação corretiva (CA01, RN22, RNF14).

let itens: ErroOrientacao[] = []
let proximoId = 1

const base: Exercicio = {
  id: 1,
  nome: 'Drible com deslocamento',
  fundamento: 'Drible',
  objetivo: 'Conduzir a bola em movimento.',
}

vi.mock('../src/features/exercicios/exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/exercicios/exerciciosApi')>()),
  consultarExercicio: vi.fn(async () => ({ ...base, errosOrientacoes: itens.map((item) => ({ ...item })) })),
  criarErroOrientacao: vi.fn(async (_exercicioId: number, textos: Omit<ErroOrientacao, 'id'>) => {
    const criado = { id: proximoId++, ...textos }
    itens = [...itens, criado]
    return criado
  }),
  atualizarErroOrientacao: vi.fn(async (_exercicioId: number, erroId: number, textos: Omit<ErroOrientacao, 'id'>) => {
    const atualizado = { id: erroId, ...textos }
    itens = itens.map((item) => (item.id === erroId ? atualizado : item))
    return atualizado
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
        <Route path="/exercicios/:exercicioId/erros-orientacoes/novo" element={<ErroOrientacaoPage key="novo" />} />
        <Route path="/exercicios/:exercicioId/erros-orientacoes/:erroId/editar" element={<ErroOrientacaoPage key="editar" />} />
      </Routes>
      <Endereco />
    </MemoryRouter>,
  )
}

const campoErro = () => screen.getByLabelText(/^Erro comum/)
const campoOrientacao = () => screen.getByLabelText(/^Orientação corretiva/)

beforeEach(() => {
  itens = [{ id: 1, erro: 'Olhar somente para a bola.', orientacaoCorretiva: 'Mantenha o olhar à frente.' }]
  proximoId = 2
  vi.mocked(consultarExercicio).mockClear()
  vi.mocked(criarErroOrientacao).mockClear()
  vi.mocked(atualizarErroOrientacao).mockClear()
})

describe('US37 — adicionar erro e orientação', () => {
  it('o botão da lista abre o formulário com o nome do exercício e o aviso de obrigatoriedade', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes')

    await usuario.click(await screen.findByRole('link', { name: 'Adicionar erro/orientação' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes/novo')
    expect(await screen.findByRole('heading', { name: 'Adicionar nova orientação' })).toBeInTheDocument()
    expect(screen.getByText('Drible com deslocamento')).toBeInTheDocument()
    expect(screen.getByText('Campos obrigatórios')).toBeInTheDocument()
    expect(campoErro()).toHaveValue('')
    expect(campoOrientacao()).toHaveValue('')
  })

  it('o estado vazio também oferece o botão de adicionar', async () => {
    itens = []
    abrir('/exercicios/1/erros-orientacoes')

    expect(await screen.findByText('Nenhum erro comum cadastrado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Adicionar erro/orientação' }))
      .toHaveAttribute('href', '/exercicios/1/erros-orientacoes/novo')
  })

  it('RNF14 / RN22: campos vazios ou só com espaços bloqueiam o envio e destacam os campos', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/novo')

    await usuario.type(await screen.findByLabelText(/^Orientação corretiva/), '   ')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Informe o erro comum.')).toBeInTheDocument()
    expect(screen.getByText('Informe a orientação corretiva.')).toBeInTheDocument()
    expect(campoErro()).toHaveAttribute('aria-invalid', 'true')
    expect(campoOrientacao()).toHaveAttribute('aria-invalid', 'true')
    expect(campoErro()).toHaveFocus()
    expect(criarErroOrientacao).not.toHaveBeenCalled()

    await usuario.type(campoErro(), 'a')
    expect(screen.queryByText('Informe o erro comum.')).not.toBeInTheDocument()
    expect(campoErro()).toHaveAttribute('aria-invalid', 'false')
  })

  it('salva sem os espaços das pontas e volta para a lista com o item novo', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/novo')

    await usuario.type(await screen.findByLabelText(/^Erro comum/), '  Bater a bola muito alta.  ')
    await usuario.type(campoOrientacao(), ' Flexione os joelhos. ')
    await usuario.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(criarErroOrientacao).toHaveBeenCalledWith(1, {
      erro: 'Bater a bola muito alta.',
      orientacaoCorretiva: 'Flexione os joelhos.',
    })
    expect(await screen.findByText('Erro comum adicionado.')).toHaveAttribute('role', 'status')
    expect(screen.getByTestId('endereco')).toHaveTextContent(/\/erros-orientacoes$/)
    expect(screen.getByText('Bater a bola muito alta.')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /^Editar erro comum:/ })).toHaveLength(2)
  })

  it('mostra o contador e limita cada campo a 1000 caracteres', async () => {
    abrir('/exercicios/1/erros-orientacoes/novo')

    expect(await screen.findByLabelText(/^Erro comum/)).toHaveAttribute('maxLength', '1000')
    expect(campoOrientacao()).toHaveAttribute('maxLength', '1000')
    expect(screen.getAllByText('0/1000')).toHaveLength(2)
  })
})

describe('US37 — editar erro e orientação (CA01)', () => {
  it('CA01: clicar no item abre a edição preenchida, e a nova orientação substitui a anterior na lista', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes')

    await usuario.click(await screen.findByRole('link', { name: 'Editar erro comum: Olhar somente para a bola.' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/erros-orientacoes/1/editar')
    expect(await screen.findByRole('heading', { name: 'Editar orientação' })).toBeInTheDocument()
    expect(screen.getByText('Treinos existentes')).toBeInTheDocument()
    expect(campoErro()).toHaveValue('Olhar somente para a bola.')
    expect(campoOrientacao()).toHaveValue('Mantenha o olhar à frente.')

    await usuario.clear(campoOrientacao())
    await usuario.type(campoOrientacao(), 'Use a visão periférica.')
    await usuario.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(atualizarErroOrientacao).toHaveBeenCalledWith(1, 1, {
      erro: 'Olhar somente para a bola.',
      orientacaoCorretiva: 'Use a visão periférica.',
    })
    expect(await screen.findByText('Alterações salvas.')).toHaveAttribute('role', 'status')
    const item = screen.getByRole('link', { name: 'Editar erro comum: Olhar somente para a bola.' })
    expect(within(item).getByText('Use a visão periférica.')).toBeInTheDocument()
    expect(screen.queryByText('Mantenha o olhar à frente.')).not.toBeInTheDocument()
  })

  it('cancelar volta para a lista sem chamar a API', async () => {
    const usuario = userEvent.setup()
    abrir('/exercicios/1/erros-orientacoes/1/editar')

    await usuario.type(await screen.findByLabelText(/^Orientação corretiva/), ' alterado')
    await usuario.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent(/\/erros-orientacoes$/)
    expect(atualizarErroOrientacao).not.toHaveBeenCalled()
    expect(await screen.findByText('Mantenha o olhar à frente.')).toBeInTheDocument()
  })

  it('o "Cancelar" do topo leva para a lista', async () => {
    abrir('/exercicios/1/erros-orientacoes/1/editar')
    await screen.findByRole('heading', { name: 'Editar orientação' })
    expect(screen.getByRole('link', { name: 'Cancelar' })).toHaveAttribute('href', '/exercicios/1/erros-orientacoes')
  })

  it('erro 400 do backend aparece no campo e mantém o que foi digitado', async () => {
    const usuario = userEvent.setup()
    vi.mocked(atualizarErroOrientacao).mockRejectedValueOnce(
      new ApiError(400, 'Erro 400', { orientacao_corretiva: ['Certifique-se de que este campo não tenha mais de 1000 caracteres.'] }),
    )
    abrir('/exercicios/1/erros-orientacoes/1/editar')

    await usuario.type(await screen.findByLabelText(/^Orientação corretiva/), ' novo')
    await usuario.click(screen.getByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByText('Certifique-se de que este campo não tenha mais de 1000 caracteres.')).toBeInTheDocument()
    expect(campoOrientacao()).toHaveAttribute('aria-invalid', 'true')
    expect(campoOrientacao()).toHaveValue('Mantenha o olhar à frente. novo')
    expect(screen.getByTestId('endereco')).toHaveTextContent('/editar')

    await usuario.type(campoOrientacao(), '!')
    expect(screen.queryByText(/mais de 1000 caracteres/)).not.toBeInTheDocument()
  })

  it('CA04: 403 mostra o aviso e não sai da tela', async () => {
    const usuario = userEvent.setup()
    vi.mocked(atualizarErroOrientacao).mockRejectedValueOnce(new ApiError(403, 'Sem permissão.'))
    abrir('/exercicios/1/erros-orientacoes/1/editar')

    await usuario.click(await screen.findByRole('button', { name: 'Salvar alterações' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Apenas treinadores podem editar erros e orientações.')
    expect(campoErro()).toHaveValue('Olhar somente para a bola.')
  })

  it('bloqueia o duplo envio enquanto salva', async () => {
    const usuario = userEvent.setup()
    let concluir!: (item: ErroOrientacao) => void
    vi.mocked(atualizarErroOrientacao).mockImplementationOnce(() => new Promise((resolve) => { concluir = resolve }))
    abrir('/exercicios/1/erros-orientacoes/1/editar')

    await usuario.click(await screen.findByRole('button', { name: 'Salvar alterações' }))
    const botao = screen.getByRole('button', { name: 'Salvando…' })
    expect(botao).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled()
    await usuario.click(botao)
    expect(atualizarErroOrientacao).toHaveBeenCalledTimes(1)

    await act(async () => concluir(itens[0]))
    expect(await screen.findByText('Alterações salvas.')).toHaveAttribute('role', 'status')
  })

  it('item inexistente ou já removido mostra o aviso', async () => {
    abrir('/exercicios/1/erros-orientacoes/99/editar')

    expect(await screen.findByRole('alert')).toHaveTextContent('Erro comum não encontrado. Ele pode ter sido removido.')
    expect(screen.queryByRole('button', { name: 'Salvar alterações' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar aos erros e orientações' }))
      .toHaveAttribute('href', '/exercicios/1/erros-orientacoes')
  })
})
