import { afterEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import {
  alterarSenha, consultarMeusDados, consultarPerfilDoAluno,
  editarMeusDados, solicitarLinkSenha, redefinirSenha,
} from '../src/api/integracaoUs'

const resposta = (valor: unknown) => new Response(JSON.stringify(valor), { status: 200 })

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
})

describe('Contratos de frontend/backend das novas USs', () => {
  it('US53 e US61 usam GET autenticado em rotas próprias', async () => {
    tokenStorage.set('token-de-teste')
    const buscar = vi.fn().mockImplementation(() => Promise.resolve(resposta({ id: 1 })))
    vi.stubGlobal('fetch', buscar)
    await consultarMeusDados()
    await consultarPerfilDoAluno(12)
    expect(buscar.mock.calls[0][0]).toBe('/api/contas/me/')
    expect(buscar.mock.calls[1][0]).toBe('/api/contas/alunos/12/')
    expect(buscar.mock.calls[0][1].headers.get('Authorization')).toBe('Bearer token-de-teste')
  })

  it('US07 envia apenas os oito campos editáveis', async () => {
    tokenStorage.set('token-de-teste')
    const buscar = vi.fn().mockImplementation(() => Promise.resolve(resposta({ detail: 'ok' })))
    vi.stubGlobal('fetch', buscar)
    const dados = {
      nome: 'Ana', sobrenome: 'Costa', apelido: 'ana', email: 'ana@example.com',
      altura: '1.65', peso: '60.00', envergadura: '1.70', objetivos: 'Aprimorar arremesso',
    }
    await editarMeusDados(dados)
    expect(buscar.mock.calls[0][0]).toBe('/api/contas/me/editar/')
    expect(buscar.mock.calls[0][1].method).toBe('PATCH')
    expect(JSON.parse(buscar.mock.calls[0][1].body)).toEqual(dados)
  })

  it('US08 envia confirmação na troca de senha', async () => {
    tokenStorage.set('token-de-teste')
    const buscar = vi.fn().mockImplementation(() => Promise.resolve(resposta({ detail: 'ok' })))
    vi.stubGlobal('fetch', buscar)
    await alterarSenha({ senha_atual: 'antiga123', nova_senha: 'nova123', confirmacao_senha: 'nova123' })
    expect(buscar.mock.calls[0][0]).toBe('/api/auth/trocar-senha/')
    expect(JSON.parse(buscar.mock.calls[0][1].body).confirmacao_senha).toBe('nova123')
  })

  it('US10 usa rotas públicas e envia confirmação no reset', async () => {
    const buscar = vi.fn().mockImplementation(() => Promise.resolve(resposta({ detail: 'ok' })))
    vi.stubGlobal('fetch', buscar)
    await solicitarLinkSenha('ana@example.com')
    await redefinirSenha({ token: 'token-ficticio', nova_senha: 'nova123', confirmacao_senha: 'nova123' })
    expect(buscar.mock.calls[0][0]).toBe('/api/auth/recuperar-senha/')
    expect(buscar.mock.calls[1][0]).toBe('/api/auth/redefinir-senha/')
    expect(buscar.mock.calls[0][1].headers.has('Authorization')).toBe(false)
    expect(buscar.mock.calls[1][1].headers.has('Authorization')).toBe(false)
    expect(JSON.parse(buscar.mock.calls[1][1].body).confirmacao_senha).toBe('nova123')
  })
})
