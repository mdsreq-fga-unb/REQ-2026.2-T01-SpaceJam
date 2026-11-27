import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import type { Exercicio } from '../../types/exercicio'
import { listarExercicios } from '../exercicios/exerciciosApi'
import { LayoutTreinador } from './LayoutTreinador'
import { criarTreino, type ExercicioDoTreino } from './planejamentosApi'
import './TreinadorNovoTreino.css'

type Meta = 'repeticoes' | 'duracao_segundos'

interface ItemDoFormulario {
  chave: number
  exercicio: string
  series: string
  meta: Meta
  valor: string
}

interface ErrosDoItem {
  exercicio?: string
  series?: string
  valor?: string
}

interface Erros {
  nome?: string
  lista?: string
  geral?: string
  itens: ErrosDoItem[]
}

type Biblioteca =
  | { estado: 'carregando' | 'erro' }
  | { estado: 'pronto'; exercicios: Exercicio[] }

const inteiroPositivo = (texto: string) => /^\d+$/.test(texto.trim()) && Number(texto) >= 1

function validar(nome: string, itens: ItemDoFormulario[]): Erros | null {
  const erros: Erros = { itens: itens.map(() => ({})) }
  let invalido = false

  if (!nome.trim()) {
    erros.nome = 'Informe o nome do treino.'
    invalido = true
  }
  if (itens.length === 0) {
    erros.lista = 'Selecione ao menos um exercício.'
    invalido = true
  }
  itens.forEach((item, indice) => {
    const erro = erros.itens[indice]
    if (!item.exercicio) erro.exercicio = 'Selecione o exercício.'
    if (!inteiroPositivo(item.series)) erro.series = 'As séries devem ser no mínimo 1.'
    if (!inteiroPositivo(item.valor)) {
      erro.valor = item.meta === 'repeticoes'
        ? 'As repetições devem ser no mínimo 1.'
        : 'A duração deve ser de no mínimo 1 segundo.'
    }
    if (erro.exercicio || erro.series || erro.valor) invalido = true
  })

  return invalido ? erros : null
}

function textos(valor: unknown): string | undefined {
  if (typeof valor === 'string') return valor
  if (Array.isArray(valor)) {
    const lista = valor.filter((item): item is string => typeof item === 'string')
    return lista.length > 0 ? lista.join(' ') : undefined
  }
  return undefined
}

/** Traduz o corpo 400 do backend (inclusive erros por exercício) para os erros da tela. */
function errosDoServidor(corpo: unknown, total: number): Erros {
  const erros: Erros = { itens: Array.from({ length: total }, () => ({})) }
  if (!corpo || typeof corpo !== 'object') return erros
  const dados = corpo as Record<string, unknown>

  erros.nome = textos(dados.nome)
  erros.geral = textos(dados.detail) ?? textos(dados.planejamento)

  if (Array.isArray(dados.exercicios)) {
    erros.lista = textos(dados.exercicios)
    dados.exercicios.forEach((item, indice) => {
      if (!item || typeof item !== 'object' || indice >= total) return
      const campos = item as Record<string, unknown>
      erros.itens[indice] = {
        exercicio: textos(campos.exercicio),
        series: textos(campos.series),
        valor: textos(campos.repeticoes) ?? textos(campos.duracao_segundos) ?? textos(campos.non_field_errors),
      }
    })
  } else {
    erros.lista = textos(dados.exercicios)
  }
  return erros
}

export function TreinadorNovoTreino() {
  const { usuario } = useAuth()
  const navegar = useNavigate()
  const { alunoId, planejamentoId } = useParams()
  const idPlanejamento = Number(planejamentoId)
  const idsValidos =
    Number.isSafeInteger(Number(alunoId)) && Number(alunoId) > 0 &&
    Number.isSafeInteger(idPlanejamento) && idPlanejamento > 0
  const rotaPlanejamento = `/treinador/alunos/${alunoId}/planejamento`

  const proximaChave = useRef(2)
  const [biblioteca, setBiblioteca] = useState<Biblioteca>({ estado: 'carregando' })
  const [nome, setNome] = useState('')
  const [itens, setItens] = useState<ItemDoFormulario[]>([
    { chave: 1, exercicio: '', series: '3', meta: 'repeticoes', valor: '' },
  ])
  const [erros, setErros] = useState<Erros>({ itens: [] })
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    let ativo = true
    listarExercicios()
      .then((exercicios) => {
        if (ativo) setBiblioteca({ estado: 'pronto', exercicios: exercicios.filter((e) => e.id !== undefined) })
      })
      .catch(() => {
        if (ativo) setBiblioteca({ estado: 'erro' })
      })
    return () => { ativo = false }
  }, [])

  function alterarItem(chave: number, alteracao: Partial<ItemDoFormulario>) {
    setItens((atuais) => atuais.map((item) => (item.chave === chave ? { ...item, ...alteracao } : item)))
    setErros({ itens: [] })
  }

  function adicionarExercicio() {
    setItens((atuais) => [
      ...atuais,
      { chave: proximaChave.current++, exercicio: '', series: '3', meta: 'repeticoes', valor: '' },
    ])
    setErros({ itens: [] })
  }

  function removerExercicio(chave: number) {
    setItens((atuais) => atuais.filter((item) => item.chave !== chave))
    setErros({ itens: [] })
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (enviando || !idsValidos) return

    const invalidos = validar(nome, itens)
    if (invalidos) {
      setErros(invalidos)
      return
    }

    const exercicios: ExercicioDoTreino[] = itens.map((item) => ({
      exercicio: Number(item.exercicio),
      series: Number(item.series),
      [item.meta]: Number(item.valor),
    }))

    setEnviando(true)
    try {
      await criarTreino(idPlanejamento, { nome: nome.trim(), exercicios })
      navegar(rotaPlanejamento)
    } catch (falha) {
      if (falha instanceof ApiError && falha.status === 400) {
        setErros(errosDoServidor(falha.corpo, itens.length))
      } else if (falha instanceof ApiError && falha.status === 404) {
        setErros({ geral: 'Planejamento não encontrado na sua carteira.', itens: [] })
      } else {
        setErros({ geral: 'Não foi possível criar o treino. Tente novamente.', itens: [] })
      }
      setEnviando(false)
    }
  }

  const exercicios = biblioteca.estado === 'pronto' ? biblioteca.exercicios : []
  const nomeTreinador = usuario?.first_name || usuario?.apelido || ''

  return (
    <LayoutTreinador nome={nomeTreinador} secao="Treinos">
      <div className="novo-treino">
        <header className="novo-treino__intro">
          <h1>Novo treino</h1>
          <p>Escolha os exercícios da biblioteca e defina séries e repetições ou duração.</p>
        </header>

        {!idsValidos && (
          <p role="alert" className="novo-treino__erro">Planejamento inválido.</p>
        )}
        {biblioteca.estado === 'carregando' && <p role="status">Carregando biblioteca de exercícios...</p>}
        {biblioteca.estado === 'erro' && (
          <p role="alert" className="novo-treino__erro">Não foi possível carregar a biblioteca de exercícios.</p>
        )}

        <form onSubmit={salvar} noValidate>
          <div className="novo-treino__campo">
            <label htmlFor="nome-treino">Nome do treino *</label>
            <input
              id="nome-treino"
              type="text"
              value={nome}
              onChange={(evento) => { setNome(evento.target.value); setErros({ itens: [] }) }}
              placeholder="Ex.: Treino A"
              aria-invalid={Boolean(erros.nome)}
            />
            {erros.nome && <p className="novo-treino__erro" role="alert">{erros.nome}</p>}
          </div>

          <ol className="novo-treino__lista" aria-label="Exercícios do treino">
            {itens.map((item, indice) => {
              const numero = indice + 1
              const erro = erros.itens[indice] ?? {}
              return (
                <li className="novo-treino__item" key={item.chave}>
                  <div className="novo-treino__campo">
                    <label htmlFor={`exercicio-${item.chave}`}>Exercício {numero}</label>
                    <select
                      id={`exercicio-${item.chave}`}
                      value={item.exercicio}
                      onChange={(evento) => alterarItem(item.chave, { exercicio: evento.target.value })}
                    >
                      <option value="">Selecione o exercício</option>
                      {exercicios.map((exercicio) => (
                        <option key={exercicio.id} value={exercicio.id}>
                          {exercicio.nome} · {exercicio.fundamento}
                        </option>
                      ))}
                    </select>
                    {erro.exercicio && <p className="novo-treino__erro" role="alert">{erro.exercicio}</p>}
                  </div>

                  <div className="novo-treino__campo">
                    <label htmlFor={`series-${item.chave}`}>Séries do exercício {numero}</label>
                    <input
                      id={`series-${item.chave}`}
                      type="text"
                      inputMode="numeric"
                      value={item.series}
                      onChange={(evento) => alterarItem(item.chave, { series: evento.target.value })}
                    />
                    {erro.series && <p className="novo-treino__erro" role="alert">{erro.series}</p>}
                  </div>

                  <div className="novo-treino__campo">
                    <label htmlFor={`meta-${item.chave}`}>Meta do exercício {numero}</label>
                    <select
                      id={`meta-${item.chave}`}
                      value={item.meta}
                      onChange={(evento) => alterarItem(item.chave, { meta: evento.target.value as Meta, valor: '' })}
                    >
                      <option value="repeticoes">Repetições</option>
                      <option value="duracao_segundos">Duração (segundos)</option>
                    </select>
                  </div>

                  <div className="novo-treino__campo">
                    <label htmlFor={`valor-${item.chave}`}>
                      {item.meta === 'repeticoes'
                        ? `Repetições do exercício ${numero}`
                        : `Duração em segundos do exercício ${numero}`}
                    </label>
                    <input
                      id={`valor-${item.chave}`}
                      type="text"
                      inputMode="numeric"
                      value={item.valor}
                      onChange={(evento) => alterarItem(item.chave, { valor: evento.target.value })}
                    />
                    {erro.valor && <p className="novo-treino__erro" role="alert">{erro.valor}</p>}
                  </div>

                  <button
                    type="button"
                    className="novo-treino__botao"
                    onClick={() => removerExercicio(item.chave)}
                  >
                    Remover exercício {numero}
                  </button>
                </li>
              )
            })}
          </ol>

          {erros.lista && <p className="novo-treino__erro" role="alert">{erros.lista}</p>}

          <div className="novo-treino__acoes">
            <button type="button" className="novo-treino__botao" onClick={adicionarExercicio}>
              Adicionar exercício
            </button>
            <button
              type="submit"
              className="novo-treino__botao novo-treino__botao--principal"
              disabled={enviando || biblioteca.estado !== 'pronto'}
            >
              Salvar treino
            </button>
            <Link className="novo-treino__botao" to={rotaPlanejamento}>Cancelar</Link>
          </div>

          {erros.geral && <p className="novo-treino__erro" role="alert">{erros.geral}</p>}
        </form>
      </div>
    </LayoutTreinador>
  )
}