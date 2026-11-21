import { useSearchParams } from 'react-router'
import { SolicitarRecuperacaoSenha } from './SolicitarRecuperacaoSenha'

export function RecuperarSenhaPage() {
  const [parametros] = useSearchParams()
  const voltarPara = parametros.get('perfil') === 'treinador' ? '/login?perfil=treinador' : '/login'

  // A integração deverá injetar um callback autenticado pelo contrato público de recuperação,
  // quando o backend oferecer esse endpoint. Nunca simular envio de e-mail.
  return <SolicitarRecuperacaoSenha voltarPara={voltarPara} />
}
