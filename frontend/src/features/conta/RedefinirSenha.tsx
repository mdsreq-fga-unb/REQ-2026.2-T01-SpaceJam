import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ApiError } from '../../api/client'
import { RecuperacaoSenhaLayout } from './RecuperacaoSenhaLayout'
import {
  MINIMO_SENHA_RECUPERACAO, prepararRedefinicao, validarRedefinicao,
  type DadosRedefinicao, type ErrosRedefinicao, type SolicitacaoRedefinicao,
} from './regrasRecuperacaoSenha'

interface Props {
  token: string
  onRedefinir?: (dados: SolicitacaoRedefinicao) => Promise<void>
}

const INICIAIS: DadosRedefinicao = { nova_senha: '', confirmar_senha: '' }
const CAMPOS = [
  { nome: 'nova_senha', rotulo: 'Nova senha' },
  { nome: 'confirmar_senha', rotulo: 'Confirmar nova senha' },
] as const

export function RedefinirSenha({ token, onRedefinir }: Props) {
  const [dados, setDados] = useState<DadosRedefinicao>(INICIAIS)
  const [erros, setErros] = useState<ErrosRedefinicao>({})
  const [visiveis, setVisiveis] = useState<Partial<Record<keyof DadosRedefinicao, boolean>>>({})
  const [aviso, setAviso] = useState('')
  const [concluido, setConcluido] = useState(false)
  const [linkInvalido, setLinkInvalido] = useState(false)
  const [erroToken, setErroToken] = useState('')
  const [enviando, setEnviando] = useState(false)
  const pendente = useRef(false)
  const campoNovaSenha = useRef<HTMLInputElement>(null)
  const campoConfirmacao = useRef<HTMLInputElement>(null)

  function atualizar(nome: keyof DadosRedefinicao, valor: string) {
    setDados((anterior) => ({ ...anterior, [nome]: valor }))
    setErros((anterior) => ({ ...anterior, [nome]: undefined }))
    setAviso('')
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (pendente.current || !token || !onRedefinir) return
    const encontrados = validarRedefinicao(dados)
    setErros(encontrados)
    setAviso('')
    if (encontrados.nova_senha) {
      campoNovaSenha.current?.focus()
      return
    }
    if (encontrados.confirmar_senha) {
      campoConfirmacao.current?.focus()
      return
    }
    pendente.current = true
    setEnviando(true)
    try {
      await onRedefinir(prepararRedefinicao(token, dados))
      setConcluido(true)
      setDados(INICIAIS)
      setVisiveis({})
    } catch (falha) {
      if (falha instanceof ApiError && (
        [401, 404, 410].includes(falha.status) ||
        falha.campos.codigo?.some(c => ['token_invalido', 'token_expirado', 'token_usado'].includes(c))
      )) {
        const codigo = falha.campos.codigo?.[0]
        setErroToken(codigo === 'token_expirado'
          ? 'Este link expirou. Solicite um novo link.'
          : codigo === 'token_usado'
            ? 'Este link já foi utilizado ou revogado. Solicite um novo link.'
            : codigo === 'token_invalido'
              ? 'Este link de recuperação é inválido. Solicite um novo link.'
              : 'Este link é inválido, expirou ou já foi utilizado.')
        setLinkInvalido(true)
        setDados(INICIAIS)
      } else {
        setAviso('Não foi possível redefinir a senha. Tente novamente mais tarde.')
      }
    } finally {
      pendente.current = false
      setEnviando(false)
    }
  }

  return (
    <RecuperacaoSenhaLayout
      titulo="Definir nova senha"
      descricao="Escolha uma nova senha para acessar sua conta."
    >
      {!token || linkInvalido ? (
        <div className="recuperacao-senha__estado" role="alert">
          <p>{erroToken || 'Este link é inválido, expirou ou já foi utilizado.'}</p>
          <Link to="/recuperar-senha" className="recuperacao-senha__link">Solicitar outro link</Link>
        </div>
      ) : concluido ? (
        <div className="recuperacao-senha__estado" role="status">
          <p>Sua senha foi redefinida. Você já pode entrar com a nova senha.</p>
        </div>
      ) : (
        <form className="recuperacao-senha__formulario" onSubmit={(evento) => { void enviar(evento) }} noValidate aria-busy={enviando}>
          {CAMPOS.map(({ nome, rotulo }) => (
            <div className="recuperacao-senha__campo" key={nome}>
              <label htmlFor={`recuperacao-${nome}`}>{rotulo}</label>
              <div className="recuperacao-senha__senha-campo">
                <input
                  ref={nome === 'nova_senha' ? campoNovaSenha : campoConfirmacao}
                  id={`recuperacao-${nome}`}
                  name={nome}
                  type={visiveis[nome] ? 'text' : 'password'}
                  autoComplete="new-password"
                  autoCapitalize="off"
                  spellCheck={false}
                  required
                  disabled={enviando}
                  value={dados[nome]}
                  aria-invalid={Boolean(erros[nome])}
                  aria-describedby={[
                    nome === 'nova_senha' ? 'recuperacao-dica-senha' : undefined,
                    erros[nome] ? `recuperacao-erro-${nome}` : undefined,
                  ].filter(Boolean).join(' ') || undefined}
                  onChange={(evento) => atualizar(nome, evento.target.value)}
                  onBlur={() => setErros((anterior) => ({
                    ...anterior, [nome]: validarRedefinicao(dados)[nome],
                  }))}
                />
                <button
                  type="button"
                  className="recuperacao-senha__mostrar"
                  aria-label={`${visiveis[nome] ? 'Ocultar' : 'Mostrar'} ${rotulo.toLocaleLowerCase('pt-BR')}`}
                  aria-pressed={Boolean(visiveis[nome])}
                  disabled={enviando}
                  onClick={() => setVisiveis((anterior) => ({ ...anterior, [nome]: !anterior[nome] }))}
                >{visiveis[nome] ? 'Ocultar' : 'Mostrar'}</button>
              </div>
              {nome === 'nova_senha' && (
                <p className="recuperacao-senha__ajuda" id="recuperacao-dica-senha">
                  Pelo menos {MINIMO_SENHA_RECUPERACAO} caracteres.
                </p>
              )}
              {erros[nome] && <p className="recuperacao-senha__erro" id={`recuperacao-erro-${nome}`}>{erros[nome]}</p>}
            </div>
          ))}
          {aviso && <p className="recuperacao-senha__erro-geral" role="alert">{aviso}</p>}
          <button className="recuperacao-senha__primario" type="submit" disabled={!onRedefinir || enviando}>
            {enviando ? 'Redefinindo…' : 'Redefinir senha'}
          </button>
        </form>
      )}
    </RecuperacaoSenhaLayout>
  )
}
