
import { Link } from 'react-router'
import type { Usuario } from '../../types/usuario'
import './TreinadorPlanejamentos.css'

export interface PlanejamentoAlunoResumo {
  id: number
  nome: string
  descricao: string
  alunoId: string
}

interface TreinadorPlanejamentosProps {
  treinador: Usuario
  planejamentos: readonly PlanejamentoAlunoResumo[]
  estado?: 'carregando' | 'erro' | 'pronto'
}

export function TreinadorPlanejamentos({
  treinador,
  planejamentos,
  estado = 'pronto',
}: TreinadorPlanejamentosProps) {
  const nomeTreinador = treinador.first_name || treinador.apelido

  const marca = (
    <div className="sj-planejamentos__marca">
      <picture>
        <source
          media="(min-width: 900px)"
          srcSet="/space-jam-logo-v2-desktop.png"
        />
        <img
          src="/space-jam-logo-v2-mobile.png"
          alt=""
          width="36"
          height="38"
        />
      </picture>
      <span>SPACE JAM</span>
    </div>
  )

  const rotaNovoPlanejamento = '/treinador/novo-planejamento'

  return (
    <div className="sj-planejamentos">
      <a
        className="sj-planejamentos__pular"
        href="#sj-planejamentos-conteudo"
      >
        Pular para o conteúdo principal
      </a>

      <aside className="sj-planejamentos__lateral">
        {marca}

        <nav
          className="sj-planejamentos__menu"
          aria-label="Menu do treinador"
        >
          <Link to="/treinador/alunos">Alunos</Link>

          <Link
            to="/treinador/planejamentos"
            aria-current="page"
          >
            Treinos
          </Link>

          <Link to="/exercicios">Biblioteca</Link>
          <Link to="/">Conta</Link>
        </nav>

        <div className="sj-planejamentos__usuario">
          <strong>{nomeTreinador}</strong>
          <span>Treinador</span>
        </div>
      </aside>

      <div className="sj-planejamentos__area">
        <header className="sj-planejamentos__cabecalho-mobile">
          {marca}
          <span>{nomeTreinador}</span>
        </header>

        <main
          className="sj-planejamentos__conteudo"
          id="sj-planejamentos-conteudo"
          tabIndex={-1}
        >
          <div className="sj-planejamentos__introducao">
            <h1>Planejamentos</h1>
            <p>Escolha um aluno da sua carteira.</p>
          </div>

          {planejamentos.length > 0 ? (
            <div
              className="sj-planejamentos__lista"
              aria-label="Planejamentos por aluno"
            >
              {planejamentos.map((item) => (
                <Link
                  className="sj-planejamentos__linha"
                  to={'/treinador/alunos/${item.alunoId}/planejamento'}
                  key={item.id}
                >
                  <strong>{item.nome}</strong>

                  <span>{item.descricao}</span>

                  <span className="sj-planejamentos__consultar">
                    Consultar
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <section
              className="sj-planejamentos__estado"
              role="status"
            >
              <h2>
                {estado === 'carregando'
                  ? 'Carregando planejamentos'
                  : estado === 'erro'
                    ? 'Planejamentos indisponíveis'
                    : 'Nenhum aluno na carteira'}
              </h2>
              <p>
                {estado === 'carregando'
                  ? 'Buscando os alunos da sua carteira...'
                  : estado === 'erro'
                    ? 'Não foi possível carregar os planejamentos dos alunos.'
                    : 'Quando um aluno se vincular ao seu código, ele aparecerá aqui.'}
              </p>
            </section>
          )}

          <div className="sj-planejamentos__acoes">
            <Link
              className="sj-planejamentos__botao"
              to={rotaNovoPlanejamento}
            >
              Novo planejamento
            </Link>
          </div>
        </main>
      </div>

      <nav
        className="sj-planejamentos__navegacao-mobile"
        aria-label="Seções do treinador"
      >
        <Link to="/treinador/alunos">Alunos</Link>

        <Link
          to="/treinador/planejamentos"
          aria-current="page"
        >
          Treinos
        </Link>

        <Link to="/exercicios">Biblioteca</Link>
        <Link to="/">Conta</Link>
      </nav>
    </div>
  )
}
