import { useState } from 'react'
import { Link } from 'react-router'
import type { Usuario } from '../../types/usuario'
import './AlunosAcompanhados.css'

/** US52 / RF04701: somente dados fornecidos pela API autorizada do treinador. */
export interface AlunoAcompanhadoResumo {
  id: number
  nome: string
  objetivo?: string | null
}

export type EstadoListaAlunos = 'aguardando-api' | 'carregando' | 'erro' | 'pronto'

interface AlunosAcompanhadosProps {
  treinador: Usuario
  alunos?: readonly AlunoAcompanhadoResumo[]
  estado: EstadoListaAlunos
  demonstracao?: boolean
  /** Habilitar somente depois que a rota US61 estiver integrada nesta branch. */
  perfilIntegrado?: boolean
}

function iniciais(nome: string) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte.charAt(0).toLocaleUpperCase('pt-BR'))
    .join('')
}

export function AlunosAcompanhados({
  treinador,
  alunos = [],
  estado,
  demonstracao = false,
  perfilIntegrado = false,
}: AlunosAcompanhadosProps) {
  const [copiado, setCopiado] = useState(false)
  const [erroCopia, setErroCopia] = useState(false)
  const nomeTreinador = treinador.first_name || treinador.apelido
  const codigo = demonstracao ? 'LUCAS26' : treinador.codigo_convite?.trim() || ''
  const podeCopiar = !demonstracao && Boolean(codigo)
  const exibindoLista = estado === 'pronto'
  const total = exibindoLista ? alunos.length : null

  async function copiarCodigo() {
    if (!podeCopiar) return
    setErroCopia(false)
    setCopiado(false)
    try {
      await navigator.clipboard.writeText(codigo)
      setCopiado(true)
    } catch {
      setErroCopia(true)
    }
  }

  const marca = (
    <div className="sj52__marca">
      <picture className="sj52__marca-imagem">
        <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
        <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
      </picture>
      <span>SPACE JAM</span>
    </div>
  )

  return (
    <div className="sj52">
      <a className="sj52__pular-conteudo" href="#sj52-conteudo">
        Pular para o conteúdo principal
      </a>
      <aside className="sj52__lateral">
        {marca}
        <nav className="sj52__menu" aria-label="Menu do treinador">
          <span aria-current="page">Alunos</span>
          <span aria-disabled="true">Treinos</span>
          <span aria-disabled="true">Biblioteca</span>
          <Link to="/">Conta</Link>
        </nav>
        <div className="sj52__usuario-lateral">
          <strong>{nomeTreinador}</strong>
          <span>Treinador</span>
        </div>
      </aside>

      <div className="sj52__area">
        <header className="sj52__cabecalho-mobile">
          {marca}
          <span>{nomeTreinador}</span>
        </header>

        <main className="sj52__conteudo" id="sj52-conteudo" tabIndex={-1}>
          <div className="sj52__intro">
            <div>
              <h1>Seus alunos</h1>
              <p>Acompanhe os alunos vinculados a você.</p>
            </div>
            {total !== null && (
              <div className="sj52__placar" aria-label={`${total} ${total === 1 ? 'atleta' : 'atletas'}`}>
                <strong>{String(total).padStart(2, '0')}</strong>
                <span>{total === 1 ? 'ATLETA' : 'ATLETAS'}</span>
              </div>
            )}
          </div>

          {demonstracao && (
            <p className="sj52__nota sj52__nota--demonstracao" role="status">
              Prévia visual com alunos e código fictícios. Nenhum dado real de alunos foi consultado.
            </p>
          )}

          <div className="sj52__colunas">
            <section className="sj52__lista" aria-label="Alunos vinculados">
              {estado === 'aguardando-api' && (
                <div className="sj52__estado" role="status">
                  <h2>Lista de alunos indisponível</h2>
                  <p>Não é possível consultar os alunos neste momento.</p>
                </div>
              )}
              {estado === 'carregando' && (
                <div className="sj52__estado" role="status">
                  <h2>Carregando alunos…</h2>
                  <p>Buscando somente os alunos vinculados ao treinador.</p>
                </div>
              )}
              {estado === 'erro' && (
                <div className="sj52__estado" role="alert">
                  <h2>Não foi possível consultar os alunos</h2>
                  <p>Verifique sua conexão e tente novamente quando o serviço estiver disponível.</p>
                </div>
              )}
              {exibindoLista && alunos.length === 0 && (
                <div className="sj52__estado" role="status">
                  <h2>Nenhum aluno vinculado</h2>
                  <p>Quando alunos forem vinculados à sua carteira, eles aparecerão aqui.</p>
                </div>
              )}
              {exibindoLista && alunos.length > 0 && (
                <ul className="sj52__lista-itens">
                  {alunos.map((aluno) => (
                    <li className="sj52__aluno" key={aluno.id}>
                      <span className="sj52__avatar" aria-hidden="true">{iniciais(aluno.nome)}</span>
                      <div className="sj52__aluno-dados">
                        <strong>{aluno.nome}</strong>
                        <span>{aluno.objetivo?.trim() || 'Objetivo não informado'}</span>
                      </div>
                      {perfilIntegrado && !demonstracao ? (
                        <Link
                          className="sj52__ver-perfil"
                          to={`/treinador/alunos/${aluno.id}`}
                          aria-label={`Ver perfil de ${aluno.nome}`}
                        >
                          Ver perfil
                        </Link>
                      ) : (
                        <span
                          className="sj52__ver-perfil sj52__ver-perfil--pendente"
                          title="Consulta ao perfil disponível após a integração da US61"
                        >
                          Em breve
                          <span className="sj52__sr-only">
                            {' — '}Perfil de {aluno.nome} indisponível até a integração da US61
                          </span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="sj52__convite" aria-labelledby="sj52-convite-titulo">
              <h2 id="sj52-convite-titulo">Convide seus alunos</h2>
              <p>Compartilhe seu código. Ele é necessário no cadastro.</p>
              {codigo ? (
                <strong className="sj52__codigo">{codigo}</strong>
              ) : (
                <p className="sj52__codigo-indisponivel">Código de convite não disponível no perfil.</p>
              )}
              <button
                type="button"
                className="sj52__copiar"
                disabled={!podeCopiar}
                onClick={() => { void copiarCodigo() }}
                title={demonstracao ? 'Código fictício apenas para prévia' : !codigo ? 'Código de convite indisponível' : undefined}
              >
                {copiado ? 'Código copiado!' : 'Copiar código'}
              </button>
              {copiado && <p className="sj52__feedback" role="status">Código copiado para a área de transferência.</p>}
              {erroCopia && <p className="sj52__feedback sj52__feedback--erro" role="alert">Não foi possível copiar. Selecione o código manualmente.</p>}
              {demonstracao && <p className="sj52__feedback">Este código é ilustrativo e não deve ser compartilhado.</p>}
            </section>
          </div>
        </main>
      </div>

      <nav className="sj52__navegacao-mobile" aria-label="Seções do treinador">
        <span aria-current="page">Alunos</span>
        <span aria-disabled="true">Treinos</span>
        <span aria-disabled="true">Biblioteca</span>
        <Link to="/">Conta</Link>
      </nav>
    </div>
  )
}
