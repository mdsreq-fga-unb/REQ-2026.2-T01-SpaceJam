import { useId, useRef, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import { RegistrosLayout, type LinksRegistros, type UsuarioRegistros } from '../registros-treino/RegistrosLayout'

interface ExcluirDadosAlunoProps {
  usuario: UsuarioRegistros
  links?: LinksRegistros
  onManter: () => void
  pedirSenha?: boolean
  onSolicitar: (senha: string) => Promise<void>
  onSolicitacaoRegistrada: () => void
}

export function ExcluirDadosAluno({ usuario, links, pedirSenha = false, onManter, onSolicitar, onSolicitacaoRegistrada }: ExcluirDadosAlunoProps) {
  const solicitacaoPendente = useRef(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [senha, setSenha] = useState('')
  const idSenha = useId()

  async function confirmar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (solicitacaoPendente.current || usuario.papel !== 'ALUNO' || (pedirSenha && !senha)) return
    solicitacaoPendente.current = true
    setEnviando(true)
    setErro('')

    try {
      await onSolicitar(senha)
    } catch (falha) {
      solicitacaoPendente.current = false
      setEnviando(false)
      setErro(falha instanceof ApiError && falha.status === 400
        ? falha.campos.senha_atual?.[0] || falha.campos.confirmacao?.[0] || 'Confira a confirmação e tente novamente.'
        : 'Não foi possível enviar a solicitação. Tente novamente.')
      return
    }

    onSolicitacaoRegistrada()
  }

  return (
    <RegistrosLayout usuario={usuario} links={links} ativo="Conta" titulo="Excluir meus dados"
      detalhe={usuario.papel === 'ALUNO' ? 'Leia antes de confirmar.' : undefined}>
      {usuario.papel === 'ALUNO' ? (
        <form className="registros-grade registros-grade--exclusao" aria-busy={enviando} onSubmit={confirmar}>
          <section className="conta-aluno__cartao registros-cartao registros-aviso">
            <h2>Esta ação é irreversível</h2>
            <p>Sua conta deixará de funcionar. Seus dados serão tratados conforme a política de privacidade.</p>
          </section>
          <section className="conta-aluno__cartao registros-cartao">
            <h2>Confirme sua decisão</h2>
            <p>Esta solicitação se refere à sua própria conta. Você perderá o acesso aos seus treinos e feedbacks.</p>
            {pedirSenha && (
              <label className="registros-pilha registros-senha" htmlFor={idSenha}>
                Senha atual
                <input id={idSenha} type="password" autoComplete="current-password" required value={senha}
                  disabled={enviando} onChange={evento => { setSenha(evento.target.value); setErro('') }} />
              </label>
            )}
          </section>
          <div className="registros-acoes">
            {erro && <p className="registros-erro" role="alert">{erro}</p>}
            <button className="registros-botao registros-botao--principal" type="submit"
              disabled={enviando || (pedirSenha && !senha)}>{enviando ? 'Enviando solicitação…' : 'Confirmar exclusão dos meus dados'}</button>
            <button className="registros-botao" type="button" onClick={onManter} disabled={enviando}>Manter minha conta</button>
          </div>
        </form>
      ) : (
        <div className="registros-pilha">
          <p role="alert">Esta solicitação está disponível na conta do aluno.</p>
          <button className="registros-botao" type="button" onClick={onManter}>Voltar à conta</button>
        </div>
      )}
    </RegistrosLayout>
  )
}

export function SolicitacaoExclusaoRegistrada({ onVoltarLogin, simulacao = false, protocolo }: {
  onVoltarLogin: () => void
  simulacao?: boolean
  protocolo?: string
}) {
  return (
    <RegistrosLayout titulo="Solicitação registrada" detalhe={protocolo ? "Sua conta foi excluída." : "A exclusão dos seus dados está em processamento."} estreito>
      <div className="registros-pilha">
        <section className="conta-aluno__cartao registros-cartao">
          <h2>{simulacao ? 'Esta é uma simulação.' : 'Sua sessão foi encerrada'}</h2>
          <p>{simulacao
            ? 'Nenhuma conta, mídia ou sessão real foi alterada.'
            : protocolo
              ? 'As credenciais dessa conta não podem mais ser usadas para entrar.'
              : 'O acesso aos dados deve permanecer bloqueado durante o processamento.'}</p>
          {protocolo && <p>Protocolo: <strong>{protocolo}</strong></p>}
        </section>
        <button className="registros-botao registros-botao--principal" type="button" onClick={onVoltarLogin}>
          {simulacao ? 'Voltar à prévia' : 'Voltar ao login'}
        </button>
      </div>
    </RegistrosLayout>
  )
}
