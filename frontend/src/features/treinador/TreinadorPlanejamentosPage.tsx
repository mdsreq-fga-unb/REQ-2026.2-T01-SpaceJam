import { useAuth } from '../../auth/useAuth'
import type { Usuario } from '../../types/usuario'
import {
  TreinadorPlanejamentos,
  type PlanejamentoAlunoResumo,
} from './TreinadorPlanejamentos'

interface Props {
  modoTeste?: boolean
}

const treinadorTeste: Usuario = {
  id: 1,
  apelido: 'lucas',
  first_name: 'Lucas',
  last_name: 'Treinador',
  email: 'lucas@teste.com',
  telefone: '',
  papel: 'TREINADOR',
}

const planejamentosDemonstracao: readonly PlanejamentoAlunoResumo[] = [
  {
    id: 1,
    nome: 'Beatriz Costa',
    descricao: 'Controle de bola · Planejamento vigente',
    alunoId: 'previa',
  },
  {
    id: 2,
    nome: 'André Lima',
    descricao: 'Nenhum planejamento vigente',
    alunoId: 'previa',
  },
]

export function TreinadorPlanejamentosPage({
  modoTeste = false,
}: Props) {
  const { usuario } = useAuth()

  // Utiliza um treinador fictício somente na rota de testes.
  const treinador = modoTeste ? treinadorTeste : usuario

  if (!treinador) return null

  return (
    <TreinadorPlanejamentos
      treinador={treinador}
      planejamentos={planejamentosDemonstracao}
      demonstracao={modoTeste}
    />
  )
}