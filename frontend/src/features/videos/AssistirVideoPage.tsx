import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { TituloTreino, TreinoLayout } from '../treinos/TreinoLayout'
import { formatarDuracao, formatarTamanho } from './verificacaoVideo'
import {
  caminhoEnvio, caminhoExercicio, caminhoMeusVideos, caminhoVideo, consultarExercicioComVideo, consultarVideo,
  formatarDataHora, idValido, quemAvalia, rotuloDoModo, textoDoBloqueio, textoDoStatus,
  type ExercicioComVideo, type VideoParaAssistir,
} from './videosApi'
import './Videos.css'
import './AssistirVideo.css'

type Consulta =
  | { estado: 'carregando' }
  | { estado: 'sem-video' }
  | { estado: 'erro'; mensagem: string; tentarNovamente?: () => void }
  | { estado: 'pronto'; contexto: ExercicioComVideo; video: VideoParaAssistir }

/** Erros em que tentar de novo não adianta. */
function erroDefinitivo(erro: unknown) {
  if (erro instanceof ApiError) {
    if (erro.status === 401) return 'Sua sessão expirou. Entre novamente para assistir ao vídeo.'
    if (erro.status === 403) return 'Você não tem permissão para assistir a este vídeo.'
    if (erro.status === 404) return 'Exercício não encontrado.'
  }
  return null
}

/** US42 CA04 — O vídeo só toca por um link temporário pedido ao servidor (RNF12). */
function TelaVideo({ treinoId, itemId, tentativa, aluno }: {
  treinoId: number
  itemId: number
  tentativa?: number
  aluno: boolean
}) {
  const [consulta, setConsulta] = useState<Consulta>({ estado: 'carregando' })
  const [recarga, setRecarga] = useState(0)
  const [naoReproduz, setNaoReproduz] = useState(false)
  const player = useRef<HTMLVideoElement>(null)
  const titulo = useRef<HTMLHeadingElement>(null)
  // O link vale 10 min: se vencer com a tela aberta, pede outro e volta ao mesmo ponto.
  const retomarEm = useRef(0)
  const linkRenovado = useRef(false)

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle
    Promise.all([
      consultarExercicioComVideo(treinoId, itemId, signal),
      consultarVideo(itemId, tentativa, signal),
    ]).then(([contexto, video]) => {
      if (!signal.aborted) setConsulta({ estado: 'pronto', contexto, video })
    }).catch((erro: unknown) => {
      if (signal.aborted) return
      if (erro instanceof ApiError && erro.codigo === 'VIDEO_NAO_ENCONTRADO') {
        setConsulta({ estado: 'sem-video' })
        return
      }
      const definitivo = erroDefinitivo(erro)
      setConsulta(definitivo
        ? { estado: 'erro', mensagem: definitivo }
        : {
            estado: 'erro',
            // 503 do Storage traz a própria mensagem; rede ou 500, a genérica.
            mensagem: erro instanceof ApiError && erro.codigo === 'ARMAZENAMENTO_INDISPONIVEL'
              ? erro.message
              : 'Não foi possível carregar o vídeo. Confira sua conexão e tente novamente.',
            tentarNovamente: () => { setConsulta({ estado: 'carregando' }); setRecarga(valor => valor + 1) },
          })
    })
    return () => controle.abort()
  }, [treinoId, itemId, tentativa, recarga])

  useEffect(() => {
    if (consulta.estado !== 'carregando') titulo.current?.focus()
  }, [consulta.estado])

  function renovarLink() {
    if (linkRenovado.current) {
      // Falhou de novo com link novo: o problema é o formato neste navegador, não o link.
      setNaoReproduz(true)
      return
    }
    linkRenovado.current = true
    retomarEm.current = player.current?.currentTime ?? 0
    void consultarVideo(itemId, tentativa).then(video => {
      setConsulta(atual => atual.estado === 'pronto' ? { ...atual, video } : atual)
    }).catch(() => {
      setConsulta({
        estado: 'erro', mensagem: 'O vídeo não pôde ser reproduzido. Tente novamente.',
        tentarNovamente: () => { setConsulta({ estado: 'carregando' }); setRecarga(valor => valor + 1) },
      })
    })
  }

  const voltar = caminhoExercicio(treinoId, itemId)

  if (consulta.estado === 'carregando') return <p className="treino-cartao" role="status">Carregando o vídeo…</p>

  if (consulta.estado !== 'pronto') {
    const semVideo = consulta.estado === 'sem-video'
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo={semVideo ? 'Nenhum vídeo enviado' : 'Não foi possível concluir'} tituloRef={titulo}
          detalhe={semVideo
            ? (aluno ? 'Envie sua execução a partir do exercício do treino.' : 'O aluno ainda não enviou vídeo deste exercício.')
            : undefined} />
        {!semVideo && <p className="treino-cartao" role="alert">{consulta.mensagem}</p>}
        <div className="treino-acoes">
          {!semVideo && consulta.tentarNovamente && (
            <button className="treino-botao treino-botao--principal" type="button" onClick={consulta.tentarNovamente}>
              Tentar novamente
            </button>
          )}
          <Link className="treino-botao" to={voltar}>Voltar ao exercício</Link>
        </div>
      </section>
    )
  }

  const { contexto, video } = consulta
  const { exercicio, treino } = contexto
  const treinador = quemAvalia(treino.treinadorNome)
  const atual = exercicio.videoExecucao
  const ehAtual = !atual || atual.tentativa === video.tentativa
  const envio = exercicio.envioVideo
  const totalTentativas = atual?.tentativa ?? video.tentativa
  const bloqueio = aluno && ehAtual && envio && !envio.permitido && envio.motivo
    ? textoDoBloqueio(envio.motivo, treino.treinadorNome)
    : null
  const enviadoEm = formatarDataHora(video.substituidoEm ?? video.enviadoEm)

  return (
    <section className="treino-tela video-tela">
      <TituloTreino titulo={exercicio.nome} tituloRef={titulo}
        detalhe={`${treino.nome} · Tentativa ${video.tentativa}${ehAtual ? '' : ' (anterior)'} · enviado em ${enviadoEm}`} />
      <div className="treino-colunas video-assistir">
        <div className="video-assistir-player">
          <video ref={player} key={video.urlVisualizacao} className="video-player" src={video.urlVisualizacao}
            controls playsInline preload="metadata" aria-label={`Vídeo da execução: ${exercicio.nome}, tentativa ${video.tentativa}`}
            onError={renovarLink}
            onLoadedMetadata={() => {
              if (retomarEm.current && player.current) player.current.currentTime = retomarEm.current
              retomarEm.current = 0
              linkRenovado.current = false
            }} />
          {naoReproduz && (
            <p className="treino-erro" role="alert">
              Este navegador não conseguiu reproduzir o vídeo. Tente em outro navegador ou no celular.
            </p>
          )}
          <p className="video-assistir-info">
            {formatarDuracao(video.duracaoSegundos)} · {formatarTamanho(video.tamanhoBytes)} · {video.formato === 'video/quicktime' ? 'MOV' : 'MP4'}
            {video.substituido && ' · vídeo substituído antes da avaliação'}
          </p>
        </div>

        <div className="video-assistir-lateral">
          <section className="treino-cartao" aria-labelledby="video-avaliacao">
            <h2 id="video-avaliacao">Avaliação</h2>
            <span className="video-status" data-status={video.status}>{textoDoStatus(video.status, treino.treinadorNome)}</span>
            {video.feedbackTreinador ? (
              <>
                <p className="treino-feedback-texto video-feedback">{video.feedbackTreinador.texto}</p>
                <p className="video-feedback-data">
                  {video.feedbackTreinador.editadoEm ? 'Editado em ' : 'Registrado em '}
                  {formatarDataHora(video.feedbackTreinador.editadoEm ?? video.feedbackTreinador.criadoEm)}
                </p>
              </>
            ) : (
              <p>
                {!aluno
                  ? 'Este vídeo ainda não tem feedback do treinador.'
                  : `Quando ${treinador} avaliar, o feedback aparece aqui.${ehAtual && envio?.modo === 'SUBSTITUICAO'
                    ? ' Até lá, você ainda pode substituir o vídeo.' : ''}`}
              </p>
            )}
          </section>

          {bloqueio && (
            <section className="treino-cartao treino-aviso" role="note">
              <h2>{bloqueio.titulo}</h2>
              <p>{bloqueio.texto}</p>
            </section>
          )}

          {totalTentativas > 1 && (
            <nav className="treino-cartao" aria-label="Tentativas deste exercício">
              <h2>Tentativas</h2>
              <ul className="video-tentativas">
                {Array.from({ length: totalTentativas }, (_, indice) => totalTentativas - indice).map(numero => (
                  <li key={numero}>
                    {numero === video.tentativa
                      ? <span aria-current="page">Tentativa {numero}{numero === totalTentativas ? ' (atual)' : ''}</span>
                      : (
                          <Link className="treino-atalho" to={caminhoVideo(treinoId, itemId, numero === totalTentativas ? undefined : numero)}>
                            Tentativa {numero}{numero === totalTentativas ? ' (atual)' : ''}
                          </Link>
                        )}
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>

      <div className="treino-acoes">
        {aluno && ehAtual && envio?.permitido && envio.modo && envio.modo !== 'NOVO' && (
          <Link className="treino-botao treino-botao--principal" to={caminhoEnvio(treinoId, itemId)}>
            {rotuloDoModo[envio.modo]}
          </Link>
        )}
        <Link className="treino-botao" to={voltar}>Voltar ao exercício</Link>
        {aluno && <Link className="treino-botao" to={caminhoMeusVideos}>Meus vídeos</Link>}
      </div>
    </section>
  )
}

export function AssistirVideoPage() {
  const { usuario } = useAuth()
  const params = useParams()
  const [busca] = useSearchParams()
  if (!usuario) return null
  const aluno = usuario.papel === 'ALUNO'
  const treinoId = idValido(params.treinoId)
  const itemId = idValido(params.itemId)
  const tentativa = idValido(busca.get('tentativa') ?? undefined) ?? undefined
  const links = aluno
    ? { Conta: '/', Treinos: '/treinos' }
    : { Conta: '/', Alunos: '/treinador/alunos', Biblioteca: '/exercicios' }

  return (
    <TreinoLayout usuario={usuario} links={links}>
      {treinoId && itemId
        ? <TelaVideo key={`${treinoId}:${itemId}:${tentativa ?? ''}`} treinoId={treinoId} itemId={itemId}
            tentativa={tentativa} aluno={aluno} />
        : <p className="treino-cartao" role="alert">Vídeo não encontrado.</p>}
    </TreinoLayout>
  )
}
