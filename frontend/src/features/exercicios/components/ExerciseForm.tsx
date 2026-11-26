import { useState } from 'react';
import type { FormEvent } from 'react';
import styles from '../BibliotecaExercicios.module.css';
import {
  FUNDAMENTOS,
  type Exercicio,
  type Fundamento,
} from '../../../types/exercicio';

interface ExerciseFormProps {
  onSalvar: (exercicio: Exercicio) => void;
  onCancelar: () => void;
  exercicioInicial?: Exercicio;
  salvando?: boolean;
}

interface ErrosFormulario {
  nome?: string;
  fundamento?: string;
  objetivo?: string;
  videoUrl?: string;
}

export default function ExerciseForm({
  onSalvar,
  onCancelar,
  exercicioInicial,
  salvando = false,
}: ExerciseFormProps) {
  const [nome, setNome] = useState(exercicioInicial?.nome ?? '');
  const [fundamento, setFundamento] = useState<Fundamento | ''>(
    exercicioInicial?.fundamento ?? ''
  );
  const [objetivo, setObjetivo] = useState(
    exercicioInicial?.objetivo ?? ''
  );
  const [orientacoes, setOrientacoes] = useState(
    exercicioInicial?.orientacoes ?? ''
  );
  const [videoUrl, setVideoUrl] = useState(
    exercicioInicial?.videoUrl ?? ''
  );

  const [erros, setErros] = useState<ErrosFormulario>({});

  function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando) return;

    const novosErros: ErrosFormulario = {};

    if (!nome.trim()) {
      novosErros.nome = 'Informe o nome do exercício.';
    }

    if (!fundamento) {
      novosErros.fundamento = 'Selecione um fundamento.';
    }

    if (!objetivo.trim()) {
      novosErros.objetivo = 'Informe o objetivo do exercício.';
    }

    if (videoUrl.trim()) {
      try {
        const url = new URL(videoUrl);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          novosErros.videoUrl = 'Informe um link válido.';
        }
      } catch {
        novosErros.videoUrl = 'Informe um link válido.';
      }
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0 || !fundamento) {
      return;
    }

    onSalvar({
      nome: nome.trim(),
      fundamento,
      objetivo: objetivo.trim(),
      orientacoes: orientacoes.trim() || undefined,
      // O campo de texto antigo saiu do formulário: os erros ficam em
      // "Erros e orientações" (US37). Na edição, o valor já salvo é mantido.
      errosComuns: exercicioInicial?.errosComuns,
      videoUrl: videoUrl.trim() || undefined,
    });
  }

  return (
    <form className={styles.formulario} onSubmit={handleSubmit} aria-busy={salvando} noValidate>
      <header className="sj52__intro">
        <div>
          <h1>{exercicioInicial ? 'Editar exercício' : 'Novo exercício'}</h1>
          <p>{exercicioInicial ? 'Atualize os dados da biblioteca.' : 'Os campos com * são obrigatórios.'}</p>
        </div>
      </header>
      <div className={styles.colunas}>
        <div className={styles.pilha}>
          <label>
            Nome do exercício *
            <input
              type="text"
              value={nome}
              disabled={salvando}
              onChange={(evento) => {
                setNome(evento.target.value);
                setErros((atuais) => ({ ...atuais, nome: undefined }));
              }}
              aria-invalid={Boolean(erros.nome)}
              placeholder="Digite o nome do exercício..."
            />
            {erros.nome && (
              <span className={styles.erro}>{erros.nome}</span>
            )}
          </label>

          <label>
            Fundamento *
            <select
              value={fundamento}
              disabled={salvando}
              onChange={(evento) => {
                setFundamento(evento.target.value as Fundamento | '');
                setErros((atuais) => ({
                  ...atuais,
                  fundamento: undefined,
                }));
              }}
              aria-invalid={Boolean(erros.fundamento)}
            >
              <option value="">Selecione um fundamento</option>

              {FUNDAMENTOS.map((opcao) => (
                <option key={opcao} value={opcao}>
                  {opcao}
                </option>
              ))}
            </select>

            <small>Selecione um fundamento da lista.</small>
            {erros.fundamento && (
              <span className={styles.erro}>{erros.fundamento}</span>
            )}
          </label>

          <label>
            Objetivo *
            <textarea
              value={objetivo}
              disabled={salvando}
              onChange={(evento) => {
                setObjetivo(evento.target.value);
                setErros((atuais) => ({ ...atuais, objetivo: undefined }));
              }}
              aria-invalid={Boolean(erros.objetivo)}
              placeholder="Descreva o objetivo do exercício..."
            />
            {erros.objetivo && (
              <span className={styles.erro}>{erros.objetivo}</span>
            )}
          </label>

          <label>
            Orientações (opcional)
            <textarea
              value={orientacoes}
              disabled={salvando}
              onChange={(evento) => setOrientacoes(evento.target.value)}
              placeholder="Adicione orientações para a execução..."
            />
          </label>

        </div>
        <div className={styles.pilha}>
          <label>
            <strong>Vídeo base (opcional)</strong>
            <input
              type="url"
              value={videoUrl}
              disabled={salvando}
              onChange={(evento) => {
                setVideoUrl(evento.target.value);
                setErros((atuais) => ({ ...atuais, videoUrl: undefined }));
              }}
              aria-invalid={Boolean(erros.videoUrl)}
              placeholder="Cole o link do vídeo..."
            />
            {erros.videoUrl && (
              <span className={styles.erro}>{erros.videoUrl}</span>
            )}
          </label>

          {exercicioInicial && (
            <aside className={styles.aviso}>
              <strong>Preserve o histórico</strong>
              <p>Confira o efeito da edição nas próximas prescrições antes de usar esta versão do exercício.</p>
            </aside>
          )}
        </div>
      </div>
      <div className={styles.acoesDetalhe}>
        <button type="submit" className={styles.principal} disabled={salvando}>
          {salvando ? 'Salvando…' : exercicioInicial ? 'Salvar alterações' : 'Salvar exercício'}
        </button>
        <button type="button" className={styles.secundario} onClick={onCancelar} disabled={salvando}>Cancelar</button>
      </div>
    </form>
  );
}
