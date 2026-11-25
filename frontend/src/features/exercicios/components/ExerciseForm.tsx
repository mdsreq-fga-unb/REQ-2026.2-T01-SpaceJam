
import { useState } from 'react';
import type { FormEvent } from 'react';
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
  const [errosComuns, setErrosComuns] = useState(
    exercicioInicial?.errosComuns ?? ''
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
      errosComuns: errosComuns.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} aria-busy={salvando} noValidate>
      <h2>
        {exercicioInicial ? 'Editar exercício' : 'Novo exercício'}
      </h2>

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
          <span className="mensagemErro">{erros.nome}</span>
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

        {erros.fundamento && (
          <span className="mensagemErro">{erros.fundamento}</span>
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
          <span className="mensagemErro">{erros.objetivo}</span>
        )}
      </label>

      <label>
        Orientações
        <textarea
          value={orientacoes}
          disabled={salvando}
          onChange={(evento) => setOrientacoes(evento.target.value)}
          placeholder="Adicione orientações para a execução..."
        />
      </label>

      <label>
        Erros comuns
        <textarea
          value={errosComuns}
          disabled={salvando}
          onChange={(evento) => setErrosComuns(evento.target.value)}
          placeholder="Descreva erros comuns durante a execução..."
        />
      </label>

      <label>
        Vídeo base
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
          <span className="mensagemErro">{erros.videoUrl}</span>
        )}
      </label>

      <div>
        <button type="button" onClick={onCancelar} disabled={salvando}>
          Cancelar
        </button>

        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : exercicioInicial ? 'Salvar alterações' : 'Salvar exercício'}
        </button>
      </div>
    </form>
  );
}
