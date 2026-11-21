import type { ReactNode } from 'react'
import { Link } from 'react-router'
import '../../pages/LoginPage.css'
import './RecuperacaoSenha.css'

interface Props {
  titulo: string
  descricao: string
  voltarPara?: string
  children: ReactNode
}

export function RecuperacaoSenhaLayout({ titulo, descricao, voltarPara = '/login', children }: Props) {
  return (
    <div className="login-v2 recuperacao-senha">
      <a className="recuperacao-senha__pular" href="#conteudo-recuperacao">Pular para o conteúdo principal</a>
      <aside className="login-v2__identidade" aria-label="Identidade Space Jam">
        <picture className="login-v2__logo-desktop">
          <img src="/space-jam-logo-login-desktop.png" alt="" width="96" height="102" />
        </picture>
        <span className="login-v2__nome-marca">SPACE JAM</span>
        <div className="login-v2__respiro" aria-hidden="true" />
        <p className="login-v2__apresentacao"><span>Seu espaço</span><span>de treino.</span></p>
        <p className="login-v2__descricao">Planejamento, execução e feedback para acompanhar cada treino.</p>
        <div className="login-v2__respiro login-v2__respiro--inferior" aria-hidden="true" />
        <p className="login-v2__rodape">Basquete · Treino · Evolução</p>
      </aside>

      <main className="login-v2__painel" id="conteudo-recuperacao" tabIndex={-1}>
        <header className="login-v2__cabecalho">
          <picture className="login-v2__logo-mobile">
            <img src="/space-jam-logo-login-mobile.png" alt="" width="38" height="40" />
          </picture>
          <span className="login-v2__nome-marca">SPACE JAM</span>
        </header>
        <section className="recuperacao-senha__conteudo" aria-labelledby="titulo-recuperacao">
          <div className="login-v2__introducao">
            <h1 className="login-v2__titulo" id="titulo-recuperacao">{titulo}</h1>
            <p className="login-v2__subtitulo">{descricao}</p>
          </div>
          {children}
          <Link to={voltarPara} className="recuperacao-senha__voltar">Voltar ao login</Link>
        </section>
      </main>
    </div>
  )
}
