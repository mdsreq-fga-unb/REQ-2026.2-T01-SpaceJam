import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { TrocarSenha } from './TrocarSenha'
import { alterarSenha } from '../../api/integracaoUs'
import type { SolicitarTrocaSenha } from './regrasTrocaSenha'

export function TrocarSenhaPage() {
  const { usuario, limparSessaoLocal } = useAuth()
  const navegar = useNavigate()
  if (!usuario) return null
  async function confirmarTroca(dados: SolicitarTrocaSenha) {
    await alterarSenha(dados)
    // A API já encerrou as sessões anteriores ao alterar a senha.
    limparSessaoLocal?.()
    navegar('/login', { replace: true })
  }
  return <TrocarSenha usuario={usuario} onVoltar={() => navegar('/')} onTrocarSenha={confirmarTroca} />
}
