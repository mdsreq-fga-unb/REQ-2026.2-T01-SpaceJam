import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ExcluirDadosAluno, SolicitacaoExclusaoRegistrada } from '../features/conta/ExcluirDadosAluno'
import { DificuldadeDoAluno } from '../features/registros-treino/DificuldadeDoAluno'
import { ExecucaoDoAluno } from '../features/registros-treino/ExecucaoDoAluno'
import { RegistrosLayout } from '../features/registros-treino/RegistrosLayout'
import type { NotaDificuldade } from '../features/registros-treino/RegistroCartoes'

const base = '/previa/iteracao-4/registros'
const aluno = { id: 1, papel: 'ALUNO', first_name: 'Aluno', last_name: 'Exemplo' } as const
const treinador = { id: 2, papel: 'TREINADOR', first_name: 'Treinador', last_name: 'Exemplo' } as const
const exercicio = 'Drible com deslocamento'
const treino = 'Controle de bola'
const feedback = { texto: 'Precisei diminuir a velocidade na última série.', editado: true }

export default function PreviaRegistrosIteracao4() {
  const { tela } = useParams()
  const navegar = useNavigate()
  const [nota, setNota] = useState<NotaDificuldade | null>(null)
  const [solicitado, setSolicitado] = useState(false)
  const voltar = () => navegar(base)
  const links = { Conta: base, Treinos: base }

  if (tela === 'dificuldade' || tela === 'concluido') {
    const treinoConcluido = tela === 'concluido'
    return <DificuldadeDoAluno key={tela} usuario={aluno} links={links} exercicio={exercicio} treino={treino}
      nota={treinoConcluido ? nota ?? 3 : nota} treinoConcluido={treinoConcluido} executado feedback={feedback}
      onSalvar={async ({ nota: novaNota }) => { setNota(novaNota); return novaNota }}
      onVoltar={voltar} />
  }

  if (tela === 'treinador') {
    return <ExecucaoDoAluno usuario={treinador} links={links}
      consulta={{ estado: 'disponivel', aluno: 'Aluno Exemplo', exercicio, treino, nota, feedback }}
      onVoltar={voltar} />
  }

  if (tela === 'exclusao') {
    return solicitado ? (
      <SolicitacaoExclusaoRegistrada simulacao onVoltarLogin={() => { setSolicitado(false); voltar() }} />
    ) : (
      <ExcluirDadosAluno usuario={aluno} links={links} onManter={voltar} onSolicitar={async () => {}}
        onSolicitacaoRegistrada={() => setSolicitado(true)} />
    )
  }

  return (
    <RegistrosLayout usuario={aluno} titulo="Prévia da Iteração 4"
      detalhe="Dados fictícios. A prévia não altera treinos nem contas reais." estreito>
      <div className="registros-pilha">
        <Link className="registros-botao" to={base + '/dificuldade'}>Registrar ou editar dificuldade</Link>
        <Link className="registros-botao" to={base + '/concluido'}>Ver dificuldade de um treino concluído</Link>
        <Link className="registros-botao" to={base + '/treinador'}>Consultar dificuldade e feedback</Link>
        <Link className="registros-botao" to={base + '/exclusao'}>Solicitar exclusão dos dados</Link>
      </div>
    </RegistrosLayout>
  )
}
