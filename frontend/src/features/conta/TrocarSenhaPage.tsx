import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { TrocarSenha } from './TrocarSenha'

export function TrocarSenhaPage() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  // RF1108: endpoint autenticado de troca de senha ainda não existe no backend.
  // Não conectar callbacks fictícios, nem informar sucesso antes de resposta real.
  return <TrocarSenha usuario={usuario} onVoltar={() => navegar('/')} />
}
