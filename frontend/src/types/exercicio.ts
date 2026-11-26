
export const FUNDAMENTOS = [
  'Arremesso',
  'Drible',
  'Passe',
  'Defesa',
  'Rebote',
  'Condicionamento físico',
] as const;

export type Fundamento = (typeof FUNDAMENTOS)[number];

/** US37: par erro comum + orientação corretiva de um exercício. */
export interface ErroOrientacao {
  id: number;
  erro: string;
  orientacaoCorretiva: string;
}

/** Limite de caracteres de cada campo do par (mesmo valor do backend). */
export const LIMITE_TEXTO_ERRO_ORIENTACAO = 1000;

/** US35: limites do título e da descrição do vídeo-base (mesmos valores do backend). */
export const LIMITE_TITULO_VIDEO_BASE = 120;
export const LIMITE_DESCRICAO_VIDEO_BASE = 500;

export interface Exercicio {
  id?: number;
  nome: string;
  fundamento: Fundamento;
  objetivo: string;
  orientacoes?: string;
  errosComuns?: string;
  videoUrl?: string;
  /** US35: título e descrição breve do vídeo-base (opcionais). */
  videoTitulo?: string;
  videoDescricao?: string;
  errosOrientacoes?: ErroOrientacao[];
}

/** US35: textos editados na tela "Vídeo de demonstração". */
export type InformacoesVideoBase = Required<Pick<Exercicio, 'videoTitulo' | 'videoDescricao'>>;
