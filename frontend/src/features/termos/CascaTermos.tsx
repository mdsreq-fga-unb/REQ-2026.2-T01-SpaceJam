import type { ReactNode } from 'react'
import './Termos.css'

/** Estrutura das telas de termos (US63): barra com a marca e conteúdo centralizado. */
export function CascaTermos({ titulo, subtitulo, children }: { titulo: string; subtitulo: string; children: ReactNode }) {
  return <div className="termos-v2">
    <header className="termos-v2__cabecalho">
      <img src="/space-jam-logo-v2-mobile.png" alt="" width="36" height="38" />
      <span>SPACE JAM</span>
    </header>
    <main className="termos-v2__conteudo">
      <div className="termos-v2__titulo">
        <h1>{titulo}</h1>
        <p>{subtitulo}</p>
      </div>
      {children}
    </main>
  </div>
}
