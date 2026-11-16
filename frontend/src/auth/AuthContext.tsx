import { useEffect, useRef, useState, type ReactNode } from 'react'
import { api, TOKEN_KEY, tokenStorage } from '../api/client'
import type { Usuario } from '../types/usuario'
import { AuthContext } from './contexto'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  // Só há o que carregar se já existe um token salvo de um login anterior.
  const [carregando, setCarregando] = useState(() => tokenStorage.get() !== null)
  const versaoSessao = useRef(0)

  // Ao abrir a página, se já existe token, busca quem é o usuário.
  useEffect(() => {
    function carregarSessao() {
      const versao = ++versaoSessao.current
      setUsuario(null)
      const temToken = tokenStorage.get() !== null
      setCarregando(temToken)
      if (!temToken) return
      api<Usuario>('/auth/me/')
        .then(perfil => {
          if (versao === versaoSessao.current) setUsuario(perfil)
        })
        .catch(() => {
          if (versao === versaoSessao.current) tokenStorage.clear()
        })
        .finally(() => {
          if (versao === versaoSessao.current) setCarregando(false)
        })
    }

    function sincronizarSessao(evento: StorageEvent) {
      if (evento.storageArea === localStorage && (evento.key === TOKEN_KEY || evento.key === null)) {
        carregarSessao()
      }
    }

    carregarSessao()
    window.addEventListener('storage', sincronizarSessao)
    return () => {
      ++versaoSessao.current
      window.removeEventListener('storage', sincronizarSessao)
    }
  }, [])

  async function login(apelido: string, senha: string) {
    const versao = ++versaoSessao.current
    const { access } = await api<{ access: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username: apelido, password: senha }),
    })
    if (versao !== versaoSessao.current) return
    tokenStorage.set(access)
    try {
      const perfil = await api<Usuario>('/auth/me/')
      if (versao === versaoSessao.current) setUsuario(perfil)
    } catch (erro) {
      if (versao === versaoSessao.current) {
        tokenStorage.clear()
        setUsuario(null)
      }
      throw erro
    } finally {
      if (versao === versaoSessao.current) setCarregando(false)
    }
  }

  // RF1103 — deslogar
  function logout() {
    ++versaoSessao.current
    tokenStorage.clear()
    setUsuario(null)
    setCarregando(false)
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
