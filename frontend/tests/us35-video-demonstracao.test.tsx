import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import BibliotecaExercicios from '../src/features/exercicios/BibliotecaExercicios'
import VideoDemonstracaoExercicio from '../src/features/exercicios/VideoDemonstracaoExercicio'
import {
  atualizarInformacoesVideoBase,
  consultarExercicio,
} from '../src/features/exercicios/exerciciosApi'
import {
  LIMITE_DESCRICAO_VIDEO_BASE,
  LIMITE_TITULO_VIDEO_BASE,
  type Exercicio,
} from '../src/types/exercicio'

// US35 / RF2418 — tela "Vídeo de demonstração" (título e descrição do vídeo-base).

vi.mock('../src/features/exercicios/exerciciosApi', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/features/exercicios/exerciciosApi')>()),
  listarExercicios: vi.fn(async () => []),
  consultarExercicio: vi.fn(),
  atualizarInformacoesVideoBase: vi.fn(),
}))

const drible: Exercicio = {
  id: 1,
  nome: 'Drible com deslocamento',
  fundamento: 'Drible',
  objetivo: 'Conduzir a bola em movimento.',
  videoUrl: 'https://www.youtube.com/watch?v=exemplo',
  videoTitulo: 'Drible com deslocamento',
  videoDescricao: 'Observe a alternância das mãos e a direção do olhar.',
}

function Endereco() {
  return <div data-testid="endereco">{useLocation().pathname}</div>
}

function abrir(rota: string) {
  render(
    <MemoryRouter initialEntries={[rota]}>
      <Routes>
        <Route path="/exercicios/:exercicioId?" element={<BibliotecaExercicios />} />
        <Route path="/exercicios/:exercicioId/video-demonstracao" element={<VideoDemonstracaoExercicio />} />
      </Routes>
      <Endereco />
    </MemoryRouter>,
  )
  return userEvent.setup()
}

const titulo = () => screen.getByLabelText('Título') as HTMLInputElement
const descricao = () => screen.getByLabelText('Descrição') as HTMLTextAreaElement

beforeEach(() => {
  vi.mocked(consultarExercicio).mockReset().mockResolvedValue(drible)
  vi.mocked(atualizarInformacoesVideoBase).mockReset()
})

describe('US35 — navegação a partir do exercício', () => {
  it('o detalhe exibe título e descrição e abre a tela pelo botão "Vídeo de demonstração"', async () => {
    const pessoa = abrir('/exercicios/1')

    expect(await screen.findByRole('heading', { name: 'Sobre o vídeo' })).toBeInTheDocument()
    expect(screen.getByText('Observe a alternância das mãos e a direção do olhar.')).toBeInTheDocument()

    await pessoa.click(screen.getByRole('button', { name: 'Vídeo de demonstração' }))

    expect(screen.getByTestId('endereco')).toHaveTextContent('/exercicios/1/video-demonstracao')
    expect(await screen.findByRole('heading', { level: 1, name: 'Vídeo de demonstração' })).toBeInTheDocument()
  })

  it('o botão aparece mesmo sem vídeo-base (RN22)', async () => {
    vi.mocked(consultarExercicio).mockResolvedValue({ ...drible, videoUrl: undefined, videoTitulo: undefined, videoDescricao: undefined })
    abrir('/exercicios/1')

    expect(await screen.findByRole('button', { name: 'Vídeo de demonstração' })).toBeEnabled()
    expect(screen.queryByRole('heading', { name: 'Sobre o vídeo' })).not.toBeInTheDocument()
  })
})

describe('US35 — tela "Vídeo de demonstração"', () => {
  it('carrega os textos salvos, mostra os contadores e o quadro do vídeo vinculado', async () => {
    abrir('/exercicios/1/video-demonstracao')

    expect(await screen.findByText('Drible com deslocamento', { selector: 'header p' })).toBeInTheDocument()
    expect(titulo()).toHaveValue('Drible com deslocamento')
    expect(titulo()).toHaveAttribute('maxLength', String(LIMITE_TITULO_VIDEO_BASE))
    expect(descricao()).toHaveAttribute('maxLength', String(LIMITE_DESCRICAO_VIDEO_BASE))
    expect(screen.getByText(`23/${LIMITE_TITULO_VIDEO_BASE}`)).toBeInTheDocument()
    expect(screen.getByText('Vídeo-base vinculado a este exercício.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Assistir vídeo' })).toHaveAttribute('href', drible.videoUrl)
    expect(consultarExercicio).toHaveBeenCalledWith(1)
  })

  it('sem vídeo-base, informa e ainda permite preencher (RN22)', async () => {
    vi.mocked(consultarExercicio).mockResolvedValue({ ...drible, videoUrl: undefined, videoTitulo: undefined, videoDescricao: undefined })
    abrir('/exercicios/1/video-demonstracao')

    expect(await screen.findByText('Nenhum vídeo-base vinculado a este exercício.')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Assistir vídeo' })).not.toBeInTheDocument()
    expect(titulo()).toHaveValue('')
    expect(titulo()).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Salvar informações' })).toBeEnabled()
  })

  it('não exibe "Configurar miniatura" (US34, fora do escopo)', async () => {
    abrir('/exercicios/1/video-demonstracao')

    await screen.findByLabelText('Título')
    expect(screen.queryByRole('button', { name: /miniatura/i })).not.toBeInTheDocument()
  })

  it('CA01/CA02: salva os textos sem espaços nas pontas e confirma', async () => {
    vi.mocked(atualizarInformacoesVideoBase).mockResolvedValue({ ...drible, videoTitulo: 'Novo título', videoDescricao: undefined })
    const pessoa = abrir('/exercicios/1/video-demonstracao')
    await screen.findByLabelText('Título')

    await pessoa.clear(titulo())
    await pessoa.type(titulo(), '  Novo título  ')
    await pessoa.clear(descricao())
    await pessoa.click(screen.getByRole('button', { name: 'Salvar informações' }))

    expect(atualizarInformacoesVideoBase).toHaveBeenCalledWith(1, { videoTitulo: 'Novo título', videoDescricao: '' })
    expect(await screen.findByRole('status')).toHaveTextContent('Informações salvas.')
    expect(titulo()).toHaveValue('Novo título')
    expect(descricao()).toHaveValue('')
  })

  it('o contador acompanha a digitação', async () => {
    vi.mocked(consultarExercicio).mockResolvedValue({ ...drible, videoTitulo: undefined })
    const pessoa = abrir('/exercicios/1/video-demonstracao')
    await screen.findByLabelText('Título')

    await pessoa.type(titulo(), 'Drible')

    expect(screen.getByText(`6/${LIMITE_TITULO_VIDEO_BASE}`)).toBeInTheDocument()
  })

  it('erro de limite do backend aparece junto ao campo e mantém o texto digitado', async () => {
    vi.mocked(atualizarInformacoesVideoBase).mockRejectedValue(
      new ApiError(400, 'Erro', { video_titulo: ['Certifique-se de que este campo não tenha mais de 120 caracteres.'] }),
    )
    const pessoa = abrir('/exercicios/1/video-demonstracao')
    await screen.findByLabelText('Título')

    await pessoa.click(screen.getByRole('button', { name: 'Salvar informações' }))

    expect(await screen.findByText(/não tenha mais de 120 caracteres/)).toBeInTheDocument()
    expect(titulo()).toHaveAttribute('aria-invalid', 'true')
    expect(titulo()).toHaveValue('Drible com deslocamento')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('CA04: perfil sem permissão (403) vê a mensagem e os dados continuam na tela', async () => {
    vi.mocked(atualizarInformacoesVideoBase).mockRejectedValue(new ApiError(403, 'Proibido'))
    const pessoa = abrir('/exercicios/1/video-demonstracao')
    await screen.findByLabelText('Título')

    await pessoa.click(screen.getByRole('button', { name: 'Salvar informações' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Apenas treinadores podem acessar a biblioteca de exercícios.')
    expect(titulo()).toHaveValue('Drible com deslocamento')
  })

  it('cancelar volta ao exercício sem salvar', async () => {
    const pessoa = abrir('/exercicios/1/video-demonstracao')
    await screen.findByLabelText('Título')

    await pessoa.type(titulo(), ' alterado')
    await pessoa.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(atualizarInformacoesVideoBase).not.toHaveBeenCalled()
    expect(screen.getByTestId('endereco')).toHaveTextContent(/^\/exercicios\/1$/)
  })

  it('exercício inexistente (404) mostra o aviso e o caminho de volta', async () => {
    vi.mocked(consultarExercicio).mockRejectedValue(new ApiError(404, 'Não encontrado'))
    abrir('/exercicios/999/video-demonstracao')

    expect(await screen.findByRole('alert')).toHaveTextContent('Exercício não encontrado.')
    expect(screen.queryByLabelText('Título')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar ao exercício' })).toHaveAttribute('href', '/exercicios/999')
  })

  it('id inválido na rota não consulta a API', async () => {
    abrir('/exercicios/abc/video-demonstracao')

    expect(await screen.findByRole('alert')).toHaveTextContent('Exercício não encontrado.')
    expect(consultarExercicio).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'Voltar à biblioteca' })).toHaveAttribute('href', '/exercicios')
  })
})
