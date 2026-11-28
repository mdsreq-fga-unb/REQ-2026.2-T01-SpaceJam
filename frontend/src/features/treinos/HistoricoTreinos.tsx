import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { TituloTreino } from './TreinoLayout'
import './HistoricoTreinos.css'

export interface ResumoTreinoHistorico {
  id: number
  nome: string
  data: string | null
  status: string
  quantidadeExercicios: number
}

export interface TreinoHistorico extends ResumoTreinoHistorico {
  exercicios: readonly {
    id: number
    nome: string
    parametros: string
    orientacoes?: string | null
    errosOrientacoes?: readonly { erro: string; orientacaoCorretiva: string }[]
    dificuldade?: 1 | 2 | 3 | 4 | 5 | null
    feedbacks?: readonly { autor: string; texto: string; editado?: boolean }[]
    videos?: readonly { titulo: string; url: string }[]
  }[]
}

type ConsultaHistorico =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem: string; tentarNovamente?: () => void }
  | { estado: 'disponivel'; treinos: readonly ResumoTreinoHistorico[] }

const dataCurta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' })

function formatarData(data: string | null) {
  if (!data) return null
  const dia = Date.parse(data)
  return Number.isFinite(dia) ? dataCurta.format(dia) : null
}

export function HistoricoTreinos({ alunoNome, consulta, rotaTreino, voltar, paginacao }: {
  alunoNome?: string
  consulta: ConsultaHistorico
  rotaTreino: (id: number) => string
  voltar?: { rota: string; texto: string }
  paginacao?: { pagina: number; anterior?: string; proxima?: string }
}) {
  const treinador = alunoNome !== undefined
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => { titulo.current?.focus() }, [alunoNome])

  return (
    <section className="treino-tela historico">
      <TituloTreino tituloRef={titulo} titulo={treinador ? 'Histórico de treinos' : 'Meu histórico'}
        detalhe={alunoNome ?? 'Seus treinos e registros anteriores.'} />
      {consulta.estado === 'carregando' && <p role="status">Carregando histórico de treinos...</p>}
      {consulta.estado === 'erro' && (
        <div>
          <p role="alert" className="treino-erro">{consulta.mensagem}</p>
          {consulta.tentarNovamente && (
            <button className="treino-botao" type="button" onClick={consulta.tentarNovamente}>Tentar novamente</button>
          )}
        </div>
      )}
      {consulta.estado === 'disponivel' && (consulta.treinos.length > 0 ? (
        <div className={treinador ? 'historico-grade' : undefined}>
          <ul className={'historico-lista' + (treinador ? '' : ' historico-grade')} aria-label="Treinos realizados">
            {consulta.treinos.map(treino => (
              <li key={treino.id} className="treino-cartao historico-resumo">
                <h2>{treino.nome}</h2>
                <p>{[
                  formatarData(treino.data),
                  treino.status,
                  treinador && (treino.quantidadeExercicios === 1 ? '1 exercício' : treino.quantidadeExercicios + ' exercícios'),
                ].filter(Boolean).join(' · ')}</p>
                <Link className="treino-atalho historico-consultar" to={rotaTreino(treino.id)}
                  aria-label={'Consultar ' + treino.nome}>Consultar</Link>
              </li>
            ))}
          </ul>
          {treinador && <aside className="treino-cartao">
            <h2>Dados da época</h2>
            <p>Exercícios, parâmetros e orientações da prescrição são preservados mesmo após alterações na biblioteca.</p>
          </aside>}
        </div>
      ) : <p role="status">Nenhum treino realizado no histórico.</p>)}
      {paginacao && (
        <nav className="historico-paginacao" aria-label="Páginas do histórico">
          {paginacao.anterior && <Link className="treino-botao" to={paginacao.anterior}>Página anterior</Link>}
          <span>Página {paginacao.pagina}</span>
          {paginacao.proxima && <Link className="treino-botao" to={paginacao.proxima}>Próxima página</Link>}
        </nav>
      )}
      {voltar && <Link className="treino-botao historico-voltar" to={voltar.rota}>{voltar.texto}</Link>}
    </section>
  )
}

export function RegistroTreinoHistorico({ treino, voltar, mostrarVideos = false }: {
  treino: TreinoHistorico
  voltar: string
  mostrarVideos?: boolean
}) {
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => { titulo.current?.focus() }, [treino.id])

  return (
    <section className="treino-tela historico">
      <TituloTreino tituloRef={titulo} titulo={treino.nome} detalhe={[formatarData(treino.data), treino.status].filter(Boolean).join(' · ')} />
      <div className="historico-grade">
        {treino.exercicios.length === 0 ? <p role="status">Nenhum exercício registrado para este treino.</p> :
        <ul className="historico-lista" aria-label="Exercícios da prescrição">
          {treino.exercicios.map(exercicio => (
            <li key={exercicio.id} className="treino-cartao historico-exercicio">
              <h2>{exercicio.nome}</h2>
              <p>{exercicio.parametros}</p>
              {exercicio.orientacoes && <p>{exercicio.orientacoes}</p>}
              <dl>
                {exercicio.errosOrientacoes?.length ? <>
                  <dt>Erros e orientações</dt>
                  <dd>
                    <ul className="historico-anotacoes">
                      {exercicio.errosOrientacoes.map(par => (
                        <li key={par.erro + ':' + par.orientacaoCorretiva}>
                          <strong>{par.erro}</strong><p>{par.orientacaoCorretiva}</p>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </> : null}
                <dt>Dificuldade</dt>
                <dd>{exercicio.dificuldade === undefined ? 'Não disponível nesta consulta.'
                  : exercicio.dificuldade === null ? 'Não registrada' : exercicio.dificuldade + ' de 5'}</dd>
                <dt>Feedbacks</dt>
                <dd>{exercicio.feedbacks?.length ? (
                  <ul className="historico-anotacoes">
                    {exercicio.feedbacks.map(feedback => (
                      <li key={feedback.autor + ':' + feedback.texto}>
                        <strong>{feedback.autor}{feedback.editado && ' · editado'}</strong><p>{feedback.texto}</p>
                      </li>
                    ))}
                  </ul>
                ) : 'Nenhum feedback registrado.'}</dd>
                {(mostrarVideos || exercicio.videos?.length) ? <>
                  <dt>Vídeos de execução</dt>
                  <dd>{exercicio.videos?.length ? exercicio.videos.map(video => (
                    <p key={video.url}><a className="treino-atalho" href={video.url}>{video.titulo}</a></p>
                  )) : 'Não disponíveis nesta consulta.'}</dd>
                </> : null}
              </dl>
            </li>
          ))}
        </ul>}
        <aside className="treino-cartao">
          <h2>Histórico de prescrição</h2>
          <p>Esta consulta preserva os exercícios e as orientações da época do treino.</p>
        </aside>
      </div>
      <Link className="treino-botao treino-botao--principal historico-voltar" to={voltar}>Voltar ao histórico</Link>
    </section>
  )
}
