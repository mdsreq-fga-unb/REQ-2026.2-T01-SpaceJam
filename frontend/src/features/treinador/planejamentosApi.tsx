import { api } from '../../api/client'

/** US27 — item da carteira: aluno e, se houver, o nome do planejamento vigente. */
export interface AlunoDaCarteira {
  id: number
  nome: string
  planejamento_vigente: { id: number; nome: string } | null
}

interface ExercicioPrescrito {
  id: number
  nome: string
  series: number
  repeticoes: number | null
  duracao_segundos: number | null
}

export interface TreinoResumo {
  id: number
  nome: string
  status: 'EM_ANDAMENTO' | 'FEITO' | 'CONCLUIDO'
  status_display: string
  total_exercicios: number
  exercicios: ExercicioPrescrito[]
}

export interface ConsultaPlanejamentoVigente {
  aluno: { id: number; nome: string }
  planejamento: { id: number; nome: string; criado_em: string; treinos: TreinoResumo[] } | null
}

/** US24 — um exercício da biblioteca com os parâmetros de execução (repetições OU duração). */
export interface ExercicioDoTreino {
  exercicio: number
  series: number
  repeticoes?: number
  duracao_segundos?: number
}

export function listarCarteiraPlanejamentos(signal?: AbortSignal) {
  return api<AlunoDaCarteira[]>('/treinos/alunos/', { signal })
}

export function consultarPlanejamentoVigente(alunoId: number, signal?: AbortSignal) {
  return api<ConsultaPlanejamentoVigente>(`/treinos/alunos/${alunoId}/planejamento-vigente/`, { signal })
}

/** US18 — cria o planejamento vigente do aluno; o anterior vai para o histórico (RN27). */
export function criarPlanejamento(payload: { aluno: number; nome: string }) {
  return api<{ id: number; aluno: number; nome: string }>('/treinos/planejamentos/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** US24 — cria um treino com exercícios da biblioteca dentro de um planejamento vigente. */
export function criarTreino(planejamentoId: number, payload: { nome: string; exercicios: ExercicioDoTreino[] }) {
  return api<{ id: number; planejamento: number; nome: string }>(`/treinos/planejamentos/${planejamentoId}/treinos/`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function descricaoDoPlanejamento(aluno: AlunoDaCarteira) {
  return aluno.planejamento_vigente
    ? `${aluno.planejamento_vigente.nome} · Planejamento vigente`
    : 'Nenhum planejamento vigente'
}

export function rotuloDoTreino(treino: Pick<TreinoResumo, 'status' | 'status_display'>) {
  return treino.status === 'FEITO' ? 'Feito · aguardando avaliação' : treino.status_display
}

export function quantidadeDeExercicios(total: number) {
  return `${total} ${total === 1 ? 'exercício' : 'exercícios'}`
}