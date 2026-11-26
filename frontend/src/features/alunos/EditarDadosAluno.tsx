import { useRef, useState, type FormEvent } from 'react'
import type { Usuario } from '../../types/usuario'
import { ApiError } from '../../api/client'
import {
  dadosDoUsuario, dadosParaAtualizacao, validarDadosAluno,
  type AtualizacaoPerfilAluno, type CampoDadosAluno,
  type ErrosDadosAluno, type FormularioDadosAluno,
} from './validacaoPerfilAluno'
import './MinhaContaAluno.css'
import './EditarDadosAluno.css'

interface Props {
  usuario: Usuario
  onCancelar: () => void
  /** Futuro contrato de escrita, conectado apenas quando o backend autorizar e implementar. */
  onSalvar?: (dados: AtualizacaoPerfilAluno) => Promise<void>
}

const campos = [
  { nome: 'first_name', rotulo: 'Nome', tipo: 'text', autoComplete: 'given-name' },
  { nome: 'last_name', rotulo: 'Sobrenome', tipo: 'text', autoComplete: 'family-name' },
  { nome: 'apelido', rotulo: 'Apelido', tipo: 'text', autoComplete: 'nickname' },
  { nome: 'email', rotulo: 'E-mail', tipo: 'email', autoComplete: 'email' },
  { nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', autoComplete: 'tel' },
  { nome: 'data_nascimento', rotulo: 'Data de nascimento', tipo: 'date', autoComplete: 'bday' },
  { nome: 'altura_cm', rotulo: 'Altura (cm)', tipo: 'text', autoComplete: 'off', inputMode: 'decimal' },
  { nome: 'peso_kg', rotulo: 'Peso (kg)', tipo: 'text', autoComplete: 'off', inputMode: 'decimal' },
  { nome: 'envergadura_cm', rotulo: 'Envergadura (cm)', tipo: 'text', autoComplete: 'off', inputMode: 'decimal' },
  { nome: 'frequencia_semanal', rotulo: 'Dias por semana', tipo: 'number', autoComplete: 'off', inputMode: 'numeric' },
] as const

export function EditarDadosAluno({ usuario, onCancelar, onSalvar }: Props) {
  const [dados, setDados] = useState<FormularioDadosAluno>(() => dadosDoUsuario(usuario))
  const [erros, setErros] = useState<ErrosDadosAluno>({})
  const [mensagem, setMensagem] = useState('')
  const [erroGeral, setErroGeral] = useState('')
  const [enviando, setEnviando] = useState(false)
  const emEnvio = useRef(false)

  function alterar(campo: CampoDadosAluno, valor: string) {
    const novos = { ...dados, [campo]: valor }
    setDados(novos)
    if (erros[campo]) setErros((antes) => ({ ...antes, [campo]: validarDadosAluno(novos)[campo] }))
    setMensagem('')
    setErroGeral('')
  }

  function conferirCampo(campo: CampoDadosAluno) {
    setErros((anterior) => ({ ...anterior, [campo]: validarDadosAluno(dados)[campo] }))
  }

  function conferirFormulario() {
    const encontrados = validarDadosAluno(dados)
    setErros(encontrados)
    setErroGeral('')
    setMensagem('')
    const primeiro = [...campos.map((c) => c.nome), 'objetivos' as const].find((campo) => encontrados[campo])
    if (primeiro) {
      setErroGeral('Confira os campos indicados. Nenhuma informação foi enviada.')
      document.getElementById(`us07-${primeiro}`)?.focus()
      return false
    }
    return true
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (emEnvio.current || !conferirFormulario() || !onSalvar) return
    emEnvio.current = true
    setEnviando(true)
    setMensagem('')
    try {
      await onSalvar(dadosParaAtualizacao(dados))
      setMensagem('Alterações salvas com sucesso.')
    } catch (falha) {
      if (falha instanceof ApiError) {
        const nomesDaApi: Record<string, CampoDadosAluno> = {
          nome: 'first_name', sobrenome: 'last_name', apelido: 'apelido',
          username: 'apelido', email: 'email', telefone: 'telefone',
          data_nascimento: 'data_nascimento', altura: 'altura_cm',
          peso: 'peso_kg', envergadura: 'envergadura_cm',
          frequencia_semanal: 'frequencia_semanal', objetivos: 'objetivos',
        }
        const recebidos: ErrosDadosAluno = {}
        for (const [nome, textos] of Object.entries(falha.campos)) {
          const campo = nomesDaApi[nome]
          if (campo) recebidos[campo] = textos.join(' ')
        }
        setErros((anterior) => ({ ...anterior, ...recebidos }))
        setErroGeral(falha.status === 401 ? 'Sua sessão expirou. Entre novamente.' :
          falha.status === 403 ? 'Você não tem permissão para editar estes dados.' :
          'Não foi possível salvar. Confira os dados e tente novamente.')
        const primeiro = [...campos.map((c) => c.nome), 'objetivos' as const].find((campo) => recebidos[campo])
        if (primeiro) document.getElementById(`us07-${primeiro}`)?.focus()
      } else {
        setErroGeral('Não foi possível acessar o serviço. Nenhuma alteração foi confirmada.')
      }
    } finally {
      emEnvio.current = false
      setEnviando(false)
    }
  }

  return (
    <div className="conta-aluno editar-aluno">
      <a className="editar-aluno__pular" href="#conteudo-us07">Pular para o conteúdo principal</a>
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span className="conta-aluno__nome-marca">SPACE JAM</span>
        </div>
        <nav className="conta-aluno__navegacao" aria-label="Seções do aluno">
          <span aria-disabled="true">Treinos</span>
          <span aria-disabled="true">Histórico</span>
          <span aria-disabled="true">Feedbacks</span>
          <span aria-current="page">Conta</span>
        </nav>
        <div className="conta-aluno__usuario">
          <span className="conta-aluno__nome-curto">{usuario.first_name || usuario.apelido}</span>
          <div className="conta-aluno__perfil-desktop">
            <strong>{[usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido}</strong>
            <span>Aluno</span>
          </div>
        </div>
      </header>

      <main id="conteudo-us07" tabIndex={-1} className="conta-aluno__conteudo editar-aluno__conteudo">
        <div className="conta-aluno__titulo">
          <h1>Editar meus dados</h1>
          <p>Confira e atualize as suas informações pessoais.</p>
        </div>

        <form className="editar-aluno__formulario" noValidate onSubmit={(evento) => { void enviar(evento) }} aria-busy={enviando}>
          <div className="editar-aluno__grade">
            {campos.map((campo) => {
              const nome = campo.nome
              return (
                <div className="editar-aluno__campo" key={nome}>
                  <label htmlFor={`us07-${nome}`}>
                    {campo.rotulo}{nome !== 'telefone' && <span aria-hidden="true"> *</span>}
                  </label>
                  <input
                    id={`us07-${nome}`}
                    name={nome}
                    type={campo.tipo}
                    autoComplete={campo.autoComplete}
                    inputMode={'inputMode' in campo ? campo.inputMode : undefined}
                    value={dados[nome]}
                    required={nome !== 'telefone'}
                    maxLength={nome === 'email' ? 254 : nome === 'telefone' ? 20 : undefined}
                    min={nome === 'frequencia_semanal' ? '1' : undefined}
                    max={nome === 'frequencia_semanal' ? '7' : undefined}
                    step={nome === 'frequencia_semanal' ? '1' : undefined}
                    onChange={(evento) => alterar(nome, evento.target.value)}
                    onBlur={() => conferirCampo(nome)}
                    aria-invalid={Boolean(erros[nome])}
                    aria-describedby={erros[nome] ? `erro-us07-${nome}` : nome === 'frequencia_semanal' ? 'ajuda-us07-frequencia' : undefined}
                    disabled={enviando || ['telefone', 'data_nascimento', 'frequencia_semanal'].includes(nome)}
                  />
                  {nome === 'frequencia_semanal' && <small id="ajuda-us07-frequencia">De 1 a 7 dias.</small>}
                  {erros[nome] && <p className="editar-aluno__erro" id={`erro-us07-${nome}`}>{erros[nome]}</p>}
                </div>
              )
            })}
            <div className="editar-aluno__campo editar-aluno__campo--objetivos">
              <label htmlFor="us07-objetivos">Meus objetivos <span aria-hidden="true">*</span></label>
              <textarea
                id="us07-objetivos" name="objetivos" rows={4} maxLength={500}
                value={dados.objetivos} onChange={(evento) => alterar('objetivos', evento.target.value)}
                onBlur={() => conferirCampo('objetivos')} aria-invalid={Boolean(erros.objetivos)}
                aria-describedby={erros.objetivos ? 'erro-us07-objetivos' : 'ajuda-us07-objetivos'}
                disabled={enviando}
              />
              <small id="ajuda-us07-objetivos">Descreva, com suas palavras, o que você gostaria de melhorar nos treinos.</small>
              {erros.objetivos && <p className="editar-aluno__erro" id="erro-us07-objetivos">{erros.objetivos}</p>}
            </div>
          </div>

          {erroGeral && <p className="editar-aluno__aviso-erro" role="alert">{erroGeral}</p>}
          {mensagem && (
            <p
              className="editar-aluno__aviso-sucesso"
              role="status"
            >
              {mensagem}
            </p>
          )}
          {!onSalvar && (
            <p className="editar-aluno__aviso-indisponivel" id="us07-salvamento-indisponivel">
              A atualização dos dados está indisponível no momento. Nenhuma alteração será salva.
            </p>
          )}
          <p className="editar-aluno__aviso-indisponivel">Telefone, nascimento e frequência semanal são somente leitura nesta edição.</p>
          <div className="editar-aluno__acoes">
            <button type="submit" className="editar-aluno__salvar" disabled={!onSalvar || enviando} aria-describedby={!onSalvar ? 'us07-salvamento-indisponivel' : undefined}>
              {enviando ? 'Salvando…' : 'Salvar alterações'}
            </button>
            <button type="button" className="editar-aluno__cancelar" onClick={onCancelar} disabled={enviando}>Cancelar</button>
          </div>
        </form>
      </main>
    </div>
  )
}
