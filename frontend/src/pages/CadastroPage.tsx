import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, NavLink } from 'react-router'
import { api, ApiError } from '../api/client'
import { AceiteTermos, documentosTermos } from '../components/AceiteTermos'
import { CarregandoSessao } from '../components/CarregandoSessao'
import { useAuth } from '../auth/useAuth'
import { gruposCadastro, validarCadastro, dadosParaApi, camposDaApi, type CampoCadastro, type DadosCadastro, type ErrosCadastro } from '../features/acesso/cadastro'
import type { Papel, Usuario } from '../types/usuario'

export function CadastroPage({ perfil }: { perfil: Papel }) {
  const { usuario, carregando } = useAuth()
  const [dados, setDados] = useState<DadosCadastro>({})
  const [erros, setErros] = useState<ErrosCadastro>({})
  const [erroGeral, setErroGeral] = useState('')
  const [erroTermos, setErroTermos] = useState('')
  const [aceito, setAceito] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [cadastrado, setCadastrado] = useState<Usuario | null>(null)
  const envioPendente = useRef(false)
  const focoAposEnvio = useRef<CampoCadastro | null>(null)
  useEffect(() => {
    if (!enviando && focoAposEnvio.current) {
      document.getElementById(`cadastro-${focoAposEnvio.current}`)?.focus()
      focoAposEnvio.current = null
    }
  }, [enviando])
  const [conferido, setConferido] = useState(false)
  const grupos = gruposCadastro(perfil)

  if (carregando) return <CarregandoSessao />
  if (usuario) return <Navigate to="/" replace />

  function alterar(campo: CampoCadastro, valor: string) {
    const proximos = { ...dados, [campo]: valor }
    setDados(proximos)
    setErroGeral('')
    if (erros[campo]) {
      const proximosErros = validarCadastro(perfil, proximos)
      setErros(anteriores => ({ ...anteriores, [campo]: proximosErros[campo] }))
    }
  }

  function conferir(campo: CampoCadastro) {
    const novosErros = validarCadastro(perfil, dados)
    setErros(anteriores => ({ ...anteriores, [campo]: novosErros[campo] }))
  }

  async function enviar(evento: FormEvent) {
    evento.preventDefault()
    if (envioPendente.current) return
    setErroGeral(''); setErroTermos('')
    const encontrados = validarCadastro(perfil, dados)
    setErros(encontrados)
    setConferido(true)
    const primeiro = grupos.flatMap(grupo => grupo.campos).find(campo => encontrados[campo.nome])
    if (primeiro) {
      setErroGeral('')
      document.getElementById(`cadastro-${primeiro.nome}`)?.focus()
      return
    }
    if (!aceito || !documentosTermos()) {
      setErroTermos('Consulte e aceite os documentos antes de continuar.')
      document.getElementById('aceite-termos')?.focus()
      return
    }
    if (perfil === 'ALUNO') {
      const [ano, mes, dia] = dados.dataNascimento!.split('-').map(Number)
      const hoje = new Date()
      const idade = hoje.getFullYear() - ano - (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia) ? 1 : 0)
      if (idade < 18) {
        setErroGeral('O cadastro de menores depende da confirmação do responsável. Entre em contato com o treinador. Nenhum dado foi enviado.')
        return
      }
    }
    envioPendente.current = true; setEnviando(true)
    try {
      const conta = await api<Usuario>(perfil === 'TREINADOR' ? '/auth/cadastro/treinador/' : '/auth/cadastro/aluno/', {
        method: 'POST', body: JSON.stringify(dadosParaApi(perfil, dados, aceito)),
      }, false)
      setDados({}); setErros({}); setCadastrado(conta)
    } catch (falha) {
      const campos: ErrosCadastro = {}
      if (falha instanceof ApiError && falha.status === 400) {
        for (const [nome, mensagens] of Object.entries(falha.campos)) {
          const campo = camposDaApi[nome]
          if (campo) campos[campo] = mensagens.join(' ')
        }
        setErros(campos)
        const primeiro = grupos.flatMap(grupo => grupo.campos).find(campo => campos[campo.nome])
        if (primeiro) focoAposEnvio.current = primeiro.nome
        else setErroGeral(Object.values(falha.campos).flat().join(' ') || 'Não foi possível concluir o cadastro. Confira os dados.')
      } else {
        setErroGeral('Não foi possível acessar o serviço. Confira sua conexão e tente novamente.')
      }
    } finally {
      envioPendente.current = false; setEnviando(false)
    }
  }

  if (cadastrado) return <main className="acesso"><section className="cartao-login">
    <h1>Sua conta foi criada</h1>
    <p className="texto-apoio" role="status">Entre com suas credenciais para continuar.</p>
    {perfil === 'TREINADOR' && cadastrado.codigo_convite && <div className="cartao-conta">
      <h2>Código para seus alunos</h2><p className="texto-apoio">{cadastrado.codigo_convite}</p>
    </div>}
    <Link className="botao-criar-conta voltar-login" aria-disabled={enviando || undefined} onClick={evento => { if (enviando) evento.preventDefault() }} to={perfil === 'TREINADOR' ? '/login?perfil=treinador' : '/login'}>Voltar ao login</Link>
  </section></main>

  return (
    <main className="acesso">
      <section className="cartao-login cartao-cadastro" aria-labelledby="titulo-cadastro">
        <header className="cabecalho-login">
          <h1 id="titulo-cadastro">Cadastro</h1>
          <img src="/space-jam-logo.png" alt="Space Jam" width="80" height="80" />
        </header>
        <nav className="perfis-cadastro" aria-label="Tipo de cadastro">
          <NavLink to="/cadastro/aluno" aria-disabled={enviando || undefined} onClick={evento => { if (enviando) evento.preventDefault() }}>Aluno</NavLink>
          <NavLink to="/cadastro/treinador" aria-disabled={enviando || undefined} onClick={evento => { if (enviando) evento.preventDefault() }}>Treinador</NavLink>
        </nav>
        <form className="formulario-cadastro" onSubmit={enviar} noValidate aria-busy={enviando}>
          {grupos.map(grupo => (
            <fieldset key={grupo.titulo} disabled={enviando}>
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
          <AceiteTermos aceito={aceito} alterar={valor => { setAceito(valor); setErroTermos('') }} desabilitado={enviando} erro={erroTermos} />
          {erroGeral && <p className="erro" role="alert">{erroGeral}</p>}
          <button className="botao-entrar" type="submit" disabled={enviando}>{enviando ? 'Cadastrando…' : 'Cadastre-se'}</button>
          <Link className="botao-criar-conta voltar-login" aria-disabled={enviando || undefined} onClick={evento => { if (enviando) evento.preventDefault() }} to={perfil === 'TREINADOR' ? '/login?perfil=treinador' : '/login'}>Voltar ao login</Link>
        </form>
      </section>
    </main>
  )
}
