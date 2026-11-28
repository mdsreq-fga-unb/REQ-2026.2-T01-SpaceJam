import type { Usuario } from '../../types/usuario'
import { LayoutAluno } from './LayoutAluno'

type MinhaContaAlunoProps = {
  usuario: Usuario
  logout: () => void
  editarDados?: () => void
  trocarSenha?: () => void
  preferenciasPrivacidade?: () => void
  treinadorVinculado?: { id: number; nome: string; codigo_convite?: string } | null
  historicoLesoes?: unknown[] | null
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

function descreverLesao(item: unknown): string {
  if (typeof item === 'string') return item
  if (item && typeof item === 'object' && 'descricao' in item && typeof item.descricao === 'string') {
    return item.descricao
  }
  return 'Lesão registrada'
}

export function MinhaContaAluno({ usuario, logout, editarDados, trocarSenha, preferenciasPrivacidade, treinadorVinculado, historicoLesoes }: MinhaContaAlunoProps) {
  const nome =
    [usuario.first_name, usuario.last_name]
      .filter(Boolean)
      .join(' ') || usuario.apelido

  const perfil = usuario.perfil_aluno

  const frequencia =
    perfil?.frequencia_semanal != null
      ? `${perfil.frequencia_semanal} ${
          perfil.frequencia_semanal === 1 ? 'dia' : 'dias'
        } por semana`
      : 'Não informado'

  return (
    <LayoutAluno usuario={usuario} secao="Conta">
        <div className="conta-aluno__titulo">
          <h1>Minha conta</h1>
          <p>{nome}</p>
        </div>

        <div className="conta-aluno__grade">
          <section className="conta-aluno__cartao conta-aluno__cartao--dados" aria-labelledby="dados-pessoais">
            <h2 id="dados-pessoais">Dados pessoais</h2>
            <dl>
              <div><dt>Apelido:</dt><dd>{usuario.apelido || 'Não informado'}</dd></div>
              <div><dt>E-mail:</dt><dd>{usuario.email || 'Não informado'}</dd></div>
              <div><dt>Nascimento:</dt><dd>{formatarNascimento(usuario.data_nascimento)}</dd></div>
              {treinadorVinculado && <div><dt>Treinador vinculado:</dt><dd>{treinadorVinculado.nome}</dd></div>}
            </dl>
          </section>

          <section className="conta-aluno__cartao conta-aluno__cartao--medidas" aria-labelledby="medidas-atividade">
            <h2 id="medidas-atividade">Medidas e atividade</h2>
            <dl>
              <div><dt>Altura:</dt><dd>{formatarMedida(perfil?.altura, 'cm')}</dd></div>
              <div><dt>Peso:</dt><dd>{formatarMedida(perfil?.peso, 'kg')}</dd></div>
              <div><dt>Envergadura:</dt><dd>{formatarMedida(perfil?.envergadura, 'cm')}</dd></div>
              <div><dt>Atividade:</dt><dd>{frequencia}</dd></div>
            </dl>
          </section>

          <section className="conta-aluno__cartao conta-aluno__cartao--objetivos" aria-labelledby="objetivos">
            <h2 id="objetivos">Objetivos</h2>
                        <p className="conta-aluno__indisponivel">{perfil?.objetivos?.trim() || 'Nenhum objetivo registrado'}</p>
          </section>

          <section className="conta-aluno__cartao conta-aluno__cartao--lesoes" aria-labelledby="historico-lesoes">
            <h2 id="historico-lesoes">Histórico de lesões</h2>
            {historicoLesoes == null ? (
              <p className="conta-aluno__indisponivel">Histórico ainda não disponível para consulta.</p>
            ) : historicoLesoes.length === 0 ? (
              <p className="conta-aluno__indisponivel">Nenhuma lesão registrada.</p>
            ) : (
              <ul>{historicoLesoes.map((lesao, indice) => <li key={indice}>{descreverLesao(lesao)}</li>)}</ul>
            )}
          </section>
        </div>

        <div className="conta-aluno__acoes" aria-label="Ações da conta">
          <button className="conta-aluno__editar" type="button" disabled={!editarDados} onClick={editarDados}>
            Editar meus dados
          </button>
          <button type="button" disabled={!trocarSenha} onClick={trocarSenha}>Trocar senha</button>
          <button type="button" disabled={!preferenciasPrivacidade} onClick={preferenciasPrivacidade}>Preferências de privacidade</button>
          <button type="button" disabled>Solicitar exclusão dos dados</button>
          <button className="conta-aluno__sair" type="button" onClick={logout}>Sair da conta</button>
        </div>
    </LayoutAluno>
  )
}
