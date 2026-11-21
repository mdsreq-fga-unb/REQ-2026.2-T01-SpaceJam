import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { AtualizarTermos } from '../../components/AtualizarTermos'
import { EditarDadosAluno } from './EditarDadosAluno'

export function EditarDadosAlunoPage() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  if (usuario.termos_pendentes) return <AtualizarTermos />
  // US07: ainda não há PATCH/PUT no backend de contas.
  // O callback onSalvar só deve ser conectado após contrato e autorização confirmados.
  return <EditarDadosAluno usuario={usuario} onCancelar={() => navegar('/')} />
}
