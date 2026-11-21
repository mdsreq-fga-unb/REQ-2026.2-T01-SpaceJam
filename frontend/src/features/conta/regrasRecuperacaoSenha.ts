/** Requisitos confirmados: RN24 e CA04 da US10 — no mínimo 6 caracteres. */
export const MINIMO_SENHA_RECUPERACAO = 6

export interface DadosRedefinicao {
  nova_senha: string
  confirmar_senha: string
}

export interface SolicitacaoRedefinicao {
  token: string
  nova_senha: string
}

export type ErrosRedefinicao = Partial<Record<keyof DadosRedefinicao, string>>

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function validarEmailRecuperacao(email: string): string | null {
  const valor = normalizarEmail(email)
  if (!valor) return 'Informe seu e-mail.'
  if (valor.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
    return 'Informe um e-mail válido.'
  }
  return null
}

export function validarRedefinicao(dados: DadosRedefinicao): ErrosRedefinicao {
  const erros: ErrosRedefinicao = {}
  if (Array.from(dados.nova_senha).length < MINIMO_SENHA_RECUPERACAO) {
    erros.nova_senha = `A nova senha deve ter pelo menos ${MINIMO_SENHA_RECUPERACAO} caracteres.`
  }
  if (!dados.confirmar_senha) {
    erros.confirmar_senha = 'Confirme a nova senha.'
  } else if (dados.nova_senha !== dados.confirmar_senha) {
    erros.confirmar_senha = 'As senhas não coincidem.'
  }
  return erros
}

/** Não altera espaços nem faz trim nas senhas. */
export function prepararRedefinicao(token: string, dados: DadosRedefinicao): SolicitacaoRedefinicao {
  return { token, nova_senha: dados.nova_senha }
}
