
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

export interface Exercicio {
  id?: number;
  nome: string;
  fundamento: Fundamento;
  objetivo: string;
  orientacoes?: string;
  errosComuns?: string;
  videoUrl?: string;
  errosOrientacoes?: ErroOrientacao[];
}
