import type { ReactNode } from 'react'
import { Link } from 'react-router'
import type { Usuario } from '../../types/usuario'
import './MinhaContaAluno.css'

type LayoutAlunoProps = {
  usuario: Usuario
  secao: 'Treinos' | 'Conta'
  children: ReactNode
}

export function LayoutAluno({ usuario, secao, children }: LayoutAlunoProps) {
  const nome = [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido
  const nomeCurto = usuario.first_name || usuario.apelido

  return (
    <div className="conta-aluno">
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span className="conta-aluno__nome-marca">SPACE JAM</span>
        </div>

        <nav className="conta-aluno__navegacao" aria-label="Seções do sistema">
          <Link to="/treinos" aria-current={secao === 'Treinos' ? 'page' : undefined}>Treinos</Link>
          <span>Histórico</span>
          <span>Feedbacks</span>
          <Link to="/" aria-current={secao === 'Conta' ? 'page' : undefined}>Conta</Link>
        </nav>

        <div className="conta-aluno__usuario">
          <span className="conta-aluno__nome-curto">{nomeCurto}</span>
          <div className="conta-aluno__perfil-desktop">
            <strong>{nome}</strong>
            <span>Aluno</span>
          </div>
        </div>
      </header>

      <main className="conta-aluno__conteudo">{children}</main>
    </div>
  )
}
