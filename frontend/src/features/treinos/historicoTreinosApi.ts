import { api } from '../../api/client'
import type { ResumoTreinoHistorico, TreinoHistorico } from './HistoricoTreinos'

interface ResumoApi {
  id: number
  nome: string
  alunoId: number
  status: string
  statusLabel: string
  criadoEm?: string | null
  realizadoEm: string | null
  quantidadeExercicios: number
}

interface PaginaApi {
  next: string | null
  previous: string | null
  results: ResumoApi[]
  aluno?: { id: number; nome: string }
}

interface DetalheApi extends ResumoApi {
  exercicios: {
    id: number
    nome: string
    parametros: string
    orientacoes: string
    errosOrientacoes?: { erro: string; orientacao_corretiva: string }[]
    dificuldade?: { nota: 1 | 2 | 3 | 4 | 5 } | null
    feedback?: { autorNome?: string; texto: string; editado: boolean } | null
  }[]
}

function paraResumo(treino: ResumoApi): ResumoTreinoHistorico {
  return {
    id: treino.id,
    nome: treino.nome,
    status: treino.statusLabel,
    data: treino.criadoEm ?? treino.realizadoEm,
    quantidadeExercicios: treino.quantidadeExercicios,
  }
}

export async function consultarHistorico(alunoId: number | undefined, pagina: number, signal: AbortSignal) {
  const rota = alunoId === undefined ? '/treinos/meu-historico/' : '/treinos/alunos/' + alunoId + '/historico/'
  const dados = await api<PaginaApi>(rota + '?page=' + pagina, { signal })
  return {
    treinos: dados.results.map(paraResumo),
    alunoNome: dados.aluno?.nome,
    temAnterior: Boolean(dados.previous),
    temProxima: Boolean(dados.next),
  }
}

export async function consultarRegistroHistorico(treinoId: number, alunoId: number, somenteConcluido: boolean, signal: AbortSignal): Promise<TreinoHistorico | null> {
  const dados = await api<DetalheApi>('/treinos/' + treinoId + '/', { signal })
  if (dados.alunoId !== alunoId || (somenteConcluido && dados.status !== 'CONCLUIDO')) return null
  return {
    ...paraResumo(dados),
    exercicios: dados.exercicios.map(exercicio => ({
      id: exercicio.id,
      nome: exercicio.nome,
      parametros: exercicio.parametros,
      orientacoes: exercicio.orientacoes,
      dificuldade: exercicio.dificuldade === undefined ? undefined : exercicio.dificuldade?.nota ?? null,
      errosOrientacoes: exercicio.errosOrientacoes?.map(par => ({
        erro: par.erro,
        orientacaoCorretiva: par.orientacao_corretiva,
      })),
      feedbacks: exercicio.feedback ? [{
        autor: exercicio.feedback.autorNome || 'Aluno',
        texto: exercicio.feedback.texto,
        editado: exercicio.feedback.editado,
      }] : [],
    })),
  }
}
