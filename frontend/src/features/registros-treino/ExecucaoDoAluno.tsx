import type { ReactNode } from 'react'
import { CartaoDificuldade, CartaoFeedback, type FeedbackDeAluno, type NotaDificuldade } from './RegistroCartoes'
import { RegistrosLayout, type LinksRegistros, type UsuarioRegistros } from './RegistrosLayout'

export type ConsultaExecucao =
  | { estado: 'carregando' }
  | { estado: 'erro'; tentarNovamente?: () => void }
  | { estado: 'sem-acesso' }
  | {
      estado: 'disponivel'
      aluno: string
      exercicio: string
      treino: string
      data?: string
      nota: NotaDificuldade | null
      feedback: FeedbackDeAluno | null
    }

interface ExecucaoDoAlunoProps {
  usuario: UsuarioRegistros
  links?: LinksRegistros
  consulta: ConsultaExecucao
  onVoltar: () => void
  video?: ReactNode
}

export function ExecucaoDoAluno({ usuario, links, consulta, onVoltar, video }: ExecucaoDoAlunoProps) {
  const semAcesso = usuario.papel !== 'TREINADOR' || consulta.estado === 'sem-acesso'
  if (semAcesso || consulta.estado !== 'disponivel') {
    return (
      <RegistrosLayout usuario={usuario} links={links} titulo="Execução do aluno">
        <div className="registros-pilha">
          {semAcesso ? (
            <p role="alert">Você não tem acesso a esta execução.</p>
          ) : consulta.estado === 'carregando' ? (
            <p role="status">Carregando execução…</p>
          ) : (
            <p role="alert">Não foi possível carregar a execução.</p>
          )}
          {!semAcesso && consulta.estado === 'erro' && consulta.tentarNovamente && (
            <button className="registros-botao" type="button" onClick={consulta.tentarNovamente}>Tentar novamente</button>
          )}
          <button className="registros-botao" type="button" onClick={onVoltar}>Voltar ao treino</button>
        </div>
      </RegistrosLayout>
    )
  }

  const { aluno, data, exercicio, treino, nota, feedback } = consulta
  return (
    <RegistrosLayout usuario={usuario} links={links} titulo={'Execução de ' + aluno}
      detalhe={[exercicio, treino, data].filter(Boolean).join(' · ')}>
      <div className="registros-grade registros-grade--execucao">
        {video && <section className="conta-aluno__cartao registros-cartao registros-video">{video}</section>}
        <div className="registros-nota">
          <CartaoDificuldade nota={nota} titulo={nota === null ? 'Dificuldade' : 'Dificuldade registrada'} />
        </div>
        <div className="registros-feedback"><CartaoFeedback feedback={feedback} /></div>
        <div className="registros-acoes">
          <button className="registros-botao" type="button" onClick={onVoltar}>Voltar ao treino</button>
        </div>
      </div>
    </RegistrosLayout>
  )
}
