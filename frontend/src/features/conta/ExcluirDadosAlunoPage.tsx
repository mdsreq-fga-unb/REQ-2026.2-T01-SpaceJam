import { useEffect, useRef } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { api } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { ExcluirDadosAluno, SolicitacaoExclusaoRegistrada } from './ExcluirDadosAluno'

export function ExcluirDadosAlunoPage() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  const protocolo = useRef<string>(null)
  if (!usuario) return null

  return <ExcluirDadosAluno usuario={usuario} links={{ Treinos: '/treinos', Histórico: '/historico' }} pedirSenha
    onManter={() => navegar('/conta/privacidade')}
    onSolicitar={async senha => {
      const resultado = await api<{ protocolo: string }>('/auth/excluir-conta/', {
        method: 'POST',
        body: JSON.stringify({ senha_atual: senha, confirmado: true }),
      })
      protocolo.current = resultado.protocolo
    }}
    onSolicitacaoRegistrada={() => navegar('/conta/excluida', {
      replace: true,
      state: { protocolo: protocolo.current, alunoId: usuario.id },
    })} />
}

export function ContaExcluidaPage() {
  const { state } = useLocation()
  const navegar = useNavigate()
  const { usuario, limparSessaoLocal } = useAuth()
  const protocolo = typeof state?.protocolo === 'string' ? state.protocolo : undefined
  const alunoId = typeof state?.alunoId === 'number' ? state.alunoId : undefined

  useEffect(() => {
    if (protocolo && alunoId !== undefined && usuario?.id === alunoId) limparSessaoLocal?.()
  }, [alunoId, limparSessaoLocal, protocolo, usuario?.id])

  if (!protocolo || alunoId === undefined) return <Navigate to="/login" replace />
  return <SolicitacaoExclusaoRegistrada protocolo={protocolo} onVoltarLogin={() => navegar('/login', { replace: true })} />
}
