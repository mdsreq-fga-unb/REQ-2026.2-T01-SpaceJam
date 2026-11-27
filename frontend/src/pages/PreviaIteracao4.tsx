import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { AssociarErrosOrientacoes } from '../features/exercicios/AssociarErrosOrientacoes'
import { LayoutTreinador } from '../features/treinador/LayoutTreinador'
import { HistoricoTreinos, RegistroTreinoHistorico, type TreinoHistorico } from '../features/treinos/HistoricoTreinos'
import { TreinoLayout } from '../features/treinos/TreinoLayout'

const base = '/previa/iteracao-4'
const aluno = { id: 1, first_name: 'Aluno', last_name: 'Exemplo', papel: 'ALUNO' } as const
const treinador = { id: 2, first_name: 'Treinador', last_name: 'Exemplo', papel: 'TREINADOR' } as const
const pares = [
  { id: 1, erro: 'Olhar para a bola', orientacaoCorretiva: 'Olhar à frente' },
  { id: 2, erro: 'Drible alto', orientacaoCorretiva: 'Aproximar a bola do corpo' },
  { id: 3, erro: 'Perder o equilíbrio', orientacaoCorretiva: 'Flexionar os joelhos' },
  { id: 4, erro: 'Mudar de direção sem controle', orientacaoCorretiva: '' },
]

const treinos: TreinoHistorico[] = [
  {
    id: 1, nome: 'Treino A · Controle de bola', data: '2026-11-17',
    status: 'Concluído', quantidadeExercicios: 1,
    exercicios: [{
      id: 1, nome: 'Drible com deslocamento', parametros: '3 séries · 8 repetições',
      orientacoes: 'Mantenha o olhar à frente e alterne a mão a cada percurso.',
      errosOrientacoes: [{ erro: 'Olhar para a bola', orientacaoCorretiva: 'Mantenha o olhar à frente.' }],
      dificuldade: 3,
      feedbacks: [
        { autor: 'Aluno', texto: 'Precisei reduzir a velocidade na segunda série.', editado: true },
        { autor: 'Treinador', texto: 'Mantenha o controle antes de acelerar.' },
      ],
    }],
  },
  {
    id: 2, nome: 'Treino B · Arremesso', data: '2026-11-16',
    status: 'Feito', quantidadeExercicios: 1,
    exercicios: [{
      id: 2, nome: 'Arremesso em apoio', parametros: '3 séries · 10 repetições',
      orientacoes: 'Mantenha os pés alinhados antes de arremessar.',
    }],
  },
]

function PreviaAssociacao() {
  const [associados, setAssociados] = useState<number[]>([1])
  return (
    <LayoutTreinador nome={treinador.first_name} secao="Biblioteca">
      <p>Prévia local · dados fictícios</p>
      <AssociarErrosOrientacoes pares={pares} associados={pares.filter(par => associados.includes(par.id))} voltar={base}
        onAssociar={async ids => setAssociados(atuais => [...atuais, ...ids])} />
    </LayoutTreinador>
  )
}

export default function PreviaIteracao4() {
  const { tela, treinoId } = useParams()
  const [busca, setBusca] = useSearchParams()
  if (tela === 'associar') return <PreviaAssociacao />

  if (tela !== 'aluno' && tela !== 'treinador') {
    return (
      <TreinoLayout usuario={aluno}>
        <h1>Prévia local da Iteração 4</h1>
        <p>Dados fictícios para revisar as telas da US33, US28 e US58.</p>
        <div className="treino-acoes">
          <Link className="treino-botao" to={base + '/associar'}>Associar erros e orientações</Link>
          <Link className="treino-botao" to={base + '/treinador'}>Histórico do aluno acompanhado</Link>
          <Link className="treino-botao" to={base + '/aluno'}>Meu histórico</Link>
          <Link className="treino-botao" to={base + '/aluno?estado=vazio'}>Histórico sem registros</Link>
          <Link className="treino-botao" to={base + '/treinador?estado=erro'}>Falha ao carregar histórico</Link>
        </div>
      </TreinoLayout>
    )
  }

  const perfilTreinador = tela === 'treinador'
  const historico = base + '/' + tela
  const semRegistros = busca.get('estado') === 'vazio'
  const falha = busca.get('estado') === 'erro'
  const registros = semRegistros ? [] : perfilTreinador ? treinos.filter(treino => treino.status === 'Concluído') : treinos
  const registro = registros.find(treino => String(treino.id) === treinoId)

  return (
    <TreinoLayout usuario={perfilTreinador ? treinador : aluno}
      secaoAtiva={perfilTreinador ? 'Treinos' : 'Histórico'}>
      <p>Prévia local · dados fictícios</p>
      {treinoId ? (
        registro ? <RegistroTreinoHistorico treino={registro} voltar={historico} /> : <>
          <p role="alert">Treino não encontrado no histórico.</p>
          <Link to={historico}>Voltar ao histórico</Link>
        </>
      ) : (
        <HistoricoTreinos alunoNome={perfilTreinador ? 'Aluno Exemplo' : undefined}
          consulta={falha ? {
            estado: 'erro', mensagem: 'Não foi possível carregar o histórico.', tentarNovamente: () => setBusca({}),
          } : { estado: 'disponivel', treinos: registros }}
          rotaTreino={id => historico + '/' + id}
          voltar={{ rota: base, texto: 'Voltar às prévias' }} />
      )}
    </TreinoLayout>
  )
}
