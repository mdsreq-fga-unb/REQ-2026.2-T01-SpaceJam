import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import type { Papel } from '../types/usuario'
import { useAuth } from './useAuth'

/**
 * Bloqueia a rota para quem não está logado e, opcionalmente, para quem
 * não tem o papel exigido (CP7). Exemplo:
 *   <RotaProtegida papel="TREINADOR"><MeusAlunos /></RotaProtegida>
 *
 * Atenção: isso só esconde a tela. A proteção de verdade (CP8) é no backend.
 */
export function RotaProtegida({ children, papel }: { children: ReactNode; papel?: Papel }) {
  const { usuario, carregando } = useAuth()
  if (carregando) return <p>Carregando…</p>
  if (!usuario) return <Navigate to="/login" replace />
  if (papel && usuario.papel !== papel) return <Navigate to="/" replace />
  return children
}
