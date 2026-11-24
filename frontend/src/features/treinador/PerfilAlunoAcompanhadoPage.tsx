
import { Navigate, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { AtualizarTermos } from '../../components/AtualizarTermos'
import {
  PerfilAlunoAcompanhado,
  type DadosAlunoAcompanhado,
} from './PerfilAlunoAcompanhado'

/**
 * US61 — Dados exclusivamente fictícios para
 * conferir o layout durante o desenvolvimento.
 *
 * Nunca utilizados em produção.
 */
const alunoDemonstracao: DadosAlunoAcompanhado = {
  nome: 'Beatriz Costa',
  apelido: 'beatriz.costa',
  email: 'beatriz@example.invalid',
  dataNascimento: '2003-04-12',
  altura: '1.72',
  peso: '68',
  envergadura: '1.75',
  frequenciaSemanal: 3,
  objetivos:
    'Melhorar a precisão do arremesso e o controle de bola.',
  historicoLesoes: [],
  planejamentoAtual: 'Controle de bola — exemplo de planejamento',
}

export function PerfilAlunoAcompanhadoPage() {
  const { usuario } = useAuth()
  const { alunoId } = useParams()
  const navegar = useNavigate()

  if (!usuario) {
    return null
  }

  if (usuario.termos_pendentes) {
    return <AtualizarTermos />
  }

  const rotaDemonstracao = alunoId === 'previa'

  if (rotaDemonstracao && !import.meta.env.DEV) {
    return <Navigate to="/" replace />
  }

  return (
    <PerfilAlunoAcompanhado
      treinador={usuario}
      aluno={rotaDemonstracao ? alunoDemonstracao : null}
      demonstracao={rotaDemonstracao}
      onVoltar={() => navegar('/treinador/alunos')}
    />
  )
}
