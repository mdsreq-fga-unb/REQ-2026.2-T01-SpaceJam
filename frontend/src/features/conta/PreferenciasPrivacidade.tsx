import { useState, type FormEvent } from 'react'
import type { Usuario } from '../../types/usuario'
import { lerPreferenciasPrivacidade, salvarPreferenciasPrivacidade } from './consentimentoCookies'
import '../alunos/MinhaContaAluno.css'
import './PreferenciasPrivacidade.css'

const SECOES = {
  ALUNO: ['Treinos', 'Histórico', 'Feedbacks'],
  TREINADOR: ['Alunos', 'Treinos', 'Biblioteca'],
} as const

/** US63 (CA04) / RNF16 — escolha, alteração e revogação dos cookies opcionais. */
export function PreferenciasPrivacidade({ usuario, onVoltar }: { usuario: Usuario; onVoltar: () => void }) {
  const [permitidos, setPermitidos] = useState(() => lerPreferenciasPrivacidade()?.cookiesOpcionais ?? false)
  const [salvos, setSalvos] = useState(permitidos)
  const [mensagem, setMensagem] = useState('')
  const nome = [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido

  function escolher(valor: boolean) {
    setPermitidos(valor)
    setMensagem('')
  }

  function salvar(evento: FormEvent) {
    evento.preventDefault()
    setSalvos(salvarPreferenciasPrivacidade(permitidos).cookiesOpcionais)
    setMensagem(permitidos
      ? 'Preferências salvas. Os cookies opcionais estão permitidos.'
      : 'Preferências salvas. Os cookies opcionais continuam desativados.')
  }

  return (
    <div className="conta-aluno privacidade">
      <a className="privacidade__pular" href="#conteudo-privacidade">Pular para o conteúdo principal</a>
      <header className="conta-aluno__cabecalho">
        <div className="conta-aluno__marca">
          <picture className="conta-aluno__logo-v2">
            <source media="(min-width: 900px)" srcSet="/space-jam-logo-v2-desktop.png" />
            <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
          </picture>
          <span className="conta-aluno__nome-marca">SPACE JAM</span>
        </div>
        <nav className="conta-aluno__navegacao" aria-label="Seções da conta">
          {SECOES[usuario.papel].map(secao => <span key={secao} aria-disabled="true">{secao}</span>)}
          <span aria-current="page">Conta</span>
        </nav>
        <div className="conta-aluno__usuario">
          <span className="conta-aluno__nome-curto">{usuario.first_name || usuario.apelido}</span>
          <div className="conta-aluno__perfil-desktop">
            <strong>{nome}</strong>
            <span>{usuario.papel === 'TREINADOR' ? 'Treinador' : 'Aluno'}</span>
          </div>
        </div>
      </header>

      <main id="conteudo-privacidade" tabIndex={-1} className="conta-aluno__conteudo">
        <div className="conta-aluno__titulo">
          <h1>Preferências de privacidade</h1>
          <p>Você pode alterar sua escolha a qualquer momento.</p>
        </div>

        <form className="privacidade__formulario" onSubmit={salvar}>
          <section className="conta-aluno__cartao" aria-labelledby="cookies-necessarios">
            <h2 id="cookies-necessarios">Cookies necessários</h2>
            <p className="conta-aluno__indisponivel">Usados para manter as funções essenciais da aplicação.</p>
          </section>

          <section className="privacidade__opcionais" aria-labelledby="cookies-opcionais">
            <h2 id="cookies-opcionais">Cookies opcionais</h2>
            <div className="privacidade__opcoes" role="group" aria-labelledby="cookies-opcionais">
              <button type="button" className="privacidade__opcao" aria-pressed={!permitidos} onClick={() => escolher(false)}>Não permitir</button>
              <button type="button" className="privacidade__opcao" aria-pressed={permitidos} onClick={() => escolher(true)}>Permitir</button>
            </div>
          </section>

          <section className="conta-aluno__cartao" aria-labelledby="sua-escolha">
            <h2 id="sua-escolha">Sua escolha</h2>
            <p className="conta-aluno__indisponivel">{salvos
              ? 'Os cookies opcionais estão permitidos. Você pode revogar essa permissão a qualquer momento escolhendo “Não permitir”.'
              : 'Os cookies opcionais ficam desativados até você permitir. Você também pode revogar essa permissão.'}</p>
          </section>

          {mensagem && <p className="privacidade__sucesso" role="status">{mensagem}</p>}

          <div className="privacidade__acoes">
            <button type="submit" className="privacidade__salvar">Salvar preferências</button>
            <button type="button" className="privacidade__voltar" onClick={onVoltar}>Voltar à conta</button>
          </div>
        </form>
      </main>
    </div>
  )
}
