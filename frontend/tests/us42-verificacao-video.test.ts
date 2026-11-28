import { describe, expect, it } from 'vitest'
import { ApiError } from '../src/api/client'
import {
  LIMITE_BYTES, formatarDuracao, formatarTamanho, lerDuracao, verificarVideo,
} from '../src/features/videos/verificacaoVideo'
import { FalhaArmazenamento, FalhaConexao, classificarErro } from '../src/features/videos/videosApi'
import { arquivoMp4, bytesMp4 } from './us42-apoio'

describe('US42 — duração lida no cabeçalho do vídeo (RNF13)', () => {
  it.each([
    ['moov no início', {}],
    ['moov no fim (depois do mdat)', { moovNoFim: true }],
    ['mvhd versão 1', { versao: 1 as const }],
    ['MP4 fragmentado (mvex/mehd)', { fragmentado: true }],
  ])('lê a duração com %s', async (_, opcoes) => {
    expect(await lerDuracao(new Blob([bytesMp4(42.5, opcoes)]))).toBeCloseTo(42.5)
  })

  it('recusa um arquivo que não tem a estrutura MP4/MOV (ex.: .avi renomeado)', async () => {
    await expect(lerDuracao(new Blob([new TextEncoder().encode('RIFF....AVI LIST')]))).rejects.toThrow()
  })

  it('recusa um arquivo truncado', async () => {
    await expect(lerDuracao(new Blob([bytesMp4(10, { moovNoFim: true }).slice(0, -12)]))).rejects.toThrow()
  })
})

describe('US42 — verificação local antes de qualquer envio (RN09, RNF06, RNF15)', () => {
  it('aceita .mp4 de até 60 s e 50 MB e devolve tipo e duração para o servidor', async () => {
    const resultado = await verificarVideo(arquivoMp4('execucao.mp4', 42))
    expect(resultado).toMatchObject({ ok: true, tipo: 'video/mp4' })
    expect(resultado.ok && resultado.duracaoSegundos).toBeCloseTo(42)
  })

  it('usa a extensão quando o navegador não informa o tipo do .mov', async () => {
    expect(await verificarVideo(arquivoMp4('iphone.mov', 35, ''))).toMatchObject({ ok: true, tipo: 'video/quicktime' })
  })

  it('diz qual regra falhou e o valor encontrado (H9)', async () => {
    const resultado = await verificarVideo(arquivoMp4('quadra.mp4', 72))
    expect(resultado.ok).toBe(false)
    if (resultado.ok) return
    expect(resultado.motivo).toBe('O vídeo tem 1min12s, acima do limite de 60 segundos.')
    expect(resultado.regras).toEqual([
      expect.objectContaining({ regra: 'formato', ok: true, valor: 'MP4' }),
      expect.objectContaining({ regra: 'duracao', ok: false, valor: '1min12s' }),
      expect.objectContaining({ regra: 'tamanho', ok: true }),
    ])
  })

  it('recusa acima de 50 MB', async () => {
    const resultado = await verificarVideo(arquivoMp4('jogada_4k.mp4', 48, 'video/mp4', LIMITE_BYTES + 1))
    expect(resultado).toMatchObject({ ok: false, motivo: expect.stringContaining('acima do limite de 50 MB') })
  })

  it('recusa formato não aceito sem tentar ler o arquivo', async () => {
    const resultado = await verificarVideo(new File(['x'], 'aquecimento.avi', { type: 'video/x-msvideo' }))
    expect(resultado).toMatchObject({ ok: false, motivo: 'O formato do arquivo não é aceito.' })
    expect(!resultado.ok && resultado.regras[0]).toMatchObject({ ok: false, valor: 'AVI' })
  })

  it('recusa um .mp4 ilegível', async () => {
    const resultado = await verificarVideo(new File(['não é vídeo'], 'falso.mp4', { type: 'video/mp4' }))
    expect(resultado).toMatchObject({ ok: false, motivo: 'Não foi possível ler este vídeo.' })
  })

  it('formata duração e tamanho em pt-BR', () => {
    expect(formatarDuracao(42.4)).toBe('42 s')
    expect(formatarDuracao(60)).toBe('1min')
    expect(formatarDuracao(72)).toBe('1min12s')
    expect(formatarTamanho(28.5 * 1024 * 1024)).toBe('28,5 MB')
  })
})

describe('US42 — erros padronizados {detail, code} viram a tela certa', () => {
  const erroApi = (status: number, code?: string, detail = 'Mensagem do servidor.') =>
    new ApiError(status, detail, { detail: [detail] }, code)

  it.each([
    [erroApi(409, 'VIDEO_AVALIADO'), { tipo: 'bloqueado', mensagem: 'Mensagem do servidor.' }],
    [erroApi(409, 'TREINO_CONCLUIDO'), { tipo: 'bloqueado' }],
    [erroApi(400, 'ARQUIVO_INVALIDO'), { tipo: 'arquivo' }],
    [erroApi(401, 'NAO_AUTENTICADO'), { tipo: 'sessao' }],
    [erroApi(503, 'ARMAZENAMENTO_INDISPONIVEL'), { tipo: 'geral', mensagem: 'Mensagem do servidor.' }],
    [erroApi(400, 'COMPROVANTE_INVALIDO'), { tipo: 'geral' }],
    [erroApi(500, undefined, 'Erro 500'), { tipo: 'geral', mensagem: expect.stringContaining('servidor não respondeu') }],
    [new FalhaConexao(), { tipo: 'conexao' }],
    [new TypeError('Failed to fetch'), { tipo: 'conexao' }],
    [new FalhaArmazenamento(413), { tipo: 'arquivo' }],
    [new FalhaArmazenamento(500), { tipo: 'geral' }],
  ])('%s', (erro, esperado) => {
    expect(classificarErro(erro)).toMatchObject(esperado)
  })
})
