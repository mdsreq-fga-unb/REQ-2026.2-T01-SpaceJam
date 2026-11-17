import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Exercicio } from '../../../types/exercicio';

import BibliotecaExercicios from '../BibliotecaExercicios';

let banco: Exercicio[] = [];
let proximoId = 1;

vi.mock('../exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../exerciciosApi')>()),
  listarExercicios: vi.fn(async () => [...banco]),
  criarExercicio: vi.fn(async (ex: Exercicio) => {
    const criado = { ...ex, id: proximoId++ };
    banco.push(criado);
    return criado;
  }),
  atualizarExercicio: vi.fn(async (id: number, ex: Exercicio) => {
    const atualizado = { ...ex, id };
    banco = banco.map((e) => (e.id === id ? atualizado : e));
    return atualizado;
  }),
}));

beforeEach(() => {
  banco = [];
  proximoId = 1;
});

describe('BibliotecaExercicios', () => {
  // Função auxiliar para cadastrar exercícios nos testes
  async function cadastrarExercicio(
    usuario: ReturnType<typeof userEvent.setup>,
    nome: string
  ) {
    await usuario.click(
      screen.getByRole('button', { name: /adicionar exercício/i })
    );

    await usuario.type(
      screen.getByLabelText(/nome do exercício/i),
      nome
    );

    await usuario.selectOptions(
      screen.getByLabelText(/fundamento/i),
      'Arremesso'
    );

    await usuario.type(
      screen.getByLabelText(/objetivo/i),
      'Melhorar a técnica do atleta.'
    );

    await usuario.click(
      screen.getByRole('button', { name: /salvar exercício/i })
    );
  }

  // TESTE 11: Exibição inicial da biblioteca
  it('deve exibir a mensagem quando não existem exercícios cadastrados', async () => {
    render(<BibliotecaExercicios />);

    expect(
      screen.getByRole('heading', { name: /biblioteca de exercícios/i })
    ).toBeInTheDocument();

    expect(await screen.findByText('Nenhum exercício cadastrado.')).toBeInTheDocument();
  });

  // TESTE 12: Abrir cadastro
  it('deve abrir o formulário ao clicar em adicionar exercício', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await usuario.click(
      screen.getByRole('button', { name: /adicionar exercício/i })
    );

    expect(
      screen.getByRole('heading', { name: 'Novo exercício' })
    ).toBeInTheDocument();
  });

  // TESTE 13: Cadastrar e exibir exercício
  it('deve adicionar um exercício à biblioteca', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await cadastrarExercicio(usuario, 'Arremesso de bandeja');

    expect(
      await screen.findByRole('button', { name: 'Arremesso de bandeja' })
    ).toBeInTheDocument();

    expect(
      screen.queryByText('Nenhum exercício cadastrado.')
    ).not.toBeInTheDocument();
  });

  // TESTE 14: Busca por nome
  it('deve filtrar os exercícios pelo nome', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await cadastrarExercicio(usuario, 'Arremesso de bandeja');
    await cadastrarExercicio(usuario, 'Passe de peito');

    const campoBusca = screen.getByPlaceholderText('Buscar:');

    await usuario.type(campoBusca, 'Arremesso');

    expect(
      await screen.findByRole('button', { name: 'Arremesso de bandeja' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Passe de peito' })
    ).not.toBeInTheDocument();
  });

  // TESTE 15: Abrir detalhes
  it('deve exibir os detalhes ao selecionar um exercício', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await cadastrarExercicio(usuario, 'Arremesso de bandeja');

    await usuario.click(
      await screen.findByRole('button', { name: 'Arremesso de bandeja' })
    );

    expect(
      await screen.findByRole('heading', { name: 'Arremesso de bandeja' })
    ).toBeInTheDocument();

    expect(
      screen.getByText('Melhorar a técnica do atleta.')
    ).toBeInTheDocument();
  });

  // TESTE 16: Editar exercício
  it('deve permitir editar um exercício cadastrado', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await cadastrarExercicio(usuario, 'Arremesso de bandeja');

    await usuario.click(
      await screen.findByRole('button', { name: 'Arremesso de bandeja' })
    );

    await usuario.click(
      screen.getByRole('button', { name: /editar exercício/i })
    );

    expect(
      screen.getByRole('heading', { name: 'Editar exercício' })
    ).toBeInTheDocument();

    const campoNome = screen.getByLabelText(/nome do exercício/i);

    await usuario.clear(campoNome);
    await usuario.type(campoNome, 'Arremesso de três pontos');

    await usuario.click(
      screen.getByRole('button', { name: /salvar alterações/i })
    );

    expect(
      await screen.findByRole('heading', { name: 'Arremesso de três pontos' })
    ).toBeInTheDocument();
  });

  // TESTE 17: Cancelar cadastro
  it('deve fechar o formulário ao cancelar o cadastro', async () => {
    const usuario = userEvent.setup();

    render(<BibliotecaExercicios />);

    await usuario.click(
      screen.getByRole('button', { name: /adicionar exercício/i })
    );

    await usuario.click(
      screen.getByRole('button', { name: /cancelar/i })
    );

    expect(
      screen.queryByRole('heading', { name: 'Novo exercício' })
    ).not.toBeInTheDocument();

    expect(
      screen.getByText('Nenhum exercício cadastrado.')
    ).toBeInTheDocument();
  });
});
