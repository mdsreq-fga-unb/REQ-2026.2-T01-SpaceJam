import { api, ApiError } from '../../api/client';
import type {
  ErroOrientacao,
  Exercicio,
  Fundamento,
  InformacoesVideoBase,
} from '../../types/exercicio';

interface ErroOrientacaoApi {
  id: number;
  erro: string;
  orientacao_corretiva: string;
}

interface ExercicioApi {
  id: number;
  nome: string;
  objetivo: string;
  fundamento: string;
  fundamento_nome: Fundamento;
  orientacoes: string;
  erros_comuns: string;
  video_base: string;
  video_titulo?: string;
  video_descricao?: string;
  erros_orientacoes?: ErroOrientacaoApi[];
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
  video_titulo: 'Título do vídeo',
  video_descricao: 'Descrição do vídeo',
  erro: 'Erro comum',
  orientacao_corretiva: 'Orientação corretiva',
};

function erroOrientacaoDaApi(dados: ErroOrientacaoApi): ErroOrientacao {
  return {
    id: dados.id,
    erro: dados.erro,
    orientacaoCorretiva: dados.orientacao_corretiva,
  };
}

function daApi(dados: ExercicioApi): Exercicio {
  return {
    id: dados.id,
    nome: dados.nome,
    fundamento: dados.fundamento_nome,
    objetivo: dados.objetivo,
    orientacoes: dados.orientacoes || undefined,
    errosComuns: dados.erros_comuns || undefined,
    videoUrl: dados.video_base || undefined,
    videoTitulo: dados.video_titulo || undefined,
    videoDescricao: dados.video_descricao || undefined,
    errosOrientacoes: (dados.erros_orientacoes ?? []).map(erroOrientacaoDaApi),
  };
}

// Não envia título e descrição do vídeo-base (US35): o PUT da edição do exercício os
// preserva, e eles só mudam pela tela própria (atualizarInformacoesVideoBase).
function paraApi(exercicio: Exercicio) {
  return {
    nome: exercicio.nome,
    objetivo: exercicio.objetivo,
    fundamento: CODIGO_FUNDAMENTO[exercicio.fundamento],
    orientacoes: exercicio.orientacoes ?? '',
    erros_comuns: exercicio.errosComuns,
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

export async function consultarExercicio(id: number, signal?: AbortSignal): Promise<Exercicio> {
  const dados = await api<ExercicioApi>(`/exercicios/${id}/`, { signal });
  return daApi(dados);
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

// US35 — título e descrição breve do vídeo-base. PATCH parcial: só os dois textos.
export async function atualizarInformacoesVideoBase(
  id: number,
  textos: InformacoesVideoBase
): Promise<Exercicio> {
  const dados = await api<ExercicioApi>(`/exercicios/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({
      video_titulo: textos.videoTitulo,
      video_descricao: textos.videoDescricao,
    }),
  });
  return daApi(dados);
}

// US37 — erros comuns e orientações corretivas do exercício.
// O exercício vem sempre da URL; o corpo leva só os dois textos.

type TextosErroOrientacao = Pick<ErroOrientacao, 'erro' | 'orientacaoCorretiva'>;

function rotaErrosOrientacoes(exercicioId: number, erroId?: number) {
  return `/exercicios/${exercicioId}/erros-comuns/${erroId === undefined ? '' : `${erroId}/`}`;
}

function erroOrientacaoParaApi(textos: TextosErroOrientacao) {
  return {
    erro: textos.erro,
    orientacao_corretiva: textos.orientacaoCorretiva,
  };
}

export async function listarErrosOrientacoes(exercicioId: number): Promise<ErroOrientacao[]> {
  const dados = await api<ErroOrientacaoApi[]>(rotaErrosOrientacoes(exercicioId));
  return dados.map(erroOrientacaoDaApi);
}

export async function listarCandidatosErroOrientacao(exercicioId: number, signal?: AbortSignal): Promise<ErroOrientacao[]> {
  const dados = await api<ErroOrientacaoApi[]>(rotaErrosOrientacoes(exercicioId) + 'candidatos/', { signal });
  return dados.map(erroOrientacaoDaApi);
}

export async function associarErrosOrientacoes(exercicioId: number, ids: number[]) {
  const dados = await api<{ criados: ErroOrientacaoApi[]; ignorados: number }>(rotaErrosOrientacoes(exercicioId) + 'associar/', {
    method: 'POST',
    body: JSON.stringify({ ids }),
  });
  return { criados: dados.criados.map(erroOrientacaoDaApi), ignorados: dados.ignorados };
}

export async function criarErroOrientacao(
  exercicioId: number,
  textos: TextosErroOrientacao
): Promise<ErroOrientacao> {
  const dados = await api<ErroOrientacaoApi>(rotaErrosOrientacoes(exercicioId), {
    method: 'POST',
    body: JSON.stringify(erroOrientacaoParaApi(textos)),
  });
  return erroOrientacaoDaApi(dados);
}

export async function atualizarErroOrientacao(
  exercicioId: number,
  erroId: number,
  textos: TextosErroOrientacao
): Promise<ErroOrientacao> {
  const dados = await api<ErroOrientacaoApi>(rotaErrosOrientacoes(exercicioId, erroId), {
    method: 'PUT',
    body: JSON.stringify(erroOrientacaoParaApi(textos)),
  });
  return erroOrientacaoDaApi(dados);
}

export async function removerErroOrientacao(exercicioId: number, erroId: number): Promise<void> {
  await api<void>(rotaErrosOrientacoes(exercicioId, erroId), { method: 'DELETE' });
}

/** Mensagens das telas de erros e orientações (US37). */
export function mensagemDeErroOrientacao(erro: unknown): string {
  if (erro instanceof ApiError) {
    if (erro.status === 403 && erro.codigo !== 'TERMOS_PENDENTES') {
      return 'Apenas treinadores podem editar erros e orientações.';
    }
    if (erro.status === 404) {
      return 'Erro comum não encontrado. Ele pode ter sido removido.';
    }
  }
  return mensagemDeErro(erro);
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
  if (erro.status === 400) {
    const linhas = Object.entries(erro.campos).map(
      ([campo, mensagens]) =>
        `${NOME_CAMPO[campo] ?? campo}: ${
          Array.isArray(mensagens) ? mensagens.join(' ') : String(mensagens)
        }`
    );
    if (linhas.length > 0) return linhas.join(' ');
  }
  return erro.message;
}