import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import type { Exercicio } from '../../types/exercicio'
import { listarExercicios } from '../exercicios/exerciciosApi'
import { LayoutTreinador } from './LayoutTreinador'
import {
  consultarPlanejamentoAnterior,
  consultarPlanejamentoVigente,
  editarPlanejamento,
  editarTreino,
  listarPlanejamentosAnteriores,
  podeRemoverTreino,
  quantidadeDeExercicios,
  rotuloDoTreino,
  type ConsultaPlanejamentoVigente,
  type ItemDaEdicao,
  type PlanejamentoAnterior,
  type TreinoResumo,
} from './planejamentosApi'
import './TreinadorHistoriasComplementares.css'

type Carga<T> = { estado: 'carregando' } | { estado: 'erro'; mensagem: string } | { estado: 'pronto'; dados: T }

function nomeTreinador(usuario: ReturnType<typeof useAuth>['usuario']) {
  return usuario?.first_name || usuario?.apelido || 'Treinador'
}

function mensagemDeErro(falha: unknown, padrao: string) {
  if (falha instanceof ApiError) {
    if (falha.status === 404) return 'Aluno ou planejamento não encontrado na sua carteira.'
    if (falha.status === 403) return 'Você não tem permissão para esta ação.'
    if (falha.status === 409) return falha.message
  }
  return padrao
}

function useIds() {
  const params = useParams()
  return {
    alunoId: Number(params.alunoId),
    planejamentoId: Number(params.planejamentoId),
    treinoId: Number(params.treinoId),
  }
}

function useVigente(alunoId: number) {
  const [carga, setCarga] = useState<Carga<ConsultaPlanejamentoVigente>>({ estado: 'carregando' })
  useEffect(() => {
    const controle = new AbortController()
    consultarPlanejamentoVigente(alunoId, controle.signal)
      .then((dados) => { if (!controle.signal.aborted) setCarga({ estado: 'pronto', dados }) })
      .catch((falha: unknown) => {
        if (!controle.signal.aborted) {
          setCarga({ estado: 'erro', mensagem: mensagemDeErro(falha, 'Não foi possível carregar o planejamento.') })
        }
      })
    return () => controle.abort()
  }, [alunoId])
  return carga
}

function Aviso({ texto, voltar }: { texto: string; voltar: string }) {
  return (
    <section className="sj-historias__estado" role="alert">
      <p>{texto}</p>
      <Link className="sj-historias__botao" to={voltar}>Voltar ao planejamento</Link>
    </section>
  )
}

/* US19 — Editar planejamento */

export function TreinadorEditarPlanejamento() {
  const { usuario } = useAuth()
  const { alunoId, planejamentoId } = useIds()
  const carga = useVigente(alunoId)
  const voltar = `/treinador/alunos/${alunoId}/planejamento`
  const planejamento = carga.estado === 'pronto' ? carga.dados.planejamento : null
  const editavel = planejamento !== null && planejamento.id === planejamentoId

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias">
        <header className="sj-historias__intro">
          <h1>Editar planejamento</h1>
          {carga.estado === 'pronto' && <p>{carga.dados.aluno.nome}</p>}
        </header>

        {carga.estado === 'carregando' && <p role="status">Carregando planejamento...</p>}
        {carga.estado === 'erro' && <Aviso texto={carga.mensagem} voltar={voltar} />}
        {carga.estado === 'pronto' && !editavel && (
          <Aviso texto="Este planejamento está no histórico e é somente leitura." voltar={voltar} />
        )}
        {planejamento && editavel && (
          <FormularioPlanejamento
            key={planejamento.id}
            planejamentoId={planejamento.id}
            nomeInicial={planejamento.nome}
            treinosIniciais={planejamento.treinos}
            voltar={voltar}
          />
        )}
      </section>
    </LayoutTreinador>
  )
}

function FormularioPlanejamento({ planejamentoId, nomeInicial, treinosIniciais, voltar }: {
  planejamentoId: number
  nomeInicial: string
  treinosIniciais: TreinoResumo[]
  voltar: string
}) {
  const navigate = useNavigate()
  const [nome, setNome] = useState(nomeInicial)
  const [treinosRemovidos, setTreinosRemovidos] = useState<number[]>([])
  const treinos = treinosIniciais.filter((treino) => !treinosRemovidos.includes(treino.id))
  const [confirmando, setConfirmando] = useState<number | null>(null)
  const [erroNome, setErroNome] = useState('')
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando) return
    setErroGeral('')
    if (!nome.trim()) {
      setErroNome('Informe o nome do planejamento.')
      return
    }
    setEnviando(true)
    try {
      await editarPlanejamento(planejamentoId, nome.trim(), treinosRemovidos)
      navigate(voltar)
    } catch (falha) {
      if (falha instanceof ApiError && falha.status === 400) setErroNome(falha.campos.nome?.join(' ') ?? falha.message)
      else setErroGeral(mensagemDeErro(falha, 'Não foi possível salvar o planejamento.'))
    } finally {
      setEnviando(false)
    }
  }

  function marcarRemocao(treino: TreinoResumo) {
    setErroGeral('')
    setTreinosRemovidos((atuais) => [...atuais, treino.id])
    setConfirmando(null)
  }

  return (
    <form className="sj-historias__form" onSubmit={salvar} noValidate>
      <div className="sj-historias__colunas">
        <div className="sj-historias__campo">
          <label htmlFor="nome-planejamento">Nome do planejamento *</label>
          <input
            id="nome-planejamento"
            value={nome}
            maxLength={255}
            disabled={enviando}
            aria-invalid={Boolean(erroNome)}
            aria-describedby={erroNome ? 'erro-nome-planejamento' : undefined}
            onChange={(event) => { setNome(event.target.value); setErroNome('') }}
          />
          {erroNome && <p id="erro-nome-planejamento" className="sj-historias__erro">{erroNome}</p>}
        </div>

        <aside className="sj-historias__painel">
          <h2>Treinos do planejamento</h2>
          {treinos.length === 0 && <p>Este planejamento ainda não tem treinos.</p>}
          {treinosRemovidos.length > 0 && <p role="status">As remoções só serão aplicadas ao salvar.</p>}
          <ul>
            {treinos.map((treino) => (
              <li key={treino.id} className="sj-historias__linha-treino">
                <span>{treino.nome} · {rotuloDoTreino(treino)}</span>
                {podeRemoverTreino(treino) && confirmando !== treino.id && (
                  <button
                    type="button"
                    className="sj-historias__remover"
                    aria-label={`Remover ${treino.nome}`}
                    disabled={enviando}
                    onClick={() => setConfirmando(treino.id)}
                  >
                    Remover
                  </button>
                )}
                {confirmando === treino.id && (
                  <span className="sj-historias__confirmacao">
                    <button type="button" className="sj-historias__remover" disabled={enviando} onClick={() => marcarRemocao(treino)}>
                      Confirmar remoção
                    </button>
                    <button type="button" className="sj-historias__remover" disabled={enviando} onClick={() => setConfirmando(null)}>
                      Manter
                    </button>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {erroGeral && <p className="sj-historias__erro" role="alert">{erroGeral}</p>}

      <div className="sj-historias__acoes">
        <button className="sj-historias__botao sj-historias__botao--principal" type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button className="sj-historias__botao" type="button" disabled={enviando} onClick={() => navigate(voltar)}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

/* US21 — Consultar planejamentos anteriores */

type Detalhe = Carga<TreinoResumo[]>

function dataCurta(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString('pt-BR') : ''
}

export function TreinadorPlanejamentosAnteriores() {
  const { usuario } = useAuth()
  const { alunoId } = useIds()
  const [carga, setCarga] = useState<Carga<{ aluno: { nome: string }; planejamentos: PlanejamentoAnterior[] }>>({
    estado: 'carregando',
  })
  const [selecionado, setSelecionado] = useState<number | null>(null)
  const [detalhes, setDetalhes] = useState<Record<number, Detalhe>>({})

  useEffect(() => {
    const controle = new AbortController()
    listarPlanejamentosAnteriores(alunoId, controle.signal)
      .then((dados) => { if (!controle.signal.aborted) setCarga({ estado: 'pronto', dados }) })
      .catch((falha: unknown) => {
        if (!controle.signal.aborted) {
          setCarga({ estado: 'erro', mensagem: mensagemDeErro(falha, 'Não foi possível carregar o histórico.') })
        }
      })
    return () => controle.abort()
  }, [alunoId])

  function alternar(id: number) {
    if (selecionado === id) {
      setSelecionado(null)
      return
    }
    setSelecionado(id)
    if (detalhes[id]?.estado === 'pronto') return
    setDetalhes((atuais) => ({ ...atuais, [id]: { estado: 'carregando' } }))
    consultarPlanejamentoAnterior(alunoId, id)
      .then(({ planejamento }) =>
        setDetalhes((atuais) => ({ ...atuais, [id]: { estado: 'pronto', dados: planejamento.treinos } })))
      .catch((falha: unknown) =>
        setDetalhes((atuais) => ({
          ...atuais,
          [id]: { estado: 'erro', mensagem: mensagemDeErro(falha, 'Não foi possível consultar este planejamento.') },
        })))
  }

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias">
        <header className="sj-historias__intro">
          <h1>Planejamentos anteriores</h1>
          {carga.estado === 'pronto' && <p>{carga.dados.aluno.nome}</p>}
        </header>

        {carga.estado === 'carregando' && <p role="status">Carregando histórico...</p>}
        {carga.estado === 'erro' && <p className="sj-historias__erro" role="alert">{carga.mensagem}</p>}
        {carga.estado === 'pronto' && carga.dados.planejamentos.length === 0 && (
          <p role="status">Nenhum planejamento anterior.</p>
        )}

        {carga.estado === 'pronto' && carga.dados.planejamentos.length > 0 && (
          <div className="sj-historias__historico">
            {carga.dados.planejamentos.map((planejamento) => {
              const aberto = selecionado === planejamento.id
              const detalhe = detalhes[planejamento.id]
              return (
                <article className={`sj-historias__item ${aberto ? 'is-aberto' : ''}`} key={planejamento.id}>
                  <button
                    className="sj-historias__item-botao"
                    type="button"
                    aria-expanded={aberto}
                    onClick={() => alternar(planejamento.id)}
                  >
                    <span>
                      <strong>{planejamento.nome}</strong>
                      <small>
                        Planejamento anterior · {planejamento.total_treinos}{' '}
                        {planejamento.total_treinos === 1 ? 'treino' : 'treinos'}
                        {planejamento.encerrado_em && ` · encerrado em ${dataCurta(planejamento.encerrado_em)}`}
                      </small>
                    </span>
                    <span className="sj-historias__consultar">{aberto ? 'Recolher' : 'Consultar'}</span>
                  </button>

                  {aberto && (
                    <div className="sj-historias__detalhe">
                      <h2>Treinos deste planejamento</h2>
                      {detalhe?.estado === 'carregando' && <p role="status">Carregando treinos...</p>}
                      {detalhe?.estado === 'erro' && <p className="sj-historias__erro" role="alert">{detalhe.mensagem}</p>}
                      {detalhe?.estado === 'pronto' && detalhe.dados.length === 0 && <p>Nenhum treino neste planejamento.</p>}
                      {detalhe?.estado === 'pronto' && detalhe.dados.length > 0 && (
                        <ul>
                          {detalhe.dados.map((treino) => (
                            <li key={treino.id}>
                              {treino.nome} · {rotuloDoTreino(treino)} · {quantidadeDeExercicios(treino.total_exercicios)}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}

        <div className="sj-historias__acoes">
          <Link
            className="sj-historias__botao sj-historias__botao--principal"
            to={`/treinador/alunos/${alunoId}/planejamento`}
          >
            Planejamento vigente
          </Link>
        </div>
      </section>
    </LayoutTreinador>
  )
}

/* US25 — Editar treino */

type Meta = 'repeticoes' | 'duracao_segundos'

interface Linha {
  chave: string
  id?: number
  exercicio?: string
  nome: string
  series: string
  meta: Meta
  valor: string
  executado: boolean
}

const inteiroPositivo = (texto: string) => /^\d+$/.test(texto.trim()) && Number(texto) >= 1

function linhaDoTreino(item: TreinoResumo['exercicios'][number]): Linha {
  const meta: Meta = item.repeticoes != null ? 'repeticoes' : 'duracao_segundos'
  return {
    chave: `p-${item.id}`,
    id: item.id,
    nome: item.nome,
    series: String(item.series),
    meta,
    valor: String((meta === 'repeticoes' ? item.repeticoes : item.duracao_segundos) ?? ''),
    executado: item.status !== 'A_FAZER',
  }
}

function paraEnvio(linha: Linha): ItemDaEdicao {
  const parametros = {
    series: Number(linha.series),
    [linha.meta]: Number(linha.valor),
  } as { series: number; repeticoes?: number; duracao_segundos?: number }
  return linha.id !== undefined
    ? { id: linha.id, ...parametros }
    : { exercicio: Number(linha.exercicio), ...parametros }
}

export function TreinadorEditarTreino() {
  const { usuario } = useAuth()
  const { alunoId, planejamentoId, treinoId } = useIds()
  const carga = useVigente(alunoId)
  const voltar = `/treinador/alunos/${alunoId}/planejamento`
  const planejamento = carga.estado === 'pronto' ? carga.dados.planejamento : null
  const treino = planejamento?.id === planejamentoId
    ? planejamento.treinos.find((item) => item.id === treinoId) ?? null
    : null
  const concluido = treino?.status === 'CONCLUIDO'

  return (
    <LayoutTreinador nome={nomeTreinador(usuario)} secao="Treinos">
      <section className="sj-historias sj-historias--treino">
        <header className="sj-historias__intro">
          <h1>Editar treino</h1>
          {treino && carga.estado === 'pronto' && <p>{treino.nome} · {carga.dados.aluno.nome}</p>}
        </header>

        {carga.estado === 'carregando' && <p role="status">Carregando treino...</p>}
        {carga.estado === 'erro' && <Aviso texto={carga.mensagem} voltar={voltar} />}
        {carga.estado === 'pronto' && !treino && (
          <Aviso texto="Este treino não está no planejamento vigente e não pode ser editado." voltar={voltar} />
        )}
        {treino && concluido && <Aviso texto="Treino concluído é somente leitura." voltar={voltar} />}
        {treino && !concluido && <FormularioTreino key={treino.id} treino={treino} voltar={voltar} />}
      </section>
    </LayoutTreinador>
  )
}

function FormularioTreino({ treino, voltar }: { treino: TreinoResumo; voltar: string }) {
  const navigate = useNavigate()
  const [biblioteca, setBiblioteca] = useState<Exercicio[]>([])
  const [nome, setNome] = useState(treino.nome)
  const [linhas, setLinhas] = useState<Linha[]>(() => treino.exercicios.map((exercicio) => {
    const linha = linhaDoTreino(exercicio)
    return { ...linha, executado: linha.executado || treino.status === 'FEITO' }
  }))
  const [erros, setErros] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [proximaChave, setProximaChave] = useState(1)

  useEffect(() => {
    let ativo = true
    listarExercicios()
      .then((itens) => { if (ativo) setBiblioteca(itens.filter((item) => item.id !== undefined)) })
      .catch(() => { if (ativo) setBiblioteca([]) })
    return () => { ativo = false }
  }, [])

  function alterar(chave: string, alteracao: Partial<Linha>) {
    setLinhas((atuais) => atuais.map((linha) => (linha.chave === chave ? { ...linha, ...alteracao } : linha)))
    setErros({})
  }

  function adicionar() {
    setLinhas((atuais) => [
      ...atuais,
      { chave: `n-${proximaChave}`, exercicio: '', nome: '', series: '', meta: 'repeticoes', valor: '', executado: false },
    ])
    setProximaChave((valor) => valor + 1)
  }

  function validar() {
    const novos: Record<string, string> = {}
    if (!nome.trim()) novos.nome = 'Informe o nome do treino.'
    if (linhas.length === 0) novos.lista = 'Selecione ao menos um exercício.'
    linhas.forEach((linha) => {
      if (linha.id === undefined && !linha.exercicio) novos[`${linha.chave}-exercicio`] = 'Selecione o exercício.'
      if (!inteiroPositivo(linha.series)) novos[`${linha.chave}-series`] = 'As séries devem ser no mínimo 1.'
      if (!inteiroPositivo(linha.valor)) {
        novos[`${linha.chave}-valor`] = linha.meta === 'repeticoes'
          ? 'As repetições devem ser no mínimo 1.'
          : 'A duração deve ser de no mínimo 1 segundo.'
      }
    })
    setErros(novos)
    return Object.keys(novos).length === 0
  }

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErroGeral('')
    if (!validar()) return
    setEnviando(true)
    try {
      await editarTreino(treino.id, { nome: nome.trim(), exercicios: linhas.map(paraEnvio) })
      navigate(voltar)
    } catch (falha) {
      if (falha instanceof ApiError && falha.status === 400) {
        setErroGeral(falha.campos.nome?.join(' ') || falha.campos.exercicios?.join(' ') || 'Revise os dados do treino.')
      } else {
        setErroGeral(mensagemDeErro(falha, 'Não foi possível salvar o treino.'))
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="sj-historias__form" onSubmit={salvar} noValidate>
      <div className="sj-historias__campo">
        <label htmlFor="nome-treino">Nome do treino *</label>
        <input
          id="nome-treino"
          value={nome}
          maxLength={255}
          aria-invalid={Boolean(erros.nome)}
          onChange={(event) => { setNome(event.target.value); setErros({}) }}
        />
        {erros.nome && <p className="sj-historias__erro">{erros.nome}</p>}
      </div>

      <section className="sj-historias__prescricao" aria-label="Exercícios do treino">
        <h2>Exercícios do treino · {linhas.length}</h2>
        {erros.lista && <p className="sj-historias__erro" role="alert">{erros.lista}</p>}

        {linhas.map((linha, indice) => (
          <fieldset className="sj-historias__item-exercicio" key={linha.chave}>
            <legend>
              {String(indice + 1).padStart(2, '0')} {linha.nome || 'Novo exercício'}
              {linha.executado && ' · já executado'}
            </legend>

            {linha.id === undefined && (
              <div className="sj-historias__campo">
                <label htmlFor={`${linha.chave}-exercicio`}>Exercício da biblioteca *</label>
                <select
                  id={`${linha.chave}-exercicio`}
                  value={linha.exercicio}
                  onChange={(event) => {
                    const escolhido = biblioteca.find((item) => String(item.id) === event.target.value)
                    alterar(linha.chave, { exercicio: event.target.value, nome: escolhido?.nome ?? '' })
                  }}
                >
                  <option value="">Selecione</option>
                  {biblioteca.map((item) => (
                    <option key={item.id} value={item.id}>{item.nome}</option>
                  ))}
                </select>
                {erros[`${linha.chave}-exercicio`] && (
                  <p className="sj-historias__erro">{erros[`${linha.chave}-exercicio`]}</p>
                )}
              </div>
            )}

            <div className="sj-historias__colunas sj-historias__colunas--parametros">
              <div className="sj-historias__campo">
                <label htmlFor={`${linha.chave}-series`}>Séries *</label>
                <input
                  id={`${linha.chave}-series`}
                  inputMode="numeric"
                  value={linha.series}
                  disabled={linha.executado}
                  onChange={(event) => alterar(linha.chave, { series: event.target.value })}
                />
                {erros[`${linha.chave}-series`] && (
                  <p className="sj-historias__erro">{erros[`${linha.chave}-series`]}</p>
                )}
              </div>
              <div className="sj-historias__campo">
                <label htmlFor={`${linha.chave}-meta`}>Medida</label>
                <select
                  id={`${linha.chave}-meta`}
                  value={linha.meta}
                  disabled={linha.executado}
                  onChange={(event) => alterar(linha.chave, { meta: event.target.value as Meta })}
                >
                  <option value="repeticoes">Repetições</option>
                  <option value="duracao_segundos">Duração (segundos)</option>
                </select>
              </div>
              <div className="sj-historias__campo">
                <label htmlFor={`${linha.chave}-valor`}>
                  {linha.meta === 'repeticoes' ? 'Repetições *' : 'Duração (segundos) *'}
                </label>
                <input
                  id={`${linha.chave}-valor`}
                  inputMode="numeric"
                  value={linha.valor}
                  disabled={linha.executado}
                  onChange={(event) => alterar(linha.chave, { valor: event.target.value })}
                />
                {erros[`${linha.chave}-valor`] && (
                  <p className="sj-historias__erro">{erros[`${linha.chave}-valor`]}</p>
                )}
              </div>
            </div>

            {!linha.executado && (
              <button
                type="button"
                className="sj-historias__remover"
                aria-label={`Remover ${linha.nome || 'novo exercício'}`}
                onClick={() => { setLinhas((atuais) => atuais.filter((item) => item.chave !== linha.chave)); setErros({}) }}
              >
                Remover exercício
              </button>
            )}
          </fieldset>
        ))}

        <button type="button" className="sj-historias__botao" onClick={adicionar}>
          Adicionar exercício
        </button>
      </section>

      <p className="sj-historias__nota">
        Exercícios já executados pelo aluno não podem ser alterados nem removidos. Os dados exibidos são os
        da prescrição; alterações na biblioteca não mudam este treino.
      </p>

      {erroGeral && <p className="sj-historias__erro" role="alert">{erroGeral}</p>}

      <div className="sj-historias__acoes">
        <button className="sj-historias__botao sj-historias__botao--principal" type="submit" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Salvar alterações'}
        </button>
        <button className="sj-historias__botao" type="button" onClick={() => navigate(voltar)}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
