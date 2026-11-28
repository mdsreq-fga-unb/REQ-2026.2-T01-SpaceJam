/** Apoio dos testes da US42: MP4 montado à mão, envio ao Storage simulado e dados da API. */
import { vi } from 'vitest'

// --- MP4/MOV mínimo: ftyp + moov/mvhd (+ mdat), suficiente para ler a duração ---

function caixa(tipo: string, ...partes: Uint8Array[]) {
  const corpo = partes.reduce((total, parte) => total + parte.length, 0)
  const bytes = new Uint8Array(8 + corpo)
  new DataView(bytes.buffer).setUint32(0, 8 + corpo)
  bytes.set([...tipo].map(letra => letra.charCodeAt(0)), 4)
  let posicao = 8
  for (const parte of partes) {
    bytes.set(parte, posicao)
    posicao += parte.length
  }
  return bytes
}

function mvhd(segundos: number, versao: 0 | 1 = 0) {
  const escala = 1000
  const corpo = new Uint8Array(versao === 1 ? 32 : 20)
  const dados = new DataView(corpo.buffer)
  dados.setUint8(0, versao)
  if (versao === 1) {
    dados.setUint32(20, escala)
    dados.setBigUint64(24, BigInt(Math.round(segundos * escala)))
  } else {
    dados.setUint32(12, escala)
    dados.setUint32(16, Math.round(segundos * escala))
  }
  return caixa('mvhd', corpo)
}

export function bytesMp4(segundos: number, opcoes: { moovNoFim?: boolean; versao?: 0 | 1; fragmentado?: boolean } = {}) {
  const ftyp = caixa('ftyp', new TextEncoder().encode('isom'))
  const cabecalho = opcoes.fragmentado
    ? caixa('moov', mvhd(0), caixa('mvex', caixa('mehd', (() => {
        const corpo = new Uint8Array(8)
        new DataView(corpo.buffer).setUint32(4, Math.round(segundos * 1000))
        return corpo
      })())))
    : caixa('moov', mvhd(segundos, opcoes.versao))
  const mdat = caixa('mdat', new Uint8Array(64))
  const ordem = opcoes.moovNoFim ? [ftyp, mdat, cabecalho] : [ftyp, cabecalho, mdat]
  const total = new Uint8Array(ordem.reduce((soma, parte) => soma + parte.length, 0))
  let posicao = 0
  for (const parte of ordem) {
    total.set(parte, posicao)
    posicao += parte.length
  }
  return total
}

export function arquivoMp4(nome: string, segundos: number, tipo = 'video/mp4', tamanho?: number) {
  const arquivo = new File([bytesMp4(segundos)], nome, { type: tipo })
  if (tamanho !== undefined) Object.defineProperty(arquivo, 'size', { value: tamanho })
  return arquivo
}

// --- Envio direto ao Storage (XMLHttpRequest) ---

export type ComportamentoEnvio = 'sucesso' | 'queda' | 'pendente' | 413

export class EnvioSimulado {
  static instancias: EnvioSimulado[] = []
  static comportamento: ComportamentoEnvio = 'sucesso'

  metodo = ''
  url = ''
  corpo: FormData | null = null
  cabecalhos: Record<string, string> = {}
  status = 0
  upload: { onprogress: ((evento: { lengthComputable: boolean; loaded: number; total: number }) => void) | null } = {
    onprogress: null,
  }
  onload: (() => void) | null = null
  onerror: (() => void) | null = null
  ontimeout: (() => void) | null = null
  onabort: (() => void) | null = null

  open(metodo: string, url: string) {
    this.metodo = metodo
    this.url = url
  }

  setRequestHeader(nome: string, valor: string) {
    this.cabecalhos[nome] = valor
  }

  send(corpo: FormData) {
    this.corpo = corpo
    EnvioSimulado.instancias.push(this)
    const comportamento = EnvioSimulado.comportamento
    setTimeout(() => {
      if (comportamento === 'pendente') {
        this.upload.onprogress?.({ lengthComputable: true, loaded: 30, total: 100 })
        return
      }
      if (comportamento === 'queda') {
        this.upload.onprogress?.({ lengthComputable: true, loaded: 46, total: 100 })
        this.onerror?.()
        return
      }
      this.upload.onprogress?.({ lengthComputable: true, loaded: 100, total: 100 })
      this.status = comportamento === 'sucesso' ? 200 : comportamento
      this.onload?.()
    }, 0)
  }

  abort() {
    this.onabort?.()
  }
}

/** Arquivo que o envio de número `indice` mandou ao Storage. */
export function arquivoEnviado(indice = 0) {
  const corpo = EnvioSimulado.instancias[indice]?.corpo
  if (!corpo) throw new Error(`Nenhum envio ${indice} ao Storage.`)
  return corpo.get('') as File
}

export function simularEnvioAoStorage(comportamento: ComportamentoEnvio = 'sucesso') {
  EnvioSimulado.instancias = []
  EnvioSimulado.comportamento = comportamento
  vi.stubGlobal('XMLHttpRequest', EnvioSimulado)
  Object.defineProperty(URL, 'createObjectURL', { value: vi.fn(() => 'blob:previa-local'), configurable: true })
  Object.defineProperty(URL, 'revokeObjectURL', { value: vi.fn(), configurable: true })
}

// --- Dados da API ---

export const alunoMe = { corpo: { id: 2, papel: 'ALUNO', first_name: 'Beatriz', apelido: 'bia', termos_pendentes: false } }
export const treinadorMe = { corpo: { id: 1, papel: 'TREINADOR', first_name: 'Lucas', apelido: 'lucas', termos_pendentes: false } }

export const situacao = {
  novo: { permitido: true, modo: 'NOVO', motivo: null },
  substituicao: { permitido: true, modo: 'SUBSTITUICAO', motivo: null },
  novaTentativa: { permitido: true, modo: 'NOVA_TENTATIVA', motivo: null },
  avaliado: { permitido: false, modo: null, motivo: 'VIDEO_AVALIADO' },
  treinoConcluido: { permitido: false, modo: null, motivo: 'TREINO_CONCLUIDO' },
} as const

export function video(extra: Record<string, unknown> = {}) {
  return {
    id: 7, exercicioId: 42, tentativa: 1, formato: 'video/mp4', tamanhoBytes: 28 * 1024 * 1024,
    duracaoSegundos: 42, enviadoEm: '2026-11-27T13:00:00Z', substituidoEm: null, substituido: false,
    status: 'AGUARDANDO_AVALIACAO', feedbackTreinador: null, ...extra,
  }
}

export const feedbackLucas = {
  id: 3, texto: 'Boa base, mas mantenha a cabeça erguida no drible.', criadoEm: '2026-11-27T15:00:00Z', editadoEm: null,
}

export function treino(exercicio: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) {
  return {
    corpo: {
      id: 14, nome: 'Treino A', alunoId: 2, status: 'EM_ANDAMENTO', statusSlug: 'em-andamento',
      statusLabel: 'Em andamento', realizadoEm: null, planejamentoId: 3, alunoNome: 'Beatriz Costa',
      treinadorNome: 'Lucas', titulo: '', objetivo: 'Controle de bola', data: null,
      exercicios: [{
        id: 42, ordem: 1, nome: 'Drible alternado', status: 'A_FAZER', parametros: '3 séries · 30 segundos',
        orientacoes: 'Mantenha a cabeça erguida.', errosComuns: '', errosOrientacoes: [],
        videoTitulo: '', videoDescricao: '', feedback: null, videoExecucao: null, envioVideo: situacao.novo,
        ...exercicio,
      }],
      ...extra,
    },
  }
}

export const solicitacaoAceita = {
  corpo: {
    urlUpload: 'https://storage.exemplo/object/upload/sign/videos/aluno_2/item_42/abc.mp4?token=t',
    tipoConteudo: 'video/mp4', comprovante: 'comprovante-assinado', validadeSegundos: 7200,
    modo: 'NOVO', substituiVideo: false,
  },
}
