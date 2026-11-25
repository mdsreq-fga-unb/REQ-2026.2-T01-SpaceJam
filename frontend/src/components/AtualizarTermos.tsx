import { useState, type FormEvent } from 'react'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { CascaTermos } from '../features/termos/CascaTermos'
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

  const subtitulo = documentos
    ? `O aceite da versão vigente (${documentos.versao}) é necessário para continuar.`
    : 'O aceite da versão vigente é necessário para continuar.'

  if (!carregando && !documentos) {
    return <CascaTermos titulo="Termos e privacidade" subtitulo={subtitulo}>
      {erro && <p role="alert" className="termos-v2__erro">{erro}</p>}
      <section className="termos-v2__cartao termos-v2__cartao--alerta" role="status">
        <h2>Não foi possível carregar os documentos</h2>
        <p>Os termos de uso e a política de privacidade precisam estar disponíveis antes do aceite.</p>
      </section>
      <section className="termos-v2__cartao">
        <h2>Acesso bloqueado</h2>
        <p>Nenhuma funcionalidade deve ser liberada até a leitura e o aceite explícito dos documentos vigentes.</p>
      </section>
      <button className="termos-v2__acao termos-v2__acao--primaria" type="button" onClick={logout}>Voltar ao login</button>
    </CascaTermos>
  }

  return <CascaTermos titulo="Termos e privacidade" subtitulo={subtitulo}>
    <form className="termos-v2__acoes" onSubmit={enviar} aria-busy={enviando}>
      <div className="termos-v2__cartao">
        <AceiteTermos documentos={documentos} carregando={carregando} aceito={aceito} alterar={setAceito} desabilitado={enviando} />
      </div>
      {erro && <p role="alert" className="termos-v2__erro">{erro}</p>}
      <button className="termos-v2__acao termos-v2__acao--primaria" disabled={!aceito || enviando || !documentos} type="submit">{enviando ? 'Registrando…' : 'Aceitar e continuar'}</button>
      <button className="termos-v2__acao termos-v2__acao--secundaria" type="button" onClick={logout} disabled={enviando}>Sair da conta</button>
    </form>
  </CascaTermos>
}
