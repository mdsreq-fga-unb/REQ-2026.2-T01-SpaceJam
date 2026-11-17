import { useAuth } from '../auth/useAuth'
import { AtualizarTermos } from '../components/AtualizarTermos'
import { Marca } from '../components/Marca'

export function InicioPage() {
  const { usuario, logout } = useAuth()
  if (!usuario) return null
  if (usuario.termos_pendentes) return <AtualizarTermos />
  const nome = [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido

  return (
    <div className="conta">
      <header className="cabecalho-conta"><Marca /><button className="botao-secundario" onClick={logout}>Sair da conta</button></header>
      <main className="conteudo-conta">
        <p className="sobretitulo">MINHA CONTA</p>
        <h1>Olá, {usuario.first_name || usuario.apelido}.</h1>
        <p className="texto-apoio">Você entrou no Space Jam.</p>
        <section className="cartao-conta" aria-labelledby="titulo-conta">
          <div className="titulo-cartao"><h2 id="titulo-conta">Dados da conta</h2><span className="selo-perfil">{usuario.papel === 'TREINADOR' ? 'Treinador' : 'Aluno'}</span></div>
          <dl><div><dt>Nome</dt><dd>{nome}</dd></div><div><dt>Apelido</dt><dd>{usuario.apelido}</dd></div>{usuario.email && <div><dt>E-mail</dt><dd>{usuario.email}</dd></div>}{usuario.telefone && <div><dt>Telefone</dt><dd>{usuario.telefone}</dd></div>}</dl>
        </section>
      </main>
    </div>
  )
}
