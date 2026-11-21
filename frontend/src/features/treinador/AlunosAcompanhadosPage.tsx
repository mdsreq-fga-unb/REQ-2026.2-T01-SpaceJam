import { Navigate, useSearchParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { AtualizarTermos } from '../../components/AtualizarTermos'
import {
  AlunosAcompanhados,
  type AlunoAcompanhadoResumo,
} from './AlunosAcompanhados'

/**
 * US52 — dados inteiramente fictícios, exclusivamente para visualizar a V2
 * durante o desenvolvimento. Não correspondem a dados reais do backend.
 */
const alunosDemonstracao: readonly AlunoAcompanhadoResumo[] = [
  { id: 101, nome: 'Beatriz Costa', objetivo: 'Melhorar o arremesso' },
  { id: 102, nome: 'André Lima', objetivo: 'Controle de bola' },
  { id: 103, nome: 'Camila Martins', objetivo: 'Defesa individual' },
  { id: 104, nome: 'Diego Melo', objetivo: 'Condicionamento físico' },
  { id: 105, nome: 'Eduarda Rocha', objetivo: 'Finalização' },
  { id: 106, nome: 'Felipe Souza', objetivo: 'Passe em movimento' },
]

export function AlunosAcompanhadosPage() {
  const { usuario } = useAuth()
  const [parametros] = useSearchParams()
  const previa = parametros.get('previa') === '1'

  if (!usuario) return null
  if (usuario.termos_pendentes) return <AtualizarTermos />

  if (previa && !import.meta.env.DEV) {
    return <Navigate to="/treinador/alunos" replace />
  }

  return (
    <AlunosAcompanhados
      treinador={usuario}
      alunos={previa ? alunosDemonstracao : []}
      estado={previa ? 'pronto' : 'aguardando-api'}
      demonstracao={previa}
      // US61 é um PR separado e ainda não foi integrado à develop.
      perfilIntegrado={false}
    />
  )
}
