/**
 * US42 — Cliente das rotas de vídeo de execução (backend `apps/videos`).
 *
 * O arquivo não passa pelo Django: o app pede um link de envio (passo 1), manda o
 * vídeo direto ao Storage com barra de progresso (passo 2) e confirma (passo 3).
 * O que o aluno pode fazer (enviar, substituir, nova tentativa ou nada) vem sempre do
 * servidor em `envioVideo`/`envio`; a tela só mostra o botão que ele vai aceitar.
 */
import { api, ApiError } from '../../api/client'

export type ModoEnvio = 'NOVO' | 'SUBSTITUICAO' | 'NOVA_TENTATIVA'
export type MotivoBloqueio = 'TREINO_CONCLUIDO' | 'EXERCICIO_CONCLUIDO' | 'VIDEO_AVALIADO'
export type StatusVideo = 'AGUARDANDO_AVALIACAO' | 'AVALIADO'

export interface SituacaoEnvio {
  permitido: boolean
  modo: ModoEnvio | null
  motivo: MotivoBloqueio | null
}

export interface FeedbackTreinador {
  id: number
  texto: string
  criadoEm: string
  editadoEm: string | null
}

export interface VideoExecucao {
  id: number
  exercicioId: number
  tentativa: number
  formato: string
  tamanhoBytes: number
  duracaoSegundos: number
  enviadoEm: string
  substituidoEm: string | null
  substituido: boolean
  status: StatusVideo
  feedbackTreinador: FeedbackTreinador | null
}

export interface VideoParaAssistir extends VideoExecucao {
  urlVisualizacao: string
  validadeSegundos: number
}

export interface MeuVideo extends VideoExecucao {
  exercicioNome: string
  treinoId: number
  treinoNome: string
  atual: boolean
  envio: SituacaoEnvio | null
}

export interface ExercicioComVideo {
  treino: { id: number; nome: string; alunoId: number; treinadorNome: string }
  exercicio: {
    id: number
    nome: string
    parametros: string
    videoExecucao: VideoExecucao | null
    envioVideo: SituacaoEnvio
  }
}

// --- Caminhos das telas ---

export const caminhoMeusVideos = '/treinos/meus-videos'
export const caminhoExercicio = (treinoId: number, itemId: number) => `/treinos/${treinoId}?exercicio=${itemId}`
export const caminhoEnvio = (treinoId: number, itemId: number) => `/treinos/${treinoId}/exercicios/${itemId}/video/enviar`
export const caminhoVideo = (treinoId: number, itemId: number, tentativa?: number) =>
  `/treinos/${treinoId}/exercicios/${itemId}/video${tentativa ? `?tentativa=${tentativa}` : ''}`

/** Id numérico vindo da URL, ou null se for inválido. */
export function idValido(valor?: string) {
  if (!valor || !/^\d+$/.test(valor)) return null
  const numero = Number(valor)
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null
}

// --- Textos compartilhados pelas telas ---

export const rotuloDoModo: Record<ModoEnvio, string> = {
  NOVO: 'Enviar vídeo da execução',
  SUBSTITUICAO: 'Substituir vídeo',
  NOVA_TENTATIVA: 'Enviar nova tentativa',
}

export function quemAvalia(treinadorNome?: string) {
  return treinadorNome || 'seu treinador'
}

export function textoDoStatus(status: StatusVideo, treinadorNome?: string) {
  if (status === 'AVALIADO') return treinadorNome ? `Avaliado por ${treinadorNome}` : 'Avaliado pelo treinador'
  return treinadorNome ? `Aguardando a avaliação de ${treinadorNome}` : 'Aguardando avaliação do treinador'
}

/** CA04: só o aluno e o treinador dele assistem. */
export function textoQuemVe(treinadorNome?: string) {
  return treinadorNome ? `Só você e ${treinadorNome}, seu treinador.` : 'Só você e seu treinador.'
}

/** Por que o envio está bloqueado, em linguagem do aluno (RN06, RN07, RN10). */
export function textoDoBloqueio(motivo: MotivoBloqueio, treinadorNome?: string) {
  const treinador = quemAvalia(treinadorNome)
  if (motivo === 'TREINO_CONCLUIDO') {
    return {
      titulo: 'Treino concluído pelo treinador',
      texto: 'O vídeo enviado continua disponível para consulta, mas não pode mais ser trocado.',
    }
  }
  if (motivo === 'EXERCICIO_CONCLUIDO') {
    return {
      titulo: 'Exercício validado',
      texto: `${primeiraMaiuscula(treinador)} validou este exercício como concluído. Ele não recebe novos vídeos.`,
    }
  }
  return {
    titulo: 'Vídeo já avaliado',
    texto: `${primeiraMaiuscula(treinador)} já deu feedback sobre este vídeo, então ele não pode mais ser substituído. `
      + 'Um novo envio só é liberado se o exercício for devolvido para correção.',
  }
}

function primeiraMaiuscula(texto: string) {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

const dataHora = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

export function formatarDataHora(iso: string) {
  return dataHora.format(new Date(iso)).replace(', ', ' às ')
}

export function formatarDiaMes(iso: string) {
  return dataCurta.format(new Date(iso))
}

// --- Consultas ---

interface DetalheTreinoApi {
  id: number
  nome: string
  alunoId: number
  treinadorNome: string
  exercicios: (ExercicioComVideo['exercicio'] & Record<string, unknown>)[]
}

/** Exercício do treino com o vídeo atual e o que o aluno pode fazer com ele. */
export async function consultarExercicioComVideo(treinoId: number, itemId: number, signal?: AbortSignal) {
  const treino = await api<DetalheTreinoApi>(`/treinos/${treinoId}/`, { signal })
  const exercicio = treino.exercicios.find(item => item.id === itemId)
  if (!exercicio) throw new ApiError(404, 'Exercício não encontrado neste treino.', {}, 'NAO_ENCONTRADO')
  return {
    treino: { id: treino.id, nome: treino.nome, alunoId: treino.alunoId, treinadorNome: treino.treinadorNome },
    exercicio: {
      id: exercicio.id, nome: exercicio.nome, parametros: exercicio.parametros,
      videoExecucao: exercicio.videoExecucao ?? null, envioVideo: exercicio.envioVideo,
    },
  } satisfies ExercicioComVideo
}

/** Passo 4 — dados do vídeo + link de 10 minutos. Sem `tentativa`, traz o atual. */
export function consultarVideo(itemId: number, tentativa?: number, signal?: AbortSignal) {
  const filtro = tentativa ? `?tentativa=${tentativa}` : ''
  return api<VideoParaAssistir>(`/treinos/exercicios/${itemId}/video/${filtro}`, { signal })
}

export function listarMeusVideos(signal?: AbortSignal) {
  return api<MeuVideo[]>('/treinos/meus-videos/', { signal })
}

// --- Envio ---

interface RespostaSolicitacao {
  urlUpload: string
  tipoConteudo: string
  comprovante: string
  validadeSegundos: number
  modo: ModoEnvio
  substituiVideo: boolean
}

export type VideoConfirmado = VideoExecucao & { modo: ModoEnvio }

/** Falha de rede no meio do envio do arquivo (a conexão caiu). */
export class FalhaConexao extends Error {
  constructor() {
    super('A conexão caiu durante o envio.')
  }
}

/** O Storage recusou o arquivo (ex.: 413 acima do limite do bucket). */
export class FalhaArmazenamento extends Error {
  status: number
  constructor(status: number) {
    super(`O armazenamento respondeu ${status}.`)
    this.status = status
  }
}

/** Passo 2 — envia o arquivo direto ao Storage, informando o progresso (CA02). */
export function enviarAoArmazenamento(
  url: string, arquivo: File, tipo: string, onProgresso: (fracao: number) => void, signal?: AbortSignal,
) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Envio cancelado.', 'AbortError'))
      return
    }
    const xhr = new XMLHttpRequest()
    const cancelar = () => xhr.abort()
    signal?.addEventListener('abort', cancelar, { once: true })
    const terminar = () => signal?.removeEventListener('abort', cancelar)

    xhr.open('PUT', url)
    xhr.setRequestHeader('x-upsert', 'false')
    xhr.upload.onprogress = evento => {
      if (evento.lengthComputable && evento.total > 0) onProgresso(evento.loaded / evento.total)
    }
    xhr.onload = () => {
      terminar()
      if (xhr.status >= 200 && xhr.status < 300) resolve()
      else reject(new FalhaArmazenamento(xhr.status))
    }
    xhr.onerror = () => { terminar(); reject(new FalhaConexao()) }
    xhr.ontimeout = xhr.onerror
    xhr.onabort = () => { terminar(); reject(new DOMException('Envio cancelado.', 'AbortError')) }

    // Mesmo formato do supabase-js: o tipo do arquivo vai na parte do formulário,
    // e o bucket só aceita video/mp4 e video/quicktime.
    const corpo = new FormData()
    corpo.append('cacheControl', '3600')
    corpo.append('', new Blob([arquivo], { type: tipo }), arquivo.name)
    xhr.send(corpo)
  })
}

export type EtapaEnvio = 'preparando' | 'enviando' | 'confirmando'

export interface OpcoesEnvio {
  tipo: string
  duracaoSegundos: number
  onEtapa: (etapa: EtapaEnvio) => void
  onProgresso: (fracao: number) => void
  signal?: AbortSignal
}

/** Passos 1 → 2 → 3. Só é chamado depois que o aluno confirma na prévia (RNF15, CA03). */
export async function enviarVideo(itemId: number, arquivo: File, opcoes: OpcoesEnvio): Promise<VideoConfirmado> {
  const { tipo, duracaoSegundos, onEtapa, onProgresso, signal } = opcoes
  onEtapa('preparando')
  const solicitacao = await api<RespostaSolicitacao>(`/treinos/exercicios/${itemId}/video/upload-url/`, {
    method: 'POST',
    body: JSON.stringify({ nomeArquivo: arquivo.name, tipo, tamanhoBytes: arquivo.size, duracaoSegundos }),
    signal,
  })

  onEtapa('enviando')
  await enviarAoArmazenamento(solicitacao.urlUpload, arquivo, solicitacao.tipoConteudo, onProgresso, signal)

  // Só depois da confirmação o vídeo existe para o treinador (CA02: 100% = confirmado).
  onEtapa('confirmando')
  return api<VideoConfirmado>(`/treinos/exercicios/${itemId}/video/`, {
    method: 'POST',
    body: JSON.stringify({ comprovante: solicitacao.comprovante }),
    signal,
  })
}

// --- Erros ---

export type ErroDeEnvio =
  /** 409: treino concluído, exercício validado ou vídeo avaliado enquanto o aluno enviava. */
  | { tipo: 'bloqueado'; mensagem: string }
  /** O servidor ou o Storage recusou o arquivo (formato, tamanho ou duração reais). */
  | { tipo: 'arquivo'; mensagem: string }
  /** A conexão caiu: dá para tentar de novo com o mesmo arquivo. */
  | { tipo: 'conexao' }
  | { tipo: 'sessao' }
  /** Qualquer outra falha: tela "Não foi possível concluir". */
  | { tipo: 'geral'; mensagem: string }

const BLOQUEIOS = new Set(['TREINO_CONCLUIDO', 'EXERCICIO_CONCLUIDO', 'VIDEO_AVALIADO'])

export function cancelado(erro: unknown) {
  return erro instanceof DOMException && erro.name === 'AbortError'
}

/** Traduz o `{detail, code}` padronizado do backend para o que a tela deve mostrar. */
export function classificarErro(erro: unknown): ErroDeEnvio {
  if (erro instanceof FalhaConexao || erro instanceof TypeError) return { tipo: 'conexao' }
  if (erro instanceof FalhaArmazenamento) {
    return erro.status === 413 || erro.status === 400 || erro.status === 415
      ? { tipo: 'arquivo', mensagem: 'O armazenamento recusou o arquivo. Confira se ele é .mp4 ou .mov e tem até 50 MB.' }
      : { tipo: 'geral', mensagem: 'O envio de vídeos está indisponível no momento. Tente novamente mais tarde.' }
  }
  if (erro instanceof ApiError) {
    if (erro.status === 401) return { tipo: 'sessao' }
    if (erro.codigo && BLOQUEIOS.has(erro.codigo)) return { tipo: 'bloqueado', mensagem: erro.message }
    if (erro.codigo === 'ARQUIVO_INVALIDO') return { tipo: 'arquivo', mensagem: erro.message }
    if (erro.status === 403) return { tipo: 'geral', mensagem: 'Você não tem permissão para enviar vídeo neste exercício.' }
    if (erro.status >= 500 && !erro.codigo) {
      return { tipo: 'geral', mensagem: 'O servidor não respondeu como esperado. Tente novamente em instantes.' }
    }
    return { tipo: 'geral', mensagem: erro.message }
  }
  return { tipo: 'geral', mensagem: 'Ocorreu um erro inesperado. Tente novamente.' }
}
