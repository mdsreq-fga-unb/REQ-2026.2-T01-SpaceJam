/**
 * US42 — Verificação do vídeo no próprio aparelho, antes de qualquer envio (RNF15).
 *
 * São as mesmas regras do backend (RN09, RNF06, RNF13): .mp4 ou .mov, até 60 segundos
 * e até 50 MB. O servidor confere tudo de novo no arquivo que chegou; esta etapa só
 * evita que o aluno espere um envio que seria recusado.
 *
 * A duração é lida no cabeçalho do arquivo (caixa `moov/mvhd`), como faz
 * `backend/apps/videos/midia.py`, e não pelo player do navegador: assim um .mov do
 * iPhone (HEVC) é medido certo até em navegadores que não conseguem reproduzi-lo.
 */

export const LIMITE_SEGUNDOS = 60
export const LIMITE_MB = 50
export const LIMITE_BYTES = LIMITE_MB * 1024 * 1024
export const TIPOS_ACEITOS = 'video/mp4,video/quicktime,.mp4,.mov'
export const TEXTO_LIMITES = `MP4 ou MOV · até ${LIMITE_SEGUNDOS} segundos · até ${LIMITE_MB} MB`

const TIPO_POR_EXTENSAO: Record<string, string> = { mp4: 'video/mp4', mov: 'video/quicktime' }
const TIPOS_PERMITIDOS = new Set(Object.values(TIPO_POR_EXTENSAO))

export type RegraVideo = 'formato' | 'duracao' | 'tamanho'

export interface ResultadoRegra {
  regra: RegraVideo
  rotulo: string
  /** Valor encontrado no arquivo, já formatado para a tela (ex.: "1min12s"). */
  valor: string
  ok: boolean
}

export type Verificacao =
  | { ok: true; tipo: string; duracaoSegundos: number; regras: ResultadoRegra[] }
  | { ok: false; motivo: string; dica: string; regras: ResultadoRegra[] }

// --- Formatação ---

const numeroCurto = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

export function formatarDuracao(segundos: number) {
  const inteiros = Math.round(segundos)
  if (inteiros < 60) return `${inteiros} s`
  const resto = inteiros % 60
  return `${Math.floor(inteiros / 60)}min${resto ? String(resto).padStart(2, '0') + 's' : ''}`
}

export function formatarTamanho(bytes: number) {
  return `${numeroCurto.format(bytes / (1024 * 1024))} MB`
}

export function extensaoDe(nome: string) {
  const partes = nome.toLowerCase().split('.')
  return partes.length > 1 ? partes[partes.length - 1] : ''
}

// --- Duração no cabeçalho MP4/MOV (ISO BMFF / QuickTime) ---

class ArquivoIlegivel extends Error {}

const CAIXAS_INICIAIS = new Set(['ftyp', 'moov', 'mdat', 'free', 'skip', 'wide', 'pnot'])
const LIMITE_MOOV = 8 * 1024 * 1024
const LIMITE_CAIXAS = 512

function tipoDaCaixa(dados: DataView, posicao: number) {
  let tipo = ''
  for (let i = 0; i < 4; i++) {
    const letra = dados.getUint8(posicao + i)
    if (letra < 32 || letra >= 127) return null
    tipo += String.fromCharCode(letra)
  }
  return tipo
}

function inteiro64(dados: DataView, posicao: number) {
  return Number(dados.getBigUint64(posicao))
}

/** Percorre as caixas filhas de um trecho em memória: [tipo, início do corpo, fim]. */
function* caixas(dados: DataView, inicio = 0, fim = dados.byteLength): Generator<[string, number, number]> {
  let posicao = inicio
  while (posicao + 8 <= fim) {
    let tamanho = dados.getUint32(posicao)
    const tipo = tipoDaCaixa(dados, posicao + 4) ?? ''
    let cabecalho = 8
    if (tamanho === 1) {
      if (posicao + 16 > fim) throw new ArquivoIlegivel()
      tamanho = inteiro64(dados, posicao + 8)
      cabecalho = 16
    } else if (tamanho === 0) {
      tamanho = fim - posicao
    }
    if (tamanho < cabecalho || posicao + tamanho > fim) throw new ArquivoIlegivel()
    yield [tipo, posicao + cabecalho, posicao + tamanho]
    posicao += tamanho
  }
}

function duracaoDoMoov(moov: DataView) {
  let escala = 0
  let duracao = 0
  let duracaoFragmentos = 0
  for (const [tipo, inicio, fim] of caixas(moov)) {
    if (tipo === 'mvhd') {
      const versao = moov.getUint8(inicio)
      if (versao === 1) {
        if (fim - inicio < 32) throw new ArquivoIlegivel()
        escala = moov.getUint32(inicio + 20)
        duracao = inteiro64(moov, inicio + 24)
      } else {
        if (fim - inicio < 20) throw new ArquivoIlegivel()
        escala = moov.getUint32(inicio + 12)
        duracao = moov.getUint32(inicio + 16)
      }
      if (duracao === 0xFFFFFFFF || duracao >= Number.MAX_SAFE_INTEGER) duracao = 0
    } else if (tipo === 'mvex') {
      // MP4 fragmentado: a duração total fica em moov/mvex/mehd.
      for (const [filho, inicioFilho, fimFilho] of caixas(moov, inicio, fim)) {
        if (filho !== 'mehd' || fimFilho - inicioFilho < 8) continue
        duracaoFragmentos = moov.getUint8(inicioFilho) === 1 && fimFilho - inicioFilho >= 12
          ? inteiro64(moov, inicioFilho + 4)
          : moov.getUint32(inicioFilho + 4)
      }
    }
  }
  const total = duracao || duracaoFragmentos
  if (!escala || !total) throw new ArquivoIlegivel()
  return total / escala
}

async function ler(arquivo: Blob, inicio: number, tamanho: number) {
  return new DataView(await arquivo.slice(inicio, inicio + tamanho).arrayBuffer())
}

/** Duração em segundos (com casas decimais) lida no cabeçalho do vídeo. */
export async function lerDuracao(arquivo: Blob): Promise<number> {
  const total = arquivo.size
  let posicao = 0
  for (let indice = 0; indice < LIMITE_CAIXAS && posicao + 8 <= total; indice++) {
    const cabecalho = await ler(arquivo, posicao, Math.min(16, total - posicao))
    let tamanho = cabecalho.getUint32(0)
    const tipo = tipoDaCaixa(cabecalho, 4)
    if (!tipo || (indice === 0 && !CAIXAS_INICIAIS.has(tipo))) throw new ArquivoIlegivel()
    let tamanhoCabecalho = 8
    if (tamanho === 1) {
      if (cabecalho.byteLength < 16) throw new ArquivoIlegivel()
      tamanho = inteiro64(cabecalho, 8)
      tamanhoCabecalho = 16
    } else if (tamanho === 0) {
      tamanho = total - posicao
    }
    if (tamanho < tamanhoCabecalho || posicao + tamanho > total) throw new ArquivoIlegivel()
    if (tipo === 'moov') {
      const corpo = tamanho - tamanhoCabecalho
      if (corpo > LIMITE_MOOV) throw new ArquivoIlegivel()
      return duracaoDoMoov(await ler(arquivo, posicao + tamanhoCabecalho, corpo))
    }
    posicao += tamanho
  }
  throw new ArquivoIlegivel()
}

// --- Verificação completa ---

/**
 * Confere formato, duração e tamanho e diz qual regra falhou (H9: o aluno vê o motivo
 * e o valor encontrado, não só "o vídeo não atende aos limites").
 */
export async function verificarVideo(arquivo: File): Promise<Verificacao> {
  const extensao = extensaoDe(arquivo.name)
  // Alguns navegadores não informam o tipo de .mov; aí ele vem da extensão.
  const tipo = (arquivo.type || TIPO_POR_EXTENSAO[extensao] || '').toLowerCase()
  const formatoOk = extensao in TIPO_POR_EXTENSAO && TIPOS_PERMITIDOS.has(tipo)
  const tamanhoOk = arquivo.size >= 1 && arquivo.size <= LIMITE_BYTES

  let duracao: number | null = null
  if (formatoOk) {
    try {
      duracao = await lerDuracao(arquivo)
    } catch {
      duracao = null
    }
  }
  const duracaoOk = duracao !== null && duracao <= LIMITE_SEGUNDOS

  const regras: ResultadoRegra[] = [
    { regra: 'formato', rotulo: 'Formato MP4 ou MOV', valor: extensao ? extensao.toUpperCase() : 'sem extensão', ok: formatoOk },
    {
      regra: 'duracao', rotulo: `Duração até ${LIMITE_SEGUNDOS} segundos`,
      valor: duracao === null ? (formatoOk ? 'não identificada' : '—') : formatarDuracao(duracao), ok: duracaoOk,
    },
    { regra: 'tamanho', rotulo: `Tamanho até ${LIMITE_MB} MB`, valor: formatarTamanho(arquivo.size), ok: tamanhoOk },
  ]

  if (formatoOk && tamanhoOk && duracaoOk && duracao !== null) {
    return { ok: true, tipo, duracaoSegundos: duracao, regras }
  }
  if (!formatoOk) {
    return { ok: false, regras, motivo: 'O formato do arquivo não é aceito.',
      dica: 'Use um vídeo .mp4 ou .mov, como os gravados pela câmera do celular.' }
  }
  if (duracao === null) {
    return { ok: false, regras, motivo: 'Não foi possível ler este vídeo.',
      dica: 'O arquivo pode estar corrompido ou ter sido renomeado. Envie um .mp4 ou .mov gravado pelo celular ou câmera.' }
  }
  if (!duracaoOk) {
    return { ok: false, regras, motivo: `O vídeo tem ${formatarDuracao(duracao)}, acima do limite de ${LIMITE_SEGUNDOS} segundos.`,
      dica: 'Corte o vídeo no editor do celular, mantendo só a execução, ou grave de novo.' }
  }
  return { ok: false, regras, motivo: `O vídeo tem ${formatarTamanho(arquivo.size)}, acima do limite de ${LIMITE_MB} MB.`,
    dica: 'Grave em resolução menor (ex.: 1080p em vez de 4K) ou corte o vídeo.' }
}
