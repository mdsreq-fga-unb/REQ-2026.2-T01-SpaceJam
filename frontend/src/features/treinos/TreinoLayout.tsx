import type { ReactNode, Ref } from 'react'
import { Link, useInRouterContext } from 'react-router'
import type { Usuario } from '../../types/usuario'
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow-condensed/latin-700.css'
import './Treino.css'

export type UsuarioTreino = Pick<Usuario, 'id' | 'papel'> &
  Partial<Pick<Usuario, 'first_name' | 'last_name' | 'apelido'>>

interface TreinoLayoutProps {
  usuario: UsuarioTreino
  links?: Partial<Record<'Treinos' | 'Alunos' | 'Biblioteca' | 'Conta' | 'Histórico' | 'Feedbacks', string>>
  secaoAtiva?: 'Treinos' | 'Histórico'
  children: ReactNode
}

export function TreinoLayout({ usuario, links, secaoAtiva = 'Treinos', children }: TreinoLayoutProps) {
  const treinador = usuario.papel === 'TREINADOR'
  const dentroDoRoteador = useInRouterContext()
  const perfil = treinador ? 'Treinador' : 'Aluno'
  const nome = [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido
  const secoes = treinador
    ? ['Alunos', 'Treinos', 'Biblioteca', 'Conta'] as const
    : ['Treinos', 'Histórico', 'Feedbacks', 'Conta'] as const

  return (
    <div className="treino-layout">
      <header className="treino-cabecalho">
        <div className="treino-marca">
          <picture>
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span>SPACE JAM</span>
        </div>
      </header>
      <nav className="treino-navegacao" aria-label={treinador ? 'Seções do treinador' : 'Seções do aluno'}>
        {secoes.map(secao => {
          const destino = links?.[secao]
          const atual = secao === secaoAtiva ? 'location' : undefined
          // Navegação interna pelo roteador: troca a tela sem recarregar o app (nem a sessão).
          // Fora de um roteador (alguns testes renderizam o layout sozinho), cai no <a> comum.
          if (destino) return dentroDoRoteador
            ? <Link key={secao} to={destino} aria-current={atual}>{secao}</Link>
            : <a key={secao} href={destino} aria-current={atual}>{secao}</a>
          return secao === secaoAtiva
            ? <span key={secao} aria-current="page">{secao}</span>
            : <span key={secao} aria-disabled="true">{secao}</span>
        })}
      </nav>
      <div className="treino-usuario">
        <span className="treino-usuario-curto">{usuario.first_name || usuario.apelido || perfil}</span>
        <span className="treino-usuario-nome">{nome || perfil}</span>
        {nome && <small>{perfil}</small>}
      </div>
      <div className="treino-rolagem">
        <main className="treino-detalhe">{children}</main>
      </div>
    </div>
  )
}

export function TituloTreino({ titulo, detalhe, tituloRef }: {
  titulo: string
  detalhe?: ReactNode
  tituloRef?: Ref<HTMLHeadingElement>
}) {
  return (
    <div className="treino-titulo-pagina">
      <h1 ref={tituloRef} tabIndex={tituloRef ? -1 : undefined}>{titulo}</h1>
      {detalhe && <p>{detalhe}</p>}
    </div>
  )
}
