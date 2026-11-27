import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import type { ErroOrientacao } from '../../types/exercicio'
import estilos from './ErrosOrientacoes.module.css'

interface AssociarErrosOrientacoesProps {
  pares: readonly ErroOrientacao[]
  associados?: readonly ErroOrientacao[]
  voltar: string
  onAssociar: (ids: number[]) => Promise<void>
}

export function AssociarErrosOrientacoes({ pares, associados = [], voltar, onAssociar }: AssociarErrosOrientacoesProps) {
  const [selecao, setSelecao] = useState<number[]>([])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [totalAssociado, setTotalAssociado] = useState(0)
  const grupoId = useId()
  const confirmacao = useRef<HTMLParagraphElement>(null)
  const envio = useRef(false)
  const idsAssociados = new Set(associados.map(par => par.id))
  const disponiveis = pares.filter(par => !idsAssociados.has(par.id))
  const selecionados = disponiveis
    .filter(par => par.orientacaoCorretiva.trim() && selecao.includes(par.id))
    .map(par => par.id)

  useEffect(() => {
    if (totalAssociado && document.activeElement === document.body) {
      confirmacao.current?.focus()
    }
  }, [totalAssociado])

  function alternar(id: number) {
    setTotalAssociado(0)
    setErro('')
    setSelecao(atual => atual.includes(id) ? atual.filter(item => item !== id) : [...atual, id])
  }

  async function associar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!selecionados.length || envio.current) return
    envio.current = true
    setTotalAssociado(0)
    setSalvando(true)
    setErro('')
    try {
      await onAssociar(selecionados)
      setSelecao([])
      setTotalAssociado(selecionados.length)
    } catch {
      setErro('Não foi possível associar os pares selecionados. Tente novamente.')
    } finally {
      envio.current = false
      setSalvando(false)
    }
  }

  return (
    <section className={estilos.pagina}>
      <header className={estilos.cabecalhoFormulario}>
        <h1>Associar erros e orientações</h1>
        <p>Escolha os pares que se aplicam ao exercício.</p>
      </header>
      <form onSubmit={associar}>
        <div className={estilos.associacao}>
          <fieldset className={estilos.selecaoPares} disabled={salvando} aria-busy={salvando}>
            <legend>Orientações disponíveis</legend>
            {disponiveis.length === 0 && <p className={estilos.estadoAssociacao}>Nenhuma orientação disponível para associar.</p>}
            {disponiveis.map(par => {
              const orientacao = par.orientacaoCorretiva.trim()
              const avisoId = grupoId + '-orientacao-' + par.id
              return (
                <label key={par.id} className={estilos.parAssociavel}>
                  <input type="checkbox" checked={selecionados.includes(par.id)} aria-labelledby={avisoId + '-texto'}
                    aria-describedby={orientacao ? undefined : avisoId}
                    disabled={!orientacao} onChange={() => alternar(par.id)} />
                  <span id={avisoId + '-texto'}>
                    <span className={estilos.marcaAssociacao} aria-hidden="true">✓ </span>{par.erro}{orientacao && ' → ' + orientacao}
                  </span>
                  {!orientacao && <small id={avisoId}>Orientação corretiva obrigatória.</small>}
                </label>
              )
            })}
          </fieldset>
          <section className={estilos.notaAssociacao} aria-labelledby={grupoId + '-associados'}>
            <h2 id={grupoId + '-associados'}>Pares associados ao exercício</h2>
            {associados.length > 0 ? (
              <ul className={estilos.paresAssociados}>
                {associados.map(par => (
                  <li key={par.id}><strong>{par.erro}</strong><p>{par.orientacaoCorretiva}</p></li>
                ))}
              </ul>
            ) : <p>Nenhum par associado.</p>}
          </section>
          <div className={estilos.acoesAssociacao}>
            {erro && <p className={estilos.erro} role="alert">{erro}</p>}
            <p className={totalAssociado ? estilos.sucesso : 'sr-only'} role="status" ref={confirmacao} tabIndex={-1}>
              {totalAssociado > 0 && (totalAssociado === 1 ? '1 par associado.' : totalAssociado + ' pares associados.')}
            </p>
            <button type="submit" className={estilos.confirmarAssociacao} disabled={!selecionados.length && !salvando} aria-disabled={salvando}>
              {salvando ? 'Associando...' : 'Associar seleção'}
            </button>
            <Link className={estilos.adicionar} to={voltar} aria-disabled={salvando}
              onClick={evento => { if (salvando) evento.preventDefault() }}>Cancelar</Link>
          </div>
        </div>
      </form>
    </section>
  )
}
