import { useState, type FormEvent } from 'react'
import { useAuth } from '../auth/useAuth'
import { AceiteTermos, documentosTermos } from './AceiteTermos'

export function AtualizarTermos() {
  const { aceitarTermos, logout } = useAuth()
  const [aceito, setAceito] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (enviando || !aceito || !documentosTermos() || !aceitarTermos) return
    setEnviando(true); setErro('')
    try { await aceitarTermos() }
    catch { setErro('Não foi possível registrar o aceite. Tente novamente.') }
    finally { setEnviando(false) }
  }
  return <main className="acesso"><section className="cartao-login">
    <h1>Termos de uso</h1>
    <form className="formulario-cadastro" onSubmit={enviar} aria-busy={enviando}>
      <p>Confira os documentos vigentes antes de continuar.</p>
      <AceiteTermos aceito={aceito} alterar={setAceito} desabilitado={enviando} />
      {erro && <p role="alert" className="erro">{erro}</p>}
      <button className="botao-secundario" disabled={!aceito || enviando || !documentosTermos()} type="submit">{enviando ? 'Registrando…' : 'Aceitar e continuar'}</button>
      <button className="botao-secundario" type="button" onClick={logout} disabled={enviando}>Sair da conta</button>
    </form>
  </section></main>
}
