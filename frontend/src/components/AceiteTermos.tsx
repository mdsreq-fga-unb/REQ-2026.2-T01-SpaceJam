export function documentosTermos() {
  const termos = import.meta.env.VITE_TERMOS_USO_URL?.trim() ?? ''
  const privacidade = import.meta.env.VITE_POLITICA_PRIVACIDADE_URL?.trim() ?? ''
  const valido = (url: string) => /^(https?:\/\/|\/(?!\/))/.test(url)
  return valido(termos) && valido(privacidade) ? { termos, privacidade } : null
}

export function AceiteTermos({ aceito, alterar, desabilitado = false, erro }: {
  aceito: boolean; alterar: (valor: boolean) => void; desabilitado?: boolean; erro?: string
}) {
  const documentos = documentosTermos()
  return <div className="aceite-termos">
    {documentos
      ? <p><a href={documentos.termos} target="_blank" rel="noopener noreferrer">Termos de Uso</a> e <a href={documentos.privacidade} target="_blank" rel="noopener noreferrer">Política de Privacidade</a></p>
      : <p role="status">Os Termos de Uso e a Política de Privacidade ainda não estão disponíveis para consulta. Tente novamente mais tarde.</p>}
    <label><input id="aceite-termos" type="checkbox" checked={aceito}
      onChange={evento => alterar(evento.target.checked)} disabled={desabilitado || !documentos}
      aria-invalid={erro ? true : undefined} aria-describedby={erro ? 'erro-termos' : undefined} />
      Li e aceito os Termos de Uso e a Política de Privacidade.</label>
    {erro && <p className="erro-campo" id="erro-termos">{erro}</p>}
  </div>
}
