
import type { Exercicio } from '../../../types/exercicio';

interface ExerciseDetailsProps {
  exercicio: Exercicio;
  onFechar: () => void;
  onEditar: () => void;
  edicaoIndisponivel?: boolean;
}

export default function ExerciseDetails({
  exercicio,
  onFechar,
  onEditar,
  edicaoIndisponivel = false,
}: ExerciseDetailsProps) {
  return (
    <section>
      <h2>{exercicio.nome}</h2>

      <h3>Fundamento</h3>
      <p>{exercicio.fundamento}</p>

      <h3>Objetivo</h3>
      <p>{exercicio.objetivo}</p>

      <h3>Orientações</h3>
      <p>{exercicio.orientacoes || 'Não informado'}</p>

      <h3>Erros comuns</h3>
      <p>{exercicio.errosComuns || 'Não informado'}</p>

      <h3>Vídeo base</h3>

      {exercicio.videoUrl ? (
        <a
          href={exercicio.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Assistir vídeo
        </a>
      ) : (
        <p>Não informado</p>
      )}

      <button type="button" onClick={onEditar} disabled={edicaoIndisponivel}>
        Editar exercício
      </button>

      <button type="button" onClick={onFechar}>
        Fechar
      </button>
    </section>
  );
}
