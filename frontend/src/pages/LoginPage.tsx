import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { CarregandoSessao } from '../components/CarregandoSessao'
import './LoginPage.css'

export function LoginPage() {
  const [parametros] = useSearchParams()
  const treinador = parametros.get('perfil') === 'treinador'
  return <FormularioLogin key={treinador ? 'treinador' : 'aluno'} treinador={treinador} />
}

function FormularioLogin({ treinador }: { treinador: boolean }) {
  const { usuario, carregando, login, avisoSessao } = useAuth()
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [camposComErro, setCamposComErro] = useState<'identificador' | 'credenciais' | null>(null)
  const campoIdentificador = useRef<HTMLInputElement>(null)
  const [enviando, setEnviando] = useState(false)
  const envioPendente = useRef(false)

  if (carregando) return <CarregandoSessao />
  if (usuario) return <Navigate to="/" replace />

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (envioPendente.current) return
    if (!identificador.trim()) {
      setErro(treinador ? 'Informe seu e-mail para entrar.' : 'Informe seu apelido para entrar.')
      setCamposComErro('identificador')
      campoIdentificador.current?.focus()
      return
    }
    setErro('')
    setCamposComErro(null)
    envioPendente.current = true
    setEnviando(true)
    try {
      if (treinador) await login(identificador.trim(), senha, 'TREINADOR')
      else await login(identificador.trim(), senha)
    } catch (falha) {
      const credenciaisInvalidas = falha instanceof ApiError && [400, 401].includes(falha.status)
      setCamposComErro(credenciaisInvalidas ? 'credenciais' : null)
      setErro(credenciaisInvalidas
        ? treinador ? 'E-mail ou senha inválidos' : 'Apelido ou senha inválidos'
        : 'Não foi possível acessar o serviço. Confira sua conexão e tente novamente.')
    } finally {
      envioPendente.current = false
      setEnviando(false)
    }
  }

  return (
    <main className="login-v2">
      <aside className="login-v2__identidade" aria-label="Identidade Space Jam">
        <picture className="login-v2__logo-desktop">
          <img src="/space-jam-logo-login-desktop.png" alt="" width="96" height="102" />
        </picture>
        <span className="login-v2__nome-marca">SPACE JAM</span>
        <div className="login-v2__respiro" aria-hidden="true" />
        <p className="login-v2__apresentacao">
          <span>Seu espaço</span>
          <span>de treino.</span>
        </p>
        <p className="login-v2__descricao">Planejamento, execução e feedback para acompanhar cada treino.</p>
        <div className="login-v2__respiro login-v2__respiro--inferior" aria-hidden="true" />
        <p className="login-v2__rodape">Basquete · Treino · Evolução</p>
      </aside>

      <section className="login-v2__painel" aria-labelledby="titulo-acesso">
        <header className="login-v2__cabecalho">
          <picture className="login-v2__logo-mobile">
            <img src="/space-jam-logo-login-mobile.png" alt="" width="38" height="40" />
          </picture>
          <span className="login-v2__nome-marca">SPACE JAM</span>
        </header>

        <form className="login-v2__formulario" onSubmit={onSubmit} aria-busy={enviando}>
          <h1 id="titulo-acesso" className="sr-only">Login</h1>
          <div className="login-v2__introducao">
            <p className="login-v2__titulo">Bem-vindo de volta</p>
            <p className="login-v2__subtitulo">{treinador ? 'Entre para acompanhar seus alunos.' : 'Entre para continuar seus treinos.'}</p>
          </div>

          <nav className="login-v2__perfis" aria-label="Tipo de acesso">
            {!treinador ? (
              <span className="login-v2__perfil login-v2__perfil--ativo" aria-current="page">Aluno</span>
            ) : (
              <Link
                className="login-v2__perfil login-v2__perfil--secundario"
                to="/login"
                aria-disabled={enviando || undefined}
                onClick={evento => { if (enviando) evento.preventDefault() }}
              >
                Aluno
              </Link>
            )}
            {treinador ? (
              <span className="login-v2__perfil login-v2__perfil--ativo" aria-current="page">Treinador</span>
            ) : (
              <Link
                className="login-v2__perfil login-v2__perfil--secundario"
                to="/login?perfil=treinador"
                aria-disabled={enviando || undefined}
                onClick={evento => { if (enviando) evento.preventDefault() }}
              >
                Treinador
              </Link>
            )}
          </nav>

          <div className="login-v2__campo">
            <label className="sr-only" htmlFor="identificador">{treinador ? 'E-mail' : 'Apelido'}</label>
            <span className="login-v2__campo-label" aria-hidden="true">{treinador ? 'E-mail *' : 'Apelido *'}</span>
            <input
              ref={campoIdentificador}
              id="identificador"
              name={treinador ? 'email' : 'username'}
              type={treinador ? 'email' : 'text'}
              placeholder={treinador ? 'seuemail@exemplo.com' : 'Seu apelido'}
              value={identificador}
              onChange={e => setIdentificador(e.target.value)}
              autoComplete={treinador ? 'email' : 'username'}
              autoCapitalize="none"
              spellCheck={false}
              required
              disabled={enviando}
              aria-invalid={camposComErro !== null || undefined}
              aria-describedby={erro ? 'dica-identificador erro-acesso' : 'dica-identificador'}
            />
            <span id="dica-identificador" className="login-v2__campo-ajuda">
              {treinador ? 'Use o e-mail do cadastro.' : 'Use o apelido criado no cadastro.'}
            </span>
          </div>

          <div className="login-v2__campo login-v2__campo--senha">
            <label className="sr-only" htmlFor="senha">Senha</label>
            <span className="login-v2__campo-label" aria-hidden="true">Senha *</span>
            <div className="login-v2__senha-controle">
              <input
                id="senha"
                name="password"
                placeholder="Sua senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={e => setSenha(e.target.value)}
                autoComplete="current-password"
                required
                disabled={enviando}
                aria-invalid={camposComErro === 'credenciais' || undefined}
                aria-describedby={erro ? 'erro-acesso' : undefined}
              />
              {senha && (
                <button
                  type="button"
                  className="login-v2__mostrar-senha"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  aria-pressed={mostrarSenha}
                  disabled={enviando}
                >
                  {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                </button>
              )}
            </div>
          </div>

          {erro && <p className="login-v2__erro" id="erro-acesso" role="alert">{erro}</p>}
          {avisoSessao && <p className="login-v2__aviso" role="status">{avisoSessao}</p>}

          <button className="login-v2__acao login-v2__acao--primaria" type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="login-v2__primeiro-acesso">Primeiro acesso?</p>
          <Link
            className="login-v2__acao login-v2__acao--secundaria"
            to={treinador ? '/cadastro/treinador' : '/cadastro/aluno'}
            aria-disabled={enviando || undefined}
            onClick={evento => { if (enviando) evento.preventDefault() }}
          >
            Criar conta
          </Link>
          <Link
            className="login-v2__acao login-v2__acao--secundaria"
            to={treinador ? '/recuperar-senha?perfil=treinador' : '/recuperar-senha'}
            aria-disabled={enviando || undefined}
            onClick={evento => { if (enviando) evento.preventDefault() }}
          >
            Esqueci minha senha
          </Link>
          {enviando && <span className="sr-only" role="status">Acessando sua conta. Aguarde.</span>}
        </form>
      </section>
    </main>
  )
}
