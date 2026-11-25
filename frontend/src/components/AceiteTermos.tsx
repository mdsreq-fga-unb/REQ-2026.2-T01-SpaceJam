import type { DocumentosTermos } from '../features/termos/useTermosVigentes'

export function AceiteTermos({ documentos, carregando, aceito, alterar, desabilitado = false, erro }: {
  documentos: DocumentosTermos | null; carregando: boolean
  aceito: boolean; alterar: (valor: boolean) => void; desabilitado?: boolean; erro?: string
}) {
  return <div className="aceite-termos">
    {carregando
      ? <p role="status">Carregando os Termos de Uso e a Política de Privacidade…</p>
      : documentos
        ? <p><a href={documentos.termos} target="_blank" rel="noopener noreferrer">Termos de Uso</a> e <a href={documentos.privacidade} target="_blank" rel="noopener noreferrer">Política de Privacidade</a> · Versão {documentos.versao}</p>
        : <p role="status">Os Termos de Uso e a Política de Privacidade ainda não estão disponíveis para consulta. Tente novamente mais tarde.</p>}
    <label><input id="aceite-termos" type="checkbox" checked={aceito}
      onChange={evento => alterar(evento.target.checked)} disabled={desabilitado || !documentos}
      aria-invalid={erro ? true : undefined} aria-describedby={erro ? 'erro-termos' : undefined} />
      Li e aceito os Termos de Uso e a Política de Privacidade.</label>
    {erro && <p className="erro-campo" id="erro-termos">{erro}</p>}
  </div>
}
