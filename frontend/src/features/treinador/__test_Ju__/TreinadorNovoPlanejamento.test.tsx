
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'

import { TreinadorNovoPlanejamento } from '../TreinadorNovoPlanejamento'

describe('TreinadorNovoPlanejamento', () => {
  // TESTE 01: Exibição da página
  it('deve exibir o título e a descrição da página', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('heading', { name: /novo planejamento/i })
    ).toBeInTheDocument()

    expect(
      screen.getByText(/organize os treinos de um aluno/i)
    ).toBeInTheDocument()
  })

  // TESTE 02: Exibição dos alunos
  it('deve exibir os três alunos disponíveis', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    const botoesAlunos = screen.getAllByRole('button', {
      name: /beatriz costa|andr|camila martins/i,
    })

    expect(botoesAlunos).toHaveLength(3)
  })

  // TESTE 03: Aluno inicialmente selecionado
  it('deve selecionar Beatriz Costa inicialmente', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /beatriz costa/i })
    ).toHaveAttribute('aria-pressed', 'true')
  })

  // TESTE 04: Seleção de aluno
  it('deve permitir selecionar outro aluno', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    await usuario.click(
      screen.getByRole('button', { name: /camila martins/i })
    )

    expect(
      screen.getByRole('button', { name: /camila martins/i })
    ).toHaveAttribute('aria-pressed', 'true')
  })

  // TESTE 05: Exclusividade da seleção
  it('deve manter apenas um aluno selecionado por vez', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    await usuario.click(
      screen.getByRole('button', { name: /camila martins/i })
    )

    const alunosSelecionados = screen
      .getAllByRole('button', {
        name: /beatriz costa|andr|camila martins/i,
      })
      .filter(
        (botao) => botao.getAttribute('aria-pressed') === 'true'
      )

    expect(alunosSelecionados).toHaveLength(1)
  })

  // TESTE 06: Nome inicial
  it('deve apresentar Controle de bola como nome inicial', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(
      screen.getByLabelText(/nome do planejamento/i)
    ).toHaveValue('Controle de bola')
  })

  // TESTE 07: Edição do nome
  it('deve permitir editar o nome do planejamento', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    const campoNome = screen.getByLabelText(/nome do planejamento/i)

    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Treino de arremesso')

    expect(campoNome).toHaveValue('Treino de arremesso')
  })

  // TESTE 08: Campo obrigatório
  it('deve impedir o envio quando o nome está vazio', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    const campoNome = screen.getByLabelText(/nome do planejamento/i)

    await usuario.clear(campoNome)

    expect(campoNome).toBeRequired()
    expect(campoNome).toBeInvalid()

    await usuario.click(
      screen.getByRole('button', { name: /criar planejamento/i })
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  // TESTE 09: Envio válido
  it('deve aceitar o envio quando o nome está preenchido', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    const campoNome = screen.getByLabelText(/nome do planejamento/i)

    await usuario.clear(campoNome)
    await usuario.type(campoNome, 'Treino de arremesso')

    await usuario.click(
      screen.getByRole('button', { name: /criar planejamento/i })
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  // TESTE 10: Mensagem de confirmação
  it('deve exibir a mensagem de prévia após o envio', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    await usuario.click(
      screen.getByRole('button', { name: /criar planejamento/i })
    )

    expect(screen.getByRole('status')).toHaveTextContent(/visual/)
    expect(screen.getByRole('status')).toHaveTextContent(/planejamento/)
  })

  // TESTE 11: Limpeza da mensagem ao editar o nome
  it('deve remover a mensagem quando o nome é alterado', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    await usuario.click(
      screen.getByRole('button', { name: /criar planejamento/i })
    )

    expect(screen.getByRole('status')).toBeInTheDocument()

    await usuario.type(
      screen.getByLabelText(/nome do planejamento/i),
      ' novo'
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  // TESTE 12: Limpeza da mensagem ao trocar aluno
  it('deve remover a mensagem quando outro aluno é selecionado', async () => {
    const usuario = userEvent.setup()

    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    await usuario.click(
      screen.getByRole('button', { name: /criar planejamento/i })
    )

    expect(screen.getByRole('status')).toBeInTheDocument()

    await usuario.click(
      screen.getByRole('button', { name: /camila martins/i })
    )

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  // TESTE 13: Cancelamento
  it('deve direcionar o link cancelar para a página de planejamentos', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('link', { name: /cancelar/i })
    ).toHaveAttribute('href', '/treinador/planejamentos')
  })

  // TESTE 14: Nome padrão do treinador
  it('deve exibir Lucas como nome padrão do treinador', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Lucas').length).toBeGreaterThan(0)
  })

  // TESTE 15: Nome personalizado do treinador
  it('deve exibir o nome personalizado do treinador', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento
          nomeTreinador="Carlos"
          modoTeste
        />
      </MemoryRouter>
    )

    expect(screen.getAllByText('Carlos').length).toBeGreaterThan(0)
  })

  // TESTE 16: Modo de teste ativado
  it('deve exibir o aviso de dados fictícios no modo de teste', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    expect(screen.getByText(/visual com dados/i)).toBeInTheDocument()
  })

  // TESTE 17: Modo de teste desativado
  it('não deve exibir o aviso de dados fictícios no modo normal', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento />
      </MemoryRouter>
    )

    expect(
      screen.queryByText(/visual com dados/i)
    ).not.toBeInTheDocument()
  })

  // TESTE 18: Navegação acessível
  it('deve apresentar os menus de navegação com seus links', () => {
    render(
      <MemoryRouter>
        <TreinadorNovoPlanejamento modoTeste />
      </MemoryRouter>
    )

    const menu = screen.getByRole('navigation', {
      name: /menu do treinador/i,
    })

    expect(
      within(menu).getByRole('link', { name: /alunos/i })
    ).toHaveAttribute('href', '/treinador/alunos')

    expect(
      within(menu).getByRole('link', { name: /treinos/i })
    ).toHaveAttribute('href', '/treinador/planejamentos')

    expect(
      within(menu).getByRole('link', { name: /biblioteca/i })
    ).toHaveAttribute('href', '/exercicios')

    expect(
      within(menu).getByRole('link', { name: /conta/i })
    ).toHaveAttribute('href', '/')
  })
})
