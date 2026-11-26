import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { EditarDadosAluno } from './EditarDadosAluno'
import { editarMeusDados } from '../../api/integracaoUs'
import type { AtualizacaoPerfilAluno } from './validacaoPerfilAluno'

export function EditarDadosAlunoPage() {
  const { usuario, recarregarUsuario } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  async function salvar(dados: AtualizacaoPerfilAluno) {
    await editarMeusDados(dados)
    // O backend confirmou o PATCH; a falha no refresh não invalida o salvamento.
    if (recarregarUsuario) await recarregarUsuario().catch(() => undefined)
  }
  return <EditarDadosAluno usuario={usuario} onCancelar={() => navegar('/')} onSalvar={salvar} />
}
