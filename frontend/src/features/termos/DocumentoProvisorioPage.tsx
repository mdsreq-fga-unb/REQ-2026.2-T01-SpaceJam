import { useNavigate } from 'react-router'
import { Marca } from '../../components/Marca'

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

  return <main className="acesso"><article className="cartao-login documento-provisorio" aria-labelledby="titulo-documento">
    <Marca />
    <h1 id="titulo-documento">{titulo}</h1>
    <p className="aviso-cadastro" role="note">
      <strong>Rascunho provisório.</strong> Este documento aguarda a publicação oficial pela equipe responsável.
      O conteúdo definitivo será exibido aqui assim que for publicado.
    </p>
    <button type="button" className="botao-secundario" onClick={voltar}>Voltar</button>
  </article></main>
}
