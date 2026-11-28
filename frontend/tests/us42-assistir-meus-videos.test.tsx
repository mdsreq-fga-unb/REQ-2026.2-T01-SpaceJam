import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import { simularApi } from './apoio'
import { alunoMe, feedbackLucas, situacao, treinadorMe, treino, video } from './us42-apoio'

const VIDEO_ATUAL = 'GET /api/treinos/exercicios/42/video/'

function abrir(caminho: string, rotas: Parameters<typeof simularApi>[0], eu = alunoMe) {
  tokenStorage.set('token-ficticio')
  const fetch = simularApi({ 'GET /api/auth/me/': eu, ...rotas })
  window.history.replaceState({}, '', caminho)
  render(<App />)
  return { fetch, pessoa: userEvent.setup() }
}

const paraAssistir = (extra: Record<string, unknown> = {}) => ({
  corpo: { ...video(extra), urlVisualizacao: `https://storage.exemplo/v.mp4?token=${extra.tentativa ?? 2}`, validadeSegundos: 600 },
})

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('US42 — assistir ao vídeo enviado (CA04)', () => {
  const devolvido = treino({
    status: 'CORRIGIR',
    videoExecucao: video({ tentativa: 2, status: 'AVALIADO', feedbackTreinador: feedbackLucas }),
    envioVideo: situacao.novaTentativa,
  })

  it('toca pelo link temporário e mostra status, feedback e tentativas', async () => {
    abrir('/treinos/14/exercicios/42/video', {
      'GET /api/treinos/14/': devolvido,
      [VIDEO_ATUAL]: paraAssistir({ tentativa: 2, status: 'AVALIADO', feedbackTreinador: feedbackLucas }),
    })
    expect(await screen.findByRole('heading', { name: 'Drible alternado' })).toHaveFocus()
    expect(screen.getByLabelText('Vídeo da execução: Drible alternado, tentativa 2'))
      .toHaveAttribute('src', 'https://storage.exemplo/v.mp4?token=2')
    expect(screen.getByText('Avaliado por Lucas')).toBeVisible()
    expect(screen.getByText(feedbackLucas.texto)).toBeVisible()

    const tentativas = screen.getByRole('navigation', { name: 'Tentativas deste exercício' })
    expect(within(tentativas).getByText('Tentativa 2 (atual)')).toHaveAttribute('aria-current', 'page')
    expect(within(tentativas).getByRole('link', { name: 'Tentativa 1' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video?tentativa=1')
    expect(screen.getByRole('link', { name: 'Enviar nova tentativa' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video/enviar')
  })

  it('consulta uma tentativa anterior sem oferecer novo envio', async () => {
    const { fetch } = abrir('/treinos/14/exercicios/42/video?tentativa=1', {
      'GET /api/treinos/14/': devolvido,
      'GET /api/treinos/exercicios/42/video/?tentativa=1': paraAssistir({ tentativa: 1, status: 'AVALIADO' }),
    })
    expect(await screen.findByText(/Tentativa 1 \(anterior\)/)).toBeVisible()
    expect(screen.queryByRole('link', { name: 'Enviar nova tentativa' })).not.toBeInTheDocument()
    expect(fetch).toHaveBeenCalledWith('/api/treinos/exercicios/42/video/?tentativa=1', expect.anything())
  })

  it('pede um link novo quando o de 10 minutos vence com a tela aberta', async () => {
    abrir('/treinos/14/exercicios/42/video', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
      [VIDEO_ATUAL]: [paraAssistir({ tentativa: 1 }), { corpo: { ...paraAssistir().corpo, urlVisualizacao: 'https://storage.exemplo/novo.mp4' } }],
    })
    const player = await screen.findByLabelText('Vídeo da execução: Drible alternado, tentativa 1')
    fireEvent.error(player)
    await waitFor(() => expect(screen.getByLabelText(/Vídeo da execução/))
      .toHaveAttribute('src', 'https://storage.exemplo/novo.mp4'))
    expect(screen.getByText(/você ainda pode substituir o vídeo/)).toBeVisible()
  })

  it('explica quando ainda não há vídeo', async () => {
    abrir('/treinos/14/exercicios/42/video', {
      'GET /api/treinos/14/': treino(),
      [VIDEO_ATUAL]: { corpo: { detail: 'Nenhum vídeo foi enviado para este exercício.', code: 'VIDEO_NAO_ENCONTRADO' }, status: 404 },
    })
    expect(await screen.findByRole('heading', { name: 'Nenhum vídeo enviado' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Voltar ao exercício' })).toHaveAttribute('href', '/treinos/14?exercicio=42')
  })

  it('o treinador assiste sem ações do aluno', async () => {
    abrir('/treinos/14/exercicios/42/video', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
      [VIDEO_ATUAL]: paraAssistir({ tentativa: 1 }),
    }, treinadorMe)
    expect(await screen.findByText('Este vídeo ainda não tem feedback do treinador.')).toBeVisible()
    expect(screen.queryByRole('link', { name: /Substituir|Meus vídeos/ })).not.toBeInTheDocument()
  })

  it('mostra "Não foi possível concluir" com nova tentativa se o Storage falhar', async () => {
    const { pessoa } = abrir('/treinos/14/exercicios/42/video', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
      [VIDEO_ATUAL]: [
        { corpo: { detail: 'O envio de vídeos está indisponível no momento.', code: 'ARMAZENAMENTO_INDISPONIVEL' }, status: 503 },
        paraAssistir({ tentativa: 1 }),
      ],
    })
    expect(await screen.findByRole('heading', { name: 'Não foi possível concluir' })).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('indisponível no momento')
    await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByLabelText(/Vídeo da execução/)).toBeVisible()
  })
})

describe('US42 — Meus vídeos', () => {
  const meuVideo = (extra: Record<string, unknown>) => ({
    ...video(), exercicioNome: 'Drible alternado', treinoId: 14, treinoNome: 'Treino A', atual: true, envio: null, ...extra,
  })

  it('agrupa por treino e exercício, com status, feedback, tentativas e a ação permitida', async () => {
    abrir('/treinos/meus-videos', {
      'GET /api/treinos/meus-videos/': {
        corpo: [
          meuVideo({ id: 9, exercicioId: 50, exercicioNome: 'Arremesso', treinoId: 15, treinoNome: 'Treino B', envio: situacao.substituicao }),
          meuVideo({ id: 8, tentativa: 2, status: 'AVALIADO', feedbackTreinador: feedbackLucas, envio: situacao.avaliado }),
          meuVideo({ id: 7, tentativa: 1, status: 'AVALIADO', atual: false }),
        ],
      },
    })
    expect(await screen.findByRole('heading', { name: 'Meus vídeos' })).toHaveFocus()
    expect(screen.getByText('2 exercícios com vídeo · 1 aguardando avaliação')).toBeVisible()

    const treinoA = screen.getByRole('region', { name: 'Treino A' })
    const drible = within(treinoA).getByRole('article', { name: 'Drible alternado' })
    expect(within(drible).getByText('Avaliado pelo treinador')).toBeVisible()
    expect(within(drible).getByText(feedbackLucas.texto)).toBeVisible()
    expect(within(drible).getByRole('link', { name: 'Assistir: Drible alternado, tentativa 2' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video')
    expect(within(drible).getByRole('link', { name: 'Tentativa 1' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video?tentativa=1')
    expect(within(drible).queryByRole('link', { name: /Substituir|nova tentativa/ })).not.toBeInTheDocument()

    const arremesso = within(screen.getByRole('region', { name: 'Treino B' })).getByRole('article', { name: 'Arremesso' })
    expect(within(arremesso).getByText('Aguardando avaliação do treinador')).toBeVisible()
    expect(within(arremesso).getByRole('link', { name: 'Substituir vídeo: Arremesso' }))
      .toHaveAttribute('href', '/treinos/15/exercicios/50/video/enviar')
    expect(within(arremesso).getByRole('link', { name: 'Abrir exercício: Arremesso' }))
      .toHaveAttribute('href', '/treinos/15?exercicio=50')
  })

  it('Meu planejamento tem um atalho para Meus vídeos com o resumo dos envios', async () => {
    const { pessoa } = abrir('/treinos', {
      'GET /api/treinos/meu-planejamento/': { corpo: { planejamento: null } },
      'GET /api/treinos/meus-videos/': {
        corpo: [
          meuVideo({ id: 9, exercicioId: 50, exercicioNome: 'Arremesso', envio: situacao.substituicao }),
          meuVideo({ id: 8, tentativa: 2, status: 'AVALIADO' }),
          meuVideo({ id: 7, tentativa: 1, status: 'AVALIADO', atual: false }),
        ],
      },
    })
    const atalho = await screen.findByRole('region', { name: 'Seus envios' })
    const link = within(atalho).getByRole('link', { name: /Meus vídeos/ })
    expect(link).toHaveAttribute('href', '/treinos/meus-videos')
    expect(await within(atalho).findByText('2 enviados · 1 aguardando avaliação')).toBeVisible()
    await pessoa.click(link)
    expect(await screen.findByRole('heading', { name: 'Meus vídeos' })).toBeVisible()
  })

  it('o atalho continua disponível se o resumo falhar', async () => {
    abrir('/treinos', {
      'GET /api/treinos/meu-planejamento/': { corpo: { planejamento: null } },
      'GET /api/treinos/meus-videos/': { corpo: { detail: 'Erro', code: 'ERRO' }, status: 500 },
    })
    const atalho = await screen.findByRole('region', { name: 'Seus envios' })
    expect(await within(atalho).findByText('Consulte as execuções que você enviou')).toBeVisible()
    expect(within(atalho).getByRole('link', { name: /Meus vídeos/ })).toHaveAttribute('href', '/treinos/meus-videos')
  })

  it('estado vazio leva aos treinos', async () => {
    abrir('/treinos/meus-videos', { 'GET /api/treinos/meus-videos/': { corpo: [] } })
    expect(await screen.findByRole('heading', { name: 'Nenhum vídeo enviado' })).toBeVisible()
    expect(screen.getByRole('link', { name: 'Consultar treinos' })).toHaveAttribute('href', '/treinos')
  })

  it('permite tentar de novo quando a lista falha', async () => {
    const { pessoa } = abrir('/treinos/meus-videos', {
      'GET /api/treinos/meus-videos/': [{ corpo: { detail: 'Erro', code: 'ERRO' }, status: 500 }, { corpo: [] }],
    })
    expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível carregar seus vídeos')
    await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByRole('heading', { name: 'Nenhum vídeo enviado' })).toBeVisible()
  })
})
