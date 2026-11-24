import { useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { AtualizarTermos } from '../components/AtualizarTermos'
import { Marca } from '../components/Marca'
import { MinhaContaAluno } from '../features/alunos/MinhaContaAluno'

export function InicioPage() {
  const { usuario, logout } = useAuth()
  const navegar = useNavigate()

  if (!usuario) return null
  if (usuario.termos_pendentes) return <AtualizarTermos />

  // US53 — Consultar os próprios dados cadastrais; US07 — navegar para edição.
  if (usuario.papel === 'ALUNO') {
    return <MinhaContaAluno usuario={usuario} logout={logout} editarDados={() => navegar('/aluno/conta/editar')} trocarSenha={() => navegar('/conta/senha')} />
  }

  const nome =
    [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') ||
    usuario.apelido

  return (
    <div className="conta">
      <header className="cabecalho-conta">
        <Marca />
        <button className="botao-secundario" onClick={logout}>
          Sair da conta
        </button>
      </header>

      <main className="conteudo-conta">
        <p className="sobretitulo">MINHA CONTA</p>

        <h1>Olá, {usuario.first_name || usuario.apelido}.</h1>

        <p className="texto-apoio">Você entrou no Space Jam.</p>
        <button type="button" className="botao-secundario" onClick={() => navegar('/treinador/alunos')}>
          Consultar meus alunos
        </button>

        <section className="cartao-conta" aria-labelledby="titulo-conta">
          <div className="titulo-cartao">
            <h2 id="titulo-conta">Dados da conta</h2>
            <span className="selo-perfil">
              {usuario.papel === 'TREINADOR' ? 'Treinador' : 'Aluno'}
            </span>
          </div>

          <dl>
            <div><dt>Nome</dt><dd>{nome}</dd></div>
            <div><dt>Apelido</dt><dd>{usuario.apelido}</dd></div>
            {usuario.email && <div><dt>E-mail</dt><dd>{usuario.email}</dd></div>}
            {usuario.telefone && <div><dt>Telefone</dt><dd>{usuario.telefone}</dd></div>}
          </dl>
        </section>
      </main>
    </div>
  )
}
