import { useRef, useState } from 'react'
import { RegistrosLayout, type LinksRegistros, type UsuarioRegistros } from '../registros-treino/RegistrosLayout'

interface ExcluirDadosAlunoProps {
  usuario: UsuarioRegistros
  links?: LinksRegistros
  onManter: () => void
  onSolicitar: () => Promise<void>
  onSolicitacaoRegistrada: () => void
}

export function ExcluirDadosAluno({ usuario, links, onManter, onSolicitar, onSolicitacaoRegistrada }: ExcluirDadosAlunoProps) {
  const solicitacaoPendente = useRef(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(false)

  async function confirmar() {
    if (solicitacaoPendente.current || usuario.papel !== 'ALUNO') return
    solicitacaoPendente.current = true
    setEnviando(true)
    setErro(false)

    try {
      await onSolicitar()
    } catch {
      solicitacaoPendente.current = false
      setEnviando(false)
      setErro(true)
      return
    }

    onSolicitacaoRegistrada()
  }

  return (
    <RegistrosLayout usuario={usuario} links={links} ativo="Conta" titulo="Excluir meus dados"
      detalhe={usuario.papel === 'ALUNO' ? 'Leia antes de confirmar.' : undefined}>
      {usuario.papel === 'ALUNO' ? (
        <div className="registros-grade registros-grade--exclusao" aria-busy={enviando}>
          <section className="conta-aluno__cartao registros-cartao registros-aviso">
            <h2>Esta ação é irreversível</h2>
            <p>Sua conta deixará de funcionar e os vídeos serão removidos. Os demais dados serão removidos ou
              anonimizados conforme a política de privacidade.</p>
          </section>
          <section className="conta-aluno__cartao registros-cartao">
            <h2>Confirme sua decisão</h2>
            <p>Esta solicitação se refere à sua própria conta. Você perderá o acesso aos seus treinos e feedbacks.</p>
          </section>
          <div className="registros-acoes">
            {erro && <p className="registros-erro" role="alert">Não foi possível enviar a solicitação. Tente novamente.</p>}
            <button className="registros-botao registros-botao--principal" type="button" onClick={confirmar}
              disabled={enviando}>{enviando ? 'Enviando solicitação…' : 'Confirmar exclusão dos meus dados'}</button>
            <button className="registros-botao" type="button" onClick={onManter} disabled={enviando}>Manter minha conta</button>
          </div>
        </div>
      ) : (
        <div className="registros-pilha">
          <p role="alert">Esta solicitação está disponível na conta do aluno.</p>
          <button className="registros-botao" type="button" onClick={onManter}>Voltar à conta</button>
        </div>
      )}
    </RegistrosLayout>
  )
}

export function SolicitacaoExclusaoRegistrada({ onVoltarLogin, simulacao = false }: {
  onVoltarLogin: () => void
  simulacao?: boolean
}) {
  return (
    <RegistrosLayout titulo="Solicitação registrada" detalhe="A exclusão dos seus dados está em processamento." estreito>
      <div className="registros-pilha">
        <section className="conta-aluno__cartao registros-cartao">
          <h2>{simulacao ? 'Esta é uma simulação.' : 'Sua sessão foi encerrada'}</h2>
          <p>{simulacao
            ? 'Nenhuma conta, mídia ou sessão real foi alterada.'
            : 'O acesso aos dados deve permanecer bloqueado durante o processamento. A conclusão depende do serviço de exclusão.'}</p>
        </section>
        <button className="registros-botao registros-botao--principal" type="button" onClick={onVoltarLogin}>
          {simulacao ? 'Voltar à prévia' : 'Voltar ao login'}
        </button>
      </div>
    </RegistrosLayout>
  )
}
