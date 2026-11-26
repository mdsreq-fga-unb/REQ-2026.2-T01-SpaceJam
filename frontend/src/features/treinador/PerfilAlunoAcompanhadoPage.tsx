import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router'
import { consultarPerfilDoAluno, type DadosCadastraisApi } from '../../api/integracaoUs'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import {
  PerfilAlunoAcompanhado,
  type DadosAlunoAcompanhado,
} from './PerfilAlunoAcompanhado'

// Apenas para visualizar o layout localmente; nunca é mostrado a usuários reais.
const alunoDemonstracao: DadosAlunoAcompanhado = {
  nome: 'Beatriz Costa', apelido: 'beatriz.costa', email: 'beatriz@example.invalid',
  dataNascimento: '2003-04-12', altura: '1.72', peso: '68', envergadura: '1.75',
  frequenciaSemanal: 3, objetivos: 'Melhorar a precisão do arremesso e o controle de bola.', historicoLesoes: [],
  planejamentoAtual: 'Controle de bola — exemplo de planejamento',
}

function paraTela(d: DadosCadastraisApi): DadosAlunoAcompanhado {
  const lesoes = Array.isArray(d.historico_lesoes)
    ? d.historico_lesoes.map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'descricao' in item && typeof item.descricao === 'string') return item.descricao
        return 'Lesão registrada'
      })
    : null
  return {
    nome: [d.first_name, d.last_name].filter(Boolean).join(' ') || d.apelido,
    apelido: d.apelido, email: d.email,
    dataNascimento: d.data_nascimento,
    altura: d.altura, peso: d.peso, envergadura: d.envergadura,
    frequenciaSemanal: d.frequencia_semanal,
    objetivos: d.objetivos,
    historicoLesoes: lesoes, planejamentoAtual: null,
  }
}

export function PerfilAlunoAcompanhadoPage() {
  const { usuario } = useAuth()
  const { alunoId } = useParams()
  const navegar = useNavigate()
  const [aluno, setAluno] = useState<{ id: number; dados: DadosAlunoAcompanhado } | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState('')
  const previa = alunoId === 'previa'

  useEffect(() => {
    if (!usuario || usuario.papel !== 'TREINADOR' || usuario.termos_pendentes || previa) return
    const id = Number(alunoId)
    if (!Number.isSafeInteger(id) || id <= 0) {
      setCarregando(false)
      setErro('Identificador de aluno inválido.')
      return
    }
    let ativo = true
    setCarregando(true)
    setErro('')
    setAluno(null)
    consultarPerfilDoAluno(id).then(resposta => {
      if (ativo) setAluno({ id, dados: paraTela(resposta) })
    }).catch((falha: unknown) => {
      if (!ativo) return
      if (falha instanceof ApiError && falha.status === 403) {
        setErro('Você não tem permissão para consultar este aluno.')
      } else if (falha instanceof ApiError && falha.status === 404) {
        setErro('Aluno não encontrado.')
      } else if (falha instanceof ApiError && falha.status === 401) {
        setErro('Sua sessão expirou. Entre novamente.')
      } else {
        setErro('Não foi possível consultar o perfil deste aluno.')
      }
    }).finally(() => {
      if (ativo) setCarregando(false)
    })
    return () => { ativo = false }
  }, [usuario?.id, usuario?.papel, usuario?.termos_pendentes, previa, alunoId])

  if (!usuario) return null
  if (previa && !import.meta.env.DEV) return <Navigate to="/" replace />

  const alunoAtual = aluno?.id === Number(alunoId) ? aluno.dados : null
  return <>
    {carregando && <p role="status">Carregando perfil do aluno...</p>}
    {erro && <div role="alert">
      <p>{erro}</p>
      <button type="button" onClick={() => navegar('/treinador/alunos')}>Voltar aos alunos</button>
    </div>}
    {(previa || (!carregando && !erro)) && <PerfilAlunoAcompanhado
      treinador={usuario}
      aluno={previa ? alunoDemonstracao : alunoAtual}
      demonstracao={previa}
      onVoltar={() => navegar('/treinador/alunos')}
    />}
  </>
}
