import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { LayoutAluno } from './LayoutAluno'
import {
  consultarMeuPlanejamento,
  type ExercicioPrescrito,
  type PlanejamentoDoAluno,
  type TreinoPrescrito,
} from './meuPlanejamentoApi'
import './MeuPlanejamentoPage.css'

type Consulta =
  | { estado: 'carregando' }
  | { estado: 'erro' }
  | { estado: 'pronto'; planejamento: PlanejamentoDoAluno | null }

const statusDoExercicio: Record<ExercicioPrescrito['status'], string> = {
  A_FAZER: 'A fazer',
  FEITO: 'Feito',
  CONCLUIDO: 'Concluído',
  CORRIGIR: 'Corrigir/Refazer',
}

function prescricaoDoExercicio(exercicio: ExercicioPrescrito) {
  const series = `${exercicio.series} ${exercicio.series === 1 ? 'série' : 'séries'}`
  const { repeticoes, duracao_segundos } = exercicio
  if (repeticoes !== null) {
    return `${series} · ${repeticoes} ${repeticoes === 1 ? 'repetição' : 'repetições'}`
  }
  return duracao_segundos === null ? series : `${series} · ${duracao_segundos} s`
}

function StatusDoTreino({ treino }: { treino: TreinoPrescrito }) {
  return <span className="meu-planejamento__status" data-status={treino.status}>{treino.status_display}</span>
}

function ListaDeTreinos({ planejamento }: { planejamento: PlanejamentoDoAluno | null }) {
  return (
    <>
      <header className="conta-aluno__titulo meu-planejamento__titulo">
        <h1>Meu planejamento</h1>
      </header>
      {planejamento ? (
        <section aria-labelledby="planejamento-vigente">
          <h2 id="planejamento-vigente" className="meu-planejamento__subtitulo">{planejamento.nome}</h2>
          {planejamento.treinos.length === 0 ? (
            <p className="conta-aluno__cartao meu-planejamento__estado" role="status">
              Este planejamento ainda não tem treinos.
            </p>
          ) : (
            <ul className="meu-planejamento__lista meu-planejamento__lista--treinos" role="list">
              {planejamento.treinos.map((treino) => (
                <li key={treino.id}>
                  <Link className="conta-aluno__cartao meu-planejamento__treino" to={`/treinos/planejamento/${treino.id}`}>
                    <div>
                      <h3>{treino.nome}</h3>
                      <p>{treino.total_exercicios} {treino.total_exercicios === 1 ? 'exercício' : 'exercícios'}</p>
                    </div>
                    <StatusDoTreino treino={treino} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="conta-aluno__cartao meu-planejamento__estado" role="status">
          <h2>Nenhum planejamento vigente</h2>
          <p className="conta-aluno__indisponivel">Nenhum treino planejado.</p>
        </section>
      )}
    </>
  )
}

function CartaoDeExercicio({ exercicio }: { exercicio: ExercicioPrescrito }) {
  return (
    <article className="conta-aluno__cartao meu-planejamento__exercicio">
      <header>
        <div>
          <h3>{exercicio.nome}</h3>
          <p>{prescricaoDoExercicio(exercicio)}</p>
        </div>
        <span className="meu-planejamento__status" data-status={exercicio.status}>{statusDoExercicio[exercicio.status]}</span>
      </header>
      {exercicio.objetivo && <div><h4>Objetivo</h4><p>{exercicio.objetivo}</p></div>}
      {exercicio.orientacoes && <div><h4>Orientações</h4><p>{exercicio.orientacoes}</p></div>}
      {exercicio.erros_comuns && <div><h4>Erros comuns</h4><p>{exercicio.erros_comuns}</p></div>}
      {exercicio.erros_orientacoes.length > 0 && (
        <div>
          <h4>Orientações corretivas</h4>
          <dl className="meu-planejamento__correcoes">
            {exercicio.erros_orientacoes.map(({ erro, orientacao_corretiva }, indice) => (
              <div key={indice}>
                <dt>{erro}</dt>
                <dd>{orientacao_corretiva}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {/^https?:\/\//i.test(exercicio.video_base) && (
        <a className="meu-planejamento__link" href={exercicio.video_base} target="_blank" rel="noreferrer">
          Ver vídeo de referência
        </a>
      )}
    </article>
  )
}

function DetalheDoTreino({ treino }: { treino?: TreinoPrescrito }) {
  return (
    <>
      <Link className="meu-planejamento__voltar" to="/treinos">Voltar aos treinos</Link>
      <header className="conta-aluno__titulo meu-planejamento__titulo meu-planejamento__titulo--treino">
        <h1>{treino?.nome ?? 'Treino indisponível'}</h1>
        {treino && <StatusDoTreino treino={treino} />}
      </header>
      {treino ? (
        <section aria-labelledby="exercicios-prescritos">
          <h2 id="exercicios-prescritos" className="meu-planejamento__subtitulo">Exercícios prescritos</h2>
          <Link className="meu-planejamento__voltar meu-planejamento__executar" to={'/treinos/' + treino.id}>
            Abrir execução do treino
          </Link>
          {treino.exercicios.length === 0 ? (
            <p className="conta-aluno__cartao meu-planejamento__estado" role="status">Este treino ainda não tem exercícios.</p>
          ) : (
            <ol className="meu-planejamento__lista" role="list" aria-labelledby="exercicios-prescritos">
              {treino.exercicios.map((exercicio) => (
                <li key={exercicio.id}><CartaoDeExercicio exercicio={exercicio} /></li>
              ))}
            </ol>
          )}
        </section>
      ) : (
        <p role="status">Este treino não faz parte do seu planejamento vigente.</p>
      )}
    </>
  )
}

function MeuPlanejamento() {
  const { treinoId } = useParams()
  const [consulta, setConsulta] = useState<Consulta>({ estado: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle

    consultarMeuPlanejamento(signal)
      .then(({ planejamento }) => {
        if (!signal.aborted) setConsulta({ estado: 'pronto', planejamento })
      })
      .catch(() => {
        if (!signal.aborted) setConsulta({ estado: 'erro' })
      })

    return () => controle.abort()
  }, [tentativa])

  if (consulta.estado === 'pronto') {
    const { planejamento } = consulta
    return treinoId === undefined
      ? <ListaDeTreinos planejamento={planejamento} />
      : <DetalheDoTreino treino={planejamento?.treinos.find(({ id }) => String(id) === treinoId)} />
  }

  function tentarNovamente() {
    setConsulta({ estado: 'carregando' })
    setTentativa((numero) => numero + 1)
  }

  return (
    <>
      {treinoId !== undefined && <Link className="meu-planejamento__voltar" to="/treinos">Voltar aos treinos</Link>}
      <header className="conta-aluno__titulo meu-planejamento__titulo"><h1>Meu planejamento</h1></header>
      {consulta.estado === 'carregando' ? (
        <p role="status">Carregando planejamento...</p>
      ) : (
        <div className="conta-aluno__cartao meu-planejamento__estado">
          <p role="alert">Não foi possível consultar seu planejamento.</p>
          <button className="meu-planejamento__tentar" type="button" onClick={tentarNovamente}>Tentar novamente</button>
        </div>
      )}
    </>
  )
}

export function MeuPlanejamentoPage() {
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <LayoutAluno usuario={usuario} secao="Treinos">
      <MeuPlanejamento key={usuario.id} />
    </LayoutAluno>
  )
}
