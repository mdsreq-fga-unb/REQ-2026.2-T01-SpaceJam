import { api } from '../../api/client'

/** US27 — item da carteira: aluno e, se houver, o nome do planejamento vigente. */
export interface AlunoDaCarteira {
  id: number
  nome: string
  planejamento_vigente: { id: number; nome: string } | null
}

export interface ExercicioPrescrito {
  id: number
  nome: string
  series: number
  repeticoes: number | null
  duracao_segundos: number | null
  status: 'A_FAZER' | 'FEITO' | 'CONCLUIDO' | 'CORRIGIR'
}

export interface TreinoResumo {
  id: number
  nome: string
  status: 'EM_ANDAMENTO' | 'FEITO' | 'CORRIGIR_REFAZER' | 'CONCLUIDO'
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

/** US19 — altera o nome do planejamento vigente. */
export function editarPlanejamento(planejamentoId: number, nome: string) {
  return api<{ id: number; nome: string }>(`/treinos/planejamentos/${planejamentoId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ nome }),
  })
}

/** US19 — remove do planejamento vigente um treino ainda não executado. */
export function removerTreino(planejamentoId: number, treinoId: number) {
  return api<void>(`/treinos/planejamentos/${planejamentoId}/treinos/${treinoId}/`, { method: 'DELETE' })
}

export function podeRemoverTreino(treino: TreinoResumo) {
  return treino.status === 'EM_ANDAMENTO' && treino.exercicios.every((item) => item.status === 'A_FAZER')
}

/** US25 — exercício já prescrito (id) ou novo, vindo da biblioteca (exercicio). */
export type ItemDaEdicao =
  | { id: number; series: number; repeticoes?: number; duracao_segundos?: number }
  | { exercicio: number; series: number; repeticoes?: number; duracao_segundos?: number }

/** US25 — substitui nome e lista de exercícios do treino. */
export function editarTreino(treinoId: number, payload: { nome: string; exercicios: ItemDaEdicao[] }) {
  return api<{ id: number; nome: string }>(`/treinos/treinos/${treinoId}/`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export interface PlanejamentoAnterior {
  id: number
  nome: string
  criado_em: string
  encerrado_em: string | null
  total_treinos: number
}

/** US21 — lista os planejamentos do histórico do aluno. */
export function listarPlanejamentosAnteriores(alunoId: number, signal?: AbortSignal) {
  return api<{ aluno: { id: number; nome: string }; planejamentos: PlanejamentoAnterior[] }>(
    `/treinos/alunos/${alunoId}/planejamentos-historico/`,
    { signal },
  )
}

/** US21 — detalhe somente leitura de um planejamento do histórico. */
export function consultarPlanejamentoAnterior(alunoId: number, planejamentoId: number) {
  return api<{ aluno: { id: number; nome: string }; planejamento: PlanejamentoAnterior & { treinos: TreinoResumo[] } }>(
    `/treinos/alunos/${alunoId}/planejamentos-historico/${planejamentoId}/`,
  )
}