import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import {
  atualizarErroOrientacao,
  atualizarExercicio,
  consultarExercicio,
  criarErroOrientacao,
  listarErrosOrientacoes,
  mensagemDeErroOrientacao,
  removerErroOrientacao,
} from '../src/features/exercicios/exerciciosApi'

// US37 — integração do frontend com /api/exercicios/<id>/erros-comuns/

const itemApi = {
  id: 7,
  erro: 'Olhar para a bola',
  orientacao_corretiva: 'Manter a cabeça erguida.',
  criado_em: '2026-11-25T10:00:00-03:00',
  atualizado_em: '2026-11-25T10:00:00-03:00',
}

const exercicioApi = {
  id: 1,
  nome: 'Drible com deslocamento',
  objetivo: 'Conduzir a bola em movimento.',
  fundamento: 'DRIBLE',
  fundamento_nome: 'Drible',
  orientacoes: '',
  erros_comuns: 'Texto antigo',
  video_base: '',
}

function simularFetch(resposta: Response) {
  const buscar = vi.fn(async (_url: string, _opcoes?: RequestInit) => resposta)
  vi.stubGlobal('fetch', buscar)
  return buscar
}

function chamada(buscar: ReturnType<typeof simularFetch>) {
  const [url, opcoes] = buscar.mock.calls[0]
  return { url, metodo: opcoes?.method ?? 'GET', corpo: opcoes?.body ? JSON.parse(String(opcoes.body)) : undefined }
}

beforeEach(() => tokenStorage.set('token-teste'))
afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
})

describe('US37 — API de erros e orientações', () => {
  it('consulta do exercício traz a lista de erros e orientações em camelCase', async () => {
    simularFetch(Response.json({ ...exercicioApi, erros_orientacoes: [itemApi] }))
    const exercicio = await consultarExercicio(1)
    expect(exercicio.errosOrientacoes).toEqual([
      { id: 7, erro: 'Olhar para a bola', orientacaoCorretiva: 'Manter a cabeça erguida.' },
    ])
    expect(exercicio.errosComuns).toBe('Texto antigo')
  })

  it('editar um exercício sem preencher erros comuns preserva o texto legado', async () => {
    const buscar = simularFetch(Response.json({ ...exercicioApi, nome: 'Drible lateral' }))
    const atualizado = await atualizarExercicio(1, {
      nome: 'Drible lateral',
      objetivo: 'Conduzir a bola em movimento.',
      fundamento: 'Drible',
    })

    expect(chamada(buscar)).toEqual({
      url: '/api/exercicios/1/',
      metodo: 'PUT',
      corpo: {
        nome: 'Drible lateral',
        objetivo: 'Conduzir a bola em movimento.',
        fundamento: 'DRIBLE',
        orientacoes: '',
        video_base: '',
      },
    })
    expect(atualizado.errosComuns).toBe('Texto antigo')
  })

  it('consulta sem o campo novo resulta em lista vazia', async () => {
    simularFetch(Response.json(exercicioApi))
    expect((await consultarExercicio(1)).errosOrientacoes).toEqual([])
  })

  it('lista os itens pela rota do exercício', async () => {
    const buscar = simularFetch(Response.json([itemApi]))
    const itens = await listarErrosOrientacoes(1)
    expect(chamada(buscar)).toMatchObject({ url: '/api/exercicios/1/erros-comuns/', metodo: 'GET' })
    expect(itens).toEqual([{ id: 7, erro: 'Olhar para a bola', orientacaoCorretiva: 'Manter a cabeça erguida.' }])
  })

  it('cadastra enviando só os dois textos em snake_case', async () => {
    const buscar = simularFetch(Response.json(itemApi, { status: 201 }))
    const criado = await criarErroOrientacao(1, { erro: 'Olhar para a bola', orientacaoCorretiva: 'Manter a cabeça erguida.' })
    expect(chamada(buscar)).toEqual({
      url: '/api/exercicios/1/erros-comuns/',
      metodo: 'POST',
      corpo: { erro: 'Olhar para a bola', orientacao_corretiva: 'Manter a cabeça erguida.' },
    })
    expect(criado.id).toBe(7)
  })

  it('CA01: edita com PUT na rota do item', async () => {
    const buscar = simularFetch(Response.json({ ...itemApi, orientacao_corretiva: 'Usar a visão periférica.' }))
    const editado = await atualizarErroOrientacao(1, 7, { erro: 'Olhar para a bola', orientacaoCorretiva: 'Usar a visão periférica.' })
    expect(chamada(buscar)).toEqual({
      url: '/api/exercicios/1/erros-comuns/7/',
      metodo: 'PUT',
      corpo: { erro: 'Olhar para a bola', orientacao_corretiva: 'Usar a visão periférica.' },
    })
    expect(editado.orientacaoCorretiva).toBe('Usar a visão periférica.')
  })

  it('CA02: remove com DELETE e aceita a resposta 204 sem corpo', async () => {
    const buscar = simularFetch(new Response(null, { status: 204 }))
    await expect(removerErroOrientacao(1, 7)).resolves.toBeUndefined()
    expect(chamada(buscar)).toMatchObject({ url: '/api/exercicios/1/erros-comuns/7/', metodo: 'DELETE' })
  })

  it('RNF14: traduz o 400 do backend com o nome do campo', async () => {
    simularFetch(Response.json({ erro: ['Este campo não pode ser em branco.'] }, { status: 400 }))
    const falha = await criarErroOrientacao(1, { erro: ' ', orientacaoCorretiva: 'x' }).catch((e: unknown) => e)
    expect(mensagemDeErroOrientacao(falha)).toBe('Erro comum: Este campo não pode ser em branco.')
  })

  it('CA04: 403 de perfil vira mensagem própria da tela', async () => {
    simularFetch(Response.json({ detail: 'Sem permissão.' }, { status: 403 }))
    const falha = await removerErroOrientacao(1, 7).catch((e: unknown) => e)
    expect(mensagemDeErroOrientacao(falha)).toBe('Apenas treinadores podem editar erros e orientações.')
  })

  it('404 indica que o item pode ter sido removido', async () => {
    simularFetch(Response.json({ detail: 'Not found.' }, { status: 404 }))
    const falha = await atualizarErroOrientacao(1, 99, { erro: 'a', orientacaoCorretiva: 'b' }).catch((e: unknown) => e)
    expect(mensagemDeErroOrientacao(falha)).toBe('Erro comum não encontrado. Ele pode ter sido removido.')
  })

  it('falha de rede mantém a mensagem padrão', () => {
    expect(mensagemDeErroOrientacao(new TypeError('fetch failed'))).toBe('Não foi possível conectar ao servidor.')
  })
})
