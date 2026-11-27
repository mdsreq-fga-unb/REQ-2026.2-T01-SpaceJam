import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import type { Usuario } from '../../types/usuario'
import type { StatusTreino } from './EstadoTreino'
import './Treino.css'

export interface FeedbackAluno {
  autorId: number
  texto: string
  editado: boolean
}

export interface AlteracaoFeedback {
  tipo: 'registrar' | 'editar'
  texto: string
}

interface FeedbackExercicioProps {
  alunoId: number
  usuario: Pick<Usuario, 'id' | 'papel'>
  statusTreino: StatusTreino
  feedback: FeedbackAluno | null
  onSalvar?: (alteracao: AlteracaoFeedback) => Promise<void>
  onAbrir?: () => void
}

interface FormularioFeedbackProps {
  feedback: FeedbackAluno | null
  onSalvar: NonNullable<FeedbackExercicioProps['onSalvar']>
  onFechar: () => void
  telaPropria?: boolean
}

const limiteTexto = 1000

export function FormularioFeedback({ feedback, onSalvar, onFechar, telaPropria }: FormularioFeedbackProps) {
  const campo = useId()
  const descricao = useId()
  const aviso = useId()
  const textarea = useRef<HTMLTextAreaElement>(null)
  const envioEmCurso = useRef(false)
  const [texto, setTexto] = useState(feedback?.texto ?? '')
  const [erroCampo, setErroCampo] = useState('')
  const [erroEnvio, setErroEnvio] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { textarea.current?.focus() }, [])

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (envioEmCurso.current) return
    setErroEnvio('')

    const tamanho = Array.from(texto).length
    const erro = !texto.trim()
      ? 'Escreva um feedback antes de salvar.'
      : tamanho > limiteTexto ? 'Use no máximo 1.000 caracteres.' : ''
    setErroCampo(erro)
    if (erro) {
      textarea.current?.focus()
      return
    }

    envioEmCurso.current = true
    setSalvando(true)
    try {
      await onSalvar({ tipo: feedback ? 'editar' : 'registrar', texto })
      onFechar()
    } catch (erro) {
      const mensagemDaApi = erro instanceof ApiError
        ? erro.campos.texto?.[0] || erro.campos.detail?.[0]
        : undefined
      setErroEnvio(mensagemDaApi || 'Não foi possível salvar o feedback. Tente novamente.')
    } finally {
      envioEmCurso.current = false
      setSalvando(false)
    }
  }

  return (
    <form className={`treino-feedback-form${telaPropria ? ' treino-feedback-form--tela' : ''}`} onSubmit={enviar} aria-busy={salvando}>
      <div className="treino-feedback-campo">
        <label htmlFor={campo}>Conte como foi o exercício <span aria-hidden="true">*</span></label>
        <div className="treino-texto">
          <textarea id={campo} ref={textarea} value={texto} rows={4} readOnly={salvando} aria-required="true"
            aria-invalid={Boolean(erroCampo)} aria-describedby={erroCampo ? `${descricao} ${aviso}` : descricao}
            onChange={(evento) => {
              setTexto(evento.target.value)
              setErroCampo('')
              setErroEnvio('')
            }} />
          <p id={descricao}>Máximo de 1.000 caracteres. Não é permitido enviar apenas espaços.</p>
          {erroCampo && <p className="treino-erro" id={aviso} role="alert">{erroCampo}</p>}
          {erroEnvio && <p className="treino-erro" role="alert">{erroEnvio}</p>}
        </div>
      </div>
      {telaPropria && (
        <section className="treino-cartao treino-feedback-regra">
          <h2>Um registro por exercício</h2>
          <p>Ao editar, o conteúdo anterior é substituído. Só você pode alterar seu feedback enquanto o treino não estiver concluído.</p>
        </section>
      )}
      <div className="treino-acoes">
        <button className="treino-botao treino-botao--principal" type="submit" disabled={salvando}>
          {salvando ? 'Salvando…' : 'Salvar feedback'}
        </button>
        <button className="treino-botao" type="button" disabled={salvando} onClick={onFechar}>Cancelar</button>
      </div>
    </form>
  )
}

export function FeedbackExercicio({ alunoId, usuario, statusTreino, feedback, onSalvar, onAbrir }: FeedbackExercicioProps) {
  const titulo = useId()
  const botaoAbrir = useRef<HTMLButtonElement>(null)
  const [formularioAberto, setFormularioAberto] = useState(false)

  const proprioExercicio = usuario.papel === 'ALUNO' && usuario.id === alunoId
  const autoriaValida = !feedback || feedback.autorId === alunoId
  const podeExibir = autoriaValida && (proprioExercicio || usuario.papel === 'TREINADOR')
  const salvar = proprioExercicio && statusTreino !== 'concluido' ? onSalvar : undefined
  const podeAbrir = proprioExercicio && statusTreino !== 'concluido' && (salvar || onAbrir)
  if (!podeExibir) return null

  function fechar() {
    setFormularioAberto(false)
    requestAnimationFrame(() => botaoAbrir.current?.focus())
  }

  return (
    <section className="treino-cartao" aria-labelledby={titulo}>
      <h2 id={titulo} className="treino-feedback-titulo">
        {proprioExercicio ? 'Seu feedback' : 'Feedback do aluno'}
        {feedback?.editado && <> · <span>editado</span></>}
      </h2>
      {feedback ? <p className="treino-feedback-texto">{feedback.texto}</p> : <p>Nenhum feedback registrado.</p>}


      {podeAbrir && (
        formularioAberto && salvar
          ? <FormularioFeedback feedback={feedback} onSalvar={salvar} onFechar={fechar} />
          : (
              <button ref={botaoAbrir} className="treino-atalho" type="button" onClick={onAbrir || (() => setFormularioAberto(true))}>
                {feedback ? 'Editar feedback' : 'Registrar feedback'}
              </button>
            )
      )}
    </section>
  )
}
