import { createContext } from 'react'
import type { Usuario } from '../types/usuario'

export interface AuthState {
  usuario: Usuario | null
  carregando: boolean
  login: (apelido: string, senha: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthState | null>(null)
