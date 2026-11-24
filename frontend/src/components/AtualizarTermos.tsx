import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { useTermosVigentes } from '../features/termos/useTermosVigentes'
import { AceiteTermos } from './AceiteTermos'

/** US63 (CA02/CA03): renovação obrigatória do aceite da versão vigente. */
export function AtualizarTermos() {
  const { aceitarTermos, logout } = useAuth()
  const { documentos, carregando, recarregar } = useTermosVigentes()
  const [aceito, setAceito] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (enviando || !aceito || !documentos || !aceitarTermos) return
    setEnviando(true); setErro('')
    try { await aceitarTermos(documentos.versao) }
    catch (falha) {
      const codigo = falha instanceof ApiError ? falha.codigo : undefined
      if (codigo === 'TERMOS_VERSAO_DIVERGENTE' || codigo === 'TERMOS_INDISPONIVEIS') {
        setAceito(false)
        recarregar()
      }
      setErro(
        codigo === 'TERMOS_VERSAO_DIVERGENTE'
          ? 'Os termos foram atualizados enquanto você lia. Confira a nova versão e aceite novamente.'
          : codigo === 'TERMOS_INDISPONIVEIS'
            ? 'Os documentos ficaram indisponíveis. Tente novamente mais tarde.'
            : codigo === 'ACEITE_OBRIGATORIO'
              ? 'Marque o aceite dos Termos de Uso e da Política de Privacidade para continuar.'
              : 'Não foi possível registrar o aceite. Tente novamente.',
      )
    }
    finally { setEnviando(false) }
  }

  return <main className="acesso"><section className="cartao-login">
    <h1>Termos de uso</h1>
    <form className="formulario-cadastro" onSubmit={enviar} aria-busy={enviando}>
      <p>{documentos
        ? `Confira os documentos da versão ${documentos.versao} antes de continuar.`
        : 'Confira os documentos vigentes antes de continuar.'}</p>
      <AceiteTermos documentos={documentos} carregando={carregando} aceito={aceito} alterar={setAceito} desabilitado={enviando} />
      {erro && <p role="alert" className="erro">{erro}</p>}
      <button className="botao-secundario" disabled={!aceito || enviando || !documentos} type="submit">{enviando ? 'Registrando…' : 'Aceitar e continuar'}</button>
      <button className="botao-secundario" type="button" onClick={logout} disabled={enviando}>Sair da conta</button>
    </form>
  </section></main>
}
