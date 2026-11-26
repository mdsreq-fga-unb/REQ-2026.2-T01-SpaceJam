
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import { PerfilAlunoAcompanhado } from '../src/features/treinador/PerfilAlunoAcompanhado'
import type { Usuario } from '../src/types/usuario'

const treinador: Usuario = {
  id: 1,
  apelido: 'lucas',
  first_name: 'Lucas',
  last_name: 'Treinador',
  email: 'lucas@example.invalid',
  telefone: '',
  papel: 'TREINADOR',
  termos_pendentes: false,
}

function abrirComSessao(
  caminho: string,
  usuario: Usuario = treinador,
  responder?: (url: string, opcoes?: RequestInit) => Response | undefined,
) {
  tokenStorage.set('token-teste')

  const requisicoes = vi.fn(async (url: string, opcoes?: RequestInit) =>
    responder?.(url, opcoes) ?? (url.includes('/api/contas/alunos/')
      ? new Response(JSON.stringify({ detail: 'Aluno não encontrado' }), { status: 404 })
      : new Response(JSON.stringify(usuario), { status: 200 })),
  )

  vi.stubGlobal('fetch', requisicoes)
  window.history.replaceState({}, '', caminho)

  render(<App />)

  return requisicoes
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('US61 — Consultar perfil de aluno acompanhado', () => {
  it('apresenta os dados do aluno recebidos pelo componente', () => {
    render(
      <PerfilAlunoAcompanhado
        treinador={treinador}
        aluno={{
          nome: 'Beatriz Costa',
          apelido: 'beatriz.costa',
          email: 'beatriz@example.invalid',
          dataNascimento: '2003-04-12',
          altura: '1.72',
          peso: '68',
          envergadura: '1.75',
          frequenciaSemanal: 3,
          objetivos: 'Melhorar o arremesso',
          historicoLesoes: [],
          planejamentoAtual: null,
        }}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Beatriz Costa' }),
    ).toBeTruthy()

    expect(screen.getByText('12/04/2003')).toBeTruthy()
    expect(screen.getByText('172 cm')).toBeTruthy()
    expect(screen.getByText('68 kg')).toBeTruthy()
    expect(screen.getByText('175 cm')).toBeTruthy()
    expect(screen.getByText('3 dias por semana')).toBeTruthy()

    expect(
      screen.getByText('Nenhuma lesão registrada.'),
    ).toBeTruthy()
  })

  it('não inventa informações quando não recebeu dados', () => {
    render(<PerfilAlunoAcompanhado treinador={treinador} />)

    expect(
      screen.getByText('Os dados deste aluno não estão disponíveis no momento.'),
    ).toBeTruthy()

    expect(
      screen.queryByText('Nenhuma lesão registrada.'),
    ).toBeNull()

    expect(
      screen.getByText(
        'Histórico ainda não disponível para consulta.',
      ),
    ).toBeTruthy()
  })

  it('permite a prévia somente ao treinador autenticado', async () => {
    const requisicoes = abrirComSessao(
      '/treinador/alunos/previa',
    )

    expect(
      await screen.findByRole('heading', {
        name: 'Beatriz Costa',
      }),
    ).toBeTruthy()

    expect(
      screen.getByText(/Modo de demonstração: dados ilustrativos/i),
    ).toBeTruthy()

    expect(requisicoes).toHaveBeenCalledTimes(1)
  })

  it('não permite que um aluno abra a rota do treinador', async () => {
    abrirComSessao('/treinador/alunos/previa', {
      ...treinador,
      id: 2,
      first_name: 'Aluno',
      last_name: 'Teste',
      papel: 'ALUNO',
    })

    await waitFor(() => {
      expect(window.location.pathname).toBe('/')
    })

    expect(
      screen.queryByRole('heading', {
        name: 'Beatriz Costa',
      }),
    ).toBeNull()
    expect(screen.queryByRole('button', { name: 'Registrar lesão' })).toBeNull()
  })

  it('não consulta uma API inexistente ao receber um ID real', async () => {
    const requisicoes = abrirComSessao('/treinador/alunos/123')

    expect(
      await screen.findByText('Os dados deste aluno não estão disponíveis no momento.'),
    ).toBeTruthy()

    expect(
      screen.queryByText('Beatriz Costa'),
    ).toBeNull()

    // /auth/me/ restaura a sessão; /contas/alunos/:id/ consulta o perfil real.
    await waitFor(() => expect(requisicoes).toHaveBeenCalledTimes(2))
    expect(requisicoes.mock.calls[1][0]).toBe('/api/contas/alunos/123/')
  })

  it('exige renovação dos termos antes de exibir o perfil', async () => {
    abrirComSessao('/treinador/alunos/previa', {
      ...treinador,
      termos_pendentes: true,
    })

    expect(
      await screen.findByRole('heading', {
        name: 'Termos e privacidade',
      }),
    ).toBeTruthy()

    expect(
      screen.queryByRole('heading', {
        name: 'Beatriz Costa',
      }),
    ).toBeNull()
  })
})

describe('US11 — Registrar lesão no perfil de um aluno', () => {
  const rotaPerfil = '/treinador/alunos/21'
  const rotaLesoes = '/api/contas/alunos/21/lesoes/'
  const perfil = {
    id: 21, first_name: 'Beatriz', last_name: 'Costa', apelido: 'bia',
    email: 'bia@example.invalid', historico_lesoes: [{ id: 8, descricao: 'Registro anterior.' }],
  }

  async function abrirFormulario(resposta: Response) {
    const requisicoes = abrirComSessao(rotaPerfil, treinador, url => {
      if (url === '/api/contas/alunos/21/') return Response.json(perfil)
      if (url === rotaLesoes) return resposta
    })
    const pessoa = userEvent.setup()
    await pessoa.click(await screen.findByRole('button', { name: 'Registrar lesão' }))
    const campo = await screen.findByRole('textbox', { name: /descrição da lesão/i })
    return { requisicoes, pessoa, campo }
  }

  it('bloqueia descrição inválida e inclui o registro devolvido pela API no histórico', async () => {
    const { requisicoes, pessoa, campo } = await abrirFormulario(
      Response.json({ id: 9, descricao: 'Entorse no tornozelo.', criado_em: '2026-11-26T18:00:00Z' }, { status: 201 }),
    )

    await pessoa.type(campo, '   ')
    await pessoa.click(screen.getByRole('button', { name: /salvar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Informe a descrição da lesão')
    expect(campo).toHaveAttribute('aria-invalid', 'true')

    fireEvent.change(campo, { target: { value: 'a'.repeat(301) } })
    await pessoa.click(screen.getByRole('button', { name: /salvar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('300 caracteres')
    expect(requisicoes.mock.calls.some(([url]) => url === rotaLesoes)).toBe(false)

    fireEvent.change(campo, { target: { value: '  Entorse no tornozelo.  ' } })
    await pessoa.click(screen.getByRole('button', { name: /salvar/i }))
    const historico = await screen.findByRole('region', { name: 'Histórico de lesões' })
    const lista = within(historico).getByRole('list')
    expect(within(lista).getAllByRole('listitem').map(item => item.textContent)).toEqual([
      'Entorse no tornozelo.',
      'Registro anterior.',
    ])
    expect(within(historico).getByRole('status')).toHaveTextContent('Lesão registrada.')
    expect(requisicoes).toHaveBeenCalledWith(rotaLesoes, expect.objectContaining({
      method: 'POST', body: '{"descricao":"Entorse no tornozelo."}',
    }))
  })

  it('mantém a descrição para corrigir ou tentar novamente quando a API recusa', async () => {
    const { pessoa, campo } = await abrirFormulario(
      Response.json({ descricao: ['Descrição recusada pela API.'] }, { status: 400 }),
    )
    await pessoa.type(campo, 'Descrição para revisar.')
    await pessoa.click(screen.getByRole('button', { name: /salvar/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Descrição recusada pela API.')
    expect(campo).toHaveValue('Descrição para revisar.')
    await pessoa.click(screen.getByRole('button', { name: 'Cancelar' }))
    const historico = screen.getByRole('region', { name: 'Histórico de lesões' })
    expect(within(historico).getByText('Registro anterior.')).toBeInTheDocument()
    expect(within(historico).queryByText('Lesão registrada.')).toBeNull()
  })
})
