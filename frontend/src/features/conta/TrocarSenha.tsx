import { useRef, useState, type FormEvent } from 'react'
import { ApiError } from '../../api/client'
import type { Usuario } from '../../types/usuario'
import {
  criteriosNovaSenha, prepararTrocaSenha, validarTrocaSenha, MINIMO_SENHA,
  type CamposTrocaSenha, type CampoTrocaSenha, type ErrosTrocaSenha,
  type SolicitarTrocaSenha,
} from './regrasTrocaSenha'
import '../alunos/MinhaContaAluno.css'
import './TrocarSenha.css'

interface Props {
  usuario: Usuario
  onVoltar: () => void
  /** Integrar somente depois de confirmar contrato, autorização e política de sessões no backend. */
  onTrocarSenha?: (dados: SolicitarTrocaSenha) => Promise<void>
}

const campos: { nome: CampoTrocaSenha; rotulo: string; autocomplete: string }[] = [
  { nome: 'senha_atual', rotulo: 'Senha atual', autocomplete: 'current-password' },
  { nome: 'nova_senha', rotulo: 'Nova senha', autocomplete: 'new-password' },
  { nome: 'confirmar_senha', rotulo: 'Confirmar nova senha', autocomplete: 'new-password' },
]

const vazio: CamposTrocaSenha = { senha_atual: '', nova_senha: '', confirmar_senha: '' }

export function TrocarSenha({ usuario, onVoltar, onTrocarSenha }: Props) {
  const [dados, setDados] = useState<CamposTrocaSenha>(vazio)
  const [visiveis, setVisiveis] = useState<Partial<Record<CampoTrocaSenha, boolean>>>({})
  const [erros, setErros] = useState<ErrosTrocaSenha>({})
  const [aviso, setAviso] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const pendente = useRef(false)
  const criterios = criteriosNovaSenha(dados.nova_senha)

  function alterar(nome: CampoTrocaSenha, valor: string) {
    const atualizados = { ...dados, [nome]: valor }
    setDados(atualizados)
    if (erros[nome]) {
      const recalculados = validarTrocaSenha(atualizados)
      setErros((antes) => ({ ...antes, [nome]: recalculados[nome] }))
    }
    setAviso('')
    setMensagem('')
  }

  function conferirCampo(nome: CampoTrocaSenha) {
    setErros((antes) => ({ ...antes, [nome]: validarTrocaSenha(dados)[nome] }))
  }

  function conferirFormulario() {
    const encontrados = validarTrocaSenha(dados)
    setErros(encontrados)
    setAviso('')
    setMensagem('')
    const primeiro = campos.find(({ nome }) => encontrados[nome])?.nome
    if (primeiro) {
      setAviso('Confira os campos destacados.')
      document.getElementById(`us08-${primeiro}`)?.focus()
      return false
    }
    return true
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (pendente.current || !onTrocarSenha || !conferirFormulario()) return
    pendente.current = true
    setEnviando(true)
    setMensagem('')
    try {
      await onTrocarSenha(prepararTrocaSenha(dados))
      setDados({ ...vazio })
      setVisiveis({})
      setErros({})
      setMensagem('Senha alterada com sucesso.')
    } catch (falha) {
      if (falha instanceof ApiError) {
        const atualIncorreta = Boolean(falha.campos.senha_atual?.length || falha.campos.senha_antiga?.length)
        if (atualIncorreta) {
          setErros((antes) => ({ ...antes, senha_atual: 'Confira sua senha atual.' }))
          document.getElementById('us08-senha_atual')?.focus()
        }
        setAviso(falha.status === 401
          ? 'Sua sessão expirou. Entre novamente para continuar.'
          : falha.status === 403
            ? 'Você não tem permissão para trocar a senha nesta sessão.'
            : 'Não foi possível alterar a senha. Confira os campos e tente novamente.')
      } else {
        setAviso('Não foi possível confirmar a troca de senha. Tente novamente quando o serviço estiver disponível.')
      }
    } finally {
      pendente.current = false
      setEnviando(false)
    }
  }

  return (
    <div className="conta-aluno troca-senha">
      <a className="troca-senha__pular" href="#conteudo-us08">Pular para o conteúdo principal</a>
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span className="conta-aluno__nome-marca">SPACE JAM</span>
        </div>
        <nav className="conta-aluno__navegacao" aria-label="Seções da conta">
          <span aria-disabled="true">Treinos</span>
          <span aria-disabled="true">Histórico</span>
          <span aria-disabled="true">Feedbacks</span>
          <span aria-current="page">Conta</span>
        </nav>
        <div className="conta-aluno__usuario">
          <span className="conta-aluno__nome-curto">{usuario.first_name || usuario.apelido}</span>
          <div className="conta-aluno__perfil-desktop">
            <strong>{[usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido}</strong>
            <span>{usuario.papel === 'TREINADOR' ? 'Treinador' : 'Aluno'}</span>
          </div>
        </div>
      </header>

      <main id="conteudo-us08" tabIndex={-1} className="conta-aluno__conteudo troca-senha__conteudo">
        <div className="conta-aluno__titulo">
          <h1>Trocar minha senha</h1>
          <p>Atualize a senha que você utiliza para acessar o Space Jam.</p>
        </div>

        <form className="troca-senha__formulario" noValidate onSubmit={(evento) => { void enviar(evento) }} aria-busy={enviando}>
          {campos.map(({ nome, rotulo, autocomplete }) => (
            <div className="troca-senha__campo" key={nome}>
              <label htmlFor={`us08-${nome}`}>{rotulo} <span aria-hidden="true">*</span></label>
              <div className="troca-senha__entrada">
                <input
                  id={`us08-${nome}`}
                  name={nome}
                  type={visiveis[nome] ? 'text' : 'password'}
                  value={dados[nome]}
                  autoComplete={autocomplete}
                  spellCheck={false}
                  autoCapitalize="off"
                  required
                  disabled={enviando}
                  aria-invalid={Boolean(erros[nome])}
                  aria-describedby={[
                    nome === 'nova_senha' ? 'us08-criterios' : undefined,
                    erros[nome] ? `us08-erro-${nome}` : undefined,
                  ].filter(Boolean).join(' ') || undefined}
                  onChange={(evento) => alterar(nome, evento.target.value)}
                  onBlur={() => conferirCampo(nome)}
                />
                <button
                  type="button"
                  className="troca-senha__alternar"
                  aria-label={`${visiveis[nome] ? 'Ocultar' : 'Mostrar'} ${rotulo.toLocaleLowerCase('pt-BR')}`}
                  aria-pressed={Boolean(visiveis[nome])}
                  onClick={() => setVisiveis((antes) => ({ ...antes, [nome]: !antes[nome] }))}
                  disabled={enviando}
                >
                  {visiveis[nome] ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {nome === 'nova_senha' && (
                <div id="us08-criterios" className="troca-senha__criterios">
                  <p>A nova senha precisa ter:</p>
                  <ul>
                    <li className={criterios.comprimento ? 'troca-senha__criterio--atendido' : ''}>
                      <span aria-hidden="true">{criterios.comprimento ? '✓' : '○'}</span>
                      Pelo menos {MINIMO_SENHA} caracteres
                      <span className="troca-senha__sr-only">{criterios.comprimento ? 'Atendido' : 'Não atendido'}</span>
                    </li>
                  </ul>
                </div>
              )}
              {erros[nome] && <p className="troca-senha__erro" id={`us08-erro-${nome}`}>{erros[nome]}</p>}
            </div>
          ))}

          {aviso && <p className="troca-senha__aviso-erro" role="alert">{aviso}</p>}
          {mensagem && <p className={mensagem === 'Senha alterada com sucesso.' ? 'troca-senha__aviso-sucesso' : 'troca-senha__aviso-info'} role="status">{mensagem}</p>}

          <div className="troca-senha__acoes">
            <button type="submit" className="troca-senha__salvar" disabled={!onTrocarSenha || enviando}>{enviando ? 'Alterando senha…' : 'Alterar senha'}</button>
            <button type="button" className="troca-senha__voltar" onClick={onVoltar} disabled={enviando}>Voltar à conta</button>
          </div>
        </form>
      </main>
    </div>
  )
}
