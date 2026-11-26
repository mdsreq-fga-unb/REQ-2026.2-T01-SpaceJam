export interface CamposTrocaSenha {
  senha_atual: string
  nova_senha: string
  confirmar_senha: string
}

export type CampoTrocaSenha = keyof CamposTrocaSenha
export type ErrosTrocaSenha = Partial<Record<CampoTrocaSenha, string>>

export interface SolicitarTrocaSenha {
  senha_atual: string
  nova_senha: string
  confirmacao_senha: string
}

/** RN24 e CA01/CA03 da US08: mínimo de 6 caracteres; sem classes obrigatórias. */
export const MINIMO_SENHA = 6

export function criteriosNovaSenha(senha: string) {
  return { comprimento: Array.from(senha).length >= MINIMO_SENHA }
}

export function validarTrocaSenha(dados: CamposTrocaSenha): ErrosTrocaSenha {
  const erros: ErrosTrocaSenha = {}
  if (!dados.senha_atual) erros.senha_atual = 'Informe sua senha atual.'
  if (!dados.nova_senha) {
    erros.nova_senha = 'Informe uma nova senha.'
  } else {
    const requisitos = criteriosNovaSenha(dados.nova_senha)
    if (!requisitos.comprimento) {
      erros.nova_senha = `A nova senha deve ter pelo menos ${MINIMO_SENHA} caracteres.`
    } else if (dados.senha_atual === dados.nova_senha) {
      erros.nova_senha = 'Use uma senha diferente da atual.'
    }
  }
  if (!dados.confirmar_senha) {
    erros.confirmar_senha = 'Confirme a nova senha.'
  } else if (dados.nova_senha !== dados.confirmar_senha) {
    erros.confirmar_senha = 'As senhas não coincidem.'
  }
  return erros
}

export function prepararTrocaSenha(dados: CamposTrocaSenha): SolicitarTrocaSenha {
  // Senhas nunca são normalizadas ou removidas de suas extremidades.
  return { senha_atual: dados.senha_atual, nova_senha: dados.nova_senha, confirmacao_senha: dados.confirmar_senha }
}
