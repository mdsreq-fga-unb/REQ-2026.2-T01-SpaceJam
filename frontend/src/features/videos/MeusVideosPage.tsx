import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { TituloTreino, TreinoLayout } from '../treinos/TreinoLayout'
import { navegacaoAluno } from '../treinos/navegacao'
import { formatarDuracao } from './verificacaoVideo'
import {
  caminhoEnvio, caminhoExercicio, caminhoVideo, formatarDataHora, listarMeusVideos, rotuloDoModo, textoDoStatus,
  type MeuVideo,
} from './videosApi'
import './Videos.css'
import './MeusVideos.css'

type Consulta =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem: string; tentarNovamente?: () => void }
  | { estado: 'pronto'; videos: MeuVideo[] }

interface ExercicioAgrupado {
  id: number
  nome: string
  atual: MeuVideo
  anteriores: MeuVideo[]
}

interface TreinoAgrupado {
  id: number
  nome: string
  exercicios: ExercicioAgrupado[]
}

/** Agrupa por treino e por exercício, mantendo a ordem do envio mais recente (a da API). */
function agrupar(videos: MeuVideo[]): TreinoAgrupado[] {
  const treinos = new Map<number, TreinoAgrupado & { porExercicio: Map<number, ExercicioAgrupado> }>()
  for (const video of videos) {
    let treino = treinos.get(video.treinoId)
    if (!treino) {
      treino = { id: video.treinoId, nome: video.treinoNome, exercicios: [], porExercicio: new Map() }
      treinos.set(video.treinoId, treino)
    }
    const exercicio = treino.porExercicio.get(video.exercicioId)
    if (!exercicio) {
      const novo = { id: video.exercicioId, nome: video.exercicioNome, atual: video, anteriores: [] as MeuVideo[] }
      treino.porExercicio.set(video.exercicioId, novo)
      treino.exercicios.push(novo)
    } else if (video.atual) {
      exercicio.anteriores.push(exercicio.atual)
      exercicio.atual = video
    } else {
      exercicio.anteriores.push(video)
    }
  }
  return Array.from(treinos.values(), ({ id, nome, exercicios }) => ({
    id, nome,
    exercicios: exercicios.map(item => ({ ...item, anteriores: item.anteriores.sort((a, b) => b.tentativa - a.tentativa) })),
  }))
}

function CartaoDoVideo({ treinoId, exercicio, treinadorNome }: {
  treinoId: number
  exercicio: ExercicioAgrupado
  treinadorNome?: string
}) {
  const { atual: video, anteriores } = exercicio
  const envio = video.envio
  return (
    <article className="treino-cartao meus-videos-cartao" aria-labelledby={`meu-video-${video.id}`}>
      <div className="meus-videos-cabecalho">
        <h3 id={`meu-video-${video.id}`}>{exercicio.nome}</h3>
        <span className="video-status" data-status={video.status}>{textoDoStatus(video.status, treinadorNome)}</span>
      </div>
      <p>
        Tentativa {video.tentativa} · {formatarDuracao(video.duracaoSegundos)} · enviado em{' '}
        {formatarDataHora(video.substituidoEm ?? video.enviadoEm)}
      </p>
      {video.feedbackTreinador && (
        <blockquote className="meus-videos-feedback">
          <p>{video.feedbackTreinador.texto}</p>
        </blockquote>
      )}
      <div className="meus-videos-acoes">
        <Link className="treino-atalho" to={caminhoVideo(treinoId, exercicio.id)}
          aria-label={`Assistir: ${exercicio.nome}, tentativa ${video.tentativa}`}>
          Assistir
        </Link>
        {envio?.permitido && envio.modo && (
          <Link className="treino-atalho" to={caminhoEnvio(treinoId, exercicio.id)}
            aria-label={`${rotuloDoModo[envio.modo]}: ${exercicio.nome}`}>
            {rotuloDoModo[envio.modo]}
          </Link>
        )}
        <Link className="treino-atalho" to={caminhoExercicio(treinoId, exercicio.id)}
          aria-label={`Abrir exercício: ${exercicio.nome}`}>
          Abrir exercício
        </Link>
      </div>
      {anteriores.length > 0 && (
        <p className="meus-videos-anteriores">
          Tentativas anteriores:{' '}
          {anteriores.map((anterior, indice) => (
            <span key={anterior.id}>
              {indice > 0 && ', '}
              <Link className="treino-atalho" to={caminhoVideo(treinoId, exercicio.id, anterior.tentativa)}>
                Tentativa {anterior.tentativa}
              </Link>
            </span>
          ))}
        </p>
      )}
    </article>
  )
}

function ListaMeusVideos() {
  const [consulta, setConsulta] = useState<Consulta>({ estado: 'carregando' })
  const [recarga, setRecarga] = useState(0)
  const titulo = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const controle = new AbortController()
    listarMeusVideos(controle.signal).then(videos => {
      if (!controle.signal.aborted) setConsulta({ estado: 'pronto', videos })
    }).catch((erro: unknown) => {
      if (controle.signal.aborted) return
      setConsulta(erro instanceof ApiError && erro.status === 401
        ? { estado: 'erro', mensagem: 'Sua sessão expirou. Entre novamente para consultar seus vídeos.' }
        : {
            estado: 'erro', mensagem: 'Não foi possível carregar seus vídeos. Confira sua conexão e tente novamente.',
            tentarNovamente: () => { setConsulta({ estado: 'carregando' }); setRecarga(valor => valor + 1) },
          })
    })
    return () => controle.abort()
  }, [recarga])

  useEffect(() => {
    if (consulta.estado !== 'carregando') titulo.current?.focus()
  }, [consulta.estado])

  if (consulta.estado === 'carregando') return <p className="treino-cartao" role="status">Carregando seus vídeos…</p>

  if (consulta.estado === 'erro') {
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo="Meus vídeos" tituloRef={titulo} />
        <p className="treino-cartao" role="alert">{consulta.mensagem}</p>
        {consulta.tentarNovamente && (
          <div className="treino-acoes">
            <button className="treino-botao treino-botao--principal" type="button" onClick={consulta.tentarNovamente}>
              Tentar novamente
            </button>
          </div>
        )}
      </section>
    )
  }

  if (consulta.videos.length === 0) {
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo="Nenhum vídeo enviado" tituloRef={titulo}
          detalhe="Envie sua execução a partir do exercício do treino: abra o treino, escolha o exercício e toque em “Enviar vídeo da execução”." />
        <div className="treino-acoes">
          <Link className="treino-botao treino-botao--principal" to="/treinos">Consultar treinos</Link>
        </div>
      </section>
    )
  }

  const treinos = agrupar(consulta.videos)
  const atuais = treinos.flatMap(treino => treino.exercicios.map(exercicio => exercicio.atual))
  const aguardando = atuais.filter(video => video.status === 'AGUARDANDO_AVALIACAO').length
  const resumo = [
    `${atuais.length} ${atuais.length === 1 ? 'exercício com vídeo' : 'exercícios com vídeo'}`,
    aguardando > 0 && `${aguardando} aguardando avaliação`,
  ].filter(Boolean).join(' · ')

  return (
    <section className="treino-tela video-tela">
      <TituloTreino titulo="Meus vídeos" detalhe={resumo} tituloRef={titulo} />
      {treinos.map(treino => (
        <section key={treino.id} className="meus-videos-treino" aria-labelledby={`meus-videos-treino-${treino.id}`}>
          <h2 id={`meus-videos-treino-${treino.id}`}>{treino.nome}</h2>
          <ul className="meus-videos-lista">
            {treino.exercicios.map(exercicio => (
              <li key={exercicio.id}>
                <CartaoDoVideo treinoId={treino.id} exercicio={exercicio} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div className="treino-acoes">
        <Link className="treino-botao" to="/treinos">Voltar aos treinos</Link>
      </div>
    </section>
  )
}

/** US42 — "Meus vídeos": todas as execuções enviadas pelo aluno e o que ainda dá para fazer com elas. */
export function MeusVideosPage() {
  const { usuario } = useAuth()
  if (!usuario) return null
  return (
    <TreinoLayout usuario={usuario} links={navegacaoAluno}>
      <ListaMeusVideos />
    </TreinoLayout>
  )
}
