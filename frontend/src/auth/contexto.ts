import { createContext } from 'react'
import type { Papel, Usuario } from '../types/usuario'

export interface AuthState {
  usuario: Usuario | null
  carregando: boolean
  login: (identificador: string, senha: string, papel?: Papel) => Promise<void>
  logout: () => void | Promise<void>
  aceitarTermos?: (versao: string) => Promise<void>
  avisoSessao?: string
}

export const AuthContext = createContext<AuthState | null>(null)
