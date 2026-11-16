import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router'
import { ApiError } from '../api/client'
import { useAuth } from '../auth/useAuth'
import { CarregandoSessao } from '../components/CarregandoSessao'

export function LoginPage() {
  const [parametros] = useSearchParams()
  const treinador = parametros.get('perfil') === 'treinador'
  return <FormularioLogin key={treinador ? 'treinador' : 'aluno'} treinador={treinador} />
}

function FormularioLogin({ treinador }: { treinador: boolean }) {
  const { usuario, carregando, login } = useAuth()
  const [identificador, setIdentificador] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [avisoTreinador, setAvisoTreinador] = useState(false)
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
    if (treinador) {
      setAvisoTreinador(true)
      return
    }
    envioPendente.current = true
    setEnviando(true)
    try {
      await login(identificador.trim(), senha)
    } catch (falha) {
      const credenciaisInvalidas = falha instanceof ApiError && [400, 401].includes(falha.status)
      setCamposComErro(credenciaisInvalidas ? 'credenciais' : null)
      setErro(credenciaisInvalidas
        ? 'Apelido ou senha inválidos'
        : 'Não foi possível acessar o serviço. Confira sua conexão e tente novamente.')
    } finally {
      envioPendente.current = false
      setEnviando(false)
    }
  }

  return (
    <main className="acesso">
      <section className="cartao-login" aria-labelledby="titulo-acesso">
        <header className="cabecalho-login">
          <h1 id="titulo-acesso">Login</h1>
          <img src="/space-jam-logo.png" alt="Space Jam" width="80" height="80" />
        </header>
        <nav className="perfis-cadastro" aria-label="Tipo de acesso">
          <Link to="/login" aria-current={!treinador ? 'page' : undefined}
            aria-disabled={enviando || undefined}
            onClick={evento => { if (enviando) evento.preventDefault() }}>Aluno</Link>
          <Link to="/login?perfil=treinador" aria-current={treinador ? 'page' : undefined}
            aria-disabled={enviando || undefined}
            onClick={evento => { if (enviando) evento.preventDefault() }}>Treinador</Link>
        </nav>
        <form className="formulario-login" onSubmit={onSubmit} aria-busy={enviando}>
          <div className="campos-login">
            <div>
              <label className="sr-only" htmlFor="identificador">{treinador ? 'E-mail' : 'Apelido'}</label>
              <input
                ref={campoIdentificador}
                id="identificador"
                name={treinador ? 'email' : 'username'}
                type={treinador ? 'email' : 'text'}
                placeholder={treinador ? 'E-mail:' : 'Apelido:'}
                value={identificador}
                onChange={e => setIdentificador(e.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={enviando}
                aria-invalid={camposComErro !== null || undefined}
                aria-describedby={erro ? 'dica-identificador erro-acesso' : 'dica-identificador'}
              />
              <span id="dica-identificador" className="sr-only">{treinador ? 'Use o e-mail cadastrado na sua conta.' : 'Use o apelido cadastrado na sua conta.'}</span>
            </div>
            <div className="campo-senha">
              <label className="sr-only" htmlFor="senha">Senha</label>
              <input
                id="senha"
                name="password"
                placeholder="Senha:"
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
                  className="mostrar-senha"
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
          {erro && <p className="erro" id="erro-acesso" role="alert">{erro}</p>}
          {avisoTreinador && <p className="aviso-cadastro" role="status">O acesso do treinador está temporariamente indisponível. Tente novamente mais tarde.</p>}
          <button className="botao-entrar" type="submit" disabled={enviando}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
          <Link
            className="botao-criar-conta"
            to={treinador ? '/cadastro/treinador' : '/cadastro/aluno'}
            aria-disabled={enviando || undefined}
            onClick={evento => { if (enviando) evento.preventDefault() }}
          >
            Criar conta
          </Link>
          {enviando && <span className="sr-only" role="status">Acessando sua conta. Aguarde.</span>}
        </form>
      </section>
    </main>
  )
}
