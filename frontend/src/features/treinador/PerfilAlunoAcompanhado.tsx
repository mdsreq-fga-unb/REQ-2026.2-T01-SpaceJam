import { useRef, useState } from 'react'
import type { Usuario } from '../../types/usuario'
import { RegistrarLesaoFormulario } from './RegistrarLesaoFormulario'
import './PerfilAlunoAcompanhado.css'

export interface DadosAlunoAcompanhado {
  nome: string
  apelido?: string | null
  email?: string | null
  dataNascimento?: string | null
  altura?: string | number | null
  peso?: string | number | null
  envergadura?: string | number | null
  frequenciaSemanal?: number | null
  objetivos?: string | null
  historicoLesoes?: string[] | null
  planejamentoAtual?: string | null
}

interface PerfilAlunoAcompanhadoProps {
  treinador: Usuario
  aluno?: DadosAlunoAcompanhado | null
  demonstracao?: boolean
  onVoltar?: () => void
  onRegistrarLesao?: (descricao: string, signal: AbortSignal) => Promise<void>
}

function valorOuIndisponivel(valor?: string | null) {
  return valor?.trim() || 'Não disponível para consulta'
}

function formatarNascimento(data?: string | null) {
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return 'Não disponível para consulta'
  }

  const dataValida = new Date(`${data}T00:00:00Z`)

  if (
    Number.isNaN(dataValida.getTime()) ||
    dataValida.toISOString().slice(0, 10) !== data
  ) {
    return 'Não disponível para consulta'
  }

  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

function formatarMedida(
  valor: string | number | null | undefined,
  unidade: 'cm' | 'kg',
) {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não disponível para consulta'
  }

  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return 'Não disponível para consulta'
  }

  const resultado = unidade === 'cm' ? numero * 100 : numero

  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(resultado)} ${unidade}`
}

export function PerfilAlunoAcompanhado({
  treinador,
  aluno,
  demonstracao = false,
  onVoltar,
  onRegistrarLesao,
}: PerfilAlunoAcompanhadoProps) {
  const nomeTreinador = treinador.first_name || treinador.apelido
  const botaoRegistrar = useRef<HTMLButtonElement>(null)
  const [formularioAberto, setFormularioAberto] = useState(false)
  const [lesaoRegistrada, setLesaoRegistrada] = useState(false)
  const registrar = treinador.papel === 'TREINADOR' && aluno && !demonstracao ? onRegistrarLesao : undefined
  const emRegistro = Boolean(formularioAberto && registrar && aluno)

  function voltarAoPerfil() {
    setFormularioAberto(false)
    requestAnimationFrame(() => botaoRegistrar.current?.focus())
  }

  const frequencia =
    aluno?.frequenciaSemanal != null
      ? `${aluno.frequenciaSemanal} ${
          aluno.frequenciaSemanal === 1 ? 'dia' : 'dias'
        } por semana`
      : 'Não disponível para consulta'

  const lesoes = aluno?.historicoLesoes

  return (
    <div className="perfil-acompanhado">
      <header className="perfil-acompanhado__cabecalho">
        <div className="perfil-acompanhado__marca">
          <picture className="perfil-acompanhado__logo">
            <source
              media="(min-width: 900px)"
              srcSet="/space-jam-logo-v2-desktop.png"
            />
            <img
              src="/space-jam-logo-v2-mobile.png"
              alt=""
              width="36"
              height="38"
            />
          </picture>

          <span>SPACE JAM</span>
        </div>

        <nav
          className="perfil-acompanhado__navegacao"
          aria-label="Seções do treinador"
        >
          <span aria-current={emRegistro ? undefined : 'page'}>Alunos</span>
          <span>Treinos</span>
          <span>Biblioteca</span>
          <span aria-current={emRegistro ? 'page' : undefined}>Conta</span>
        </nav>

        <div className="perfil-acompanhado__usuario">
          <strong>{nomeTreinador}</strong>
          <span>Treinador</span>
        </div>
      </header>

      {emRegistro && registrar && aluno ? (
        <main className="perfil-acompanhado__conteudo perfil-acompanhado__conteudo--registro">
          <RegistrarLesaoFormulario
            nomeAluno={aluno.nome}
            onSalvar={registrar}
            onConcluir={() => {
              setLesaoRegistrada(true)
              voltarAoPerfil()
            }}
            onCancelar={voltarAoPerfil}
          />
        </main>
      ) : <main className="perfil-acompanhado__conteudo">
        {/* Identificação do aluno */}
        <div className="perfil-acompanhado__titulo">
          <h1>{aluno?.nome || 'Perfil do aluno'}</h1>
          <p>Dados do aluno vinculado à sua carteira.</p>
        </div>

        {/* Aviso de demonstração */}
        {demonstracao && (
          <p
            className="perfil-acompanhado__aviso"
            role="status"
          >
            Modo de demonstração: dados ilustrativos, não reais.
          </p>
        )}

        {/* Aviso de integração pendente */}
        {!aluno && (
          <p
            className="perfil-acompanhado__aviso"
            role="status"
          >
            Os dados deste aluno não estão disponíveis no momento.
          </p>
        )}

        <div className="perfil-acompanhado__grade">
          {/* Coluna 1 — Informações do aluno */}
          <div className="perfil-acompanhado__coluna">
            <section aria-labelledby="us61-objetivo">
              <h2 id="us61-objetivo">Objetivo</h2>
              <p>{valorOuIndisponivel(aluno?.objetivos)}</p>
            </section>

            <section aria-labelledby="us61-dados">
              <h2 id="us61-dados">Dados cadastrais</h2>

              <dl className="perfil-acompanhado__info">
                <div>
                  <dt>Apelido:</dt>
                  <dd>{valorOuIndisponivel(aluno?.apelido)}</dd>
                </div>

                <div>
                  <dt>E-mail:</dt>
                  <dd>{valorOuIndisponivel(aluno?.email)}</dd>
                </div>

                <div>
                  <dt>Nascimento:</dt>
                  <dd>{formatarNascimento(aluno?.dataNascimento)}</dd>
                </div>
              </dl>
            </section>

            <section aria-labelledby="us61-medidas">
              <h2 id="us61-medidas">Medidas e frequência</h2>

              <dl className="perfil-acompanhado__info">
                <div>
                  <dt>Altura:</dt>
                  <dd>{formatarMedida(aluno?.altura, 'cm')}</dd>
                </div>

                <div>
                  <dt>Peso:</dt>
                  <dd>{formatarMedida(aluno?.peso, 'kg')}</dd>
                </div>

                <div>
                  <dt>Envergadura:</dt>
                  <dd>{formatarMedida(aluno?.envergadura, 'cm')}</dd>
                </div>

                <div>
                  <dt>Atividade física:</dt>
                  <dd>{frequencia}</dd>
                </div>
              </dl>
            </section>
          </div>

          {/* Coluna 2 — Acompanhamento */}
          <div className="perfil-acompanhado__coluna">
            <section aria-labelledby="us61-lesoes">
              <h2 id="us61-lesoes">Histórico de lesões</h2>
              {lesoes?.length ? (
                <ul className="perfil-acompanhado__historico-lesoes">
                  {lesoes.map((lesao, indice) => <li key={`${indice}-${lesao}`}>{lesao}</li>)}
                </ul>
              ) : (
                <p>{lesoes ? 'Nenhuma lesão registrada.' : 'Histórico ainda não disponível para consulta.'}</p>
              )}
              {lesaoRegistrada && <p className="perfil-acompanhado__sucesso-lesao" role="status">Lesão registrada.</p>}

              <button
                ref={botaoRegistrar}
                className="perfil-acompanhado__acao"
                type="button"
                disabled={!registrar}
                title={registrar ? undefined : 'Registro de lesões indisponível no momento'}
                onClick={() => {
                  setLesaoRegistrada(false)
                  setFormularioAberto(true)
                }}
              >
                Registrar lesão
              </button>
            </section>

            <section aria-labelledby="us61-planejamento">
              <h2 id="us61-planejamento">Planejamento atual</h2>

              <p>
                {valorOuIndisponivel(aluno?.planejamentoAtual)}
              </p>

              <button
                className="perfil-acompanhado__acao perfil-acompanhado__acao--principal"
                type="button"
                disabled
                title="Consulta de planejamento indisponível no momento"
              >
                Ver planejamento
              </button>
            </section>

            <p className="perfil-acompanhado__observacao">
              As informações clínicas são registradas pelo treinador.
            </p>
          </div>
        </div>

        {/* Navegação de retorno — final da página */}
        <div className="perfil-acompanhado__retorno-final">
          <button className="perfil-acompanhado__voltar" type="button" onClick={onVoltar} disabled={!onVoltar}>
            <span aria-hidden="true">←</span>
            Voltar aos alunos
          </button>
        </div>
      </main>}
    </div>
  )
}
