import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { HistoricoTreinos, RegistroTreinoHistorico, type TreinoHistorico } from './HistoricoTreinos'
import { consultarHistorico, consultarRegistroHistorico } from './historicoTreinosApi'
import { TituloTreino, TreinoLayout } from './TreinoLayout'

type PaginaHistorico = Awaited<ReturnType<typeof consultarHistorico>>
type Consulta<T> =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem: string }
  | { estado: 'disponivel'; dados: T }

function inteiroPositivo(texto: string | null | undefined) {
  const valor = Number(texto)
  return texto && /^[1-9]\d*$/.test(texto) && Number.isSafeInteger(valor) ? valor : null
}

function urlPagina(rota: string, pagina: number) {
  return pagina === 1 ? rota : rota + '?pagina=' + pagina
}

function mensagemHistorico(falha: unknown, detalhe: boolean) {
  if (falha instanceof ApiError && falha.status === 401) return 'Sua sessão expirou. Entre novamente.'
  if (falha instanceof ApiError && falha.status === 403) return 'Você não tem permissão para consultar este histórico.'
  if (falha instanceof ApiError && falha.status === 404) {
    return detalhe ? 'Treino não encontrado neste histórico.' : 'Página do histórico ou aluno não encontrado.'
  }
  return detalhe ? 'Não foi possível carregar este treino.' : 'Não foi possível carregar o histórico.'
}

function Lista({ alunoId, pagina, rota }: { alunoId?: number; pagina: number; rota: string }) {
  const [consulta, definir] = useState<Consulta<PaginaHistorico>>({ estado: 'carregando' })
  const [tentativa, tentar] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    consultarHistorico(alunoId, pagina, controle.signal).then(dados => {
      if (!controle.signal.aborted) definir({ estado: 'disponivel', dados })
    }).catch((falha: unknown) => {
      if (!controle.signal.aborted) definir({ estado: 'erro', mensagem: mensagemHistorico(falha, false) })
    })
    return () => controle.abort()
  }, [alunoId, pagina, tentativa])

  const dados = consulta.estado === 'disponivel' ? consulta.dados : null
  const treinador = alunoId !== undefined
  return (
    <HistoricoTreinos
      alunoNome={treinador ? dados?.alunoNome || '' : undefined}
      consulta={consulta.estado === 'erro' ? {
        ...consulta, tentarNovamente: () => { definir({ estado: 'carregando' }); tentar(valor => valor + 1) },
      } : dados ? { estado: 'disponivel', treinos: dados.treinos } : { estado: 'carregando' }}
      rotaTreino={id => urlPagina(rota + '/' + id, pagina)}
      voltar={treinador ? { rota: '/treinador/alunos/' + alunoId, texto: 'Voltar ao perfil do aluno' } : undefined}
      paginacao={dados && (dados.temAnterior || dados.temProxima) ? {
        pagina,
        anterior: dados.temAnterior ? urlPagina(rota, pagina - 1) : undefined,
        proxima: dados.temProxima ? urlPagina(rota, pagina + 1) : undefined,
      } : undefined}
    />
  )
}

function Detalhe({ treinoId, alunoId, treinador, voltar }: { treinoId: number; alunoId: number; treinador: boolean; voltar: string }) {
  const [consulta, definir] = useState<Consulta<TreinoHistorico>>({ estado: 'carregando' })
  const [tentativa, tentar] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    consultarRegistroHistorico(treinoId, alunoId, treinador, controle.signal).then(dados => {
      if (controle.signal.aborted) return
      definir(dados ? { estado: 'disponivel', dados } : { estado: 'erro', mensagem: 'Treino não encontrado neste histórico.' })
    }).catch((falha: unknown) => {
      if (!controle.signal.aborted) definir({ estado: 'erro', mensagem: mensagemHistorico(falha, true) })
    })
    return () => controle.abort()
  }, [treinoId, alunoId, treinador, tentativa])

  if (consulta.estado === 'disponivel') return <RegistroTreinoHistorico treino={consulta.dados} voltar={voltar} mostrarVideos={treinador} />
  return (
    <section className="treino-tela historico">
      <TituloTreino titulo="Detalhe do treino" />
      {consulta.estado === 'carregando' ? <p role="status">Carregando treino...</p> : <>
        <p role="alert" className="treino-erro">{consulta.mensagem}</p>
        <button className="treino-botao" type="button" onClick={() => {
          definir({ estado: 'carregando' })
          tentar(valor => valor + 1)
        }}>Tentar novamente</button>
      </>}
      <Link className="treino-botao historico-voltar" to={voltar}>Voltar ao histórico</Link>
    </section>
  )
}

const linksTreinador = { Alunos: '/treinador/alunos', Treinos: '/treinador/planejamentos', Biblioteca: '/exercicios', Conta: '/' }
const linksAluno = { Treinos: '/treinos', Conta: '/' }

export function HistoricoTreinosPage() {
  const { usuario } = useAuth()
  const { alunoId, treinoId } = useParams()
  const [busca] = useSearchParams()
  if (!usuario) return null

  const treinador = usuario.papel === 'TREINADOR'
  const aluno = treinador ? inteiroPositivo(alunoId) : usuario.id
  const registro = inteiroPositivo(treinoId)
  const pagina = inteiroPositivo(busca.get('pagina')) ?? 1
  const rota = treinador ? '/treinador/alunos/' + alunoId + '/historico' : '/historico'

  return (
    <TreinoLayout usuario={usuario} secaoAtiva={treinador ? 'Treinos' : 'Histórico'} links={treinador ? linksTreinador : linksAluno}>
      {aluno === null || (treinoId && registro === null) ? (
        <section className="treino-tela historico">
          <TituloTreino titulo="Histórico de treinos" />
          <p role="alert" className="treino-erro">Registro inválido.</p>
          <Link className="treino-botao" to={treinador ? '/treinador/alunos' : '/historico'}>Voltar</Link>
        </section>
      ) : registro !== null ? (
        <Detalhe key={aluno + '/' + registro} treinoId={registro} alunoId={aluno} treinador={treinador} voltar={urlPagina(rota, pagina)} />
      ) : (
        <Lista key={rota + '/' + pagina} alunoId={treinador ? aluno : undefined} pagina={pagina} rota={rota} />
      )}
    </TreinoLayout>
  )
}
