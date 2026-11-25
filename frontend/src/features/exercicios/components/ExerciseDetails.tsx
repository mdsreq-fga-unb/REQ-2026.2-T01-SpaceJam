import type { Exercicio } from '../../../types/exercicio';
import styles from '../BibliotecaExercicios.module.css';

interface ExerciseDetailsProps {
  exercicio: Exercicio;
  onFechar?: () => void;
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
      <header className="sj52__intro">
        <div><h1>{exercicio.nome}</h1><p>Fundamento: <span>{exercicio.fundamento}</span></p></div>
      </header>
      <div className={styles.colunas}>
        <div className={styles.pilha}>
          <section><h2>Objetivo</h2><p>{exercicio.objetivo}</p></section>
          <section id="orientacoes-exercicio"><h2>Orientações</h2><p>{exercicio.orientacoes || 'Não informado'}</p></section>
        </div>
        <div className={styles.pilha}>
          <section><h2>Erros comuns</h2><p>{exercicio.errosComuns || 'Não informado'}</p></section>
          <section>
            <h2>Vídeo base</h2>
            {exercicio.videoUrl ? (
              <a href={exercicio.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.consultar}>Assistir vídeo</a>
            ) : (
              <p>Não informado</p>
            )}
          </section>
        </div>
      </div>
      <div className={styles.acoesDetalhe}>
        <button type="button" className={styles.principal} onClick={onEditar} disabled={edicaoIndisponivel}>Editar exercício</button>
        <a className={styles.secundario} href="#orientacoes-exercicio">Erros e orientações</a>
        {exercicio.videoUrl
          ? <a className={styles.secundario} href={exercicio.videoUrl} target="_blank" rel="noopener noreferrer">Vídeo de demonstração</a>
          : <button type="button" className={styles.secundario} disabled>Vídeo de demonstração</button>}
        {onFechar && <button type="button" className={styles.secundario} onClick={onFechar}>Fechar</button>}
      </div>
    </section>
  );
}
