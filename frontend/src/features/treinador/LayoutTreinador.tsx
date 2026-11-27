import { useId, type ReactNode } from 'react'
import { Link } from 'react-router'
import './AlunosAcompanhados.css'
import './LayoutTreinador.css'

const secoes = [
  { titulo: 'Alunos', rota: '/treinador/alunos' },
  { titulo: 'Treinos', rota: '/treinador/planejamentos' },
  { titulo: 'Biblioteca', rota: '/exercicios' },
  { titulo: 'Conta', rota: '/' },
] as const

type Secao = (typeof secoes)[number]['titulo']

export function LayoutTreinador({ nome, secao, children }: {
  nome: string
  secao: Secao
  children: ReactNode
}) {
  const conteudo = useId()
  const marca = (
    <div className="sj52__marca">
      <picture className="sj52__marca-imagem">
        <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
        <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="39" />
      </picture>
      <span>SPACE JAM</span>
    </div>
  )
  return (
    <div className="sj52 treinador-v2">
      <a className="sj52__pular-conteudo" href={'#' + conteudo}>Pular para o conteúdo principal</a>
      <aside className="sj52__lateral">
        {marca}
        <nav className="sj52__menu" aria-label="Menu do treinador">
          {secoes.map(({ titulo, rota }) => titulo === secao
            ? <span key={titulo} aria-current="page">{titulo}</span>
            : rota
              ? <Link key={titulo} to={rota}>{titulo}</Link>
              : <span key={titulo} aria-disabled="true">{titulo}</span>)}
        </nav>
        <div className="sj52__usuario-lateral"><strong>{nome}</strong><span>Treinador</span></div>
      </aside>
      <div className="sj52__area">
        <header className="sj52__cabecalho-mobile">{marca}<span>{nome}</span></header>
        <main className="sj52__conteudo" id={conteudo} tabIndex={-1}>{children}</main>
      </div>
    </div>
  )
}
