import { useRef, useState, type FormEvent } from 'react'
import { RecuperacaoSenhaLayout } from './RecuperacaoSenhaLayout'
import { normalizarEmail, validarEmailRecuperacao } from './regrasRecuperacaoSenha'

interface Props {
  onSolicitar?: (email: string) => Promise<void>
  voltarPara?: string
}

const MENSAGEM_NEUTRA = 'Se houver uma conta associada a este e-mail, você receberá instruções para redefinir a senha.'

export function SolicitarRecuperacaoSenha({ onSolicitar, voltarPara }: Props) {
  const [email, setEmail] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  const [concluido, setConcluido] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const envioPendente = useRef(false)
  const campoEmail = useRef<HTMLInputElement>(null)

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (envioPendente.current || !onSolicitar) return
    const falha = validarEmailRecuperacao(email)
    setErro(falha)
    setAviso('')
    if (falha) {
      campoEmail.current?.focus()
      return
    }
    envioPendente.current = true
    setEnviando(true)
    try {
      await onSolicitar(normalizarEmail(email))
      // A mesma mensagem deve ser devolvida para e-mails cadastrados ou não cadastrados.
      setConcluido(true)
      setEmail('')
    } catch {
      // Não exponha status ou respostas do servidor que possam revelar a existência da conta.
      setAviso('Não foi possível processar a solicitação agora. Tente novamente mais tarde.')
    } finally {
      envioPendente.current = false
      setEnviando(false)
    }
  }

  return (
    <RecuperacaoSenhaLayout
      titulo="Recuperar senha"
      descricao="Informe seu e-mail para receber as instruções de redefinição de senha."
      voltarPara={voltarPara}
    >
      {concluido ? (
        <p className="recuperacao-senha__resultado" role="status">{MENSAGEM_NEUTRA}</p>
      ) : (
        <form className="recuperacao-senha__formulario" onSubmit={(evento) => { void enviar(evento) }} noValidate aria-busy={enviando}>
          <div className="recuperacao-senha__campo">
            <label htmlFor="recuperacao-email">E-mail</label>
            <input
              ref={campoEmail}
              id="recuperacao-email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              maxLength={254}
              required
              disabled={enviando}
              value={email}
              aria-invalid={Boolean(erro)}
              aria-describedby={erro ? 'recuperacao-email-erro' : undefined}
              onChange={(evento) => {
                setEmail(evento.target.value)
                setErro(null)
                setAviso('')
              }}
              onBlur={() => setErro(validarEmailRecuperacao(email))}
            />
            {erro && <p className="recuperacao-senha__erro" id="recuperacao-email-erro">{erro}</p>}
          </div>
          {aviso && <p className="recuperacao-senha__erro-geral" role="alert">{aviso}</p>}
          <button className="recuperacao-senha__primario" type="submit" disabled={!onSolicitar || enviando}>
            {enviando ? 'Enviando…' : 'Enviar instruções'}
          </button>
        </form>
      )}
    </RecuperacaoSenhaLayout>
  )
}
