const TOKEN_KEY = 'access_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  dados: unknown
  constructor(status: number, message: string, dados: unknown = null) {
    super(message)
    this.status = status
    this.dados = dados
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const token = tokenStorage.get()
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const resp = await fetch(`/api${path}`, { ...options, headers })
  if (!resp.ok) {
    const corpo = await resp.json().catch(() => ({}))
    throw new ApiError(resp.status, corpo.detail ?? `Erro ${resp.status}`, corpo)
  }
  return resp.status === 204 ? (undefined as T) : resp.json()
}
