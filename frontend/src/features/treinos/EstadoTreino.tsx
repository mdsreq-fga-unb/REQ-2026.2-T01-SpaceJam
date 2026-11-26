import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Papel } from '../../types/usuario'
import { TituloTreino } from './TreinoLayout'

export type StatusTreino = 'em-andamento' | 'feito' | 'corrigir-refazer' | 'concluido'

export type ConsultaStatus =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem?: string; tentarNovamente?: () => void }
  | { estado: 'disponivel'; status: StatusTreino }

interface ContextoTreino {
  nome: string
  titulo?: string
  alunoNome?: string
  treinadorNome?: string
  data?: string
  conclusaoEm?: string
  feitos?: number
  quantidade?: number
  onContinuar?: () => void
}

interface EstadoTreinoProps {
  papel: Papel
  consulta: ConsultaStatus
  contexto?: ContextoTreino
  onMarcarFeito?: () => Promise<void>
  onDesfazerFeito?: () => Promise<void>
  onDevolver?: () => Promise<void>
  onConcluir?: () => Promise<void>
  onVerHistorico?: () => void
  onVoltarPlanejamento?: () => void
  alerta?: ReactNode
  lateral?: ReactNode
  children?: ReactNode
}

const rotulos: Record<StatusTreino, string> = {
  'em-andamento': 'Em andamento',
  feito: 'Feito',
  'corrigir-refazer': 'Corrigir/Refazer',
  concluido: 'Concluído',
}

const mensagemSomenteLeitura = 'A dificuldade e o feedback do aluno ficam somente para leitura.'
const aguardandoAvaliacao = 'O treino aguarda a avaliação do treinador.'

function CartaoAluno({ contexto, status }: { contexto: ContextoTreino; status: Exclude<StatusTreino, 'concluido'> }) {
  const { nome, titulo, treinadorNome, feitos = 0, quantidade = 0, onContinuar } = contexto
  const subtitulo = [titulo, treinadorNome && `orientado por ${treinadorNome}`].filter(Boolean).join(' · ')
  const progresso = quantidade > 0 ? `${feitos} de ${quantidade} exercícios marcados como feitos` : ''

  return (
    <section className="treino-hero" aria-label="Progresso do treino">
      <img className="treino-hero-quadra" src="/treinos/quadra.svg" width="151" height="195" alt="" />
      <span className="treino-hero-selo">
        <span aria-hidden="true">● </span>{status === 'feito' ? 'FEITO · EM AVALIAÇÃO' : rotulos[status].toUpperCase()}
      </span>
      <h2>{nome}</h2>
      {subtitulo && <p className="treino-hero-orientacao">{subtitulo}</p>}
      {progresso && (
        <div className="treino-hero-progresso">
          <p>{progresso}</p>
          <progress max={quantidade} value={feitos} aria-label={progresso} />
        </div>
      )}
      {status === 'feito' ? <p className="treino-hero-aguardando">Aguardando avaliação</p> : onContinuar && (
        <button className="treino-hero-botao" type="button" onClick={onContinuar}>
          Continuar treino
          <img src="/treinos/seta-avanco.svg" width="18" height="18" alt="" />
        </button>
      )}
    </section>
  )
}

export function EstadoTreino({
  papel, consulta, contexto, onMarcarFeito, onDesfazerFeito, onDevolver, onConcluir, onVerHistorico,
  onVoltarPlanejamento, alerta, lateral, children,
}: EstadoTreinoProps) {
  const [tela, setTela] = useState<'treino' | 'confirmar' | 'feito'>('treino')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const emEnvio = useRef(false)
  const tituloDaAcao = useRef<HTMLHeadingElement>(null)
  const botaoConcluir = useRef<HTMLButtonElement>(null)
  const aluno = papel === 'ALUNO'
  const status = consulta.estado === 'disponivel' ? consulta.status : null

  useEffect(() => {
    if (tela !== 'treino' || status === 'concluido') tituloDaAcao.current?.focus()
  }, [tela, status])

  async function registrar(acao: () => Promise<void>, emCasoDeFalha: string, destino: typeof tela) {
    if (emEnvio.current) return
    emEnvio.current = true
    setSalvando(true)
    setErro('')
    try {
      await acao()
      setTela(destino)
    } catch {
      setErro(emCasoDeFalha)
    } finally {
      emEnvio.current = false
      setSalvando(false)
    }
  }

  if (consulta.estado === 'carregando') {
    return <p className="treino-cartao" role="status">Carregando status do treino…</p>
  }

  if (consulta.estado === 'erro') {
    return (
      <div className="treino-cartao">
        <p role="alert">{consulta.mensagem ?? 'Não foi possível consultar o status do treino.'}</p>
        {consulta.tentarNovamente && (
          <button className="treino-botao" type="button" onClick={consulta.tentarNovamente}>Tentar novamente</button>
        )}
      </div>
    )
  }

  const { status: estado } = consulta
  const tituloDoTreino = contexto?.titulo || contexto?.nome || 'Treino'
  const resumoTreinador = [contexto?.alunoNome, tituloDoTreino].filter(Boolean).join(' · ')
  const erroEnvio = erro && <p className="treino-erro" role="alert">{erro}</p>
  const selo = <span className="treino-selo" data-status={estado}>{rotulos[estado]}</span>

  if (!aluno && tela === 'confirmar' && estado !== 'concluido' && onConcluir) {
    return (
      <section className="treino-tela" aria-busy={salvando}>
        <TituloTreino titulo="Concluir este treino?" detalhe={resumoTreinador} tituloRef={tituloDaAcao} />
        <div className="treino-colunas treino-colunas--cartoes treino-confirmacao-cartoes">
          <section className="treino-cartao">
            <h2>Confirme sua avaliação</h2>
            <p>Conclua após conferir os vídeos ou acompanhar a execução presencialmente. A conclusão presencial pode ocorrer mesmo se o aluno não marcou o treino como Feito.</p>
          </section>
          <section className="treino-cartao treino-aviso">
            <h2>Após concluir</h2>
            <p>{mensagemSomenteLeitura}</p>
          </section>
        </div>
        {erroEnvio}
        <div className="treino-acoes">
          <button className="treino-botao treino-botao--principal" type="button" disabled={salvando}
            onClick={() => void registrar(onConcluir, 'Não foi possível concluir o treino. Tente novamente.', 'treino')}>
            {salvando ? 'Salvando…' : 'Confirmar conclusão'}
          </button>
          <button className="treino-botao" type="button" disabled={salvando}
            onClick={() => {
              setErro('')
              setTela('treino')
              requestAnimationFrame(() => botaoConcluir.current?.focus())
            }}>
            Continuar avaliação
          </button>
        </div>
      </section>
    )
  }

  if (aluno && tela === 'feito' && estado === 'feito') {
    const treinador = contexto?.treinadorNome
    return (
      <section className="treino-tela">
        <TituloTreino titulo="Treino marcado como feito"
          detalhe={[contexto?.nome, contexto?.data].filter(Boolean).join(' · ')} tituloRef={tituloDaAcao} />
        <div role="status">{selo}</div>
        <div className="treino-texto">
          <h2>{treinador ? `Agora é com ${treinador}` : 'Aguarde a avaliação'}</h2>
          <p>Seu treino aguarda a avaliação do treinador. O status mudará para Concluído quando ele registrar a conclusão.</p>
        </div>
        <button className="treino-botao treino-botao--voltar" type="button" onClick={() => setTela('treino')}>
          Voltar ao treino
        </button>
      </section>
    )
  }

  if (estado === 'concluido') {
    const responsavel = contexto?.treinadorNome || 'O treinador'
    const descricaoAluno = contexto?.conclusaoEm && `${responsavel} registrou a conclusão em ${contexto.conclusaoEm}.`
    return (
      <section className="treino-tela">
        <TituloTreino titulo="Treino concluído" detalhe={aluno ? descricaoAluno : resumoTreinador} tituloRef={tituloDaAcao} />
        <span className="treino-sr" role="status">Concluído</span>
        {children}
        <section className={`treino-cartao treino-resumo-conclusao${aluno ? ' treino-aviso' : ''}`}>
          <h2>{aluno ? 'Registro somente para consulta' : 'Histórico preservado'}</h2>
          <p>{aluno ? mensagemSomenteLeitura : 'Os registros da execução continuam disponíveis para consulta.'}</p>
        </section>
        {onVerHistorico && (
          <div className="treino-acoes">
            <button className="treino-botao treino-botao--principal" type="button" onClick={onVerHistorico}>
              {aluno ? 'Ver histórico' : 'Consultar histórico'}
            </button>
            {!aluno && onVoltarPlanejamento && (
              <button className="treino-botao" type="button" onClick={onVoltarPlanejamento}>Voltar ao planejamento</button>
            )}
          </div>
        )}
      </section>
    )
  }

  const marcarFeito = aluno && (estado === 'em-andamento' || estado === 'corrigir-refazer') ? onMarcarFeito : undefined
  const acaoAluno = (
    <>
      {erroEnvio}
      {marcarFeito && (
        <button className="treino-botao treino-botao--principal" type="button" disabled={salvando}
          onClick={() => void registrar(marcarFeito, 'Não foi possível marcar o treino como feito. Tente novamente.', 'feito')}>
          {salvando ? 'Salvando…' : 'Marcar treino como feito'}
        </button>
      )}
      {estado === 'feito' && <p className="treino-status-ajuda">{aguardandoAvaliacao}</p>}
      {estado === 'feito' && onDesfazerFeito && (
        <button className="treino-botao" type="button" disabled={salvando}
          onClick={() => void registrar(onDesfazerFeito, 'Não foi possível desfazer a marcação. Tente novamente.', 'treino')}>
          Desfazer marcação
        </button>
      )}
    </>
  )

  return (
    <section className="treino-tela" aria-busy={salvando}>
      <TituloTreino
        titulo={aluno ? 'Seu treino' : [tituloDoTreino, contexto?.alunoNome].filter(Boolean).join(' · ')}
        detalhe={aluno ? contexto?.data : (
          <span role="status">
            <span>{rotulos[estado]}</span>
            {estado === 'feito' && ' · aguardando sua avaliação'}
          </span>
        )} />
      {alerta}
      {aluno && contexto && <CartaoAluno contexto={contexto} status={estado} />}
      {aluno ? (
        <div className="treino-aluno-grade">
          <div className="treino-aluno-principal">
            {contexto && <h2 className="treino-apenas-desktop treino-nome">{contexto.nome}</h2>}
            <div role="status" className={contexto ? 'treino-apenas-desktop' : undefined}>{selo}</div>
            {contexto?.quantidade ? (
              <p className="treino-apenas-desktop treino-progresso-texto">
                {contexto.feitos ?? 0} de {contexto.quantidade} exercícios marcados como feitos
              </p>
            ) : null}
            {children}
            {acaoAluno}
          </div>
          {lateral}
        </div>
      ) : (
        <>
          {children}
          {erroEnvio}
          {(onConcluir || onDevolver || onVoltarPlanejamento) && (
            <div className="treino-acoes">
              {onConcluir && (
                <button ref={botaoConcluir} className="treino-botao treino-botao--principal" type="button" disabled={salvando}
                  onClick={() => { setErro(''); setTela('confirmar') }}>
                  Concluir treino
                </button>
              )}
              {onDevolver && estado !== 'corrigir-refazer' && (
                <button className="treino-botao" type="button" disabled={salvando}
                  onClick={() => void registrar(onDevolver, 'Não foi possível devolver o treino. Tente novamente.', 'treino')}>
                  Devolver para correção
                </button>
              )}
              {onVoltarPlanejamento && (
                <button className="treino-botao" type="button" onClick={onVoltarPlanejamento}>Voltar ao planejamento</button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  )
}
