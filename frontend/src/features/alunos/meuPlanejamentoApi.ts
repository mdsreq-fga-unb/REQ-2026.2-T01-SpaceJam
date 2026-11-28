import { api } from '../../api/client'

export interface ExercicioPrescrito {
  id: number
  exercicio: number | null
  ordem: number
  nome: string
  objetivo: string
  fundamento: string
  orientacoes: string
  erros_comuns: string
  erros_orientacoes: { erro: string; orientacao_corretiva: string }[]
  video_base: string
  series: number
  repeticoes: number | null
  duracao_segundos: number | null
  status: 'A_FAZER' | 'FEITO' | 'CONCLUIDO' | 'CORRIGIR'
}

export interface TreinoPrescrito {
  id: number
  nome: string
  status: 'EM_ANDAMENTO' | 'FEITO' | 'CONCLUIDO' | 'CORRIGIR_REFAZER'
  status_display: string
  total_exercicios: number
  exercicios: ExercicioPrescrito[]
}

export interface PlanejamentoDoAluno {
  id: number
  nome: string
  criado_em: string
  treinos: TreinoPrescrito[]
}

export function consultarMeuPlanejamento(signal?: AbortSignal) {
  return api<{ planejamento: PlanejamentoDoAluno | null }>('/treinos/meu-planejamento/', { signal })
}
