import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import { enviadosPara, simularApi } from './apoio'
import {
  EnvioSimulado, alunoMe, arquivoEnviado, arquivoMp4, feedbackLucas, simularEnvioAoStorage, situacao, solicitacaoAceita, treino, video,
} from './us42-apoio'

const UPLOAD_URL = 'POST /api/treinos/exercicios/42/video/upload-url/'
const CONFIRMAR = 'POST /api/treinos/exercicios/42/video/'

function abrir(caminho: string, rotas: Parameters<typeof simularApi>[0]) {
  tokenStorage.set('token-ficticio')
  const fetch = simularApi({ 'GET /api/auth/me/': alunoMe, ...rotas })
  window.history.replaceState({}, '', caminho)
  render(<App />)
  // applyAccept: false deixa testar arquivos que o seletor do sistema filtraria (.avi).
  return { fetch, pessoa: userEvent.setup({ applyAccept: false }) }
}

async function escolherArquivo(pessoa: ReturnType<typeof userEvent.setup>, arquivo: File) {
  await pessoa.upload(screen.getByTestId('seletor-arquivo'), arquivo)
}

beforeEach(() => simularEnvioAoStorage())

afterEach(() => {
  vi.unstubAllGlobals()
  tokenStorage.clear()
  window.history.replaceState({}, '', '/')
})

describe('US42 — cartão "Vídeo da execução" no exercício', () => {
  it('sem vídeo, mostra limites e "Enviar vídeo da execução"', async () => {
    abrir('/treinos/14?exercicio=42', { 'GET /api/treinos/14/': treino() })
    const cartao = await screen.findByRole('region', { name: 'Vídeo da execução' })
    expect(within(cartao).getByText(/Nenhum vídeo enviado\. Grave ou escolha um vídeo para Lucas/)).toBeVisible()
    expect(within(cartao).getByText(/MP4 ou MOV · até 60 segundos · até 50 MB/)).toBeVisible()
    expect(within(cartao).getByRole('link', { name: 'Enviar vídeo da execução' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video/enviar')
    expect(within(cartao).getByRole('link', { name: 'Meus vídeos' })).toHaveAttribute('href', '/treinos/meus-videos')
    expect(within(cartao).queryByRole('link', { name: 'Ver vídeo enviado' })).not.toBeInTheDocument()
    // O endereço é limpo: recarregar não reabre o exercício nem o aviso.
    await waitFor(() => expect(window.location.search).toBe(''))
  })

  it('com vídeo aguardando avaliação, oferece substituir (RN10/CA05)', async () => {
    abrir('/treinos/14?exercicio=42', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
    })
    const cartao = await screen.findByRole('region', { name: 'Vídeo da execução' })
    expect(within(cartao).getByText('Aguardando a avaliação de Lucas')).toBeVisible()
    expect(within(cartao).getByRole('link', { name: 'Substituir vídeo' })).toBeVisible()
    expect(within(cartao).getByRole('link', { name: 'Ver vídeo enviado' }))
      .toHaveAttribute('href', '/treinos/14/exercicios/42/video')
  })

  it('com vídeo avaliado, mostra o feedback e explica por que não dá para trocar', async () => {
    abrir('/treinos/14?exercicio=42', {
      'GET /api/treinos/14/': treino({
        videoExecucao: video({ status: 'AVALIADO', feedbackTreinador: feedbackLucas }), envioVideo: situacao.avaliado,
      }),
    })
    const cartao = await screen.findByRole('region', { name: 'Vídeo da execução' })
    expect(within(cartao).getByText('Avaliado por Lucas')).toBeVisible()
    expect(within(cartao).getByText(feedbackLucas.texto)).toBeVisible()
    expect(within(cartao).getByRole('note')).toHaveTextContent('Vídeo já avaliado')
    expect(within(cartao).getByRole('note')).toHaveTextContent('só é liberado se o exercício for devolvido para correção')
    expect(within(cartao).queryByRole('link', { name: /Substituir|Enviar/ })).not.toBeInTheDocument()
  })

  it('exercício devolvido libera "Enviar nova tentativa" (RN09/RN06)', async () => {
    abrir('/treinos/14?exercicio=42', {
      'GET /api/treinos/14/': treino({
        status: 'CORRIGIR', videoExecucao: video({ status: 'AVALIADO', feedbackTreinador: feedbackLucas }),
        envioVideo: situacao.novaTentativa,
      }),
    })
    const cartao = await screen.findByRole('region', { name: 'Vídeo da execução' })
    expect(within(cartao).getByText(/devolvido para correção/)).toBeVisible()
    expect(within(cartao).getByRole('link', { name: 'Enviar nova tentativa' })).toBeVisible()
  })

  it('para o treinador, só oferece assistir (CA04)', async () => {
    tokenStorage.set('token-ficticio')
    simularApi({
      'GET /api/auth/me/': { corpo: { id: 1, papel: 'TREINADOR', first_name: 'Lucas', termos_pendentes: false } },
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
    })
    window.history.replaceState({}, '', '/treinos/14?exercicio=42')
    render(<App />)
    const cartao = await screen.findByRole('region', { name: 'Vídeo da execução' })
    expect(within(cartao).getByRole('link', { name: 'Assistir ao vídeo do aluno' })).toBeVisible()
    expect(within(cartao).queryByRole('link', { name: /Substituir|Meus vídeos/ })).not.toBeInTheDocument()
  })
})

describe('US42 — envio do vídeo', () => {
  it('verifica no aparelho, mostra a prévia e só depois envia, confirma e avisa (CA01–CA03)', async () => {
    const { fetch, pessoa } = abrir('/treinos/14?exercicio=42', {
      'GET /api/treinos/14/': [treino(), treino(), treino({ videoExecucao: video(), envioVideo: situacao.substituicao })],
      [UPLOAD_URL]: solicitacaoAceita,
      [CONFIRMAR]: { corpo: { ...video(), modo: 'NOVO' }, status: 201 },
    })
    await pessoa.click(await screen.findByRole('link', { name: 'Enviar vídeo da execução' }))
    expect(await screen.findByRole('heading', { name: 'Enviar vídeo da execução' })).toHaveFocus()
    expect(screen.getByText('Só você e Lucas, seu treinador.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Escolher arquivo de vídeo' })).toBeVisible()

    // Vídeo longo demais: a tela diz qual regra falhou.
    await escolherArquivo(pessoa, arquivoMp4('treino_quadra.mp4', 72))
    expect(await screen.findByRole('heading', { name: 'Não foi possível usar este vídeo' })).toBeVisible()
    const alerta = screen.getByRole('alert')
    expect(alerta).toHaveTextContent('Duração até 60 segundos')
    expect(alerta).toHaveTextContent('1min12s')
    expect(within(alerta).getAllByRole('img', { name: 'Atende' })).toHaveLength(2)
    expect(within(alerta).getByRole('img', { name: 'Não atende' })).toBeVisible()

    // Vídeo válido: prévia local, ainda sem nenhuma chamada de envio (RNF15).
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    expect(await screen.findByRole('heading', { name: 'Confira antes de enviar' })).toBeVisible()
    expect(screen.getByLabelText('Prévia de execucao.mp4')).toHaveAttribute('src', 'blob:previa-local')
    expect(enviadosPara(fetch, UPLOAD_URL)).toHaveLength(0)

    await pessoa.click(screen.getByRole('button', { name: 'Confirmar envio' }))
    expect(await screen.findByText('Vídeo enviado. Lucas já pode assistir.')).toHaveAttribute('role', 'status')
    expect(screen.getByRole('heading', { name: 'Drible alternado' })).toBeVisible()
    expect(window.location.pathname).toBe('/treinos/14')

    const [pedido] = enviadosPara(fetch, UPLOAD_URL)
    expect(pedido).toMatchObject({ nomeArquivo: 'execucao.mp4', tipo: 'video/mp4' })
    expect(pedido.duracaoSegundos).toBeCloseTo(42)
    expect(enviadosPara(fetch, CONFIRMAR)).toEqual([{ comprovante: 'comprovante-assinado' }])
    const [envio] = EnvioSimulado.instancias
    expect(envio.metodo).toBe('PUT')
    expect(envio.url).toBe(solicitacaoAceita.corpo.urlUpload)
    expect(arquivoEnviado().type).toBe('video/mp4')
  })

  it('na substituição, compara o vídeo atual com o novo antes de confirmar (CA05)', async () => {
    const { pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
      [UPLOAD_URL]: { corpo: { ...solicitacaoAceita.corpo, modo: 'SUBSTITUICAO', substituiVideo: true } },
      [CONFIRMAR]: { corpo: { ...video({ substituido: true }), modo: 'SUBSTITUICAO' } },
    })
    expect(await screen.findByRole('heading', { name: 'Substituir vídeo' })).toBeVisible()
    expect(screen.getByText(/Ele só é trocado se o novo envio terminar/)).toBeVisible()

    await escolherArquivo(pessoa, arquivoMp4('nova-execucao.mov', 35, 'video/quicktime'))
    expect(await screen.findByRole('heading', { name: 'Revise a substituição' })).toBeVisible()
    expect(screen.getByText('Atual')).toBeVisible()
    expect(screen.getByText('nova-execucao.mov')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Manter vídeo atual' })).toHaveAttribute('href', '/treinos/14?exercicio=42')

    await pessoa.click(screen.getByRole('button', { name: 'Confirmar substituição' }))
    expect(await screen.findByText('Vídeo substituído. O anterior foi apagado.')).toBeVisible()
  })

  it('não deixa abrir o envio quando o servidor já bloqueou (RN10)', async () => {
    abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino({ videoExecucao: video({ status: 'AVALIADO' }), envioVideo: situacao.avaliado }),
    })
    expect(await screen.findByRole('heading', { name: 'Vídeo já avaliado' })).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('não pode mais ser substituído')
    expect(screen.queryByRole('button', { name: /Escolher/ })).not.toBeInTheDocument()
  })

  it('se a conexão cai, diz onde parou e reenvia o mesmo arquivo', async () => {
    simularEnvioAoStorage('queda')
    const { fetch, pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino(),
      [UPLOAD_URL]: solicitacaoAceita,
      [CONFIRMAR]: { corpo: { ...video(), modo: 'NOVO' }, status: 201 },
    })
    await screen.findByRole('heading', { name: 'Enviar vídeo da execução' })
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    await pessoa.click(await screen.findByRole('button', { name: 'Confirmar envio' }))

    expect(await screen.findByRole('heading', { name: 'O envio não foi concluído' })).toBeVisible()
    expect(screen.getByText(/A conexão caiu em 46%/)).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Nenhum vídeo foi salvo' })).toBeVisible()
    expect(enviadosPara(fetch, CONFIRMAR)).toHaveLength(0)

    EnvioSimulado.comportamento = 'sucesso'
    await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    expect(await screen.findByText('Vídeo enviado. Lucas já pode assistir.')).toBeVisible()
    expect(EnvioSimulado.instancias).toHaveLength(2)
    expect(arquivoEnviado(1).name).toBe('execucao.mp4')
  })

  it('mostra "Não foi possível concluir" quando o treinador avalia durante o envio (409)', async () => {
    const { pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino({ videoExecucao: video(), envioVideo: situacao.substituicao }),
      [UPLOAD_URL]: solicitacaoAceita,
      [CONFIRMAR]: {
        corpo: { detail: 'O treinador já avaliou este vídeo, então ele não pode mais ser substituído.', code: 'VIDEO_AVALIADO' },
        status: 409,
      },
    })
    await screen.findByRole('heading', { name: 'Substituir vídeo' })
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    await pessoa.click(await screen.findByRole('button', { name: 'Confirmar substituição' }))

    expect(await screen.findByRole('heading', { name: 'Não foi possível concluir' })).toBeVisible()
    expect(screen.getByText('O treinador já avaliou este vídeo, então ele não pode mais ser substituído.')).toBeVisible()
    expect(screen.getByRole('alert')).toHaveTextContent('A situação do exercício mudou')
    expect(screen.getByRole('alert')).toHaveTextContent('Seu vídeo atual continua salvo')
    expect(screen.queryByRole('button', { name: 'Tentar novamente' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar ao exercício' })).toBeVisible()
  })

  it('mostra "Não foi possível concluir" com nova tentativa quando o Storage está fora (503)', async () => {
    const { fetch, pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino(),
      [UPLOAD_URL]: {
        corpo: { detail: 'O envio de vídeos está indisponível no momento. Tente novamente mais tarde.', code: 'ARMAZENAMENTO_INDISPONIVEL' },
        status: 503,
      },
    })
    await screen.findByRole('heading', { name: 'Enviar vídeo da execução' })
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    await pessoa.click(await screen.findByRole('button', { name: 'Confirmar envio' }))

    expect(await screen.findByRole('heading', { name: 'Não foi possível concluir' })).toBeVisible()
    expect(screen.getByText(/indisponível no momento/)).toBeVisible()
    await pessoa.click(screen.getByRole('button', { name: 'Tentar novamente' }))
    await waitFor(() => expect(enviadosPara(fetch, UPLOAD_URL)).toHaveLength(2))
  })

  it('volta para a verificação quando o servidor recusa o arquivo real (ARQUIVO_INVALIDO)', async () => {
    const { pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino(),
      [UPLOAD_URL]: solicitacaoAceita,
      [CONFIRMAR]: { corpo: { detail: 'O vídeo deve ter no máximo 60 segundos.', code: 'ARQUIVO_INVALIDO' }, status: 400 },
    })
    await screen.findByRole('heading', { name: 'Enviar vídeo da execução' })
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    await pessoa.click(await screen.findByRole('button', { name: 'Confirmar envio' }))
    expect(await screen.findByRole('heading', { name: 'Não foi possível usar este vídeo' })).toBeVisible()
    expect(screen.getByText('O vídeo deve ter no máximo 60 segundos.')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Selecionar outro arquivo' })).toBeVisible()
  })

  it('cancelar pede confirmação, mantém o foco no diálogo e descarta o envio', async () => {
    simularEnvioAoStorage('pendente')
    const { fetch, pessoa } = abrir('/treinos/14/exercicios/42/video/enviar', {
      'GET /api/treinos/14/': treino(),
      [UPLOAD_URL]: solicitacaoAceita,
    })
    await screen.findByRole('heading', { name: 'Enviar vídeo da execução' })
    await escolherArquivo(pessoa, arquivoMp4('execucao.mp4', 42))
    await pessoa.click(await screen.findByRole('button', { name: 'Confirmar envio' }))
    expect(await screen.findByRole('heading', { name: 'Enviando vídeo…' })).toBeVisible()
    expect(await screen.findByRole('progressbar', { name: 'Progresso do envio' })).toHaveAttribute('value', '30')

    await pessoa.click(screen.getByRole('button', { name: 'Cancelar envio' }))
    const dialogo = screen.getByRole('alertdialog', { name: 'Cancelar o envio?' })
    expect(within(dialogo).getByRole('button', { name: 'Continuar enviando' })).toHaveFocus()
    await pessoa.keyboard('{Escape}')
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()

    await pessoa.click(screen.getByRole('button', { name: 'Cancelar envio' }))
    await pessoa.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancelar envio' }))
    expect(await screen.findByText('Envio cancelado. Nenhum vídeo foi salvo.')).toBeVisible()
    expect(enviadosPara(fetch, CONFIRMAR)).toHaveLength(0)
  })
})
