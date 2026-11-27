import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import {
  criarPlanejamento,
  listarCarteiraPlanejamentos,
  type AlunoDaCarteira,
} from './planejamentosApi'
import './TreinadorNovoPlanejamento.css'

type Alunos =
  | { estado: 'carregando' | 'erro' }
  | { estado: 'pronto'; lista: AlunoDaCarteira[] }

interface Erros {
  aluno?: string
  nome?: string
  geral?: string
}

export function TreinadorNovoPlanejamento() {
  const navigate = useNavigate()
  const { usuario } = useAuth()
  const [parametros] = useSearchParams()
  const nomeTreinador = usuario?.first_name || usuario?.apelido || ''

  const [alunos, setAlunos] = useState<Alunos>({ estado: 'carregando' })
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(
    () => Number(parametros.get('aluno')) || null,
  )
  const [nomePlanejamento, setNomePlanejamento] = useState('')
  const [erros, setErros] = useState<Erros>({})
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle

    listarCarteiraPlanejamentos(signal)
      .then((lista) => {
        if (!signal.aborted) setAlunos({ estado: 'pronto', lista })
      })
      .catch(() => {
        if (!signal.aborted) setAlunos({ estado: 'erro' })
      })

    return () => controle.abort()
  }, [])

  const lista = alunos.estado === 'pronto' ? alunos.lista : []
  const escolhido = lista.find((aluno) => aluno.id === alunoSelecionado)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando) return

    const nome = nomePlanejamento.trim()
    const novos: Erros = {}
    if (!escolhido) novos.aluno = 'Selecione o aluno.'
    if (!nome) novos.nome = 'Informe o nome do planejamento.'
    setErros(novos)
    if (!escolhido || novos.nome) return

    setEnviando(true)
    try {
      await criarPlanejamento({ aluno: escolhido.id, nome })
      navigate(`/treinador/alunos/${escolhido.id}/planejamento`)
    } catch (falha) {
      if (falha instanceof ApiError && falha.status === 400) {
        setErros({
          aluno: falha.campos.aluno?.join(' '),
          nome: falha.campos.nome?.join(' '),
          geral: falha.campos.detail?.join(' '),
        })
      } else {
        setErros({ geral: 'Não foi possível criar o planejamento. Tente novamente.' })
      }
      setEnviando(false)
    }
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

          <form onSubmit={handleSubmit} noValidate>
            <div className="sj-novo__campos">
              <fieldset className="sj-novo__alunos">
                <legend>Aluno *</legend>

                {alunos.estado === 'carregando' && (
                  <p role="status">Carregando alunos...</p>
                )}
                {alunos.estado === 'erro' && (
                  <p role="alert">Não foi possível carregar os alunos da sua carteira.</p>
                )}
                {alunos.estado === 'pronto' && lista.length === 0 && (
                  <p role="status">Nenhum aluno na sua carteira.</p>
                )}

                <div className="sj-novo__opcoes">
                  {lista.map((aluno) => (
                    <button
                      key={aluno.id}
                      type="button"
                      className={
                        alunoSelecionado === aluno.id
                          ? 'sj-novo__opcao selecionada'
                          : 'sj-novo__opcao'
                      }
                      onClick={() => {
                        setAlunoSelecionado(aluno.id)
                        setErros({})
                      }}
                      aria-pressed={alunoSelecionado === aluno.id}
                    >
                      {alunoSelecionado === aluno.id && (
                        <span aria-hidden="true">✓ </span>
                      )}
                      {aluno.nome}
                    </button>
                  ))}
                </div>

                {erros.aluno && (
                  <p className="sj-novo__mensagem" role="alert">
                    {erros.aluno}
                  </p>
                )}
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
                    setErros({})
                  }}
                  placeholder="Ex.: Controle de bola"
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? 'erro-nome-planejamento' : undefined}
                />

                {erros.nome && (
                  <p className="sj-novo__mensagem" id="erro-nome-planejamento" role="alert">
                    {erros.nome}
                  </p>
                )}
              </div>
            </div>

            <div className="sj-novo__informacoes">
              <section className="sj-novo__card">
                <h2>Depois de criar</h2>
                <p>
                  Adicione os treinos e selecione os exercícios da biblioteca.
                </p>
                {escolhido?.planejamento_vigente && (
                  <p>
                    {escolhido.nome} já tem o planejamento vigente "
                    {escolhido.planejamento_vigente.nome}". Ao criar um novo, o
                    atual vai para o histórico e seus treinos deixam de aceitar alterações.
                  </p>
                )}
              </section>
            </div>

            <div className="sj-novo__acoes">
              <button className="sj-novo__criar" type="submit" disabled={enviando}>
                Criar planejamento
              </button>

              <Link
                className="sj-novo__cancelar"
                to="/treinador/planejamentos"
              >
                Cancelar
              </Link>
            </div>

            {erros.geral && (
              <p className="sj-novo__mensagem" role="alert">
                {erros.geral}
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