import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'

interface RegistrarLesaoFormularioProps {
  nomeAluno: string
  onSalvar: (descricao: string, signal: AbortSignal) => Promise<void>
  onConcluir: () => void
  onCancelar: () => void
}

const limiteDescricao = 300

export function RegistrarLesaoFormulario({
  nomeAluno, onSalvar, onConcluir, onCancelar,
}: RegistrarLesaoFormularioProps) {
  const campoId = useId()
  const erroId = useId()
  const titulo = useRef<HTMLHeadingElement>(null)
  const campo = useRef<HTMLTextAreaElement>(null)
  const requisicao = useRef<AbortController | null>(null)
  const [descricao, setDescricao] = useState('')
  const [erroCampo, setErroCampo] = useState('')
  const [erroEnvio, setErroEnvio] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    titulo.current?.focus()
    return () => requisicao.current?.abort()
  }, [])

  function invalidarDescricao(mensagem: string) {
    setErroCampo(mensagem)
    campo.current?.focus()
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (requisicao.current) return
    setErroCampo('')
    setErroEnvio('')

    const texto = descricao.trim()
    if (!texto) {
      invalidarDescricao('Informe a descrição da lesão.')
      return
    }
    if (Array.from(texto).length > limiteDescricao) {
      invalidarDescricao('A descrição deve ter no máximo 300 caracteres.')
      return
    }

    const controle = new AbortController()
    requisicao.current = controle
    setSalvando(true)
    try {
      await onSalvar(texto, controle.signal)
      if (!controle.signal.aborted) onConcluir()
    } catch (erro) {
      if (controle.signal.aborted) return
      if (erro instanceof ApiError && erro.campos.descricao?.[0]) {
        invalidarDescricao(erro.campos.descricao[0])
        return
      }
      setErroEnvio(
        erro instanceof ApiError && erro.status === 403
          ? 'Você não tem permissão para registrar lesões deste aluno.'
          : 'Não foi possível salvar a lesão. Tente novamente.',
      )
    } finally {
      requisicao.current = null
      if (!controle.signal.aborted) setSalvando(false)
    }
  }

  return (
    <>
      <div className="perfil-acompanhado__titulo">
        <h1 ref={titulo} tabIndex={-1}>Registrar lesão</h1>
        <p>{nomeAluno} · Registro do treinador</p>
      </div>
      <form className="perfil-acompanhado__form-lesao" noValidate aria-busy={salvando} onSubmit={salvar}>
        <div className="perfil-acompanhado__campos-lesao">
          <div className="perfil-acompanhado__campo-lesao">
            <label htmlFor={campoId}>Descrição da lesão <span aria-hidden="true">*</span></label>
            <textarea
              ref={campo}
              id={campoId}
              placeholder="Descreva a lesão informada pelo aluno."
              value={descricao}
              readOnly={salvando}
              aria-required="true"
              aria-invalid={Boolean(erroCampo)}
              aria-describedby={erroCampo ? erroId : undefined}
              onChange={evento => {
                setDescricao(evento.target.value)
                setErroCampo('')
                setErroEnvio('')
              }}
            />
            {erroCampo && <p className="perfil-acompanhado__erro-lesao" role="alert" id={erroId}>{erroCampo}</p>}
            {erroEnvio && <p className="perfil-acompanhado__erro-lesao" role="alert">{erroEnvio}</p>}
          </div>
          <aside className="perfil-acompanhado__acesso-lesao">
            <h2>Acesso ao registro</h2>
            <p>O aluno pode consultar o histórico. Apenas o treinador pode registrar lesões.</p>
          </aside>
        </div>
        <div className="perfil-acompanhado__acoes-lesao">
          <button className="perfil-acompanhado__acao perfil-acompanhado__acao--principal" type="submit" disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar registro'}
          </button>
          <button className="perfil-acompanhado__acao" type="button" disabled={salvando} onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </>
  )
}
