export const TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  set: (token: string, refresh?: string) => {
    if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
    else localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.setItem(TOKEN_KEY, token)
  },
  clear: () => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_KEY)
  },
}

export class ApiError extends Error {
  status: number
  campos: Record<string, string[]>
  constructor(status: number, message: string, campos: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.campos = campos
  }
}

export async function api<T>(path: string, options: RequestInit = {}, autenticada = true): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  const token = autenticada ? tokenStorage.get() : null
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const base = (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/+$/, '')
  const resp = await fetch(`${base}/${path.replace(/^\/+/, '')}`, { ...options, headers })
  if (!resp.ok) {
    const corpo: unknown = await resp.json().catch(() => ({}))
    const campos: Record<string, string[]> = {}
    if (corpo && typeof corpo === 'object') {
      for (const [campo, valor] of Object.entries(corpo)) {
        if (typeof valor === 'string') campos[campo] = [valor]
        else if (Array.isArray(valor)) campos[campo] = valor.filter((item): item is string => typeof item === 'string')
      }
    }
    const mensagem = campos.detail?.join(' ') || campos.non_field_errors?.join(' ') || `Erro ${resp.status}`
    throw new ApiError(resp.status, mensagem, campos)
  }
  return resp.status === 204 ? (undefined as T) : resp.json()
}
