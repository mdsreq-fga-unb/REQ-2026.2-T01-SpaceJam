import type { ReactNode, Ref } from 'react'
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
  links?: Partial<Record<'Alunos' | 'Biblioteca' | 'Conta' | 'Treinos' | 'Histórico' | 'Feedbacks', string>>
  children: ReactNode
}

export function TreinoLayout({ usuario, links, children }: TreinoLayoutProps) {
  const treinador = usuario.papel === 'TREINADOR'
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
          if (secao === 'Treinos') return destino
            ? <a key={secao} href={destino} aria-current="location">{secao}</a>
            : <span key={secao} aria-current="page">{secao}</span>
          return destino
            ? <a key={secao} href={destino}>{secao}</a>
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
