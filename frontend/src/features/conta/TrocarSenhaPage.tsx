import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { AtualizarTermos } from '../../components/AtualizarTermos'
import { TrocarSenha } from './TrocarSenha'

export function TrocarSenhaPage() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  if (usuario.termos_pendentes) return <AtualizarTermos />
  // RF1108: endpoint autenticado de troca de senha ainda não existe no backend.
  // Não conectar callbacks fictícios, nem informar sucesso antes de resposta real.
  return <TrocarSenha usuario={usuario} onVoltar={() => navegar('/')} />
}
