import { useState, type FormEvent } from 'react'
import { Link, Navigate, NavLink } from 'react-router'
import { CarregandoSessao } from '../components/CarregandoSessao'
import { useAuth } from '../auth/useAuth'
import { gruposCadastro, validarCadastro, type CampoCadastro, type DadosCadastro, type ErrosCadastro } from '../features/acesso/cadastro'
import type { Papel } from '../types/usuario'

export function CadastroPage({ perfil }: { perfil: Papel }) {
  const { usuario, carregando } = useAuth()
  const [dados, setDados] = useState<DadosCadastro>({})
  const [erros, setErros] = useState<ErrosCadastro>({})
  const [aviso, setAviso] = useState(false)
  const [conferido, setConferido] = useState(false)
  const grupos = gruposCadastro(perfil)

  if (carregando) return <CarregandoSessao />
  if (usuario) return <Navigate to="/" replace />

  function alterar(campo: CampoCadastro, valor: string) {
    const proximos = { ...dados, [campo]: valor }
    setDados(proximos)
    setAviso(false)
    if (erros[campo]) {
      const proximosErros = validarCadastro(perfil, proximos)
      setErros(anteriores => ({ ...anteriores, [campo]: proximosErros[campo] }))
    }
  }

  function conferir(campo: CampoCadastro) {
    const novosErros = validarCadastro(perfil, dados)
    setErros(anteriores => ({ ...anteriores, [campo]: novosErros[campo] }))
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const encontrados = validarCadastro(perfil, dados)
    setErros(encontrados)
    setConferido(true)
    const primeiro = grupos.flatMap(grupo => grupo.campos).find(campo => encontrados[campo.nome])
    if (primeiro) {
      setAviso(false)
      document.getElementById(`cadastro-${primeiro.nome}`)?.focus()
      return
    }
    setAviso(true)
  }

  return (
    <main className="acesso">
      <section className="cartao-login cartao-cadastro" aria-labelledby="titulo-cadastro">
        <header className="cabecalho-login">
          <h1 id="titulo-cadastro">Cadastro</h1>
          <img src="/space-jam-logo.png" alt="Space Jam" width="80" height="80" />
        </header>
        <nav className="perfis-cadastro" aria-label="Tipo de cadastro">
          <NavLink to="/cadastro/aluno">Aluno</NavLink>
          <NavLink to="/cadastro/treinador">Treinador</NavLink>
        </nav>
        <form className="formulario-cadastro" onSubmit={enviar} noValidate>
          {grupos.map(grupo => (
            <fieldset key={grupo.titulo}>
              <legend>{grupo.titulo}</legend>
              <div className="campos-login">
                {grupo.campos.map(campo => {
                  const id = `cadastro-${campo.nome}`
                  const propriedades = {
                    id, name: campo.nome, value: dados[campo.nome] ?? '', required: true,
                    'aria-invalid': erros[campo.nome] ? true : undefined,
                    'aria-describedby': erros[campo.nome] ? `${id}-erro` : undefined,
                    onChange: (evento: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => alterar(campo.nome, evento.target.value),
                    onBlur: () => conferir(campo.nome),
                  }
                  return (
                    <div className="campo-cadastro" key={campo.nome}>
                      <label htmlFor={id}>{campo.rotulo}</label>
                      {campo.textoLongo
                        ? <textarea {...propriedades} rows={4} />
                        : <input {...propriedades} type={campo.tipo ?? 'text'}
                            inputMode={campo.decimal ? 'decimal' : campo.inteiro ? 'numeric' : undefined}
                            autoComplete={campo.autocomplete ?? 'off'}
                            autoCapitalize={['apelido', 'email', 'codigoTreinador', 'codigoAtivacao', 'senha'].includes(campo.nome) ? 'none' : undefined}
                            spellCheck={campo.nome === 'senha' || campo.nome === 'apelido' ? false : undefined} />}
                      {erros[campo.nome] && <p className="erro-campo" id={`${id}-erro`}>{erros[campo.nome]}</p>}
                    </div>
                  )
                })}
              </div>
            </fieldset>
          ))}
          {conferido && Object.values(erros).some(Boolean) && <p className="erro" role="alert">Confira os campos indicados antes de continuar.</p>}
          {aviso && <p className="aviso-cadastro" role="status">Cadastro indisponível no momento. Seus dados não foram enviados.</p>}
          <button className="botao-entrar" type="submit">Cadastre-se</button>
          <Link className="botao-criar-conta voltar-login" to={perfil === 'TREINADOR' ? '/login?perfil=treinador' : '/login'}>Voltar ao login</Link>
        </form>
      </section>
    </main>
  )
}
