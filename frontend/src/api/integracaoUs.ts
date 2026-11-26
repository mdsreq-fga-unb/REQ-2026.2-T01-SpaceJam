import { api } from './client'
import type { AtualizacaoPerfilAluno } from '../features/alunos/validacaoPerfilAluno'
import type { SolicitarTrocaSenha } from '../features/conta/regrasTrocaSenha'
import type { SolicitacaoRedefinicao } from '../features/conta/regrasRecuperacaoSenha'

export interface DadosCadastraisApi {
  id: number
  first_name: string
  last_name: string
  apelido: string
  email: string
  telefone?: string | null
  data_nascimento?: string | null
  altura?: string | number | null
  peso?: string | number | null
  envergadura?: string | number | null
  frequencia_semanal?: number | null
  objetivos?: string | null
  treinador_vinculado?: { id: number; nome: string; codigo_convite?: string } | null
  historico_lesoes?: unknown[] | null
}

export function consultarMeusDados() {
  return api<DadosCadastraisApi>('/contas/me/')
}

export function editarMeusDados(payload: AtualizacaoPerfilAluno) {
  return api('/contas/me/editar/', { method: 'PATCH', body: JSON.stringify(payload) })
}

export function alterarSenha(payload: SolicitarTrocaSenha) {
  return api('/auth/trocar-senha/', { method: 'POST', body: JSON.stringify(payload) })
}

export function solicitarLinkSenha(email: string) {
  return api('/auth/recuperar-senha/', { method: 'POST', body: JSON.stringify({ email }) }, false)
}

export function redefinirSenha(payload: SolicitacaoRedefinicao) {
  return api('/auth/redefinir-senha/', { method: 'POST', body: JSON.stringify(payload) }, false)
}

export function consultarPerfilDoAluno(alunoId: number) {
  return api<DadosCadastraisApi>(`/contas/alunos/${alunoId}/`)
}

export function registrarLesaoDoAluno(alunoId: number, descricao: string, signal: AbortSignal) {
  return api<{ id: number; descricao: string; criado_em: string }>(`/contas/alunos/${alunoId}/lesoes/`, {
    method: 'POST',
    body: JSON.stringify({ descricao }),
    signal,
  })
}

interface CarteiraDeAlunosApi {
  alunos: Pick<DadosCadastraisApi, 'id' | 'first_name' | 'last_name' | 'apelido'>[]
  codigo_convite: string | null
}

export function listarAlunosAcompanhados(signal: AbortSignal) {
  return api<CarteiraDeAlunosApi>('/alunos-acompanhados/', { signal })
}
