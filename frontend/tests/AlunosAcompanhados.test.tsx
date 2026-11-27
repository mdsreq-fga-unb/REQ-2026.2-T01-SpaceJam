import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { tokenStorage } from '../src/api/client'
import { AlunosAcompanhados } from '../src/features/treinador/AlunosAcompanhados'
import type { Usuario } from '../src/types/usuario'
import { MemoryRouter } from 'react-router'
import type { ComponentProps } from 'react'

const treinador: Usuario = {
  id: 1,
  apelido: 'lucas',
  first_name: 'Lucas',
  last_name: 'Treinador',
  email: 'lucas@example.invalid',
  telefone: '',
  papel: 'TREINADOR',
  codigo_convite: 'ABC123',
  termos_pendentes: false,
}

const atletas = [
  { id: 21, nome: 'Beatriz Costa', objetivo: 'Arremesso' },
  { id: 22, nome: 'André Lima', objetivo: 'Controle de bola' },
]

function componente(props: Partial<ComponentProps<typeof AlunosAcompanhados>> = {}) {
  return render(
    <MemoryRouter>
      <AlunosAcompanhados treinador={treinador} estado="pronto" alunos={atletas} {...props} />
    </MemoryRouter>,
  )
}

function abrirRota(rota: string, usuario: Usuario = treinador) {
  tokenStorage.set('token-teste')
  const requisicoes = vi.fn().mockResolvedValue(
    new Response(JSON.stringify(usuario), { status: 200 }),
  )
  vi.stubGlobal('fetch', requisicoes)
  window.history.replaceState({}, '', rota)
  render(<App />)
  return requisicoes
}

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
  Reflect.deleteProperty(window.navigator, 'clipboard')
})

describe('US52 — Consultar alunos acompanhados', () => {
  it('exibe apenas os alunos fornecidos e seus objetivos', () => {
    componente()
    const lista = screen.getByRole('region', { name: 'Alunos vinculados' })
    expect(within(lista).getByText('Beatriz Costa')).toBeTruthy()
    expect(within(lista).getByText('André Lima')).toBeTruthy()
    expect(within(lista).getByText('Arremesso')).toBeTruthy()
    expect(screen.getByLabelText('2 atletas')).toBeTruthy()
  })

  it('apresenta estado vazio sem inventar alunos', () => {
    componente({ alunos: [] })
    expect(screen.getByText('Nenhum aluno vinculado')).toBeTruthy()
    expect(screen.queryByText('Beatriz Costa')).toBeNull()
  })

  it('indica ausência de API sem afirmar que a carteira está vazia', () => {
    componente({ estado: 'aguardando-api', alunos: [] })
    expect(screen.getByText('Lista de alunos indisponível')).toBeTruthy()
    expect(screen.queryByText('Nenhum aluno vinculado')).toBeNull()
  })

  it('distingue carregamento e erro de uma lista vazia', () => {
    const tela = componente({ estado: 'carregando' })
    expect(screen.getByText('Carregando alunos…')).toBeTruthy()
    tela.rerender(
      <MemoryRouter>
        <AlunosAcompanhados treinador={treinador} estado="erro" />
      </MemoryRouter>,
    )
    expect(screen.getByRole('alert')).toHaveProperty('textContent', expect.stringContaining('Não foi possível consultar os alunos'))
  })

  it('não oferece um botão enganoso antes da integração da US61', () => {
    componente()
    expect(screen.queryByRole('button', { name: 'Ver perfil' })).toBeNull()
    expect(screen.queryByRole('link', { name: /Ver perfil de/i })).toBeNull()
    expect(screen.getAllByText('Em breve')).toHaveLength(2)
    expect(screen.getByText(/Perfil de Beatriz Costa indisponível até a integração da US61/i)).toBeTruthy()
  })

  it('oferece acesso ao conteúdo por teclado antes da navegação', () => {
    const tela = componente()
    const pular = screen.getByRole('link', { name: 'Pular para o conteúdo principal' })
    expect(pular.getAttribute('href')).toBe('#sj52-conteudo')
    expect(tela.container.querySelector('main#sj52-conteudo')?.getAttribute('tabindex')).toBe('-1')
  })

  it('dá nome acessível específico aos links de perfil quando integrados', () => {
    componente({ perfilIntegrado: true })
    expect(screen.getByRole('link', { name: 'Ver perfil de Beatriz Costa' }).getAttribute('href')).toBe('/treinador/alunos/21')
    expect(screen.getByRole('link', { name: 'Ver perfil de André Lima' }).getAttribute('href')).toBe('/treinador/alunos/22')
  })

  it('leva a opção Treinos do menu à lista de planejamentos (US27)', () => {
    componente()
    const treinos = screen.getAllByRole('link', { name: 'Treinos' })
    expect(treinos).toHaveLength(2)
    for (const elemento of treinos) expect(elemento.getAttribute('href')).toBe('/treinador/planejamentos')
  })

  it('copia somente o código real do treinador', async () => {
    const escrita = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      configurable: true,
      value: { writeText: escrita },
    })
    componente({ alunos: [] })
    fireEvent.click(screen.getByRole('button', { name: 'Copiar código' }))
    await waitFor(() => expect(escrita).toHaveBeenCalledWith('ABC123'))
    expect(await screen.findByText('Código copiado!')).toBeTruthy()
  })

  it('não deixa copiar o código fictício da prévia', () => {
    componente({ demonstracao: true })
    expect((screen.getByRole('button', { name: 'Copiar código' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.getByText(/Nenhum dado real de alunos foi consultado/i)).toBeTruthy()
  })

  it('reserva a prévia ao treinador autenticado', async () => {
    const requisicoes = abrirRota('/treinador/alunos?previa=1')
    expect(await screen.findByText('Beatriz Costa')).toBeTruthy()
    expect(screen.getByText(/Prévia visual com alunos/i)).toBeTruthy()
    // A prévia não consulta a carteira real.
    expect(requisicoes).toHaveBeenCalledTimes(1)
  })

  it('restringe a rota para usuários com papel ALUNO', async () => {
    abrirRota('/treinador/alunos?previa=1', { ...treinador, papel: 'ALUNO' })
    await waitFor(() => expect(window.location.pathname).toBe('/'))
    expect(screen.queryByText('Beatriz Costa')).toBeNull()
  })

  it('não exibe a lista antes do aceite de termos pendentes', async () => {
    abrirRota('/treinador/alunos?previa=1', { ...treinador, termos_pendentes: true })
    expect(await screen.findByRole('heading', { name: 'Termos e privacidade' })).toBeTruthy()
    expect(screen.queryByText('Beatriz Costa')).toBeNull()
  })
})
