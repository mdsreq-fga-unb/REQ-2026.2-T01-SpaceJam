import { Marca } from './Marca'

export function CarregandoSessao() {
  return <main className="pagina-espera"><Marca /><p role="status">Recuperando sua sessão…</p></main>
}
