import { useEffect, useState, type ReactNode } from 'react'
import { api, tokenStorage } from '../api/client'
import type { Usuario } from '../types/usuario'
import { AuthContext } from './contexto'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  // Só há o que carregar se já existe um token salvo de um login anterior.
  const [carregando, setCarregando] = useState(() => tokenStorage.get() !== null)

  // Ao abrir a página, se já existe token, busca quem é o usuário.
  useEffect(() => {
    if (!tokenStorage.get()) return
    api<Usuario>('/auth/me/')
      .then(setUsuario)
      .catch(() => tokenStorage.clear())
      .finally(() => setCarregando(false))
  }, [])

  async function login(apelido: string, senha: string) {
    const { access } = await api<{ access: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: apelido, password: senha }),
    })
    tokenStorage.set(access)
    setUsuario(await api<Usuario>('/auth/me/'))
  }

  // RF1103 — deslogar
  function logout() {
    tokenStorage.clear()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
