/**
 * US63 (CA04) / RNF16 — Consentimento de cookies opcionais, guardado só neste navegador.
 * O registro da escolha é necessário para respeitá-la; ele próprio não é um cookie.
 * Sem registro, vale "não permitir" (opt-in explícito).
 */
export const CHAVE_PREFERENCIAS_PRIVACIDADE = 'preferencias_privacidade'

export interface PreferenciasPrivacidade {
  cookiesOpcionais: boolean
  atualizadoEm: string
}

export function lerPreferenciasPrivacidade(): PreferenciasPrivacidade | null {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(CHAVE_PREFERENCIAS_PRIVACIDADE) ?? 'null')
    if (salvo && typeof salvo === 'object' && typeof (salvo as PreferenciasPrivacidade).cookiesOpcionais === 'boolean') {
      return salvo as PreferenciasPrivacidade
    }
  } catch {
    // Registro corrompido: volta ao padrão seguro (não permitir).
  }
  return null
}

export function salvarPreferenciasPrivacidade(cookiesOpcionais: boolean): PreferenciasPrivacidade {
  const preferencias = { cookiesOpcionais, atualizadoEm: new Date().toISOString() }
  localStorage.setItem(CHAVE_PREFERENCIAS_PRIVACIDADE, JSON.stringify(preferencias))
  return preferencias
}
