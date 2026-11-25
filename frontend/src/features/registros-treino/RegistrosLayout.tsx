import { useEffect, useId, useRef, type ReactNode } from 'react'
import type { Usuario } from '../../types/usuario'
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '../alunos/MinhaContaAluno.css'
import './Registros.css'

export type UsuarioRegistros = Pick<Usuario, 'id' | 'papel'> &
  Partial<Pick<Usuario, 'first_name' | 'last_name' | 'apelido'>>

type Secao = 'Alunos' | 'Treinos' | 'Histórico' | 'Feedbacks' | 'Biblioteca' | 'Conta'
export type LinksRegistros = Partial<Record<Secao, string>>

const secoes = {
  ALUNO: ['Treinos', 'Histórico', 'Feedbacks', 'Conta'],
  TREINADOR: ['Alunos', 'Treinos', 'Biblioteca', 'Conta'],
} as const

interface RegistrosLayoutProps {
  usuario?: UsuarioRegistros
  ativo?: Secao
  links?: LinksRegistros
  titulo: string
  detalhe?: string
  estreito?: boolean
  children: ReactNode
}

export function RegistrosLayout({
  usuario, titulo, detalhe, children, links, ativo = 'Treinos', estreito = false,
}: RegistrosLayoutProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  const conteudo = useId()
  const perfil = usuario?.papel === 'TREINADOR' ? 'Treinador' : 'Aluno'
  const nome = [usuario?.first_name, usuario?.last_name].filter(Boolean).join(' ') || usuario?.apelido || perfil

  useEffect(() => {
    heading.current?.focus()
  }, [titulo])

  return (
    <div className={['conta-aluno', 'registros-layout', !usuario && 'registros-layout--visitante'].filter(Boolean).join(' ')}>
      <a className="registros-pular" href={'#' + conteudo}>Pular para o conteúdo principal</a>
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span className="conta-aluno__nome-marca">SPACE JAM</span>
        </div>
        {usuario && (
          <>
            <nav className="conta-aluno__navegacao" aria-label={'Seções · ' + perfil}>
              {secoes[usuario.papel].map(secao => {
                if (secao === ativo) return <span key={secao} aria-current="page">{secao}</span>
                const destino = links?.[secao]
                return destino
                  ? <a key={secao} href={destino}>{secao}</a>
                  : <span key={secao} aria-disabled="true">{secao}</span>
              })}
            </nav>
            <div className="conta-aluno__usuario">
              <span className="conta-aluno__nome-curto">{usuario.first_name || usuario.apelido || perfil}</span>
              <div className="conta-aluno__perfil-desktop"><strong>{nome}</strong><span>{perfil}</span></div>
            </div>
          </>
        )}
      </header>
      <main id={conteudo} className={'conta-aluno__conteudo' + (estreito ? ' registros-conteudo--estreito' : '')}>
        <div className="conta-aluno__titulo">
          <h1 ref={heading} tabIndex={-1}>{titulo}</h1>
          {detalhe && <p>{detalhe}</p>}
        </div>
        {children}
      </main>
    </div>
  )
}
