
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import './TreinadorNovoPlanejamento.css'

interface TreinadorNovoPlanejamentoProps {
  nomeTreinador?: string
  modoTeste?: boolean
}

const alunos = ['Beatriz Costa', 'André Lima', 'Camila Martins']

export function TreinadorNovoPlanejamento({
  nomeTreinador = 'Lucas',
  modoTeste = false,
}: TreinadorNovoPlanejamentoProps) {
  const navigate = useNavigate()

  const [alunoSelecionado, setAlunoSelecionado] = useState('Beatriz Costa')
  const [nomePlanejamento, setNomePlanejamento] = useState('Controle de bola')
  const [mensagem, setMensagem] = useState('')

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nome = nomePlanejamento.trim()

    if (!nome) {
      setMensagem('Informe um nome para o planejamento.')
      return
    }

    const parametros = new URLSearchParams({
      titulo: nome,
      aluno: alunoSelecionado,
    })

    const destino = modoTeste
      ? `/teste/treinador/planejamento?${parametros.toString()}`
      : `/treinador/planejamento?${parametros.toString()}`

    navigate(destino)
  }

  return (
    <div className="sj-novo">
      <a className="sj-novo__pular" href="#sj-novo-conteudo">
        Pular para o conteúdo principal
      </a>

      <aside className="sj-novo__lateral">
        <div className="sj-novo__marca">
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

        <nav className="sj-novo__menu" aria-label="Menu do treinador">
          <Link to="/treinador/alunos">Alunos</Link>

          <Link to="/treinador/planejamentos" className="ativo">
            Treinos
          </Link>

          <Link to="/exercicios">Biblioteca</Link>
          <Link to="/">Conta</Link>
        </nav>

        <div className="sj-novo__usuario">
          <strong>{nomeTreinador}</strong>
          <span>Treinador</span>
        </div>
      </aside>

      <div className="sj-novo__area">
        <header className="sj-novo__cabecalho-mobile">
          <div className="sj-novo__marca">
            <img
              src="/space-jam-logo-v2-mobile.png"
              alt=""
              width="36"
              height="38"
            />
            <span>SPACE JAM</span>
          </div>

          <span>{nomeTreinador}</span>
        </header>

        <main
          className="sj-novo__conteudo"
          id="sj-novo-conteudo"
          tabIndex={-1}
        >
          <div className="sj-novo__introducao">
            <h1>Novo planejamento</h1>
            <p>Organize os treinos de um aluno.</p>
          </div>

          {modoTeste && (
            <p className="sj-novo__aviso">
              Prévia visual com dados fictícios.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="sj-novo__campos">
              <fieldset className="sj-novo__alunos">
                <legend>Aluno *</legend>

                <div className="sj-novo__opcoes">
                  {alunos.map((aluno) => (
                    <button
                      key={aluno}
                      type="button"
                      className={
                        alunoSelecionado === aluno
                          ? 'sj-novo__opcao selecionada'
                          : 'sj-novo__opcao'
                      }
                      onClick={() => {
                        setAlunoSelecionado(aluno)
                        setMensagem('')
                      }}
                      aria-pressed={alunoSelecionado === aluno}
                    >
                      {alunoSelecionado === aluno && (
                        <span aria-hidden="true">✓ </span>
                      )}
                      {aluno}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="sj-novo__campo">
                <label htmlFor="nome-planejamento">
                  Nome do planejamento *
                </label>

                <input
                  id="nome-planejamento"
                  type="text"
                  value={nomePlanejamento}
                  onChange={(event) => {
                    setNomePlanejamento(event.target.value)
                    setMensagem('')
                  }}
                  placeholder="Ex.: Controle de bola"
                  required
                />
              </div>
            </div>

            <div className="sj-novo__informacoes">
              <section className="sj-novo__card">
                <h2>Depois de criar</h2>
                <p>
                  Adicione os treinos e selecione os exercícios da biblioteca.
                </p>
              </section>
            </div>

            <div className="sj-novo__acoes">
              <button className="sj-novo__criar" type="submit">
                Criar planejamento
              </button>

              <Link
                className="sj-novo__cancelar"
                to="/treinador/planejamentos"
              >
                Cancelar
              </Link>
            </div>

            {mensagem && (
              <p className="sj-novo__mensagem" role="status">
                {mensagem}
              </p>
            )}
          </form>
        </main>
      </div>

      <nav
        className="sj-novo__navegacao-mobile"
        aria-label="Seções do treinador"
      >
        <Link to="/treinador/alunos">Alunos</Link>

        <Link to="/treinador/planejamentos" className="ativo">
          Treinos
        </Link>

        <Link to="/exercicios">Biblioteca</Link>
        <Link to="/">Conta</Link>
      </nav>
    </div>
  )
}
