import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router'
import { CascaTermos } from './CascaTermos'
import {
  contarPendencias,
  POLITICA_DE_PRIVACIDADE,
  TERMOS_DE_USO,
  VERSAO_DOCUMENTOS_LEGAIS,
  type BlocoDocumento,
  type DocumentoLegal,
} from './documentosLegais'
import { useTermosVigentes } from './useTermosVigentes'

const DOCUMENTOS = { termos: TERMOS_DE_USO, privacidade: POLITICA_DE_PRIVACIDADE } as const

/** Renderiza **destaque** e [[pendência]] como nós React (sem HTML bruto). */
function TextoDocumento({ texto }: { texto: string }) {
  return texto.split(/(\*\*[^*]+\*\*|\[\[[^\]]+\]\])/).map((parte, indice) => {
    if (parte.startsWith('**') && parte.endsWith('**')) return <strong key={indice}>{parte.slice(2, -2)}</strong>
    if (parte.startsWith('[[') && parte.endsWith(']]')) {
      return <mark key={indice} className="termos-doc__pendente">{parte.slice(2, -2)}</mark>
    }
    return <Fragment key={indice}>{parte}</Fragment>
  })
}

function Bloco({ bloco }: { bloco: BlocoDocumento }) {
  if (bloco.tipo === 'paragrafo') return <p><TextoDocumento texto={bloco.texto} /></p>
  if (bloco.tipo === 'lista') {
    return <ul>{bloco.itens.map(item => <li key={item}><TextoDocumento texto={item} /></li>)}</ul>
  }
  return <div className="termos-doc__tabela" role="region" aria-label={bloco.legenda} tabIndex={0}>
    <table>
      <caption>{bloco.legenda}</caption>
      <thead><tr>{bloco.cabecalho.map(coluna => <th key={coluna} scope="col">{coluna}</th>)}</tr></thead>
      <tbody>
        {bloco.linhas.map(linha => <tr key={linha[0]}>
          {linha.map((celula, indice) => <td key={indice}><TextoDocumento texto={celula} /></td>)}
        </tr>)}
      </tbody>
    </table>
  </div>
}

/**
 * US63 (RN15, RNF16) — Página pública dos Termos de Uso e da Política de Privacidade.
 * Acessível sem login e com termos pendentes; não grava nada no navegador.
 */
export function DocumentoLegalPage({ documento: chave }: { documento: keyof typeof DOCUMENTOS }) {
  const navegar = useNavigate()
  const documento: DocumentoLegal = DOCUMENTOS[chave]
  const outro = chave === 'termos' ? POLITICA_DE_PRIVACIDADE : TERMOS_DE_USO
  const pendencias = contarPendencias(documento)
  const { documentos } = useTermosVigentes()
  const versaoDivergente = documentos && documentos.versao !== VERSAO_DOCUMENTOS_LEGAIS

  function voltar() {
    // Aberta pelo link do aceite (nova aba), a página só tem a si mesma no histórico.
    if (window.history.length > 1) {
      navegar(-1)
      return
    }
    window.close()
    navegar('/login', { replace: true })
  }

  return <CascaTermos titulo={documento.titulo} subtitulo="Documento da plataforma Space Jam.">
    <div className="termos-doc">
      <p className="termos-doc__meta">
        <strong>Versão {VERSAO_DOCUMENTOS_LEGAIS}</strong>
        {' · Vigente a partir de: '}<TextoDocumento texto={documento.vigencia} />
      </p>

      {versaoDivergente && <section className="termos-v2__cartao termos-v2__cartao--alerta" role="alert">
        <h2>Versão divergente</h2>
        <p>Este texto corresponde à versão {VERSAO_DOCUMENTOS_LEGAIS}, mas a versão vigente informada pela plataforma é {documentos.versao}.
          Fale com o responsável pela plataforma antes de aceitar.</p>
      </section>}

      {pendencias > 0 && <section className="termos-v2__cartao termos-v2__cartao--alerta" role="note" aria-labelledby="doc-pendencias">
        <h2 id="doc-pendencias">Versão em validação</h2>
        <p>Este documento tem {pendencias === 1 ? '1 ponto destacado' : `${pendencias} pontos destacados`} que aguardam confirmação do
          responsável pela plataforma ou revisão jurídica. As regras descritas correspondem ao funcionamento atual da plataforma.</p>
      </section>}

      <section className="termos-v2__cartao" aria-labelledby="doc-resumo">
        <h2 id="doc-resumo">Resumo</h2>
        <ul>{documento.resumo.map(item => <li key={item}><TextoDocumento texto={item} /></li>)}</ul>
      </section>

      <nav className="termos-doc__sumario" aria-label="Sumário">
        <h2>Sumário</h2>
        <ol>{documento.secoes.map(secao => <li key={secao.id}><a href={`#${secao.id}`}>{secao.titulo}</a></li>)}</ol>
      </nav>

      {documento.secoes.map(secao => <section key={secao.id} id={secao.id} className="termos-doc__secao" aria-labelledby={`${secao.id}-titulo`}>
        <h2 id={`${secao.id}-titulo`}>{secao.titulo}</h2>
        {secao.blocos.map((bloco, indice) => <Bloco key={indice} bloco={bloco} />)}
      </section>)}

      <footer className="termos-doc__rodape">
        <p>{documento.historico}</p>
        <ul>
          <li><Link to={outro.caminho}>{outro.titulo}</Link></li>
          {chave === 'privacidade' && <li><Link to="/conta/privacidade">Preferências de privacidade</Link></li>}
        </ul>
      </footer>
    </div>
    <button type="button" className="termos-v2__acao termos-v2__acao--primaria" onClick={voltar}>Voltar</button>
  </CascaTermos>
}
