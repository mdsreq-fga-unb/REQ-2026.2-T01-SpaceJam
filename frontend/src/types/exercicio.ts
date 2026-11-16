
export const FUNDAMENTOS = [
  'Arremesso',
  'Drible',
  'Passe',
  'Defesa',
  'Rebote',
  'Condicionamento físico',
] as const;

export type Fundamento = (typeof FUNDAMENTOS)[number];

export interface Exercicio {
  nome: string;
  fundamento: Fundamento;
  objetivo: string;
  orientacoes?: string;
  errosComuns?: string;
  videoUrl?: string;
}
