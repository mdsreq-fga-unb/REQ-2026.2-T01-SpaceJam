import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router';
import { criarExercicio, listarExercicios } from '../exerciciosApi';
import type { Exercicio } from '../../../types/exercicio';

import BibliotecaExercicios from '../BibliotecaExercicios';

let banco: Exercicio[] = [];
let proximoId = 1;

vi.mock('../exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../exerciciosApi')>()),
  listarExercicios: vi.fn(async () => [...banco]),
  consultarExercicio: vi.fn(async (id: number) => banco.find((ex) => ex.id === id)!),
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


function renderizarBiblioteca() {
  return render(
    <MemoryRouter initialEntries={['/exercicios']}>
      <Routes>
        <Route path="/exercicios/:exercicioId?" element={<BibliotecaExercicios />} />
      </Routes>
    </MemoryRouter>,
  );
}

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
    renderizarBiblioteca();

    expect(
      screen.getByRole('heading', { name: /biblioteca de exercícios/i })
    ).toBeInTheDocument();

    expect(await screen.findByText('Nenhum exercício cadastrado.')).toBeInTheDocument();
  });

  // TESTE 12: Abrir cadastro
  it('deve abrir o formulário ao clicar em adicionar exercício', async () => {
    const usuario = userEvent.setup();

    renderizarBiblioteca();

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

    renderizarBiblioteca();

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

    renderizarBiblioteca();

    await cadastrarExercicio(usuario, 'Arremesso de bandeja');
    await cadastrarExercicio(usuario, 'Passe de peito');

    const campoBusca = screen.getByRole('searchbox', { name: 'Buscar por nome' });

    await usuario.type(campoBusca, 'Arremesso');

    expect(
      await screen.findByRole('button', { name: 'Arremesso de bandeja' })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('button', { name: 'Passe de peito' })
    ).not.toBeInTheDocument();
  });

  it('busca por parte do nome, informa quando não há resultado e permite limpar', async () => {
    const usuario = userEvent.setup();
    banco = [{ id: 1, nome: 'Arremesso de três pontos', fundamento: 'Arremesso', objetivo: 'Controle' }];
    renderizarBiblioteca();
    const campoBusca = screen.getByRole('searchbox', { name: 'Buscar por nome' });

    await usuario.type(campoBusca, '  ARREMESSO  ');
    expect(await screen.findByRole('button', { name: 'Arremesso de três pontos' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('1 exercício encontrado.');
    expect(screen.queryByRole('button', { name: /^Buscar$/ })).not.toBeInTheDocument();
    await usuario.keyboard('{Enter}');
    expect(screen.getByRole('region', { name: 'Resultados da busca' })).toHaveFocus();
    await usuario.clear(campoBusca);
    await usuario.type(campoBusca, 'Gancho');
    expect(screen.getByText('Nenhum exercício encontrado.')).toBeVisible();
    await usuario.click(screen.getByRole('button', { name: 'Limpar busca' }));
    expect(campoBusca).toHaveValue('');
    expect(campoBusca).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Arremesso de três pontos' })).toBeVisible();
  });

  // TESTE 15: Abrir detalhes
  it('deve exibir os detalhes ao selecionar um exercício', async () => {
    const usuario = userEvent.setup();

    renderizarBiblioteca();

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

    renderizarBiblioteca();

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

    renderizarBiblioteca();

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

  it('bloqueia novos envios e o cancelamento enquanto salva', async () => {
    const usuario = userEvent.setup();
    let confirmar!: (exercicio: Exercicio) => void;
    vi.mocked(criarExercicio).mockImplementationOnce(
      () => new Promise((resolve) => { confirmar = resolve; }),
    );
    vi.mocked(criarExercicio).mockClear();
    renderizarBiblioteca();
    await screen.findByText('Nenhum exercício cadastrado.');

    await cadastrarExercicio(usuario, 'Passe de peito');
    expect(screen.getByRole('button', { name: /salvar|salvando/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeDisabled();
    expect(criarExercicio).toHaveBeenCalledTimes(1);
    await act(async () => confirmar({
      id: 1, nome: 'Passe de peito', fundamento: 'Arremesso', objetivo: 'Melhorar a técnica do atleta.',
    }));
    expect(await screen.findByRole('button', { name: 'Passe de peito' })).toBeInTheDocument();
  });

  it('abre um cadastro vazio a partir de uma edição', async () => {
    const usuario = userEvent.setup();
    renderizarBiblioteca();
    await cadastrarExercicio(usuario, 'Passe de peito');
    await usuario.click(await screen.findByRole('button', { name: 'Passe de peito' }));
    await usuario.click(await screen.findByRole('button', { name: /editar exercício/i }));
    await usuario.type(screen.getByLabelText(/nome do exercício/i), ' atualizado');
    await usuario.click(screen.getByRole('button', { name: 'Voltar à biblioteca' }));
    await usuario.click(screen.getByRole('button', { name: /adicionar exercício/i }));

    expect(screen.getByRole('heading', { name: 'Novo exercício' })).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do exercício/i)).toHaveValue('');
    expect(screen.getByLabelText(/objetivo/i)).toHaveValue('');
  });

  it('libera o cadastro após a consulta inicial da lista', async () => {
    const usuario = userEvent.setup();
    let confirmar!: (exercicios: Exercicio[]) => void;
    vi.mocked(listarExercicios).mockImplementationOnce(
      () => new Promise((resolve) => { confirmar = resolve; }),
    );
    renderizarBiblioteca();
    expect(screen.getByRole('button', { name: /adicionar exercício/i })).toBeDisabled();
    await act(async () => confirmar([]));
    await cadastrarExercicio(usuario, 'Passe de peito');
    expect(await screen.findByRole('button', { name: 'Passe de peito' })).toBeInTheDocument();
  });
});
