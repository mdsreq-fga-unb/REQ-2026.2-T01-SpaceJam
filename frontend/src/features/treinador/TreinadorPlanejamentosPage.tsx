import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import type { Usuario } from '../../types/usuario'
import {
  descricaoDoPlanejamento,
  listarCarteiraPlanejamentos,
  type AlunoDaCarteira,
} from './planejamentosApi'
import {
  TreinadorPlanejamentos,
  type PlanejamentoAlunoResumo,
} from './TreinadorPlanejamentos'

type Consulta =
  | { estado: 'carregando' | 'erro' }
  | { estado: 'pronto'; alunos: AlunoDaCarteira[] }

function CarteiraDePlanejamentos({ treinador }: { treinador: Usuario }) {
  const [consulta, setConsulta] = useState<Consulta>({ estado: 'carregando' })

  useEffect(() => {
    const controle = new AbortController()
    const { signal } = controle

    listarCarteiraPlanejamentos(signal)
      .then((alunos) => {
        if (!signal.aborted) setConsulta({ estado: 'pronto', alunos })
      })
      .catch(() => {
        if (!signal.aborted) setConsulta({ estado: 'erro' })
      })

    return () => controle.abort()
  }, [])

  const planejamentos: PlanejamentoAlunoResumo[] =
    consulta.estado === 'pronto'
      ? consulta.alunos.map((aluno) => ({
          id: aluno.id,
          nome: aluno.nome,
          descricao: descricaoDoPlanejamento(aluno),
          alunoId: String(aluno.id),
        }))
      : []

  return (
    <TreinadorPlanejamentos
      treinador={treinador}
      planejamentos={planejamentos}
      estado={consulta.estado}
    />
  )
}

export function TreinadorPlanejamentosPage() {
  const { usuario } = useAuth()

  if (!usuario) return null

  return <CarteiraDePlanejamentos key={usuario.id} treinador={usuario} />
}