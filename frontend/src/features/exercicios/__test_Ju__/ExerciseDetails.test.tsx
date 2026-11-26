
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ExerciseDetails from '../components/ExerciseDetails';

describe('ExerciseDetails', () => {
  const exercicio = {
    nome: 'Arremesso de bandeja',
    fundamento: 'Arremesso' as const,
    objetivo: 'Melhorar a finalização próxima à cesta.',
    orientacoes: 'Utilizar a mão dominante.',
    errosComuns: 'Não olhar para a cesta.',
    videoUrl: 'https://www.youtube.com/watch?v=exemplo',
  };

  // TESTE 08: Exibição dos detalhes
  it('deve exibir as informações do exercício', () => {
    render(
      <ExerciseDetails
        exercicio={exercicio}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { name: 'Arremesso de bandeja' })
    ).toBeInTheDocument();

    expect(screen.getByText('Arremesso')).toBeInTheDocument();

    expect(
      screen.getByText('Melhorar a finalização próxima à cesta.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Utilizar a mão dominante.')
    ).toBeInTheDocument();

    // O texto antigo de erros comuns não aparece mais no detalhe:
    // a lista fica na tela "Erros e orientações" (US37).
    expect(screen.queryByRole('heading', { name: 'Erros comuns' })).not.toBeInTheDocument();
    expect(screen.queryByText('Não olhar para a cesta.')).not.toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /assistir vídeo/i })
    ).toHaveAttribute('href', exercicio.videoUrl);
  });

  // TESTE 09: Campos opcionais vazios
  it('deve exibir Não informado quando os campos opcionais estiverem vazios', () => {
    const exercicioSemOpcionais = {
      nome: 'Passe de peito',
      fundamento: 'Passe' as const,
      objetivo: 'Melhorar a precisão dos passes.',
    };

    render(
      <ExerciseDetails
        exercicio={exercicioSemOpcionais}
        onEditar={vi.fn()}
        onFechar={vi.fn()}
      />
    );

    expect(screen.getAllByText('Não informado')).toHaveLength(2);

    expect(
      screen.queryByRole('link', { name: /assistir vídeo/i })
    ).not.toBeInTheDocument();
  });

  // TESTE 10: Botões de edição e fechamento
  it('deve chamar as funções de editar e fechar', async () => {
    const usuario = userEvent.setup();
    const onEditar = vi.fn();
    const onFechar = vi.fn();

    render(
      <ExerciseDetails
        exercicio={exercicio}
        onEditar={onEditar}
        onFechar={onFechar}
      />
    );

    await usuario.click(
      screen.getByRole('button', { name: /editar exercício/i })
    );

    expect(onEditar).toHaveBeenCalledTimes(1);

    await usuario.click(
      screen.getByRole('button', { name: /fechar/i })
    );

    expect(onFechar).toHaveBeenCalledTimes(1);
  });
});
