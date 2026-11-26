import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { Link, Navigate, NavLink } from 'react-router'
import './CadastroPage.css'
import { api, ApiError } from '../api/client'
import { AceiteTermos } from '../components/AceiteTermos'
import { CarregandoSessao } from '../components/CarregandoSessao'
import { useAuth } from '../auth/useAuth'
import { useTermosVigentes } from '../features/termos/useTermosVigentes'
import {
  gruposCadastro,
  validarCadastro,
  dadosParaApi,
  camposDaApi,
  type CampoCadastro,
  type CampoFormulario,
  type DadosCadastro,
  type ErrosCadastro,
} from '../features/acesso/cadastro'
import type { Papel, Usuario } from '../types/usuario'

type EtapaAluno = 1 | 2 | 3

const CAMPOS_ALUNO: Record<EtapaAluno, CampoCadastro[]> = {
  1: ['codigoTreinador', 'apelido', 'email', 'senha'],
  2: ['nome', 'sobrenome', 'dataNascimento'],
  3: ['altura', 'peso', 'envergadura', 'frequencia', 'objetivos'],
}

const TITULOS_ETAPA: Record<EtapaAluno, { titulo: string; legenda: string }> = {
  1: { titulo: 'Sua conta', legenda: 'Etapa 1 de 3 · Acesso e vínculo' },
  2: { titulo: 'Sobre você', legenda: 'Etapa 2 de 3 · Dados pessoais' },
  3: { titulo: 'Seu treino começa aqui', legenda: 'Etapa 3 de 3 · Medidas e objetivos' },
}

const AJUDAS: Partial<Record<CampoCadastro, string>> = {
  codigoTreinador: 'Obrigatório para vincular sua conta.',
  apelido: 'Seu identificador de acesso.',
  email: 'Use um e-mail ao qual você tenha acesso.',
  senha: 'Defina uma senha para acessar a sua conta.',
  frequencia: 'Atividade física por semana, de 1 a 7 dias.',
}

// Diferenças de conteúdo do fluxo de ativação do treinador no Figma V2.
const AJUDAS_TREINADOR: Partial<Record<CampoCadastro, string>> = {
  codigoAtivacao: 'Disponível na configuração inicial do sistema.',
  email: 'Será usado para entrar.',
  senha: 'Pelo menos 6 caracteres.',
}

const PLACEHOLDERS_TREINADOR: Partial<Record<CampoCadastro, string>> = {
  codigoAtivacao: 'Código de ativação',
  apelido: 'Seu apelido',
  telefone: '(00) 00000-0000',
  senha: 'Crie uma senha',
}

const PLACEHOLDERS: Partial<Record<CampoCadastro, string>> = {
  codigoTreinador: 'Código recebido do treinador',
  apelido: 'Como você quer entrar',
  email: 'seuemail@exemplo.com',
  nome: 'Seu nome',
  sobrenome: 'Seu sobrenome',
  altura: 'Ex.: 172',
  peso: 'Ex.: 68',
  envergadura: 'Ex.: 175',
  frequencia: '1 a 7',
  objetivos: 'Conte o que deseja melhorar.',
}

function etapaDeCampo(campo: CampoCadastro): EtapaAluno {
  if (CAMPOS_ALUNO[1].includes(campo)) return 1
  if (CAMPOS_ALUNO[2].includes(campo)) return 2
  return 3
}

export function CadastroPage({ perfil }: { perfil: Papel }) {
  const { usuario, carregando } = useAuth()
  const termosVigentes = useTermosVigentes()
  const [dados, setDados] = useState<DadosCadastro>({})
  const [erros, setErros] = useState<ErrosCadastro>({})
  const [erroGeral, setErroGeral] = useState('')
  const [erroTermos, setErroTermos] = useState('')
  const [aceito, setAceito] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [cadastrado, setCadastrado] = useState<Usuario | null>(null)
  const [etapa, setEtapa] = useState<EtapaAluno>(1)
  const [conferido, setConferido] = useState(false)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 900)
  const envioPendente = useRef(false)
  const focoAposEnvio = useRef<CampoCadastro | null>(null)
  const perfilAnterior = useRef(perfil)

  useEffect(() => {
    function atualizarLargura() { setMobile(window.innerWidth < 900) }
    window.addEventListener('resize', atualizarLargura)
    return () => window.removeEventListener('resize', atualizarLargura)
  }, [])

  useEffect(() => {
    if (perfilAnterior.current !== perfil) {
      perfilAnterior.current = perfil
      setDados({}); setErros({}); setErroGeral(''); setErroTermos('')
      setAceito(false); setEtapa(1); setConferido(false); setCadastrado(null)
    }
  }, [perfil])

  useEffect(() => {
    if (!enviando && focoAposEnvio.current) {
      const campo = focoAposEnvio.current
      const elemento = document.getElementById(`cadastro-${campo}`)
      if (elemento) {
        elemento.focus()
        focoAposEnvio.current = null
      }
    }
  }, [enviando, etapa, erros])

  const aluno = perfil === 'ALUNO'
  const grupos = gruposCadastro(perfil)
  const todosCampos = grupos.flatMap(grupo => grupo.campos)
  const camposAluno = (numero: EtapaAluno) => CAMPOS_ALUNO[numero]
    .map(nome => todosCampos.find(campo => campo.nome === nome))
    .filter((campo): campo is CampoFormulario => Boolean(campo))

  if (carregando) return <CarregandoSessao />
  if (usuario) return <Navigate to="/" replace />

  function alterar(campo: CampoCadastro, valor: string) {
    const proximos = { ...dados, [campo]: valor }
    setDados(proximos)
    setErroGeral('')
    if (erros[campo]) {
      const novos = validarCadastro(perfil, proximos)
      setErros(anteriores => ({ ...anteriores, [campo]: novos[campo] }))
    }
  }

  function conferir(campo: CampoCadastro) {
    const novos = validarCadastro(perfil, dados)
    setErros(anteriores => ({ ...anteriores, [campo]: novos[campo] }))
  }

  function mostrarPrimeiroErro(campo: CampoCadastro) {
    if (aluno && mobile) setEtapa(etapaDeCampo(campo))
    focoAposEnvio.current = campo
  }

  function avancarEtapa() {
    if (!aluno || etapa === 3 || enviando) return
    const encontrados = validarCadastro(perfil, dados)
    const nomes = CAMPOS_ALUNO[etapa]
    const primeiro = nomes.find(nome => encontrados[nome])
    setErros(anteriores => {
      const atualizados = { ...anteriores }
      for (const nome of nomes) atualizados[nome] = encontrados[nome]
      return atualizados
    })
    if (primeiro) {
      setConferido(true)
      mostrarPrimeiroErro(primeiro)
      document.getElementById(`cadastro-${primeiro}`)?.focus()
      return
    }
    setConferido(false)
    setEtapa((etapa + 1) as EtapaAluno)
    window.scrollTo?.(0, 0)
  }

  function voltarEtapa() {
    if (etapa <= 1 || enviando) return
    setConferido(false)
    setEtapa((etapa - 1) as EtapaAluno)
    window.scrollTo?.(0, 0)
  }

  async function enviarCadastro(evento: FormEvent) {
    evento.preventDefault()
    if (envioPendente.current || enviando) return
    setErroGeral(''); setErroTermos('')
    const encontrados = validarCadastro(perfil, dados)
    setErros(encontrados)
    setConferido(true)
    const primeiro = todosCampos.find(campo => encontrados[campo.nome])
    if (primeiro) {
      mostrarPrimeiroErro(primeiro.nome)
      // No desktop, the field is already mounted and visible.
      if (!mobile || !aluno || etapaDeCampo(primeiro.nome) === etapa) {
        document.getElementById(`cadastro-${primeiro.nome}`)?.focus()
      }
      return
    }
    if (!aceito || !termosVigentes.documentos) {
      setErroTermos('Consulte e aceite os documentos antes de continuar.')
      if (aluno && mobile) setEtapa(3)
      document.getElementById('aceite-termos')?.focus()
      return
    }
    if (aluno) {
      const [ano, mes, dia] = dados.dataNascimento!.split('-').map(Number)
      const hoje = new Date()
      const idade = hoje.getFullYear() - ano -
        (hoje.getMonth() + 1 < mes || (hoje.getMonth() + 1 === mes && hoje.getDate() < dia) ? 1 : 0)
      if (idade < 18) {
        setErroGeral('O cadastro de menores depende da confirmação do responsável. Entre em contato com o treinador. Nenhum dado foi enviado.')
        return
      }
    }
    envioPendente.current = true
    setEnviando(true)
    try {
      const conta = await api<Usuario>(aluno ? '/auth/cadastro/aluno/' : '/auth/cadastro/treinador/', {
        method: 'POST',
        body: JSON.stringify(dadosParaApi(perfil, dados, aceito)),
      }, false)
      setDados({}); setErros({}); setCadastrado(conta)
    } catch (falha) {
      const campos: ErrosCadastro = {}
      const codigo = falha instanceof ApiError ? falha.codigo : undefined
      if (codigo === 'ACEITE_OBRIGATORIO' || codigo === 'TERMOS_INDISPONIVEIS') {
        // US63 (CA01): nenhum dado é aceito sem o aceite dos documentos vigentes.
        setAceito(false)
        if (codigo === 'TERMOS_INDISPONIVEIS') termosVigentes.recarregar()
        setErroTermos(codigo === 'TERMOS_INDISPONIVEIS'
          ? 'Os documentos ficaram indisponíveis. Nenhum dado foi cadastrado; tente novamente mais tarde.'
          : 'Consulte e aceite os documentos antes de continuar.')
        if (aluno && mobile) setEtapa(3)
        document.getElementById('aceite-termos')?.focus()
      } else if (falha instanceof ApiError && falha.status === 400) {
        for (const [nome, mensagens] of Object.entries(falha.campos)) {
          const campo = camposDaApi[nome]
          if (campo) campos[campo] = mensagens.join(' ')
        }
        setErros(campos)
        const primeiroErro = todosCampos.find(campo => campos[campo.nome])
        if (primeiroErro) mostrarPrimeiroErro(primeiroErro.nome)
        else setErroGeral(Object.values(falha.campos).flat().join(' ') || 'Não foi possível concluir o cadastro. Confira os dados.')
      } else {
        setErroGeral('Não foi possível acessar o serviço. Confira sua conexão e tente novamente.')
      }
    } finally {
      envioPendente.current = false
      setEnviando(false)
    }
  }

  function renderCampo(campo: CampoFormulario) {
    const id = `cadastro-${campo.nome}`
    const ajuda = aluno ? AJUDAS[campo.nome] : (AJUDAS_TREINADOR[campo.nome] ?? AJUDAS[campo.nome])
    const placeholder = aluno ? PLACEHOLDERS[campo.nome] : (PLACEHOLDERS_TREINADOR[campo.nome] ?? PLACEHOLDERS[campo.nome])
    const propriedades = {
      id,
      name: campo.nome,
      value: dados[campo.nome] ?? '',
      required: true,
      'aria-invalid': erros[campo.nome] ? true : undefined,
      'aria-describedby': erros[campo.nome] ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined,
      onChange: (evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => alterar(campo.nome, evento.target.value),
      onBlur: () => conferir(campo.nome),
    }
    return (
      <div className={`cadastro-v2__campo cadastro-v2__campo--${campo.nome}`} key={campo.nome}>
        <label htmlFor={id}>{campo.rotulo}</label>
        {campo.textoLongo
          ? <textarea {...propriedades} rows={4} placeholder={placeholder} />
          : <input {...propriedades} type={campo.tipo ?? 'text'}
              placeholder={placeholder}
              inputMode={campo.decimal ? 'decimal' : campo.inteiro ? 'numeric' : undefined}
              autoComplete={campo.autocomplete ?? 'off'}
              autoCapitalize={['apelido', 'email', 'codigoTreinador', 'codigoAtivacao', 'senha'].includes(campo.nome) ? 'none' : undefined}
              spellCheck={campo.nome === 'senha' || campo.nome === 'apelido' ? false : undefined} />}
        {ajuda && <p className="cadastro-v2__campo-ajuda" id={`${id}-ajuda`}>{ajuda}</p>}
        {erros[campo.nome] && <p className="cadastro-v2__erro-campo" id={`${id}-erro`}>{erros[campo.nome]}</p>}
      </div>
    )
  }

  const loginUrl = aluno ? '/login' : '/login?perfil=treinador'
  const termo = <AceiteTermos documentos={termosVigentes.documentos} carregando={termosVigentes.carregando} aceito={aceito}
    alterar={valor => { setAceito(valor); setErroTermos('') }}
    desabilitado={enviando} erro={erroTermos} />

  if (cadastrado) return (
    <main className="cadastro-v2 cadastro-v2--concluido">
      <section className="cadastro-v2__conclusao" aria-labelledby="titulo-cadastro-concluido">
        <img src="/space-jam-logo-v2-mobile.png" alt="" width="56" height="56" />
        <h1 id="titulo-cadastro-concluido">Sua conta foi criada</h1>
        <p role="status">Entre com suas credenciais para continuar.</p>
        {perfil === 'TREINADOR' && cadastrado.codigo_convite && (
          <div className="cadastro-v2__codigo"><h2>Código para seus alunos</h2><p>{cadastrado.codigo_convite}</p></div>
        )}
        <Link className="cadastro-v2__acao cadastro-v2__acao--primaria" to={loginUrl}>Voltar ao login</Link>
      </section>
    </main>
  )

  return (
    <main className={`cadastro-v2 ${aluno ? 'cadastro-v2--aluno' : 'cadastro-v2--treinador'}`}>
      <aside className="cadastro-v2__identidade" aria-label="Space Jam">
        <div className="cadastro-v2__marca-desktop">
          <img src="/space-jam-logo-v2-desktop.png" alt="" width="96" height="96" />
          <strong>SPACE JAM</strong>
        </div>
        <div className="cadastro-v2__apresentacao">
          <p>Seu espaço<br />de treino.</p>
          <span>Planejamento, execução e feedback para acompanhar cada treino.</span>
        </div>
        <p className="cadastro-v2__rodape">Basquete · Treino · Evolução</p>
      </aside>

      <div className="cadastro-v2__conteudo">
        <header className="cadastro-v2__cabecalho">
          <img src="/space-jam-logo-v2-mobile.png" alt="" width="38" height="41" />
          <strong>SPACE JAM</strong>
        </header>

        <section className="cadastro-v2__painel" aria-labelledby="titulo-cadastro">
          <h1 id="titulo-cadastro" className="cadastro-v2__sr-only">Cadastro</h1>
          <div className="cadastro-v2__introducao cadastro-v2__introducao--desktop">
            <h2>{aluno ? 'Crie sua conta' : 'Cadastro do treinador'}</h2>
            <p>{aluno ? 'Preencha seus dados para começar a treinar.' : 'Ative sua conta para acompanhar seus alunos.'}</p>
          </div>
          {aluno && mobile && (
            <div className="cadastro-v2__introducao cadastro-v2__introducao--mobile" aria-live="polite">
              <h2>{TITULOS_ETAPA[etapa].titulo}</h2>
              <p>{TITULOS_ETAPA[etapa].legenda}</p>
            </div>
          )}
          {!aluno && mobile && (
            <div className="cadastro-v2__introducao cadastro-v2__introducao--mobile">
              <h2>Ative sua conta</h2>
              <p>Cadastro único do treinador.</p>
            </div>
          )}

          <form className="cadastro-v2__formulario" onSubmit={enviarCadastro} noValidate aria-busy={enviando}>
            {aluno ? (
              <>
                <fieldset className="cadastro-v2__bloco" data-step="1" hidden={mobile && etapa !== 1} disabled={enviando}>
                  <legend className="cadastro-v2__sr-only">Dados da conta</legend>
                  <div className="cadastro-v2__grade">{camposAluno(1).map(renderCampo)}</div>
                </fieldset>
                <fieldset className="cadastro-v2__bloco" data-step="2" hidden={mobile && etapa !== 2} disabled={enviando}>
                  <legend className="cadastro-v2__sr-only">Dados pessoais</legend>
                  <div className="cadastro-v2__grade cadastro-v2__grade--identidade">{camposAluno(2).map(renderCampo)}</div>
                </fieldset>
                <fieldset className="cadastro-v2__bloco" data-step="3" hidden={mobile && etapa !== 3} disabled={enviando}>
                  <legend className="cadastro-v2__sr-only">Medidas e objetivos</legend>
                  <div className="cadastro-v2__grade cadastro-v2__grade--medidas">{camposAluno(3).map(renderCampo)}</div>
                </fieldset>
              </>
            ) : (
              groupsCadastroTreinador(grupos, renderCampo, enviando, mobile)
            )}

            <div className="cadastro-v2__termos" hidden={aluno && mobile && etapa !== 3}>
              {termo}
            </div>
            {conferido && Object.values(erros).some(Boolean) && (
              <p className="cadastro-v2__erro-geral" role="alert">Confira os campos indicados antes de continuar.</p>
            )}
            {erroGeral && <p className="cadastro-v2__erro-geral" role="alert">{erroGeral}</p>}

            {aluno && mobile ? (
              <div className="cadastro-v2__navegacao">
                {etapa < 3
                  ? <button className="cadastro-v2__acao cadastro-v2__acao--primaria" type="button" onClick={avancarEtapa} disabled={enviando}>Continuar</button>
                  : <button className="cadastro-v2__acao cadastro-v2__acao--primaria" type="submit" disabled={enviando}>{enviando ? 'Cadastrando…' : 'Criar minha conta'}</button>}
                {etapa === 1
                  ? <Link className="cadastro-v2__acao cadastro-v2__acao--secundaria" to={loginUrl}>Voltar ao login</Link>
                  : <button className="cadastro-v2__acao cadastro-v2__acao--secundaria" type="button" onClick={voltarEtapa} disabled={enviando}>Voltar</button>}
              </div>
            ) : (
              <div className="cadastro-v2__navegacao">
                <button className="cadastro-v2__acao cadastro-v2__acao--primaria" type="submit" disabled={enviando}>
                  {enviando ? 'Cadastrando…' : 'Cadastre-se'}
                </button>
                <Link className="cadastro-v2__acao cadastro-v2__acao--secundaria" to={loginUrl}>Voltar ao login</Link>
              </div>
            )}
          </form>

          <nav className="cadastro-v2__perfis" aria-label="Tipo de cadastro">
            <span>Deseja cadastrar-se como {aluno ? 'treinador' : 'aluno'}?</span>
            <NavLink to={aluno ? '/cadastro/treinador' : '/cadastro/aluno'}>
              {aluno ? 'Treinador' : 'Aluno'}
            </NavLink>
          </nav>
        </section>
      </div>
    </main>
  )
}

function groupsCadastroTreinador(
  grupos: ReturnType<typeof gruposCadastro>,
  renderCampo: (campo: CampoFormulario) => ReactNode,
  enviando: boolean,
  mobile: boolean,
) {
  const ordemMobile: CampoCadastro[] = [
    'codigoAtivacao', 'nome', 'sobrenome', 'apelido', 'telefone', 'email', 'senha',
  ]
  return grupos.map(grupo => {
    // Ordenação somente no celular: mantém a navegação por teclado na ordem visual.
    const campos = mobile
      ? [...grupo.campos].sort((a, b) => ordemMobile.indexOf(a.nome) - ordemMobile.indexOf(b.nome))
      : grupo.campos
    return (
      <fieldset className="cadastro-v2__bloco" key={grupo.titulo} disabled={enviando}>
        <legend className="cadastro-v2__legenda">{grupo.titulo}</legend>
        <div className="cadastro-v2__grade">{campos.map(renderCampo)}</div>
      </fieldset>
    )
  })
}
