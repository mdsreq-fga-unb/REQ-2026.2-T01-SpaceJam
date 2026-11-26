import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import { api } from '../../api/client'
import {
  PerfilAlunoAcompanhado,
  type DadosAlunoAcompanhado,
} from './PerfilAlunoAcompanhado'

interface RespostaPerfilAluno {
  first_name: string
  last_name: string
  apelido: string
  email: string
  data_nascimento: string | null
  altura: string | number | null
  peso: string | number | null
  envergadura: string | number | null
  frequencia_semanal: number | null
  objetivos: string | null
  historico_lesoes: string[]
}

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

  const [aluno, setAluno] = useState<DadosAlunoAcompanhado | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const rotaDemonstracao = alunoId === 'previa'

  useEffect(() => {
    if (!usuario || rotaDemonstracao || !alunoId) return

    let ativo = true

    async function carregarPerfil() {
      setCarregando(true)
      setErro(null)

      try {
        const resposta = await api<RespostaPerfilAluno>(
          `/contas/alunos/${alunoId}/`,
        )

        if (!ativo) return

        setAluno({
          nome: `${resposta.first_name} ${resposta.last_name}`.trim()
            || resposta.apelido,
          apelido: resposta.apelido,
          email: resposta.email,
          dataNascimento: resposta.data_nascimento,
          altura: resposta.altura,
          peso: resposta.peso,
          envergadura: resposta.envergadura,
          frequenciaSemanal: resposta.frequencia_semanal,
          objetivos: resposta.objetivos,
          historicoLesoes: resposta.historico_lesoes,
        })
      } catch (erroApi) {
        if (!ativo) return

        setErro(
          erroApi instanceof Error
            ? erroApi.message
            : 'Não foi possível carregar o perfil deste aluno.',
        )
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    void carregarPerfil()

    return () => {
      ativo = false
    }
  }, [usuario, alunoId, rotaDemonstracao])

  if (!usuario) return null

  if (rotaDemonstracao && !import.meta.env.DEV) {
    return <Navigate to="/" replace />
  }

  if (rotaDemonstracao) {
    return (
      <PerfilAlunoAcompanhado
        treinador={usuario}
        aluno={alunoDemonstracao}
        demonstracao={true}
        onVoltar={() => navegar('/treinador/alunos')}
      />
    )
  }

  if (carregando) {
    return (
      <div role="status" aria-live="polite">
        Carregando perfil do aluno...
      </div>
    )
  }

  if (erro || !aluno) {
    return (
      <div>
        <p role="alert">
          {erro ?? 'Não foi possível carregar o perfil deste aluno.'}
        </p>
        <button type="button" onClick={() => navegar('/treinador/alunos')}>
          Voltar para alunos
        </button>
      </div>
    )
  }

  return (
    <PerfilAlunoAcompanhado
      treinador={usuario}
      aluno={aluno}
      demonstracao={false}
      onVoltar={() => navegar('/treinador/alunos')}
    />
  )
}