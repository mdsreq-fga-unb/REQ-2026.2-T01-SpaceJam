import { useNavigate } from 'react-router'
import { CascaTermos } from './CascaTermos'

/**
 * US63 — Estrutura provisória dos documentos legais. O texto oficial será fornecido
 * pela equipe; até lá, a página não apresenta nenhuma cláusula como se fosse vigente.
 */
export function DocumentoProvisorioPage({ titulo }: { titulo: string }) {
  const navegar = useNavigate()

  function voltar() {
    // Aberta pelo link do aceite (nova aba), a página só tem a si mesma no histórico.
    if (window.history.length > 1) {
      navegar(-1)
      return
    }
    window.close()
    navegar('/login', { replace: true })
  }

  return <CascaTermos titulo={titulo} subtitulo="Documento da plataforma Space Jam.">
    <section className="termos-v2__cartao termos-v2__cartao--alerta" role="note">
      <h2>Rascunho provisório</h2>
      <p>Este documento aguarda a publicação oficial pela equipe responsável. O conteúdo definitivo será exibido aqui assim que for publicado.</p>
    </section>
    <button type="button" className="termos-v2__acao termos-v2__acao--primaria" onClick={voltar}>Voltar</button>
  </CascaTermos>
}
