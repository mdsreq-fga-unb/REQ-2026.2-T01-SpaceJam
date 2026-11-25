import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { PreferenciasPrivacidade } from './PreferenciasPrivacidade'

export function PreferenciasPrivacidadePage() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  return <PreferenciasPrivacidade usuario={usuario} onVoltar={() => navegar('/')} />
}
