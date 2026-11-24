import { useEffect, useRef, useState } from 'react'
import { EstadoTreino, type ConsultaStatus, type StatusTreino } from './EstadoTreino'
import { FeedbackExercicio, FormularioFeedback, type AlteracaoFeedback, type FeedbackAluno } from './FeedbackExercicio'
import { TituloTreino, TreinoLayout, type UsuarioTreino } from './TreinoLayout'

interface ExercicioDoTreino {
  id: number
  nome: string
  feedback: FeedbackAluno | null
  parametros?: string
  resumo?: string
  situacao?: string
  feito?: boolean
  feedbackTreinador?: string
  orientacoes?: string
  errosComuns?: string
}

type TreinoDisponivel = {
  estado: 'disponivel'
  nome: string
  alunoId: number
  status: StatusTreino
  exercicios: ExercicioDoTreino[]
  titulo?: string
  alunoNome?: string
  treinadorNome?: string
  data?: string
  conclusaoEm?: string
  objetivo?: string
  avisoFeedback?: string
}

export type ConsultaTreino = Exclude<ConsultaStatus, { estado: 'disponivel' }> | TreinoDisponivel

interface DetalheTreinoProps {
  usuario: UsuarioTreino
  consulta: ConsultaTreino
  navegacao?: Parameters<typeof TreinoLayout>[0]['links']
  onMarcarFeito?: () => Promise<void>
  onConcluir?: () => Promise<void>
  onSalvarFeedback?: (exercicioId: number, alteracao: AlteracaoFeedback) => Promise<void>
  onAbrirExercicio?: (exercicioId: number) => void
  onVerHistorico?: () => void
  onVoltarPlanejamento?: () => void
  onVerFeedback?: () => void
}

function NomeExercicio({ exercicio, numero, aluno, onAbrir }: {
  exercicio: ExercicioDoTreino
  numero: number
  aluno: boolean
  onAbrir?: () => void
}) {
  const { nome, parametros, situacao, resumo, feito } = exercicio
  const acao = aluno ? 'Ver exercício' : 'Consultar'
  const icone = feito ? '/treinos/ver-exercicio.svg' : '/treinos/abrir-exercicio.svg'

  return (
    <div className={aluno ? 'treino-exercicio-linha treino-exercicio-linha--aluno' : 'treino-exercicio-linha'}>
      {aluno && <span className="treino-exercicio-numero" aria-hidden="true">{String(numero).padStart(2, '0')}</span>}
      <div className="treino-exercicio-dados">
        <h2>{nome}</h2>
        {(resumo || parametros) && <p>{resumo || parametros}</p>}
        {aluno && situacao && <p className="treino-exercicio-situacao">{situacao}</p>}
        {onAbrir && (
          <button className="treino-atalho treino-atalho-exercicio" type="button" onClick={onAbrir}
            aria-label={`${acao}: ${nome}`}>
            <span>{acao}</span>
            {aluno && <img src={icone} width="18" height="18" alt="" />}
          </button>
        )}
      </div>
      {aluno && situacao && <span className="treino-selo treino-exercicio-selo">{situacao.split(' · ')[0]}</span>}
    </div>
  )
}

export function DetalheTreino({
  usuario, consulta, navegacao, onMarcarFeito, onConcluir, onSalvarFeedback,
  onAbrirExercicio, onVerHistorico, onVoltarPlanejamento, onVerFeedback,
}: DetalheTreinoProps) {
  const [selecao, setSelecao] = useState<{ id: number; tela: 'exercicio' | 'feedback' } | null>(null)
  const tituloExercicio = useRef<HTMLHeadingElement>(null)
  const idExercicioVisivel = selecao?.tela === 'exercicio' ? selecao.id : null
  const aluno = usuario.papel === 'ALUNO'

  useEffect(() => {
    if (idExercicioVisivel !== null) tituloExercicio.current?.focus()
  }, [idExercicioVisivel])

  if (consulta.estado !== 'disponivel' || (aluno && usuario.id !== consulta.alunoId)) {
    const consultaIndisponivel = consulta.estado === 'disponivel' ? { estado: 'erro' } as const : consulta
    return (
      <TreinoLayout usuario={usuario} links={navegacao}>
        <TituloTreino titulo="Treino" />
        <EstadoTreino papel={usuario.papel} consulta={consultaIndisponivel} />
      </TreinoLayout>
    )
  }

  const { alunoId, exercicios, status, treinadorNome } = consulta
  const selecionado = exercicios.find(exercicio => exercicio.id === selecao?.id)
  const feedbackSelecionado = selecionado?.feedback
  const abreFormulario = aluno && selecionado && selecao?.tela === 'feedback' && onSalvarFeedback && status !== 'concluido' &&
    (!feedbackSelecionado || feedbackSelecionado.autorId === alunoId)

  if (abreFormulario) {
    return (
      <TreinoLayout usuario={usuario} links={navegacao}>
        <TituloTreino titulo="Seu feedback" detalhe={`${selecionado.nome} · ${consulta.titulo || consulta.nome}`} />
        <FormularioFeedback feedback={feedbackSelecionado ?? null} telaPropria
          onSalvar={alteracao => onSalvarFeedback(selecionado.id, alteracao)}
          onFechar={() => setSelecao({ id: selecionado.id, tela: 'exercicio' })} />
      </TreinoLayout>
    )
  }

  if (aluno && selecionado && selecao?.tela === 'exercicio') {
    const { id, nome, parametros, situacao, orientacoes, errosComuns } = selecionado
    return (
      <TreinoLayout usuario={usuario} links={navegacao}>
        <button className="treino-botao treino-botao--voltar" type="button" onClick={() => setSelecao(null)}>
          Voltar ao treino
        </button>
        <TituloTreino titulo={nome} detalhe={parametros} tituloRef={tituloExercicio} />
        {situacao && <span className="treino-selo">{situacao.split(' · ')[0]}</span>}
        <div className="treino-colunas treino-exercicio-conteudo">
          {(orientacoes || errosComuns) && (
            <section className="treino-cartao treino-exercicio-orientacoes" aria-label="Orientações do exercício">
              {orientacoes && (
                <div className="treino-texto"><h2>Como executar</h2><p>{orientacoes}</p></div>
              )}
              {errosComuns && (
                <div className="treino-texto"><h2>Evite estes erros</h2><p>{errosComuns}</p></div>
              )}
            </section>
          )}
          <FeedbackExercicio alunoId={alunoId} usuario={usuario} statusTreino={status}
            feedback={feedbackSelecionado ?? null}
            onAbrir={onSalvarFeedback && (() => setSelecao({ id, tela: 'feedback' }))} />
        </div>
      </TreinoLayout>
    )
  }

  function abrirExercicio(id: number) {
    if (onAbrirExercicio) onAbrirExercicio(id)
    else setSelecao({ id, tela: 'exercicio' })
  }

  const ativo = aluno && status !== 'concluido'
  const proximo = exercicios.find(exercicio => !exercicio.feito)
  const feitos = exercicios.filter(exercicio => exercicio.feito).length
  const tituloNovoFeedback = treinadorNome ? `Novo feedback de ${treinadorNome}` : 'Novo feedback'
  const tipoLista = !aluno ? 'treino-lista--treinador'
    : ativo ? 'treino-lista--aluno' : 'treino-lista--aluno-concluido'

  return (
    <TreinoLayout usuario={usuario} links={navegacao}>
      <EstadoTreino papel={usuario.papel} consulta={consulta}
        contexto={{
          ...consulta, feitos, quantidade: exercicios.length,
          onContinuar: proximo && (() => abrirExercicio(proximo.id)),
        }}
        onMarcarFeito={onMarcarFeito} onConcluir={onConcluir} onVerHistorico={onVerHistorico}
        onVoltarPlanejamento={onVoltarPlanejamento}
        alerta={ativo && status === 'em-andamento' && consulta.avisoFeedback && (
          <section className="treino-cartao treino-alerta-feedback">
            <h2>{tituloNovoFeedback}</h2>
            {onVerFeedback && <button className="treino-atalho" type="button" onClick={onVerFeedback}>Ver feedback</button>}
          </section>
        )}
        lateral={ativo && (
          <aside className="treino-cartao treino-aluno-lateral">
            {consulta.objetivo && (
              <div className="treino-texto"><h2>Seu objetivo</h2><p>{consulta.objetivo}</p></div>
            )}
            {consulta.avisoFeedback && (
              <section className="treino-texto treino-aluno-lateral-feedback">
                <h2>Você tem um feedback</h2><p>{consulta.avisoFeedback}</p>
              </section>
            )}
            <div className="treino-texto">
              <h2>Como funciona</h2>
              <p>Marque os exercícios que realizou. A conclusão do treino é registrada pelo treinador.</p>
            </div>
          </aside>
        )}>
        {exercicios.length === 0 ? <p>Nenhum exercício neste treino.</p> : (
          <div className={!aluno && status === 'concluido' ? 'treino-colunas treino-registros--concluido' : 'treino-registros'}>
            {ativo && <div className="treino-exercicios-titulo"><h2>Exercícios</h2><p>{feitos} de {exercicios.length} feitos</p></div>}
            <ul className={`treino-lista ${tipoLista}`} aria-label="Exercícios do treino">
              {exercicios.map((exercicio, indice) => (
                <li key={exercicio.id} className={exercicio === proximo && status === 'em-andamento' ? 'treino-exercicio--atual' : undefined}>
                  <NomeExercicio exercicio={exercicio} numero={indice + 1} aluno={ativo}
                    onAbrir={ativo || onAbrirExercicio ? () => abrirExercicio(exercicio.id) : undefined} />
                  {aluno && status === 'concluido' && exercicio.feedback && (
                    <FeedbackExercicio alunoId={alunoId} usuario={usuario} statusTreino={status}
                      feedback={exercicio.feedback} />
                  )}
                  {aluno && status === 'concluido' && exercicio.feedbackTreinador && (
                    <section className="treino-cartao">
                      <h2>{treinadorNome ? `Feedback de ${treinadorNome}` : 'Feedback do treinador'}</h2>
                      <p>{exercicio.feedbackTreinador}</p>
                    </section>
                  )}
                </li>
              ))}
            </ul>
            {!aluno && exercicios.some(exercicio => exercicio.feedback?.autorId === alunoId) && (
              <div className="treino-colunas treino-colunas--cartoes">
                {exercicios.filter(exercicio => exercicio.feedback?.autorId === alunoId).map(exercicio => (
                  <FeedbackExercicio key={exercicio.id} alunoId={alunoId} usuario={usuario}
                    statusTreino={status} feedback={exercicio.feedback} />
                ))}
                {status !== 'concluido' && (
                  <section className="treino-cartao">
                    <h2>Registro do aluno</h2>
                    <p>Este texto é somente para leitura. Apenas o próprio aluno pode editar seu feedback.</p>
                  </section>
                )}
              </div>
            )}
          </div>
        )}
      </EstadoTreino>
    </TreinoLayout>
  )
}
