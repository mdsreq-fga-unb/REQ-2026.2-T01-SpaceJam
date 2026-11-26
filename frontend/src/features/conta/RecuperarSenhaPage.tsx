import { useSearchParams } from 'react-router'
import { SolicitarRecuperacaoSenha } from './SolicitarRecuperacaoSenha'
import { solicitarLinkSenha } from '../../api/integracaoUs'

export function RecuperarSenhaPage() {
  const [parametros] = useSearchParams()
  const voltarPara = parametros.get('perfil') === 'treinador' ? '/login?perfil=treinador' : '/login'

  return <SolicitarRecuperacaoSenha voltarPara={voltarPara} onSolicitar={async email => {
    await solicitarLinkSenha(email)
  }} />
}
