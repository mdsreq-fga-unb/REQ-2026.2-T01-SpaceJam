import { useId, useRef, useState, type FormEvent } from 'react'
import { CartaoDificuldade, CartaoFeedback, escala, type FeedbackDeAluno, type NotaDificuldade } from './RegistroCartoes'
import { RegistrosLayout, type LinksRegistros, type UsuarioRegistros } from './RegistrosLayout'

export type AlteracaoDificuldade = {
  operacao: 'registrar' | 'editar'
  nota: NotaDificuldade
}

interface DificuldadeDoAlunoProps {
  usuario: UsuarioRegistros
  links?: LinksRegistros
  exercicio: string
  treino: string
  nota: NotaDificuldade | null
  treinoConcluido: boolean
  executado: boolean
  treinador?: string
  feedback?: FeedbackDeAluno | null
  onSalvar: (alteracao: AlteracaoDificuldade) => Promise<NotaDificuldade>
  onVoltar: () => void
  onEditarFeedback?: () => void
  onEnviarVideo?: () => void
}

interface FormularioDificuldadeProps {
  nota: NotaDificuldade | null
  treinador?: string
  onSalvar: (nota: NotaDificuldade) => Promise<void>
  onCancelar: () => void
}

function FormularioDificuldade({ nota, treinador, onSalvar, onCancelar }: FormularioDificuldadeProps) {
  const grupo = useId()
  const pendente = useRef(false)
  const [escolhida, setEscolhida] = useState(nota)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(false)

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (pendente.current || escolhida === null) return

    pendente.current = true
    setSalvando(true)
    setErro(false)
    try {
      await onSalvar(escolhida)
    } catch {
      setErro(true)
    } finally {
      pendente.current = false
      setSalvando(false)
    }
  }

  return (
    <form className="registros-pilha registros-formulario" onSubmit={salvar} aria-busy={salvando}>
      <fieldset className="registros-escala" disabled={salvando}>
        <legend>Como foi realizar o exercício?</legend>
        {escala.map(item => (
          <label key={item.nota} className="registros-opcao">
            <input type="radio" name={grupo} value={item.nota} checked={escolhida === item.nota}
              onChange={() => { setEscolhida(item.nota); setErro(false) }} />
            <span>
              {escolhida === item.nota && <span aria-hidden="true">✓ </span>}
              {item.nota} · {item.rotulo}
            </span>
          </label>
        ))}
      </fieldset>
      <section className="conta-aluno__cartao registros-cartao">
        <h2>Enquanto o treino estiver aberto</h2>
        <p>Você pode alterar sua nota até {treinador || 'o treinador'} concluir o treino.</p>
      </section>
      {erro && <p role="alert" className="registros-erro">Não foi possível salvar a nota. Tente novamente.</p>}
      <div className="registros-acoes">
        <button className="registros-botao registros-botao--principal" type="submit"
          disabled={salvando || escolhida === null}>
          {salvando ? 'Salvando nota…' : 'Salvar nota'}
        </button>
        <button className="registros-botao" type="button" onClick={onCancelar} disabled={salvando}>Cancelar</button>
      </div>
    </form>
  )
}

export function DificuldadeDoAluno({
  usuario, links, exercicio, treino, nota, treinador, treinoConcluido, executado, feedback,
  onSalvar, onVoltar, onEditarFeedback, onEnviarVideo,
}: DificuldadeDoAlunoProps) {
  const [registro, setRegistro] = useState({ origem: nota, atual: nota })
  const [formulario, abrirFormulario] = useState(false)
  const registrada = registro.origem === nota ? registro.atual : nota
  const aluno = usuario.papel === 'ALUNO'
  const editavel = aluno && !treinoConcluido && (executado || registrada !== null)
  const editando = formulario && editavel
  const detalhe = exercicio + ' · ' + treino

  async function salvar(nova: NotaDificuldade) {
    const confirmada = await onSalvar({ operacao: registrada === null ? 'registrar' : 'editar', nota: nova })
    setRegistro({ origem: nota, atual: confirmada })
    abrirFormulario(false)
  }

  if (!aluno) {
    return (
      <RegistrosLayout usuario={usuario} links={links} titulo="Dificuldade do exercício">
        <p role="alert" className="registros-pilha">Você não pode registrar dificuldade neste treino.</p>
      </RegistrosLayout>
    )
  }

  if (editando) {
    return (
      <RegistrosLayout usuario={usuario} links={links} titulo="Dificuldade do exercício" detalhe={detalhe} estreito>
        <FormularioDificuldade nota={registrada} treinador={treinador} onSalvar={salvar}
          onCancelar={() => abrirFormulario(false)} />
      </RegistrosLayout>
    )
  }

  return (
    <RegistrosLayout usuario={usuario} links={links} titulo="Seu registro" detalhe={detalhe} estreito>
      <div className="registros-pilha">
        <CartaoDificuldade nota={registrada} />
        {feedback !== undefined && <CartaoFeedback feedback={feedback} aluno />}
        {treinoConcluido && (
          <section className="conta-aluno__cartao registros-cartao">
            <h2>Treino concluído</h2>
            <p>Você pode consultar a dificuldade registrada.</p>
          </section>
        )}
        {!treinoConcluido && !executado && registrada === null && (
          <p className="registros-detalhe">Registre a dificuldade depois de realizar o exercício.</p>
        )}
        <div className="registros-acoes">
          {editavel && (
            <button className="registros-botao registros-botao--principal" type="button"
              onClick={() => abrirFormulario(true)}>
              {registrada === null ? 'Registrar dificuldade' : 'Editar dificuldade'}
            </button>
          )}
          {!treinoConcluido && onEditarFeedback && (
            <button className="registros-botao" type="button" onClick={onEditarFeedback}>
              {feedback ? 'Editar feedback' : 'Registrar feedback'}
            </button>
          )}
          {!treinoConcluido && onEnviarVideo && (
            <button className="registros-botao" type="button" onClick={onEnviarVideo}>Enviar vídeo</button>
          )}
          <button className="registros-botao" type="button" onClick={onVoltar}>Voltar ao exercício</button>
        </div>
      </div>
    </RegistrosLayout>
  )
}
