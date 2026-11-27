
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError } from '../../api/client'
import { useAuth } from '../../auth/useAuth'
import { LayoutTreinador } from './LayoutTreinador'
import {
  consultarPlanejamentoVigente,
  quantidadeDeExercicios,
  rotuloDoTreino,
  type ConsultaPlanejamentoVigente,
} from './planejamentosApi'
import './TreinadorDetalhesPlanejamento.css'

type Consulta =
  | { estado: 'carregando' }
  | { estado: 'erro'; mensagem: string }
  | { estado: 'pronto'; dados: ConsultaPlanejamentoVigente }

function mensagemDeErro(falha: unknown) {
  if (falha instanceof ApiError && falha.status === 404) return 'Aluno não encontrado na sua carteira.'
  if (falha instanceof ApiError && falha.status === 403) return 'Você não tem permissão para consultar este aluno.'
  return 'Não foi possível consultar o planejamento deste aluno.'
}

export function TreinadorDetalhesPlanejamento() {
  const { usuario } = useAuth()
  const { alunoId } = useParams()
  const id = Number(alunoId)
  const idValido = Number.isSafeInteger(id) && id > 0
  const [consulta, setConsulta] = useState<Consulta>({ estado: 'carregando' })

  useEffect(() => {
    if (!idValido) return
    const controle = new AbortController()
    const { signal } = controle

    setConsulta({ estado: 'carregando' })
    consultarPlanejamentoVigente(id, signal)
      .then((dados) => {
        if (!signal.aborted) setConsulta({ estado: 'pronto', dados })
      })
      .catch((falha: unknown) => {
        if (!signal.aborted) setConsulta({ estado: 'erro', mensagem: mensagemDeErro(falha) })
      })

    return () => controle.abort()
  }, [id, idValido])

  const nomeTreinador = usuario?.first_name || usuario?.apelido || ''
  const estado: Consulta = idValido
    ? consulta
    : { estado: 'erro', mensagem: 'Identificador de aluno inválido.' }

  // Guarda o planejamento em uma variável para garantir que ele não seja nulo.
  const planejamento =
    estado.estado === 'pronto' ? estado.dados.planejamento : null

  return (
    <LayoutTreinador nome={nomeTreinador} secao="Treinos">
      <div className="detalhes-planejamento">
        {estado.estado === 'carregando' && <p role="status">Carregando planejamento...</p>}

        {estado.estado === 'erro' && (
          <section className="detalhes-planejamento__estado" role="alert">
            <h1>Planejamento indisponível</h1>
            <p>{estado.mensagem}</p>
            <Link className="detalhes-planejamento__botao" to="/treinador/planejamentos">
              Voltar aos alunos
            </Link>
          </section>
        )}

        {estado.estado === 'pronto' && !planejamento && (
          <section className="detalhes-planejamento__estado" role="status">
            <header className="detalhes-planejamento__intro">
              <h1>Nenhum planejamento vigente</h1>
              <p>Planejamento de {estado.dados.aluno.nome}</p>
            </header>
            <div className="detalhes-planejamento__acoes">
              <Link
                className="detalhes-planejamento__botao principal"
                to={`/treinador/novo-planejamento?aluno=${estado.dados.aluno.id}`}
              >
                Criar planejamento
              </Link>
              <Link
                className="detalhes-planejamento__botao"
                to={`/treinador/alunos/${estado.dados.aluno.id}/planejamentos-anteriores`}
              >
                Planejamentos anteriores
              </Link>
              <Link className="detalhes-planejamento__botao" to="/treinador/planejamentos">
                Voltar aos alunos
              </Link>
            </div>
          </section>
        )}

        {estado.estado === 'pronto' && planejamento && (
          <>
            <header className="detalhes-planejamento__intro">
              <h1>{planejamento.nome}</h1>
              <p>Planejamento de {estado.dados.aluno.nome}</p>
            </header>

            {planejamento.treinos.length > 0 ? (
              <section className="detalhes-planejamento__treinos" aria-label="Treinos do planejamento">
                {planejamento.treinos.map((treino) => (
                  <div className="detalhes-planejamento__coluna" key={treino.id}>
                    <article className="detalhes-planejamento__cartao" data-status={treino.status}>
                      <strong>{treino.nome}</strong>
                      <span>
                        <span className="detalhes-planejamento__status">{rotuloDoTreino(treino)}</span>
                        {' · '}{quantidadeDeExercicios(treino.total_exercicios)}
                      </span>
                      <Link className="detalhes-planejamento__link" to={'/treinos/' + treino.id}
                        aria-label={'Consultar treino ' + treino.nome}>
                        Consultar treino
                      </Link>
                      {treino.status !== 'CONCLUIDO' && (
                        <Link
                          className="detalhes-planejamento__editar-treino"
                          to={`/treinador/alunos/${estado.dados.aluno.id}/planejamento/${planejamento.id}/treinos/${treino.id}/editar`}
                          aria-label={'Editar treino ' + treino.nome}
                        >
                          Editar treino
                        </Link>
                      )}
                      {treino.exercicios?.length > 0 && (
                        <details className="detalhes-planejamento__exercicios">
                          <summary aria-label={`Ver exercícios de ${treino.nome}`}>
                            Ver exercícios
                          </summary>
                          <ol>
                            {treino.exercicios.map((exercicio) => (
                              <li key={exercicio.id}>
                                <strong>{exercicio.nome}</strong>
                                <span>
                                  {exercicio.series} {exercicio.series === 1 ? 'série' : 'séries'} ·{' '}
                                  {exercicio.repeticoes != null
                                    ? `${exercicio.repeticoes} ${exercicio.repeticoes === 1 ? 'repetição' : 'repetições'}`
                                    : `${exercicio.duracao_segundos} s`}
                                </span>
                              </li>
                            ))}
                          </ol>
                        </details>
                      )}
                    </article>
                  </div>
                ))}
              </section>
            ) : (
              <p className="detalhes-planejamento__vazio" role="status">
                Este planejamento ainda não tem treinos.
              </p>
            )}

            <section className="detalhes-planejamento__acoes" aria-label="Ações do planejamento">
              <Link
                className="detalhes-planejamento__botao principal"
                to={`/treinador/alunos/${estado.dados.aluno.id}/planejamento/${planejamento.id}/novo-treino`}
              >
                Adicionar treino
              </Link>

              <Link className="detalhes-planejamento__botao" to="/treinador/planejamentos">
                Voltar aos alunos
              </Link>

              <Link
                className="detalhes-planejamento__botao"
                to={`/treinador/alunos/${estado.dados.aluno.id}/planejamento/${planejamento.id}/editar`}
              >
                Editar planejamento
              </Link>

              <Link
                className="detalhes-planejamento__botao"
                to={`/treinador/alunos/${estado.dados.aluno.id}/planejamentos-anteriores`}
              >
                Planejamentos anteriores
              </Link>
            </section>
          </>
        )}
      </div>
    </LayoutTreinador>
  )
}
