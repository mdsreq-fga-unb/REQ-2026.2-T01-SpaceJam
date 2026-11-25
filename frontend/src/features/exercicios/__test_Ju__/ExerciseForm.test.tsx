
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ExerciseForm from '../components/ExerciseForm';

describe('ExerciseForm', () => {
  // TESTE 01: Exibição dos campos
  it('deve exibir todos os campos do formulário', () => {
    render(
      <ExerciseForm
        onSalvar={vi.fn()}
        onCancelar={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/nome do exercício/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/fundamento/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/objetivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/orientações/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/erros comuns/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/vídeo base/i)).toBeInTheDocument();
  });

  // TESTE 02: Campos obrigatórios vazios
  it('deve impedir o cadastro quando os campos obrigatórios estão vazios', async () => {
    const usuario = userEvent.setup();
    const onSalvar = vi.fn();

    render(
      <ExerciseForm
        onSalvar={onSalvar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.click(
      screen.getByRole('button', { name: /salvar exercício/i })
    );

    expect(onSalvar).not.toHaveBeenCalled();

    expect(
      screen.getByText('Informe o nome do exercício.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Selecione um fundamento.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Informe o objetivo do exercício.')
    ).toBeInTheDocument();
  });

  // TESTE 03: Cadastro válido
  it('deve cadastrar um exercício quando os campos obrigatórios estão preenchidos', async () => {
    const usuario = userEvent.setup();
    const onSalvar = vi.fn();

    render(
      <ExerciseForm
        onSalvar={onSalvar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.type(
      screen.getByLabelText(/nome do exercício/i),
      'Arremesso de bandeja'
    );

    await usuario.selectOptions(
      screen.getByLabelText(/fundamento/i),
      'Arremesso'
    );

    await usuario.type(
      screen.getByLabelText(/objetivo/i),
      'Melhorar a finalização próxima à cesta.'
    );

    await usuario.click(
      screen.getByRole('button', { name: /salvar exercício/i })
    );

    expect(onSalvar).toHaveBeenCalledWith({
      nome: 'Arremesso de bandeja',
      fundamento: 'Arremesso',
      objetivo: 'Melhorar a finalização próxima à cesta.',
      orientacoes: undefined,
      errosComuns: undefined,
      videoUrl: undefined,
    });
  });

  // TESTE 04: Campos opcionais preenchidos
  it('deve enviar os campos opcionais quando preenchidos', async () => {
    const usuario = userEvent.setup();
    const onSalvar = vi.fn();

    render(
      <ExerciseForm
        onSalvar={onSalvar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.type(
      screen.getByLabelText(/nome do exercício/i),
      'Arremesso de bandeja'
    );

    await usuario.selectOptions(
      screen.getByLabelText(/fundamento/i),
      'Arremesso'
    );

    await usuario.type(
      screen.getByLabelText(/objetivo/i),
      'Melhorar a finalização.'
    );

    await usuario.type(
      screen.getByLabelText(/orientações/i),
      'Realizar a bandeja utilizando a mão dominante.'
    );

    await usuario.type(
      screen.getByLabelText(/erros comuns/i),
      'Não olhar para a cesta durante a finalização.'
    );

    await usuario.type(
      screen.getByLabelText(/vídeo base/i),
      'https://www.youtube.com/watch?v=exemplo'
    );

    await usuario.click(
      screen.getByRole('button', { name: /salvar exercício/i })
    );

    expect(onSalvar).toHaveBeenCalledWith({
      nome: 'Arremesso de bandeja',
      fundamento: 'Arremesso',
      objetivo: 'Melhorar a finalização.',
      orientacoes: 'Realizar a bandeja utilizando a mão dominante.',
      errosComuns: 'Não olhar para a cesta durante a finalização.',
      videoUrl: 'https://www.youtube.com/watch?v=exemplo',
    });
  });

  // TESTE 05: Link de vídeo inválido
  it('deve impedir o cadastro quando o link do vídeo é inválido', async () => {
    const usuario = userEvent.setup();
    const onSalvar = vi.fn();

    render(
      <ExerciseForm
        onSalvar={onSalvar}
        onCancelar={vi.fn()}
      />
    );

    await usuario.type(
      screen.getByLabelText(/nome do exercício/i),
      'Arremesso de bandeja'
    );

    await usuario.selectOptions(
      screen.getByLabelText(/fundamento/i),
      'Arremesso'
    );

    await usuario.type(
      screen.getByLabelText(/objetivo/i),
      'Melhorar a finalização.'
    );

    await usuario.type(
      screen.getByLabelText(/vídeo base/i),
      'link-invalido'
    );

    await usuario.click(
      screen.getByRole('button', { name: /salvar exercício/i })
    );

    expect(onSalvar).not.toHaveBeenCalled();

    expect(
      screen.getByText('Informe um link válido.')
    ).toBeInTheDocument();
  });

  // TESTE 06: Edição de exercício
  it('deve preencher o formulário com os dados do exercício ao editar', () => {
    const exercicio = {
      nome: 'Arremesso de bandeja',
      fundamento: 'Arremesso' as const,
      objetivo: 'Melhorar a finalização.',
      orientacoes: 'Usar a mão dominante.',
      errosComuns: 'Não olhar para a cesta.',
      videoUrl: 'https://www.youtube.com/watch?v=exemplo',
    };

    render(
      <ExerciseForm
        onSalvar={vi.fn()}
        onCancelar={vi.fn()}
        exercicioInicial={exercicio}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Editar exercício' })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/nome do exercício/i))
      .toHaveValue('Arremesso de bandeja');

    expect(screen.getByLabelText(/fundamento/i))
      .toHaveValue('Arremesso');

    expect(screen.getByLabelText(/objetivo/i))
      .toHaveValue('Melhorar a finalização.');

    expect(screen.getByLabelText(/orientações/i))
      .toHaveValue('Usar a mão dominante.');

    expect(screen.getByLabelText(/erros comuns/i))
      .toHaveValue('Não olhar para a cesta.');

    expect(screen.getByLabelText(/vídeo base/i))
      .toHaveValue('https://www.youtube.com/watch?v=exemplo');

    expect(
      screen.getByRole('button', { name: /salvar alterações/i })
    ).toBeInTheDocument();
  });

  // TESTE 07: Cancelamento
  it('deve chamar a função de cancelar ao clicar no botão', async () => {
    const usuario = userEvent.setup();
    const onCancelar = vi.fn();

    render(
      <ExerciseForm
        onSalvar={vi.fn()}
        onCancelar={onCancelar}
      />
    );

    await usuario.click(
      screen.getByRole('button', { name: /cancelar/i })
    );

    expect(onCancelar).toHaveBeenCalledTimes(1);
  });

});
