import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, type Mock } from 'vitest'
import App from '../src/App'

export function abrir(caminho: string) {
  window.history.replaceState({}, '', caminho)
  render(<App />)
  return userEvent.setup()
}

export async function preencherCadastro(pessoa: ReturnType<typeof userEvent.setup>, perfil = 'aluno', nascimento = '2000-01-01') {
  const campos = perfil === 'aluno'
    ? { Nome: 'Aluno', Sobrenome: 'Teste', Apelido: 'aluno', 'E-mail': 'aluno@example.com', Senha: 'Senha#2026', 'Código do treinador': 'TRN-ABC123', 'Altura (cm)': '185', 'Peso (kg)': '80,5', 'Envergadura (cm)': '190', 'Frequência de atividade física (dias por semana)': '3', Objetivos: 'Melhorar o arremesso' }
    : { Nome: 'Treinador', Sobrenome: 'Teste', Apelido: 'treinador', 'E-mail': 'treinador@example.com', Telefone: '61999990000', Senha: 'Senha#2026', 'Código de ativação': 'ativacao-de-teste' }
  for (const [nome, valor] of Object.entries(campos)) await pessoa.type(screen.getByLabelText(nome, { exact: true }), valor)
  if (perfil === 'aluno') await pessoa.type(screen.getByLabelText('Data de nascimento'), nascimento)
}

interface RespostaSimulada { corpo: unknown; status?: number }

export const termosVigentes = {
  versao: '1.0',
  termos_uso_url: '/termos-de-uso',
  politica_privacidade_url: '/politica-de-privacidade',
  disponivel: true,
}
export const termosIndisponiveis = { ...termosVigentes, termos_uso_url: null, politica_privacidade_url: null, disponivel: false }

/**
 * Simula a API por "MÉTODO /url" em vez da ordem das chamadas. Uma lista responde em
 * sequência e repete a última. `GET /api/auth/termos/vigentes/` já responde por padrão.
 */
export function simularApi(rotas: Record<string, RespostaSimulada | RespostaSimulada[]> = {}) {
  const filas = new Map(Object.entries({ 'GET /api/auth/termos/vigentes/': { corpo: termosVigentes }, ...rotas })
    .map(([rota, resposta]) => [rota, Array.isArray(resposta) ? [...resposta] : [resposta]]))
  const fetch = vi.fn(async (url: string, opcoes: RequestInit = {}) => {
    const rota = `${opcoes.method ?? 'GET'} ${url}`
    const fila = filas.get(rota)
    if (!fila) throw new TypeError(`Rota não simulada: ${rota}`)
    const { corpo, status = 200 } = fila.length > 1 ? fila.shift()! : fila[0]
    return new Response(JSON.stringify(corpo), { status })
  })
  vi.stubGlobal('fetch', fetch)
  return fetch
}

/** Corpos (JSON) enviados para "MÉTODO /url". */
export function enviadosPara(fetch: Mock, rota: string) {
  return fetch.mock.calls
    .filter(([url, opcoes = {}]) => `${(opcoes as RequestInit).method ?? 'GET'} ${url}` === rota)
    .map(([, opcoes]) => JSON.parse(((opcoes as RequestInit | undefined)?.body as string | undefined) ?? 'null'))
}
