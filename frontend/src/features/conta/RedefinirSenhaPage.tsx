import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router'
import { RedefinirSenha } from './RedefinirSenha'
import { redefinirSenha } from '../../api/integracaoUs'

interface EstadoRecuperacao {
  tokenRecuperacao?: unknown
}

export function RedefinirSenhaPage() {
  const localizacao = useLocation()
  const [parametros, setParametros] = useSearchParams()
  const tokenDaUrl = parametros.get('token')?.trim() ?? ''
  const estado = localizacao.state as EstadoRecuperacao | null
  const tokenDoHistorico =
    typeof estado?.tokenRecuperacao === 'string' ? estado.tokenRecuperacao : ''
  const token = tokenDaUrl || tokenDoHistorico

  // Guarda o token no estado privado da entrada de histórico ao limpar a URL.
  // Assim, o F5 não interrompe a recuperação nos navegadores que preservam history.state.
  // Não usar localStorage, sessionStorage nem inserir o token em mensagens ou logs.
  useEffect(() => {
    if (!parametros.has('token')) return
    const limpos = new URLSearchParams(parametros)
    limpos.delete('token')
    setParametros(limpos, {
      replace: true,
      state: { tokenRecuperacao: tokenDaUrl },
    })
  }, [parametros, setParametros, tokenDaUrl])

  return <RedefinirSenha token={token} onRedefinir={async dados => {
    await redefinirSenha(dados)
  }} />
}
