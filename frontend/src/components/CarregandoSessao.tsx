import { Marca } from './Marca'
import './CarregandoSessao.css'

export function CarregandoSessao() {
  return (
    <main className="sessao-v2">
      <Marca />
      <p role="status">Recuperando sua sessão…</p>
    </main>
  )
}
