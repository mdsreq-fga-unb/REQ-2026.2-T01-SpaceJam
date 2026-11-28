import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { caminhoMeusVideos, listarMeusVideos } from './videosApi'
import './AtalhoMeusVideos.css'

type Resumo = { estado: 'carregando' } | { estado: 'pronto'; texto: string } | { estado: 'sem-resumo' }

/** Resumo dos envios no mesmo critério da tela Meus vídeos: um vídeo atual por exercício. */
function resumir(videos: Awaited<ReturnType<typeof listarMeusVideos>>) {
  const atuais = videos.filter(video => video.atual)
  if (atuais.length === 0) return 'Nenhum vídeo enviado ainda'
  const aguardando = atuais.filter(video => video.status === 'AGUARDANDO_AVALIACAO').length
  return [
    `${atuais.length} ${atuais.length === 1 ? 'enviado' : 'enviados'}`,
    aguardando > 0 && `${aguardando} aguardando avaliação`,
  ].filter(Boolean).join(' · ')
}

/** US42 — Atalho para "Meus vídeos" na entrada da seção Treinos (H6: reconhecer em vez de lembrar). */
export function AtalhoMeusVideos() {
  const [resumo, setResumo] = useState<Resumo>({ estado: 'carregando' })

  useEffect(() => {
    const controle = new AbortController()
    listarMeusVideos(controle.signal)
      .then(videos => { if (!controle.signal.aborted) setResumo({ estado: 'pronto', texto: resumir(videos) }) })
      // Sem o resumo, o atalho continua útil: não bloqueia a tela de planejamento.
      .catch(() => { if (!controle.signal.aborted) setResumo({ estado: 'sem-resumo' }) })
    return () => controle.abort()
  }, [])

  const detalhe = resumo.estado === 'pronto' ? resumo.texto
    : resumo.estado === 'carregando' ? 'Carregando seus envios…'
    : 'Consulte as execuções que você enviou'

  return (
    <section className="atalho-videos" aria-labelledby="atalho-videos-titulo">
      <h2 id="atalho-videos-titulo" className="atalho-videos__rotulo">Seus envios</h2>
      <Link className="conta-aluno__cartao atalho-videos__cartao" to={caminhoMeusVideos}>
        <span className="atalho-videos__icone" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="6" width="13" height="12" rx="2" /><path d="M16 10.5l5-3v9l-5-3" />
          </svg>
        </span>
        <span className="atalho-videos__texto">
          <strong>Meus vídeos</strong>
          <span aria-live="polite">{detalhe}</span>
        </span>
        <svg className="atalho-videos__seta" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  )
}
