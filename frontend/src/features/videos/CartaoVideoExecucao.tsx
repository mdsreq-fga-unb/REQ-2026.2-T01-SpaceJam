import { useId } from 'react'
import { Link } from 'react-router'
import { TEXTO_LIMITES, formatarDuracao } from './verificacaoVideo'
import {
  caminhoEnvio, caminhoMeusVideos, caminhoVideo, formatarDiaMes, quemAvalia, rotuloDoModo, textoDoBloqueio,
  textoDoStatus, type SituacaoEnvio, type VideoExecucao,
} from './videosApi'
import './Videos.css'
import './CartaoVideoExecucao.css'

interface CartaoVideoExecucaoProps {
  aluno: boolean
  treinoId: number
  exercicioId: number
  treinadorNome?: string
  video: VideoExecucao | null
  /** Decidido pelo servidor (`envioVideo`): o cartão só oferece o que ele vai aceitar. */
  envio?: SituacaoEnvio
  /** Confirmação do envio que acabou de terminar (H1). */
  aviso?: string
}

/** US42 — Vídeo da execução no exercício do treino: status, limites e a próxima ação. */
export function CartaoVideoExecucao({
  aluno, treinoId, exercicioId, treinadorNome, video, envio, aviso,
}: CartaoVideoExecucaoProps) {
  const titulo = useId()
  const treinador = quemAvalia(treinadorNome)
  const podeEnviar = aluno && envio?.permitido && envio.modo
  const bloqueio = aluno && envio && !envio.permitido && envio.motivo ? textoDoBloqueio(envio.motivo, treinadorNome) : null

  return (
    <section className="treino-cartao video-cartao" aria-labelledby={titulo}>
      <h2 id={titulo}>Vídeo da execução</h2>
      {aviso && <p className="video-cartao-aviso" role="status">{aviso}</p>}

      {video ? (
        <div className="video-cartao-dados">
          <span className="video-status" data-status={video.status}>{textoDoStatus(video.status, treinadorNome)}</span>
          <p>
            {video.tentativa > 1 && <>Tentativa {video.tentativa} · </>}
            {formatarDuracao(video.duracaoSegundos)} · enviado em {formatarDiaMes(video.substituidoEm ?? video.enviadoEm)}
            {video.substituido && ' (substituído)'}
          </p>
          {video.feedbackTreinador && (
            <blockquote className="video-cartao-feedback">
              <p className="treino-feedback-texto">{video.feedbackTreinador.texto}</p>
            </blockquote>
          )}
        </div>
      ) : (
        <p>
          {aluno
            ? `Nenhum vídeo enviado. Grave ou escolha um vídeo para ${treinador} avaliar sua execução.`
            : 'O aluno ainda não enviou vídeo deste exercício.'}
        </p>
      )}

      {aluno && envio?.modo === 'NOVA_TENTATIVA' && (
        <p className="video-cartao-nota">
          O exercício foi devolvido para correção. Envie uma nova tentativa: a anterior fica no histórico com o feedback.
        </p>
      )}
      {bloqueio && (
        <div className="treino-cartao treino-aviso video-cartao-bloqueio" role="note">
          <h3>{bloqueio.titulo}</h3>
          <p>{bloqueio.texto}</p>
        </div>
      )}
      {podeEnviar && <p className="video-cartao-limites">Limites: {TEXTO_LIMITES} · um vídeo por envio.</p>}

      <div className="treino-acoes">
        {podeEnviar && envio.modo && (
          <Link className="treino-botao treino-botao--principal" to={caminhoEnvio(treinoId, exercicioId)}>
            {rotuloDoModo[envio.modo]}
          </Link>
        )}
        {video && (
          <Link className={podeEnviar ? 'treino-botao' : 'treino-botao treino-botao--principal'}
            to={caminhoVideo(treinoId, exercicioId)}>
            {aluno ? 'Ver vídeo enviado' : 'Assistir ao vídeo do aluno'}
          </Link>
        )}
        {aluno && <Link className="treino-botao" to={caminhoMeusVideos}>Meus vídeos</Link>}
      </div>
    </section>
  )
}
