import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { TituloTreino, TreinoLayout } from '../treinos/TreinoLayout'
import { navegacaoAluno } from '../treinos/navegacao'
import {
  LIMITE_MB, LIMITE_SEGUNDOS, TEXTO_LIMITES, TIPOS_ACEITOS, formatarDuracao, formatarTamanho, verificarVideo,
  type ResultadoRegra,
} from './verificacaoVideo'
import {
  caminhoExercicio, cancelado, classificarErro, consultarExercicioComVideo, enviarVideo, formatarDiaMes, idValido, quemAvalia,
  textoDoBloqueio, textoQuemVe, type EtapaEnvio, type ExercicioComVideo, type ModoEnvio,
} from './videosApi'
import './Videos.css'
import './EnviarVideo.css'


type Tela =
  | 'selecao' | 'verificando' | 'invalido' | 'previa' | 'enviando' | 'falha' | 'erro' | 'bloqueado' | 'sessao'

interface ArquivoPronto {
  arquivo: File
  tipo: string
  duracaoSegundos: number
  /** Endereço local da prévia; nada sai do aparelho antes da confirmação (RNF15). */
  url: string | null
}

interface Recusa {
  motivo: string
  dica: string
  regras: ResultadoRegra[]
}

type Carga =
  | { estado: 'carregando' }
  | { estado: 'indisponivel'; titulo: string; mensagem: string; tentarNovamente?: () => void }
  | { estado: 'pronto'; dados: ExercicioComVideo; modo: ModoEnvio }

const titulos: Record<ModoEnvio, { selecao: string; previa: string; confirmar: string; enviando: string }> = {
  NOVO: {
    selecao: 'Enviar vídeo da execução', previa: 'Confira antes de enviar',
    confirmar: 'Confirmar envio', enviando: 'Enviando vídeo…',
  },
  SUBSTITUICAO: {
    selecao: 'Substituir vídeo', previa: 'Revise a substituição',
    confirmar: 'Confirmar substituição', enviando: 'Substituindo vídeo…',
  },
  NOVA_TENTATIVA: {
    selecao: 'Enviar nova tentativa', previa: 'Confira a nova tentativa',
    confirmar: 'Enviar nova tentativa', enviando: 'Enviando nova tentativa…',
  },
}

const textoDaEtapa: Record<EtapaEnvio, string> = {
  preparando: 'Preparando o envio…',
  enviando: 'Enviando o vídeo',
  confirmando: 'Confirmando com o servidor…',
}

function aparelhoComCamera() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches
}

function criarPrevia(arquivo: File) {
  return typeof URL.createObjectURL === 'function' ? URL.createObjectURL(arquivo) : null
}

function avisoDeSucesso(modo: ModoEnvio, treinadorNome?: string) {
  const treinador = quemAvalia(treinadorNome)
  if (modo === 'SUBSTITUICAO') return 'Vídeo substituído. O anterior foi apagado.'
  const inicio = modo === 'NOVA_TENTATIVA' ? 'Nova tentativa enviada.' : 'Vídeo enviado.'
  return `${inicio} ${treinador.charAt(0).toUpperCase() + treinador.slice(1)} já pode assistir.`
}

function ListaDeRegras({ regras }: { regras: ResultadoRegra[] }) {
  return (
    <ul className="video-regras">
      {regras.map(({ regra, rotulo, valor, ok }) => (
        <li key={regra} data-ok={ok}>
          <svg width="18" height="18" viewBox="0 0 18 18" role="img" aria-label={ok ? 'Atende' : 'Não atende'}>
            <circle cx="9" cy="9" r="8" fill={ok ? '#2f5d4f' : '#7a2a1c'} />
            {ok
              ? <path d="M5 9.2l2.6 2.6L13 6.6" stroke="#bff0de" strokeWidth="2" fill="none" />
              : <path d="M6 6l6 6M12 6l-6 6" stroke="#ffd0c4" strokeWidth="2" />}
          </svg>
          <span>{rotulo}</span>
          <strong>{valor}</strong>
        </li>
      ))}
    </ul>
  )
}

/** US42 — Envio do vídeo de execução: escolher, verificar, conferir, enviar e confirmar. */
function FluxoDeEnvio({ treinoId, itemId, dados, modo }: {
  treinoId: number
  itemId: number
  dados: ExercicioComVideo
  modo: ModoEnvio
}) {
  const navegar = useNavigate()
  const [tela, setTela] = useState<Tela>('selecao')
  const [pronto, setPronto] = useState<ArquivoPronto | null>(null)
  const [recusa, setRecusa] = useState<Recusa | null>(null)
  const [previaFalhou, setPreviaFalhou] = useState(false)
  const [etapa, setEtapa] = useState<EtapaEnvio>('preparando')
  const [fracao, setFracao] = useState(0)
  const [parouEm, setParouEm] = useState(0)
  const [mensagem, setMensagem] = useState('')
  const [confirmarCancelamento, setConfirmarCancelamento] = useState(false)

  const titulo = useRef<HTMLHeadingElement>(null)
  const seletorArquivo = useRef<HTMLInputElement>(null)
  const seletorCamera = useRef<HTMLInputElement>(null)
  const botaoCancelar = useRef<HTMLButtonElement>(null)
  const botaoContinuar = useRef<HTMLButtonElement>(null)
  const envio = useRef<AbortController | null>(null)
  const cancelamentoPedido = useRef(false)
  const verificacaoAtual = useRef(0)
  const urlPrevia = useRef<string | null>(null)

  const { treino, exercicio } = dados
  const treinador = quemAvalia(treino.treinadorNome)
  const videoAtual = exercicio.videoExecucao
  const voltar = caminhoExercicio(treinoId, itemId)
  const comCamera = aparelhoComCamera()
  const textos = titulos[modo]
  const subtitulo = `${exercicio.nome} · ${treino.nome}`

  // H1: a cada etapa o foco vai para o título, e o leitor de tela anuncia onde o aluno está.
  useEffect(() => { titulo.current?.focus() }, [tela])

  useEffect(() => {
    if (confirmarCancelamento) botaoContinuar.current?.focus()
  }, [confirmarCancelamento])

  // Fechar a aba no meio do envio interrompe o envio: o navegador pede confirmação.
  useEffect(() => {
    if (tela !== 'enviando') return
    const avisar = (evento: BeforeUnloadEvent) => { evento.preventDefault() }
    window.addEventListener('beforeunload', avisar)
    return () => window.removeEventListener('beforeunload', avisar)
  }, [tela])

  useEffect(() => () => {
    envio.current?.abort()
    if (urlPrevia.current) URL.revokeObjectURL?.(urlPrevia.current)
  }, [])

  function trocarPrevia(url: string | null) {
    if (urlPrevia.current) URL.revokeObjectURL?.(urlPrevia.current)
    urlPrevia.current = url
  }

  function abrirSeletor(camera = false) {
    const seletor = camera ? seletorCamera.current : seletorArquivo.current
    seletor?.click()
  }

  async function escolher(arquivo: File | undefined) {
    if (!arquivo) return
    const verificacao = ++verificacaoAtual.current
    trocarPrevia(null)
    setPronto(null)
    setPreviaFalhou(false)
    setTela('verificando')
    const resultado = await verificarVideo(arquivo)
    if (verificacao !== verificacaoAtual.current) return
    if (!resultado.ok) {
      setRecusa({ motivo: resultado.motivo, dica: resultado.dica, regras: resultado.regras })
      setTela('invalido')
      return
    }
    const url = criarPrevia(arquivo)
    trocarPrevia(url)
    setPronto({ arquivo, tipo: resultado.tipo, duracaoSegundos: resultado.duracaoSegundos, url })
    setTela('previa')
  }

  async function enviar() {
    if (!pronto || envio.current) return
    const controle = new AbortController()
    envio.current = controle
    cancelamentoPedido.current = false
    setFracao(0)
    setEtapa('preparando')
    setConfirmarCancelamento(false)
    setTela('enviando')
    let ultimaFracao = 0
    try {
      const video = await enviarVideo(itemId, pronto.arquivo, {
        tipo: pronto.tipo,
        duracaoSegundos: pronto.duracaoSegundos,
        onEtapa: setEtapa,
        onProgresso: valor => { ultimaFracao = valor; setFracao(valor) },
        signal: controle.signal,
      })
      navegar(voltar, { state: { avisoVideo: avisoDeSucesso(video.modo, treino.treinadorNome) } })
    } catch (erro) {
      if (cancelado(erro)) {
        if (cancelamentoPedido.current) {
          navegar(voltar, {
            state: {
              avisoVideo: videoAtual
                ? 'Envio cancelado. Seu vídeo atual continua salvo.'
                : 'Envio cancelado. Nenhum vídeo foi salvo.',
            },
          })
        }
        return
      }
      const falha = classificarErro(erro)
      if (falha.tipo === 'conexao') {
        setParouEm(Math.round(ultimaFracao * 100))
        setTela('falha')
      } else if (falha.tipo === 'arquivo') {
        setRecusa({ motivo: falha.mensagem, dica: `Confira o arquivo: ${TEXTO_LIMITES}.`, regras: [] })
        setTela('invalido')
      } else if (falha.tipo === 'sessao') {
        setTela('sessao')
      } else {
        setMensagem(falha.mensagem)
        setTela(falha.tipo === 'bloqueado' ? 'bloqueado' : 'erro')
      }
    } finally {
      envio.current = null
    }
  }

  function cancelarEnvio() {
    cancelamentoPedido.current = true
    envio.current?.abort()
  }

  function fecharDialogo() {
    setConfirmarCancelamento(false)
    requestAnimationFrame(() => botaoCancelar.current?.focus())
  }

  function teclaNoDialogo(evento: KeyboardEvent<HTMLDivElement>) {
    if (evento.key === 'Escape') {
      fecharDialogo()
      return
    }
    if (evento.key !== 'Tab') return
    // Mantém o foco dentro do diálogo enquanto ele estiver aberto.
    const botoes = Array.from(evento.currentTarget.querySelectorAll('button'))
    const posicao = botoes.indexOf(document.activeElement as HTMLButtonElement)
    const proximo = evento.shiftKey ? posicao - 1 : posicao + 1
    evento.preventDefault()
    botoes[(proximo + botoes.length) % botoes.length]?.focus()
  }

  const seletores = (
    <>
      <input ref={seletorArquivo} className="treino-sr" type="file" accept={TIPOS_ACEITOS} tabIndex={-1}
        aria-hidden="true" data-testid="seletor-arquivo"
        onChange={evento => { void escolher(evento.target.files?.[0]); evento.target.value = '' }} />
      <input ref={seletorCamera} className="treino-sr" type="file" accept={TIPOS_ACEITOS} capture="environment"
        tabIndex={-1} aria-hidden="true"
        onChange={evento => { void escolher(evento.target.files?.[0]); evento.target.value = '' }} />
    </>
  )
  const linkVoltar = (principal = false) => (
    <Link className={principal ? 'treino-botao treino-botao--principal' : 'treino-botao'} to={voltar}>
      Voltar ao exercício
    </Link>
  )
  const atualContinuaSalvo = videoAtual && <p>Seu vídeo atual continua salvo e disponível para {treinador}.</p>

  if (tela === 'verificando') {
    return (
      <section className="video-carregando" role="status">
        <span className="video-giro" aria-hidden="true" />
        <h1 ref={titulo} tabIndex={-1}>Verificando o vídeo…</h1>
        <p>Lendo formato, duração e tamanho no seu aparelho. Nada é enviado nesta etapa.</p>
      </section>
    )
  }

  if (tela === 'invalido' && recusa) {
    return (
      <section className="treino-tela video-tela">
        {seletores}
        <TituloTreino titulo="Não foi possível usar este vídeo" detalhe={recusa.motivo} tituloRef={titulo} />
        <div className="treino-colunas">
          <div className="treino-cartao treino-aviso video-recusa" role="alert">
            <h2>Confira o arquivo</h2>
            {recusa.regras.length > 0 && <ListaDeRegras regras={recusa.regras} />}
            <p>{recusa.dica}</p>
          </div>
          {atualContinuaSalvo && <div className="treino-cartao">{atualContinuaSalvo}</div>}
        </div>
        <div className="treino-acoes">
          <button className="treino-botao treino-botao--principal" type="button" onClick={() => abrirSeletor()}>
            Selecionar outro arquivo
          </button>
          {linkVoltar()}
        </div>
      </section>
    )
  }

  if (tela === 'previa' && pronto) {
    const { arquivo, duracaoSegundos, url } = pronto
    const resumo = `${formatarDuracao(duracaoSegundos)} · ${formatarTamanho(arquivo.size)}`
    return (
      <section className="treino-tela video-tela">
        {seletores}
        <TituloTreino titulo={textos.previa} detalhe={`${arquivo.name} · ${resumo}`} tituloRef={titulo} />
        <div className="treino-colunas video-previa">
          <div className="video-previa-player">
            {url && !previaFalhou ? (
              <video className="video-player" src={url} controls playsInline preload="metadata"
                aria-label={`Prévia de ${arquivo.name}`} onError={() => setPreviaFalhou(true)} />
            ) : (
              <div className="treino-cartao">
                <h2>Prévia indisponível neste navegador</h2>
                <p>O vídeo passou na verificação e pode ser enviado. Vídeos HEVC do iPhone, por exemplo, nem sempre tocam no computador.</p>
              </div>
            )}
          </div>
          <div className="video-previa-lateral">
            {modo === 'SUBSTITUICAO' && videoAtual ? (
              <section className="treino-cartao">
                <h2>Revise antes de confirmar</h2>
                <div className="video-comparacao">
                  <div>
                    <span>Atual</span>
                    <strong>Enviado em {formatarDiaMes(videoAtual.substituidoEm ?? videoAtual.enviadoEm)}</strong>
                    <small>{formatarDuracao(videoAtual.duracaoSegundos)} · {formatarTamanho(videoAtual.tamanhoBytes)}</small>
                  </div>
                  <div data-novo="true">
                    <span>Novo</span>
                    <strong>{arquivo.name}</strong>
                    <small>{resumo}</small>
                  </div>
                </div>
                <p>O vídeo atual só é trocado se o novo envio for concluído com sucesso.</p>
              </section>
            ) : (
              <section className="treino-cartao">
                <h2>Antes de enviar</h2>
                <p>O arquivo ainda não foi enviado. Assista à prévia e confirme, ou escolha outro vídeo.</p>
                {modo === 'NOVA_TENTATIVA' && videoAtual && (
                  <p>A tentativa {videoAtual.tentativa} continua no histórico, com o feedback que você recebeu.</p>
                )}
              </section>
            )}
            <section className="treino-cartao">
              <h2>Quem vai ver</h2>
              <p>{textoQuemVe(treino.treinadorNome)}</p>
            </section>
          </div>
        </div>
        <div className="treino-acoes">
          <button className="treino-botao treino-botao--principal" type="button" onClick={() => void enviar()}>
            {textos.confirmar}
          </button>
          <button className="treino-botao" type="button" onClick={() => abrirSeletor()}>Escolher outro vídeo</button>
          <Link className="treino-botao" to={voltar}>{modo === 'SUBSTITUICAO' ? 'Manter vídeo atual' : 'Cancelar'}</Link>
        </div>
      </section>
    )
  }

  if (tela === 'enviando' && pronto) {
    // A barra para em 99% até o servidor confirmar: 100% só quando o vídeo existe (CA02).
    const porcentagem = etapa === 'preparando' ? 0 : etapa === 'confirmando' ? 99 : Math.min(99, Math.round(fracao * 100))
    const enviadoMb = formatarTamanho(Math.min(fracao, 1) * pronto.arquivo.size)
    return (
      <section className="treino-tela video-tela" aria-busy="true">
        <TituloTreino titulo={textos.enviando} detalhe="Mantenha esta tela aberta." tituloRef={titulo} />
        <div className="treino-colunas">
          <section className="treino-cartao video-progresso">
            <h2 aria-live="polite">{textoDaEtapa[etapa]}</h2>
            <progress max={100} value={porcentagem} aria-label="Progresso do envio" />
            <p className="video-progresso-numeros">
              <strong>{porcentagem}%</strong>
              <span>{etapa === 'enviando' ? `${enviadoMb} de ${formatarTamanho(pronto.arquivo.size)}` : pronto.arquivo.name}</span>
            </p>
          </section>
          <section className="treino-cartao">
            <h2>{pronto.arquivo.name}</h2>
            <p>Aguarde a confirmação antes de sair. Se você fechar o app agora, o envio é interrompido.</p>
            {modo === 'SUBSTITUICAO' && <p>Seu vídeo atual continua salvo até o novo envio terminar.</p>}
          </section>
        </div>
        <div className="treino-acoes">
          <button ref={botaoCancelar} className="treino-botao" type="button" disabled={etapa === 'confirmando'}
            onClick={() => setConfirmarCancelamento(true)}>
            Cancelar envio
          </button>
        </div>
        {confirmarCancelamento && (
          <div className="video-dialogo-fundo">
            <div className="treino-cartao video-dialogo" role="alertdialog" aria-modal="true"
              aria-labelledby="video-cancelar-titulo" aria-describedby="video-cancelar-texto" onKeyDown={teclaNoDialogo}>
              <h2 id="video-cancelar-titulo">Cancelar o envio?</h2>
              <p id="video-cancelar-texto">
                {videoAtual
                  ? 'O que já foi enviado será descartado e o seu vídeo atual continua salvo.'
                  : 'O que já foi enviado será descartado e nenhum vídeo ficará salvo.'}
              </p>
              <button ref={botaoContinuar} className="treino-botao treino-botao--principal" type="button" onClick={fecharDialogo}>
                Continuar enviando
              </button>
              <button className="treino-botao" type="button" onClick={cancelarEnvio}>Cancelar envio</button>
            </div>
          </div>
        )}
      </section>
    )
  }

  if (tela === 'falha') {
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo="O envio não foi concluído" tituloRef={titulo}
          detalhe={`A conexão caiu em ${parouEm}%. Confira sua internet e tente novamente.`} />
        <section className="treino-cartao video-resultado">
          <h2>{videoAtual ? 'Seu vídeo atual continua salvo' : 'Nenhum vídeo foi salvo'}</h2>
          <p>“Tentar novamente” reenvia o mesmo arquivo, sem precisar escolher outra vez.</p>
        </section>
        <div className="treino-acoes">
          <button className="treino-botao treino-botao--principal" type="button" onClick={() => void enviar()}>
            Tentar novamente
          </button>
          {linkVoltar()}
        </div>
      </section>
    )
  }

  if (tela === 'erro' || tela === 'bloqueado') {
    const bloqueado = tela === 'bloqueado'
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo="Não foi possível concluir" detalhe={mensagem} tituloRef={titulo} />
        <section className={bloqueado ? 'treino-cartao treino-aviso video-resultado' : 'treino-cartao video-resultado'} role="alert">
          <h2>{bloqueado ? 'A situação do exercício mudou' : 'O vídeo não foi salvo'}</h2>
          <p>
            {bloqueado
              ? `${treinador.charAt(0).toUpperCase() + treinador.slice(1)} atualizou o treino enquanto você enviava. Volte ao exercício para ver o que pode ser feito agora.`
              : 'Nada foi alterado no seu exercício.'}
          </p>
          {atualContinuaSalvo}
        </section>
        <div className="treino-acoes">
          {!bloqueado && pronto && (
            <button className="treino-botao treino-botao--principal" type="button" onClick={() => void enviar()}>
              Tentar novamente
            </button>
          )}
          {linkVoltar(bloqueado)}
        </div>
      </section>
    )
  }

  if (tela === 'sessao') {
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo="Sua sessão expirou" tituloRef={titulo}
          detalhe="Entre novamente para enviar o vídeo. Nenhum vídeo foi salvo." />
        <div className="treino-acoes">
          <Link className="treino-botao treino-botao--principal" to="/login">Entrar novamente</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="treino-tela video-tela">
      {seletores}
      <TituloTreino titulo={textos.selecao} detalhe={subtitulo} tituloRef={titulo} />
      <div className="treino-colunas">
        <section className="treino-cartao video-origem" aria-labelledby="video-origem-titulo">
          <h2 id="video-origem-titulo">Como você quer enviar?</h2>
          {comCamera && (
            <button className="video-opcao" type="button" onClick={() => abrirSeletor(true)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" />
              </svg>
              Gravar agora
            </button>
          )}
          <button className="video-opcao" type="button" onClick={() => abrirSeletor()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="M21 16l-5-5-8 8" />
            </svg>
            {comCamera ? 'Escolher da galeria' : 'Escolher arquivo de vídeo'}
          </button>
          <p>O vídeo é verificado no seu aparelho antes de qualquer envio.</p>
        </section>
        <div className="video-previa-lateral">
          <section className="treino-cartao">
            <h2>Limites do envio</h2>
            <ul className="video-limites">
              <li>Formato MP4 ou MOV</li>
              <li>Até {LIMITE_SEGUNDOS} segundos</li>
              <li>Até {LIMITE_MB} MB</li>
            </ul>
          </section>
          {modo === 'SUBSTITUICAO' && videoAtual && (
            <section className="treino-cartao">
              <h2>Vídeo atual</h2>
              <p>
                Enviado em {formatarDiaMes(videoAtual.substituidoEm ?? videoAtual.enviadoEm)} · {formatarDuracao(videoAtual.duracaoSegundos)}.
                {' '}Ele só é trocado se o novo envio terminar, e então é apagado.
              </p>
            </section>
          )}
          <section className="treino-cartao">
            <h2>Quem vai ver</h2>
            <p>{textoQuemVe(treino.treinadorNome)}</p>
          </section>
        </div>
      </div>
      <div className="treino-acoes">{linkVoltar()}</div>
    </section>
  )
}

function mensagemDeCarga(erro: unknown) {
  if (erro instanceof ApiError) {
    if (erro.status === 401) return 'Sua sessão expirou. Entre novamente para enviar o vídeo.'
    if (erro.status === 403) return 'Você não tem permissão para enviar vídeo neste exercício.'
    if (erro.status === 404) return 'Exercício não encontrado.'
  }
  return null
}

function TelaEnvio({ treinoId, itemId, alunoId }: { treinoId: number; itemId: number; alunoId: number }) {
  const [carga, setCarga] = useState<Carga>({ estado: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    consultarExercicioComVideo(treinoId, itemId, controle.signal).then(dados => {
      if (controle.signal.aborted) return
      const { envioVideo } = dados.exercicio
      if (dados.treino.alunoId !== alunoId) {
        setCarga({ estado: 'indisponivel', titulo: 'Enviar vídeo', mensagem: 'Você não tem permissão para enviar vídeo neste exercício.' })
      } else if (!envioVideo?.permitido || !envioVideo.modo) {
        // O servidor já disse que não aceita: explica o motivo em vez de deixar tentar e falhar (H5).
        const bloqueio = textoDoBloqueio(envioVideo?.motivo ?? 'TREINO_CONCLUIDO', dados.treino.treinadorNome)
        setCarga({ estado: 'indisponivel', titulo: bloqueio.titulo, mensagem: bloqueio.texto })
      } else {
        setCarga({ estado: 'pronto', dados, modo: envioVideo.modo })
      }
    }).catch((erro: unknown) => {
      if (controle.signal.aborted) return
      const mensagem = mensagemDeCarga(erro)
      setCarga(mensagem
        ? { estado: 'indisponivel', titulo: 'Enviar vídeo', mensagem }
        : {
            estado: 'indisponivel', titulo: 'Não foi possível concluir',
            mensagem: 'Não foi possível carregar o exercício. Confira sua conexão e tente novamente.',
            tentarNovamente: () => { setCarga({ estado: 'carregando' }); setTentativa(valor => valor + 1) },
          })
    })
    return () => controle.abort()
  }, [treinoId, itemId, alunoId, tentativa])

  if (carga.estado === 'carregando') return <p className="treino-cartao" role="status">Carregando o exercício…</p>
  if (carga.estado === 'indisponivel') {
    return (
      <section className="treino-tela video-tela">
        <TituloTreino titulo={carga.titulo} />
        <div className="treino-cartao treino-aviso" role="alert"><p>{carga.mensagem}</p></div>
        <div className="treino-acoes">
          {carga.tentarNovamente && (
            <button className="treino-botao treino-botao--principal" type="button" onClick={carga.tentarNovamente}>
              Tentar novamente
            </button>
          )}
          <Link className="treino-botao" to={caminhoExercicio(treinoId, itemId)}>Voltar ao exercício</Link>
        </div>
      </section>
    )
  }
  return <FluxoDeEnvio treinoId={treinoId} itemId={itemId} dados={carga.dados} modo={carga.modo} />
}

export function EnviarVideoPage() {
  const { usuario } = useAuth()
  const params = useParams()
  if (!usuario) return null
  const treinoId = idValido(params.treinoId)
  const itemId = idValido(params.itemId)

  return (
    <TreinoLayout usuario={usuario} links={navegacaoAluno}>
      {treinoId && itemId
        ? <TelaEnvio key={`${treinoId}:${itemId}`} treinoId={treinoId} itemId={itemId} alunoId={usuario.id} />
        : <p className="treino-cartao" role="alert">Exercício não encontrado.</p>}
    </TreinoLayout>
  )
}
