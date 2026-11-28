import type { Exercicio } from '../../../types/exercicio';
import styles from '../BibliotecaExercicios.module.css';

interface ExerciseDetailsProps {
  exercicio: Exercicio;
  onFechar?: () => void;
  onEditar: () => void;
  onErrosOrientacoes?: () => void;
  /** US35: abre a tela de título e descrição do vídeo-base. */
  onVideoDemonstracao?: () => void;
  edicaoIndisponivel?: boolean;
  somenteConsulta?: boolean;
}

export default function ExerciseDetails({
  exercicio,
  onFechar,
  onEditar,
  onErrosOrientacoes,
  onVideoDemonstracao,
  edicaoIndisponivel = false,
  somenteConsulta = false,
}: ExerciseDetailsProps) {
  return (
    <section>
      <header className="sj52__intro">
        <div>
          <h1>{exercicio.nome}</h1>
          <p>Fundamento: <span>{exercicio.fundamento}</span></p>
        </div>
      </header>

      <div className={styles.colunas}>
        <div className={styles.pilha}>
          <section>
            <h2>Objetivo</h2>
            <p>{exercicio.objetivo}</p>
          </section>

          <section id="orientacoes-exercicio">
            <h2>Orientações</h2>
            <p>{exercicio.orientacoes || 'Não informado'}</p>
          </section>
          {somenteConsulta && Boolean(exercicio.errosOrientacoes?.length) && (
            <section>
              <h2>Erros e orientações</h2>
              <ul>
                {exercicio.errosOrientacoes?.map(par => (
                  <li key={par.id}><strong>{par.erro}</strong><p>{par.orientacaoCorretiva}</p></li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className={styles.pilha}>
          <section>
            <h2>Vídeo base</h2>
            {exercicio.videoUrl ? (
              <a href={exercicio.videoUrl} target="_blank" rel="noopener noreferrer" className={styles.consultar}>
                Assistir vídeo
              </a>
            ) : (
              <p>Não informado</p>
            )}
          </section>
          {(exercicio.videoTitulo || exercicio.videoDescricao) && (
            <section>
              <h2>Sobre o vídeo</h2>
              {exercicio.videoTitulo && <p><strong>{exercicio.videoTitulo}</strong></p>}
              {exercicio.videoDescricao && <p>{exercicio.videoDescricao}</p>}
            </section>
          )}
        </div>
      </div>

      {!somenteConsulta && (
        <div className={styles.acoesDetalhe}>
          <button type="button" className={styles.principal} onClick={onEditar} disabled={edicaoIndisponivel}>Editar exercício</button>
          {onErrosOrientacoes
            ? <button type="button" className={styles.secundario} onClick={onErrosOrientacoes}>Erros e orientações</button>
            : <a className={styles.secundario} href="#orientacoes-exercicio">Erros e orientações</a>}
          {onVideoDemonstracao && (
            <button type="button" className={styles.secundario} onClick={onVideoDemonstracao}>Vídeo de demonstração</button>
          )}
          {onFechar && <button type="button" className={styles.secundario} onClick={onFechar}>Fechar</button>}
        </div>
      )}
    </section>
  );
}
