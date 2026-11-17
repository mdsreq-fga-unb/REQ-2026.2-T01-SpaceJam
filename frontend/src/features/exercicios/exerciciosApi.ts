import { api, ApiError } from '../../api/client';
import type { Exercicio, Fundamento } from '../../types/exercicio';

interface ExercicioApi {
  id: number;
  nome: string;
  objetivo: string;
  fundamento: string;
  fundamento_nome: Fundamento;
  orientacoes: string;
  erros_comuns: string;
  video_base: string;
}

const CODIGO_FUNDAMENTO: Record<Fundamento, string> = {
  'Arremesso': 'ARREMESSO',
  'Drible': 'DRIBLE',
  'Passe': 'PASSE',
  'Defesa': 'DEFESA',
  'Rebote': 'REBOTE',
  'Condicionamento físico': 'CONDICIONAMENTO_FISICO',
};

const NOME_CAMPO: Record<string, string> = {
  nome: 'Nome',
  objetivo: 'Objetivo',
  fundamento: 'Fundamento',
  orientacoes: 'Orientações',
  erros_comuns: 'Erros comuns',
  video_base: 'Vídeo base',
};

function daApi(dados: ExercicioApi): Exercicio {
  return {
    id: dados.id,
    nome: dados.nome,
    fundamento: dados.fundamento_nome,
    objetivo: dados.objetivo,
    orientacoes: dados.orientacoes || undefined,
    errosComuns: dados.erros_comuns || undefined,
    videoUrl: dados.video_base || undefined,
  };
}

function paraApi(exercicio: Exercicio) {
  return {
    nome: exercicio.nome,
    objetivo: exercicio.objetivo,
    fundamento: CODIGO_FUNDAMENTO[exercicio.fundamento],
    orientacoes: exercicio.orientacoes ?? '',
    erros_comuns: exercicio.errosComuns ?? '',
    video_base: exercicio.videoUrl ?? '',
  };
}

export async function listarExercicios(): Promise<Exercicio[]> {
  const dados = await api<ExercicioApi[] | { results: ExercicioApi[] }>(
    '/exercicios/'
  );
  const itens = Array.isArray(dados) ? dados : dados.results;
  return itens.map(daApi);
}

export async function criarExercicio(exercicio: Exercicio): Promise<Exercicio> {
  const dados = await api<ExercicioApi>('/exercicios/', {
    method: 'POST',
    body: JSON.stringify(paraApi(exercicio)),
  });
  return daApi(dados);
}

export async function atualizarExercicio(
  id: number,
  exercicio: Exercicio
): Promise<Exercicio> {
  const dados = await api<ExercicioApi>(`/exercicios/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(paraApi(exercicio)),
  });
  return daApi(dados);
}

export function mensagemDeErro(erro: unknown): string {
  if (!(erro instanceof ApiError)) {
    return 'Não foi possível conectar ao servidor.';
  }
  if (erro.status === 401) return 'Sua sessão expirou. Entre novamente.';
  if (erro.status === 403) {
    return 'Apenas treinadores podem acessar a biblioteca de exercícios.';
  }
  if (erro.status === 404) return 'Exercício não encontrado.';
  if (erro.status === 400 && erro.dados && typeof erro.dados === 'object') {
    const linhas = Object.entries(erro.dados as Record<string, unknown>).map(
      ([campo, mensagens]) =>
        `${NOME_CAMPO[campo] ?? campo}: ${
          Array.isArray(mensagens) ? mensagens.join(' ') : String(mensagens)
        }`
    );
    if (linhas.length > 0) return linhas.join(' ');
  }
  return erro.message;
}