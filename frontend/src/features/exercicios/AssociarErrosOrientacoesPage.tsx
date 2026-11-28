import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { useAuth } from '../../auth/useAuth'
import type { ErroOrientacao } from '../../types/exercicio'
import { LayoutTreinador } from '../treinador/LayoutTreinador'
import { AssociarErrosOrientacoes } from './AssociarErrosOrientacoes'
import { idDeRotaValido } from './ErrosOrientacoesExercicio'
import {
  associarErrosOrientacoes,
  consultarExercicio,
  listarCandidatosErroOrientacao,
  mensagemDeErro,
} from './exerciciosApi'

type Pares = { candidatos: ErroOrientacao[]; associados: ErroOrientacao[] }

async function carregarPares(id: number, signal?: AbortSignal): Promise<Pares> {
  const [exercicio, candidatos] = await Promise.all([
    consultarExercicio(id, signal), listarCandidatosErroOrientacao(id, signal),
  ])
  return { candidatos, associados: exercicio.errosOrientacoes ?? [] }
}

function Associar({ id, voltar }: { id: number; voltar: string }) {
  const [pares, definir] = useState<Pares | null>(null)
  const [erro, erroAoConsultar] = useState('')
  const [aviso, definirAviso] = useState('')
  const [tentativa, tentar] = useState(0)

  useEffect(() => {
    const controle = new AbortController()
    carregarPares(id, controle.signal).then(dados => {
      if (!controle.signal.aborted) definir(dados)
    }).catch((falha: unknown) => {
      if (!controle.signal.aborted) erroAoConsultar(mensagemDeErro(falha))
    })
    return () => controle.abort()
  }, [id, tentativa])

  async function associar(ids: number[]) {
    const resultado = await associarErrosOrientacoes(id, ids)
    definir(atuais => atuais && ({
      candidatos: atuais.candidatos.filter(par => !ids.includes(par.id)),
      associados: [...atuais.associados, ...resultado.criados],
    }))
    try {
      definir(await carregarPares(id))
      definirAviso('')
    } catch {
      definirAviso('A associação foi salva, mas não foi possível atualizar os pares. Reabra esta tela para consultar a lista atual.')
    }
    return { criados: resultado.criados.length, ignorados: resultado.ignorados }
  }

  if (pares) return <>
    {aviso && <p role="status">{aviso}</p>}
    <AssociarErrosOrientacoes pares={pares.candidatos} associados={pares.associados} voltar={voltar} onAssociar={associar} />
  </>

  return <>
    <h1>Associar erros e orientações</h1>
    {erro ? <>
      <p role="alert">{erro}</p>
      <button className="treinador-v2__botao" type="button" onClick={() => {
        erroAoConsultar('')
        tentar(valor => valor + 1)
      }}>Tentar novamente</button>
    </> : <p role="status">Carregando pares disponíveis...</p>}
    <Link className="treinador-v2__botao" to={voltar}>Voltar aos erros e orientações</Link>
  </>
}

export function AssociarErrosOrientacoesPage() {
  const { exercicioId } = useParams()
  const { usuario } = useAuth()
  if (!usuario) return null

  return (
    <LayoutTreinador nome={usuario.first_name || usuario.apelido} secao="Biblioteca">
      {idDeRotaValido(exercicioId) ? (
        <Associar key={exercicioId} id={Number(exercicioId)} voltar={'/exercicios/' + exercicioId + '/erros-orientacoes'} />
      ) : <>
        <h1>Associar erros e orientações</h1>
        <p role="alert">Exercício não encontrado.</p>
        <Link className="treinador-v2__botao" to="/exercicios">Voltar à biblioteca</Link>
      </>}
    </LayoutTreinador>
  )
}
