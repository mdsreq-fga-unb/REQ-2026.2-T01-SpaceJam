import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'

const treino = {
  id: 7, alunoId: 2, nome: 'Controle de bola', status: 'CONCLUIDO',
  statusLabel: 'Concluído', criadoEm: '2026-11-04T12:00:00Z', realizadoEm: null,
  quantidadeExercicios: 1,
}
const par = { id: 5, erro: 'Olhar para a bola', orientacao_corretiva: 'Olhar à frente' }
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status })

function abrir(path: string, papel: 'ALUNO' | 'TREINADOR', responder: (rota: string, request?: RequestInit) => Response) {
  tokenStorage.set('sessao-teste')
  window.history.replaceState({}, '', path)
  const fetch = vi.fn(async (input: RequestInfo | URL, request?: RequestInit) =>
    String(input) === '/api/auth/me/'
      ? json({ id: papel === 'ALUNO' ? 2 : 1, papel, first_name: 'Alex', apelido: 'alex', termos_pendentes: false })
      : responder(String(input), request))
  vi.stubGlobal('fetch', fetch)
  render(<App />)
  return fetch
}

afterEach(() => {
  tokenStorage.clear()
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('Integração dos históricos e da associação', () => {
  it('abre o histórico do aluno, consulta outra página e volta do detalhe à página anterior', async () => {
    const pessoa = userEvent.setup()
    abrir('/historico', 'ALUNO', rota => {
      if (rota === '/api/treinos/meu-historico/?page=1') return json({ next: 'http://api/exemplo/?page=2', previous: null, results: [{ ...treino, id: 6, nome: 'Treino anterior' }] })
      if (rota === '/api/treinos/meu-historico/?page=2') return json({ next: null, previous: 'http://api/exemplo/', results: [treino] })
      if (rota === '/api/treinos/7/') return json({ ...treino, exercicios: [{
        id: 1, nome: 'Drible', parametros: '3 séries', errosOrientacoes: [par], dificuldade: { nota: 4 },
        feedback: { autorNome: 'Alex', texto: 'Consegui manter o controle.', editado: true },
      }] })
      return json({}, 404)
    })
    expect(await screen.findByText('Treino anterior')).toBeVisible()
    await pessoa.click(screen.getByRole('link', { name: 'Próxima página' }))
    expect(await screen.findByText(/04\/11\/2026.*Concluído/)).toBeVisible()
    await pessoa.click(screen.getByRole('link', { name: 'Consultar Controle de bola' }))
    expect(await screen.findByText('Consegui manter o controle.')).toBeVisible()
    expect(screen.getByText('Olhar à frente')).toBeVisible()
    expect(screen.getByText('4 de 5')).toBeVisible()
    await pessoa.click(screen.getByRole('link', { name: 'Voltar ao histórico' }))
    expect(await screen.findByText('Controle de bola')).toBeVisible()
    expect(window.location.search).toBe('?pagina=2')
  })

  it('carrega o histórico do aluno acompanhado e mantém o detalhe associado ao aluno da URL', async () => {
    const pessoa = userEvent.setup()
    const fetch = abrir('/treinador/alunos/2/historico', 'TREINADOR', rota => {
      if (rota === '/api/treinos/alunos/2/historico/?page=1') return json({ aluno: { id: 2, nome: 'Alex Aluno' }, next: null, previous: null, results: [treino] })
      if (rota === '/api/treinos/7/') return json({ ...treino, alunoId: 3, exercicios: [] })
      return json({}, 404)
    })
    expect(await screen.findByText('Alex Aluno')).toBeVisible()
    await pessoa.click(screen.getByRole('link', { name: 'Consultar Controle de bola' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Treino não encontrado neste histórico')
    expect(fetch).toHaveBeenCalledWith('/api/treinos/7/', expect.any(Object))
  })

  it('entra pela biblioteca, envia os IDs e mostra a cópia devolvida pela API', async () => {
    const pessoa = userEvent.setup()
    let associados: (typeof par)[] = []
    const fetch = abrir('/exercicios/2/erros-orientacoes', 'TREINADOR', (rota, request) => {
      if (rota === '/api/exercicios/2/') return json({ id: 2, nome: 'Deslocamento', objetivo: '', fundamento_nome: 'Drible', erros_orientacoes: associados })
      if (rota === '/api/exercicios/2/erros-comuns/candidatos/') return json(associados.length ? [] : [par])
      if (rota === '/api/exercicios/2/erros-comuns/associar/' && request?.method === 'POST') {
        associados = [{ ...par, id: 23 }]
        return json({ criados: associados, ignorados: 0 }, 201)
      }
      return json({}, 404)
    })
    await pessoa.click(await screen.findByRole('link', { name: 'Associar erros e orientações' }))
    await pessoa.click(await screen.findByRole('checkbox', { name: /Olhar para a bola/ }))
    await pessoa.click(screen.getByRole('button', { name: 'Associar seleção' }))
    expect(await screen.findByText('1 par associado.')).toBeVisible()
    expect(within(screen.getByRole('region', {name: 'Pares associados ao exercício'})).getByText('Olhar à frente')).toBeVisible()
    expect(fetch).toHaveBeenCalledWith('/api/exercicios/2/erros-comuns/associar/', expect.objectContaining({
      method: 'POST', body: '{"ids":[5]}',
    }))
  })
})
