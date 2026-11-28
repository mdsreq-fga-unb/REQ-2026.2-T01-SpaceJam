import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { api, ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import type { SituacaoEnvio, VideoExecucao } from '../videos/videosApi'
import { DetalheTreino, type ConsultaTreino } from './DetalheTreino'
import type { StatusTreino } from './EstadoTreino'
import type { AlteracaoFeedback, FeedbackAluno } from './FeedbackExercicio'
import type { UsuarioTreino } from './TreinoLayout'
import { navegacaoAluno, navegacaoTreinador as navegacaoTreino } from './navegacao'

type StatusApi = 'EM_ANDAMENTO' | 'FEITO' | 'CORRIGIR_REFAZER' | 'CONCLUIDO'

interface DetalheApi {
  nome: string
  titulo?: string
  alunoId: number
  alunoNome: string
  treinadorNome: string
  statusSlug: StatusTreino
  objetivo?: string
  data?: string | null
  exercicios: {
    id: number
    nome: string
    parametros: string
    resumo?: string
    orientacoes: string
    errosComuns: string
    errosOrientacoes?: { erro: string; orientacao_corretiva: string }[]
    videoTitulo?: string
    videoDescricao?: string
    feedback?: FeedbackAluno | null
    videoExecucao?: VideoExecucao | null
    envioVideo?: SituacaoEnvio
  }[]
}

/** US42: as telas de vídeo voltam para cá com `?exercicio=<id>` e um aviso no `state`. */
function useRetornoDoVideo() {
  const local = useLocation()
  const navegar = useNavigate()
  const [retorno] = useState(() => ({
    exercicio: Number(new URLSearchParams(local.search).get('exercicio')) || undefined,
    aviso: (local.state as { avisoVideo?: string } | null)?.avisoVideo,
  }))

  useEffect(() => {
    // Limpa o endereço: recarregar a página não reabre o aviso (mesmo padrão da US37).
    if (local.search || local.state) navegar(local.pathname, { replace: true, state: null })
  }, [local.pathname, local.search, local.state, navegar])

  return retorno
}

const dataCurta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeZone: 'UTC' })

function dadosDoTreino(detalhe: DetalheApi): ConsultaTreino {
  const { statusSlug, data, ...dados } = detalhe
  return {
    ...dados,
    estado: 'disponivel',
    status: statusSlug,
    data: data ? dataCurta.format(new Date(data + 'T00:00:00Z')) : undefined,
  }
}

function TelaTreino({ usuario, id }: { usuario: UsuarioTreino; id: number }) {
  const [consulta, setConsulta] = useState<ConsultaTreino>({ estado: 'carregando' })
  const [tentativa, setTentativa] = useState(0)
  const requisicao = useRef<AbortController>(null)
  const navegar = useNavigate()
  const retornoDoVideo = useRetornoDoVideo()
  const rota = '/treinos/' + id + '/'

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle
    requisicao.current = controle
    api<DetalheApi>(rota, { signal }).then(detalhe => {
      if (!signal.aborted) setConsulta(dadosDoTreino(detalhe))
    }).catch((erro: unknown) => {
      if (signal.aborted) return
      const status = erro instanceof ApiError ? erro.status : undefined
      if (status === 403) {
        setConsulta({ estado: 'erro', mensagem: 'Você não tem permissão para consultar este treino.' })
      } else if (status === 404) {
        setConsulta({ estado: 'erro', mensagem: 'Treino não encontrado.' })
      } else if (status === 401) {
        setConsulta({ estado: 'erro', mensagem: 'Sua sessão expirou. Entre novamente para consultar o treino.' })
      } else {
        setConsulta({
          estado: 'erro',
          tentarNovamente: () => {
            setConsulta({ estado: 'carregando' })
            setTentativa(valor => valor + 1)
          },
        })
      }
    })
    return () => controle.abort()
  }, [rota, tentativa])

  async function atualizarAposConflito(erro: unknown, signal?: AbortSignal) {
    if (!(erro instanceof ApiError) || erro.status !== 409 || signal?.aborted) return

    const detalhe = await api<DetalheApi>(rota, { signal }).catch(() => null)
    if (detalhe && !signal?.aborted) setConsulta(dadosDoTreino(detalhe))
  }

  async function enviarStatus(acao: 'feito' | 'concluir', status: StatusApi) {
    const signal = requisicao.current?.signal
    try {
      const resposta = await api<Pick<DetalheApi, 'statusSlug'>>(rota + acao + '/', {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        signal,
      })
      if (!signal?.aborted) {
        setConsulta(atual => atual.estado === 'disponivel' ? { ...atual, status: resposta.statusSlug } : atual)
      }
    } catch (erro) {
      await atualizarAposConflito(erro, signal)
      throw erro
    }
  }

  async function salvarFeedback(itemId: number, { tipo, texto }: AlteracaoFeedback) {
    const signal = requisicao.current?.signal
    try {
      const feedback = await api<FeedbackAluno>('/treinos/exercicios/' + itemId + '/feedback-aluno/', {
        method: tipo === 'registrar' ? 'POST' : 'PATCH',
        body: JSON.stringify({ texto }),
        signal,
      })
      if (!signal?.aborted) {
        setConsulta(atual => atual.estado === 'disponivel' ? {
          ...atual,
          exercicios: atual.exercicios.map(item => item.id === itemId ? { ...item, feedback } : item),
        } : atual)
      }
    } catch (erro) {
      await atualizarAposConflito(erro, signal)
      throw erro
    }
  }

  const aluno = usuario.papel === 'ALUNO'
  return <DetalheTreino usuario={usuario} consulta={consulta} navegacao={aluno ? navegacaoAluno : navegacaoTreino}
    onMarcarFeito={aluno ? () => enviarStatus('feito', 'FEITO') : undefined}
    onDesfazerFeito={aluno ? () => enviarStatus('feito', 'EM_ANDAMENTO') : undefined}
    onDevolver={!aluno ? () => enviarStatus('concluir', 'CORRIGIR_REFAZER') : undefined}
    onConcluir={!aluno ? () => enviarStatus('concluir', 'CONCLUIDO') : undefined}
    onVoltarPlanejamento={aluno ? () => navegar('/treinos')
      : consulta.estado === 'disponivel'
        ? () => navegar('/treinador/alunos/' + consulta.alunoId + '/planejamento')
        : undefined}
    onSalvarFeedback={aluno ? salvarFeedback : undefined}
    treinoId={id} exercicioInicial={retornoDoVideo.exercicio} avisoVideo={retornoDoVideo.aviso}
  />
}

export function TreinoPage() {
  const { usuario } = useAuth()
  const { treinoId } = useParams()
  if (!usuario) return null

  const id = Number(treinoId)
  if (!treinoId || !/^\d+$/.test(treinoId) || !Number.isSafeInteger(id) || id < 1) {
    return <DetalheTreino usuario={usuario} navegacao={usuario.papel === 'ALUNO' ? navegacaoAluno : navegacaoTreino}
      consulta={{ estado: 'erro', mensagem: 'Treino não encontrado.' }} />
  }
  return <TelaTreino key={usuario.id + ':' + id} usuario={usuario} id={id} />
}
