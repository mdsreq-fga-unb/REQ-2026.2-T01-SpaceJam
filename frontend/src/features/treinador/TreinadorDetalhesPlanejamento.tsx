
import { useSearchParams, Link } from 'react-router'
import { LayoutTreinador } from './LayoutTreinador'
import './TreinadorDetalhesPlanejamento.css'

interface TreinadorDetalhesPlanejamentoProps {
  modoTeste?: boolean
}

export function TreinadorDetalhesPlanejamento({
  modoTeste = false,
}: TreinadorDetalhesPlanejamentoProps) {
  const [searchParams] = useSearchParams()

  const titulo = searchParams.get('titulo') || 'Novo planejamento'
  const aluno = searchParams.get('aluno') || 'Aluno não informado'

  return (
    <LayoutTreinador nome="Lucas" secao="Treinos">
      <main className="detalhes-planejamento">
        <header className="detalhes-planejamento__intro">
          <h1>{titulo}</h1>
          <p>Planejamento de {aluno}</p>
        </header>

        {modoTeste && (
          <p className="detalhes-planejamento__aviso">
            Prévia visual com dados fictícios.
          </p>
        )}

        <section className="detalhes-planejamento__treinos">
          <div className="detalhes-planejamento__coluna">
            <Link
              to="/exercicios"
              className="detalhes-planejamento__consulta"
            >
              <strong>Treino A · {titulo}</strong>
              <span>Feito · 3 exercícios · aguardando avaliação</span>
              <span className="detalhes-planejamento__link">
                Consultar
              </span>
            </Link>
          </div>

          <div className="detalhes-planejamento__coluna">
            <article className="detalhes-planejamento__cartao">
              <strong>Treino B · Arremesso</strong>
              <span>Em andamento · 3 exercícios</span>
            </article>
          </div>
        </section>

        <section
          className="detalhes-planejamento__acoes"
          aria-label="Ações do planejamento"
        >
          <button type="button" className="detalhes-planejamento__botao principal">
            Adicionar treino
          </button>

          <button type="button" className="detalhes-planejamento__botao">
            Editar planejamento
          </button>

          <button type="button" className="detalhes-planejamento__botao">
            Histórico de planejamentos
          </button>

          <button type="button" className="detalhes-planejamento__botao">
            Vincular objetivo
          </button>

          <button type="button" className="detalhes-planejamento__botao">
            Excluir planejamento
          </button>
        </section>
      </main>
    </LayoutTreinador>
  )
}
