import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { LayoutTreinador } from './LayoutTreinador'
import './TreinadorHistoriasComplementares.css'

type Exercicio = {
  id: number
  nome: string
  series: number
  repeticoes: number | null
  duracao: number | null
}

const exerciciosIniciais: Exercicio[] = [
  { id: 1, nome: 'Drible alternado', series: 3, repeticoes: null, duracao: 30 },
  { id: 2, nome: 'Drible com deslocamento', series: 3, repeticoes: 10, duracao: null },
  { id: 3, nome: 'Mudança de direção', series: 3, repeticoes: 10, duracao: null },
]

const historico = [
  {
    id: 1,
    nome: 'Fundamentos de drible',
    data: '12/08/2026',
    treinos: [
      'Treino A · Controle de bola',
      'Treino B · Mudança de direção',
    ],
  },
  {
    id: 2,
    nome: 'Base de arremesso',
    data: '03/06/2026',
    treinos: [
      'Treino A · Mecânica de arremesso',
      'Treino B · Arremesso em movimento',
      'Treino C · Lances livres',
    ],
  },
]

function nomeTreinador(usuario: ReturnType<typeof useAuth>['usuario']) {
  return usuario?.first_name || usuario?.apelido || 'Treinador'
}

/* US19 — Editar planejamento */

export function TreinadorEditarPlanejamento() {
  const { usuario } = useAuth()
  const { alunoId } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState('Controle de bola')
  const [salvo, setSalvo] = useState(false)

  const aluno = 'Beatriz Costa'

  function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!nome.trim()) return

    setSalvo(true)
  }

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias">
        <header className="sj-historias__intro">
          <h1>Editar planejamento</h1>
          <p>{aluno}</p>
        </header>

        <form className="sj-historias__form" onSubmit={salvar}>
          <div className="sj-historias__colunas">
            <div className="sj-historias__campo">
              <label htmlFor="nome-planejamento">
                Nome do planejamento
              </label>

              <input
                id="nome-planejamento"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value)
                  setSalvo(false)
                }}
                maxLength={100}
                required
              />
            </div>

            <aside className="sj-historias__painel">
              <h2>Treinos do planejamento</h2>

              <ul>
                <li>Treino A · Controle de bola</li>
                <li>Treino B · Arremesso</li>
              </ul>
            </aside>
          </div>

          {salvo && (
            <p className="sj-historias__feedback" role="status">
              Alterações registradas nesta demonstração.
            </p>
          )}

          <div className="sj-historias__acoes">
            <button
              className="sj-historias__botao sj-historias__botao--principal"
              type="submit"
            >
              Salvar alterações
            </button>

            <button
              className="sj-historias__botao"
              type="button"
              onClick={() =>
                navigate(
                  `/treinador/alunos/${alunoId || 1}/planejamento`,
                )
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </LayoutTreinador>
  )
}

/* US21 — Consultar planejamentos anteriores */

export function TreinadorPlanejamentosAnteriores() {
  const { usuario } = useAuth()
  const { alunoId } = useParams()

  const [selecionado, setSelecionado] = useState<number | null>(null)

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias">
        <header className="sj-historias__intro">
          <h1>Planejamentos anteriores</h1>
          <p>Beatriz Costa</p>
        </header>

        <div className="sj-historias__historico">
          {historico.map((planejamento) => (
            <article
              className={`sj-historias__item ${
                selecionado === planejamento.id ? 'is-aberto' : ''
              }`}
              key={planejamento.id}
            >
              <button
                className="sj-historias__item-botao"
                type="button"
                aria-expanded={selecionado === planejamento.id}
                onClick={() =>
                  setSelecionado(
                    selecionado === planejamento.id
                      ? null
                      : planejamento.id,
                  )
                }
              >
                <span>
                  <strong>{planejamento.nome}</strong>

                  <small>
                    Planejamento anterior · {planejamento.treinos.length}{' '}
                    {planejamento.treinos.length === 1
                      ? 'treino'
                      : 'treinos'}{' '}
                    · {planejamento.data}
                  </small>
                </span>

                <span className="sj-historias__consultar">
                  {selecionado === planejamento.id
                    ? 'Recolher'
                    : 'Consultar'}
                </span>
              </button>

              {selecionado === planejamento.id && (
                <div className="sj-historias__detalhe">
                  <h2>Treinos deste planejamento</h2>

                  <ul>
                    {planejamento.treinos.map((treino) => (
                      <li key={treino}>{treino}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="sj-historias__acoes">
          <Link
            className="sj-historias__botao sj-historias__botao--principal"
            to={`/treinador/alunos/${alunoId || 1}/planejamento`}
          >
            Planejamento vigente
          </Link>
        </div>
      </section>
    </LayoutTreinador>
  )
}

/* US25 — Editar treino */

export function TreinadorEditarTreino() {
  const { usuario } = useAuth()
  const { alunoId, planejamentoId } = useParams()
  const navigate = useNavigate()

  const [nome, setNome] = useState('Treino A')
  const [exercicios, setExercicios] =
    useState<Exercicio[]>(exerciciosIniciais)

  const [emEdicao, setEmEdicao] = useState(2)
  const [salvo, setSalvo] = useState(false)

  const exercicioAtual = useMemo(
    () =>
      exercicios.find((item) => item.id === emEdicao) ??
      exercicios[0],
    [exercicios, emEdicao],
  )

  function atualizar(
    campo: 'series' | 'repeticoes' | 'duracao',
    valor: string,
  ) {
    const numero = valor === '' ? null : Number(valor)

    setExercicios((atuais) =>
      atuais.map((item) =>
        item.id !== emEdicao
          ? item
          : {
              ...item,
              [campo]: numero,

              ...(campo === 'repeticoes' && numero !== null
                ? { duracao: null }
                : {}),

              ...(campo === 'duracao' && numero !== null
                ? { repeticoes: null }
                : {}),
            },
      ),
    )

    setSalvo(false)
  }

  function salvar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      !nome.trim() ||
      exercicios.some(
        (item) =>
          item.series < 1 ||
          (item.repeticoes === null && item.duracao === null),
      )
    ) {
      return
    }

    setSalvo(true)
  }

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias sj-historias--treino">
        <header className="sj-historias__intro">
          <h1>Editar treino</h1>
          <p>Treino A · Beatriz Costa</p>
        </header>

        <section
          className="sj-historias__prescricao"
          aria-label="Exercícios do treino"
        >
          <h2>Exercícios do treino · {exercicios.length}</h2>

          {exercicios.map((item, index) => (
            <button
              className={`sj-historias__exercicio ${
                emEdicao === item.id ? 'is-selecionado' : ''
              }`}
              type="button"
              key={item.id}
              onClick={() => setEmEdicao(item.id)}
            >
              <strong>
                {String(index + 1).padStart(2, '0')}
                &nbsp;{item.nome}
              </strong>

              <span>
                {item.series} séries ·{' '}
                {item.repeticoes !== null
                  ? `${item.repeticoes} repetições`
                  : `${item.duracao} segundos`}
              </span>
            </button>
          ))}

          <p>
            Abaixo, ajuste os parâmetros do exercício em edição.
          </p>
        </section>

        <form className="sj-historias__form" onSubmit={salvar}>
          <div className="sj-historias__colunas">
            <div className="sj-historias__campo">
              <label htmlFor="nome-treino">Nome do treino</label>

              <input
                id="nome-treino"
                value={nome}
                onChange={(event) => {
                  setNome(event.target.value)
                  setSalvo(false)
                }}
                required
                maxLength={100}
              />
            </div>

            <aside className="sj-historias__painel">
              <h2>Exercício da biblioteca</h2>
              <p>{exercicioAtual?.nome ?? 'Selecione um exercício'}</p>
            </aside>
          </div>

          {exercicioAtual && (
            <div className="sj-historias__colunas sj-historias__colunas--parametros">
              <div className="sj-historias__campo">
                <label htmlFor="series">Séries *</label>

                <input
                  id="series"
                  type="number"
                  min="1"
                  max="99"
                  value={exercicioAtual.series}
                  onChange={(event) =>
                    atualizar('series', event.target.value)
                  }
                  required
                />
              </div>

              <div className="sj-historias__campo">
                <label htmlFor="repeticoes">Repetições</label>

                <input
                  id="repeticoes"
                  type="number"
                  min="1"
                  max="999"
                  value={exercicioAtual.repeticoes ?? ''}
                  placeholder="Não se aplica"
                  onChange={(event) =>
                    atualizar('repeticoes', event.target.value)
                  }
                />
              </div>

              <div className="sj-historias__campo">
                <label htmlFor="duracao">Duração (segundos)</label>

                <input
                  id="duracao"
                  type="number"
                  min="1"
                  max="3600"
                  value={exercicioAtual.duracao ?? ''}
                  placeholder="Não se aplica"
                  onChange={(event) =>
                    atualizar('duracao', event.target.value)
                  }
                />
              </div>
            </div>
          )}

          <p className="sj-historias__nota">
            Os dados exibidos representam a prescrição salva no treino.
            Alterações na biblioteca não modificam automaticamente esta
            prescrição.
          </p>

          {salvo && (
            <p className="sj-historias__feedback" role="status">
              Alterações registradas nesta demonstração.
            </p>
          )}

          <div className="sj-historias__acoes">
            <button
              className="sj-historias__botao sj-historias__botao--principal"
              type="submit"
            >
              Salvar alterações
            </button>

            <button
              className="sj-historias__botao"
              type="button"
              onClick={() =>
                navigate(
                  `/treinador/alunos/${alunoId || 1}/planejamento/${
                    planejamentoId || 1
                  }/novo-treino`,
                )
              }
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </LayoutTreinador>
  )
}
