
import type { Usuario } from '../../types/usuario'
import './MinhaContaAluno.css'

type MinhaContaAlunoProps = {
  usuario: Usuario
  logout: () => void
}

type Medida = string | number | null | undefined

function formatarMedida(valor: Medida, unidade: 'cm' | 'kg') {
  if (valor === null || valor === undefined || valor === '') {
    return 'Não informado'
  }

  const numero = Number(valor)

  if (!Number.isFinite(numero)) {
    return 'Não informado'
  }

  const resultado = unidade === 'cm' ? numero * 100 : numero

  return `${new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 2,
  }).format(resultado)} ${unidade}`
}

function formatarNascimento(data?: string | null) {
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return 'Não informado'
  }

  const [ano, mes, dia] = data.split('-')
  const dataValida = new Date(`${data}T00:00:00Z`)

  if (
    Number.isNaN(dataValida.getTime()) ||
    dataValida.toISOString().slice(0, 10) !== data
  ) {
    return 'Não informado'
  }

  return `${dia}/${mes}/${ano}`
}

export function MinhaContaAluno({
  usuario,
  logout,
}: MinhaContaAlunoProps) {
  const nome =
    [usuario.first_name, usuario.last_name]
      .filter(Boolean)
      .join(' ') || usuario.apelido

  const nomeCurto = usuario.first_name || usuario.apelido
  const perfil = usuario.perfil_aluno

  const frequencia =
    perfil?.frequencia_semanal != null
      ? `${perfil.frequencia_semanal} ${
          perfil.frequencia_semanal === 1 ? 'dia' : 'dias'
        } por semana`
      : 'Não informado'

  return (
    <div className="conta-aluno">
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
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

          <span className="conta-aluno__nome-marca">
            SPACE JAM
          </span>
        </div>

        <nav
          className="conta-aluno__navegacao"
          aria-label="Seções do sistema"
        >
          <span>Treinos</span>
          <span>Histórico</span>
          <span>Feedbacks</span>
          <span aria-current="page">Conta</span>
        </nav>

        <div className="conta-aluno__usuario">
          <span className="conta-aluno__nome-curto">
            {nomeCurto}
          </span>

          <div className="conta-aluno__perfil-desktop">
            <strong>{nome}</strong>
            <span>Aluno</span>
          </div>
        </div>
      </header>

      <main className="conta-aluno__conteudo">
        <div className="conta-aluno__titulo">
          <h1>Minha conta</h1>
          <p>{nome}</p>
        </div>

        <div className="conta-aluno__grade">
          <section
            className="conta-aluno__cartao conta-aluno__cartao--dados"
            aria-labelledby="dados-pessoais"
          >
            <h2 id="dados-pessoais">Dados pessoais</h2>

            <dl>
              <div>
                <dt>Apelido:</dt>
                <dd>{usuario.apelido || 'Não informado'}</dd>
              </div>

              <div>
                <dt>E-mail:</dt>
                <dd>{usuario.email || 'Não informado'}</dd>
              </div>

              <div>
                <dt>Nascimento:</dt>
                <dd>
                  {formatarNascimento(usuario.data_nascimento)}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="conta-aluno__cartao conta-aluno__cartao--medidas"
            aria-labelledby="medidas-atividade"
          >
            <h2 id="medidas-atividade">
              Medidas e atividade
            </h2>

            <dl>
              <div>
                <dt>Altura:</dt>
                <dd>{formatarMedida(perfil?.altura, 'cm')}</dd>
              </div>

              <div>
                <dt>Peso:</dt>
                <dd>{formatarMedida(perfil?.peso, 'kg')}</dd>
              </div>

              <div>
                <dt>Envergadura:</dt>
                <dd>
                  {formatarMedida(perfil?.envergadura, 'cm')}
                </dd>
              </div>

              <div>
                <dt>Atividade:</dt>
                <dd>{frequencia}</dd>
              </div>
            </dl>
          </section>

          <section
            className="conta-aluno__cartao conta-aluno__cartao--objetivos"
            aria-labelledby="objetivos"
          >
            <h2 id="objetivos">Objetivos</h2>

            <p className="conta-aluno__indisponivel">
              {perfil?.objetivos?.trim() || 'Não informado'}
            </p>
          </section>

          <section
            className="conta-aluno__cartao conta-aluno__cartao--lesoes"
            aria-labelledby="historico-lesoes"
          >
            <h2 id="historico-lesoes">
              Histórico de lesões
            </h2>

            <p className="conta-aluno__indisponivel">
              Histórico ainda não disponível para consulta.
            </p>
          </section>
        </div>

        <div
          className="conta-aluno__acoes"
          aria-label="Ações da conta"
        >
          <button type="button" disabled>
            Editar meus dados
          </button>

          <button type="button" disabled>
            Trocar senha
          </button>

          <button type="button" disabled>
            Preferências de privacidade
          </button>

          <button type="button" disabled>
            Solicitar exclusão dos dados
          </button>

          <button
            className="conta-aluno__sair"
            type="button"
            onClick={logout}
          >
            Sair da conta
          </button>
        </div>
      </main>
    </div>
  )
}
