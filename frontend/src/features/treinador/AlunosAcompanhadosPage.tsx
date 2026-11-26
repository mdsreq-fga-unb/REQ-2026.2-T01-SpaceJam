import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { listarAlunosAcompanhados } from '../../api/integracaoUs'
import { useAuth } from '../../auth/useAuth'
import type { Usuario } from '../../types/usuario'
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

type ConsultaDaCarteira =
  | { estado: 'carregando' | 'erro' }
  | { estado: 'pronto'; alunos: AlunoAcompanhadoResumo[]; codigoConvite: string | null }

function CarteiraDoTreinador({ treinador }: { treinador: Usuario }) {
  const [consulta, setConsulta] = useState<ConsultaDaCarteira>({ estado: 'carregando' })

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle

    listarAlunosAcompanhados(signal).then(carteira => {
      if (signal.aborted) return
      const alunos = carteira.alunos.map(({ id, first_name, last_name, apelido }) => ({
        id,
        nome: [first_name.trim(), last_name.trim()].filter(Boolean).join(' ') || apelido,
      }))
      setConsulta({ estado: 'pronto', alunos, codigoConvite: carteira.codigo_convite })
    }).catch(() => {
      if (!signal.aborted) setConsulta({ estado: 'erro' })
    })

    return () => controle.abort()
  }, [])

  const carteira = consulta.estado === 'pronto' ? consulta : null
  return (
    <AlunosAcompanhados
      treinador={carteira ? { ...treinador, codigo_convite: carteira.codigoConvite } : treinador}
      alunos={carteira?.alunos}
      estado={consulta.estado}
      perfilIntegrado
    />
  )
}

export function AlunosAcompanhadosPage() {
  const { usuario } = useAuth()
  const [parametros] = useSearchParams()
  const previa = parametros.get('previa') === '1'

  if (!usuario) return null

  if (previa && !import.meta.env.DEV) {
    return <Navigate to="/treinador/alunos" replace />
  }

  if (previa) return (
    <AlunosAcompanhados
      treinador={usuario}
      alunos={alunosDemonstracao}
      estado="pronto"
      demonstracao
    />
  )

  return <CarteiraDoTreinador key={usuario.id} treinador={usuario} />
}
