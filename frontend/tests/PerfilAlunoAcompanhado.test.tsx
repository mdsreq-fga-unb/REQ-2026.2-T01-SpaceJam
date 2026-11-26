
import { render, screen, waitFor } from '@testing-library/react'
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
) {
  tokenStorage.set('token-teste')

  const requisicoes = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(usuario), { status: 200 }),
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
  })

  it('não consulta uma API inexistente ao receber um ID real', async () => {
    const requisicoes = abrirComSessao('/treinador/alunos/123')

    expect(
      await screen.findByText('Os dados deste aluno não estão disponíveis no momento.'),
    ).toBeTruthy()

    expect(
      screen.queryByText('Beatriz Costa'),
    ).toBeNull()

    // Apenas /auth/me/ é consultado para restaurar a sessão.
    expect(requisicoes).toHaveBeenCalledTimes(1)
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
