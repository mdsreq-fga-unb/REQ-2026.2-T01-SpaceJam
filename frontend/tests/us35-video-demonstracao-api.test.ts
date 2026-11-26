import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, tokenStorage } from '../src/api/client'
import {
  atualizarExercicio,
  atualizarInformacoesVideoBase,
  consultarExercicio,
  mensagemDeErro,
} from '../src/features/exercicios/exerciciosApi'

// US35 / RF2418 — integração do frontend com o PATCH /api/exercicios/<id>/

const exercicioApi = {
  id: 1,
  nome: 'Drible com deslocamento',
  objetivo: 'Conduzir a bola em movimento.',
  fundamento: 'DRIBLE',
  fundamento_nome: 'Drible',
  orientacoes: '',
  erros_comuns: '',
  video_base: '',
  video_titulo: 'Drible com deslocamento',
  video_descricao: 'Observe a alternância das mãos.',
  erros_orientacoes: [],
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

describe('US35 — API do título e da descrição do vídeo-base', () => {
  it('a consulta traz título e descrição em camelCase', async () => {
    simularFetch(Response.json(exercicioApi))

    const exercicio = await consultarExercicio(1)

    expect(exercicio.videoTitulo).toBe('Drible com deslocamento')
    expect(exercicio.videoDescricao).toBe('Observe a alternância das mãos.')
  })

  it('textos vazios na API viram ausentes no front (RN22)', async () => {
    simularFetch(Response.json({ ...exercicioApi, video_titulo: '', video_descricao: '' }))

    const exercicio = await consultarExercicio(1)

    expect(exercicio.videoTitulo).toBeUndefined()
    expect(exercicio.videoDescricao).toBeUndefined()
  })

  it('salvar faz PATCH só com os dois textos', async () => {
    const buscar = simularFetch(Response.json(exercicioApi))

    const exercicio = await atualizarInformacoesVideoBase(1, {
      videoTitulo: 'Drible com deslocamento',
      videoDescricao: '',
    })

    expect(chamada(buscar)).toMatchObject({
      url: '/api/exercicios/1/',
      metodo: 'PATCH',
      corpo: { video_titulo: 'Drible com deslocamento', video_descricao: '' },
    })
    expect(Object.keys(chamada(buscar).corpo)).toEqual(['video_titulo', 'video_descricao'])
    expect(exercicio.videoTitulo).toBe('Drible com deslocamento')
  })

  it('a edição geral do exercício (PUT) não envia os textos do vídeo, para não sobrescrevê-los', async () => {
    const buscar = simularFetch(Response.json(exercicioApi))

    await atualizarExercicio(1, {
      nome: 'Drible com deslocamento',
      fundamento: 'Drible',
      objetivo: 'Conduzir a bola em movimento.',
      videoTitulo: 'Não deve ser enviado',
      videoDescricao: 'Não deve ser enviado',
    })

    const { metodo, corpo } = chamada(buscar)
    expect(metodo).toBe('PUT')
    expect(corpo).not.toHaveProperty('video_titulo')
    expect(corpo).not.toHaveProperty('video_descricao')
  })

  it('erro de limite do backend aparece com o nome amigável do campo', () => {
    const erro = new ApiError(400, 'Erro', {
      video_titulo: ['Certifique-se de que este campo não tenha mais de 120 caracteres.'],
    })

    expect(mensagemDeErro(erro)).toBe(
      'Título do vídeo: Certifique-se de que este campo não tenha mais de 120 caracteres.'
    )
  })
})
