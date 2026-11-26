import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { api } from '../../api/client'
import {
  AlunosAcompanhados,
  type AlunoAcompanhadoResumo,
} from './AlunosAcompanhados'

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

  const [alunos, setAlunos] = useState<AlunoAcompanhadoResumo[]>([])
  const [estado, setEstado] = useState<
    'aguardando-api' | 'carregando' | 'erro' | 'pronto'
  >('carregando')

  useEffect(() => {
    if (!usuario || previa) return

    let ativo = true

    async function carregarAlunos() {
      setEstado('carregando')

      try {
        const resposta = await api<AlunoAcompanhadoResumo[]>(
          '/contas/alunos/',
        )

        if (ativo) {
          setAlunos(resposta)
          setEstado('pronto')
        }
      } catch {
        if (ativo) {
          setEstado('erro')
        }
      }
    }

    void carregarAlunos()

    return () => {
      ativo = false
    }
  }, [usuario, previa])

  if (!usuario) return null

  if (previa && !import.meta.env.DEV) {
    return <Navigate to="/treinador/alunos" replace />
  }

  return (
    <AlunosAcompanhados
      treinador={usuario}
      alunos={previa ? alunosDemonstracao : alunos}
      estado={previa ? 'pronto' : estado}
      demonstracao={previa}
      perfilIntegrado={true}
    />
  )
}