import { screen } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { tokenStorage } from '../src/api/client'
import { abrir, enviadosPara, simularApi } from './apoio'

const usuario = { id: 2, papel: 'ALUNO', first_name: 'Ana', apelido: 'ana', termos_pendentes: false }

afterEach(() => {
  tokenStorage.clear()
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

it('registra e edita a dificuldade do item sem precisar marcar o treino inteiro como feito', async () => {
  tokenStorage.set('sessao-de-teste')
  const endpoint = '/api/treinos/exercicios/8/dificuldade/'
  const fetch = simularApi({
    'GET /api/auth/me/': { corpo: usuario },
    'GET /api/treinos/7/': { corpo: {
      alunoId: 2, nome: 'Controle de bola', treinadorNome: 'Lucas', statusSlug: 'em-andamento',
      exercicios: [{ id: 8, nome: 'Drible', parametros: '3 séries', orientacoes: '', dificuldade: null, feedback: null }],
    } },
    ['POST ' + endpoint]: { status: 201, corpo: { nota: 4 } },
    ['PATCH ' + endpoint]: { corpo: { nota: 2 } },
  })
  const pessoa = abrir('/treinos/7')
  await pessoa.click(await screen.findByRole('button', { name: 'Ver exercício: Drible' }))
  await pessoa.click(screen.getByRole('button', { name: 'Registrar dificuldade' }))
  expect(screen.getByText('Ao salvar, você confirma que realizou este exercício.')).toBeVisible()
  await pessoa.click(screen.getByRole('radio', { name: '4 · Difícil' }))
  await pessoa.click(screen.getByRole('button', { name: 'Salvar nota' }))
  expect(await screen.findByText('4 de 5 · Difícil')).toBeVisible()
  await pessoa.click(screen.getByRole('button', { name: 'Editar dificuldade' }))
  await pessoa.click(screen.getByRole('radio', { name: '2 · Fácil' }))
  await pessoa.click(screen.getByRole('button', { name: 'Salvar nota' }))
  expect(await screen.findByText('2 de 5 · Fácil')).toBeVisible()
  expect(enviadosPara(fetch, 'POST ' + endpoint)).toEqual([{ nota: 4 }])
  expect(enviadosPara(fetch, 'PATCH ' + endpoint)).toEqual([{ nota: 2 }])
})

it('mostra a rejeição da senha e só encerra a sessão após confirmar a exclusão pela API', async () => {
  tokenStorage.set('sessao-de-teste', 'renovacao-de-teste')
  const rota = 'POST /api/auth/excluir-conta/'
  const fetch = simularApi({
    'GET /api/auth/me/': { corpo: usuario },
    [rota]: [
      { status: 400, corpo: { senha_atual: ['A senha atual está incorreta.'] } },
      { corpo: { protocolo: 'EXC-20261128-12345678' } },
    ],
  })
  const pessoa = abrir('/conta/privacidade')
  await pessoa.click(await screen.findByRole('link', { name: 'Excluir meus dados' }))
  const senha = await screen.findByLabelText('Senha atual')
  await pessoa.type(senha, 'Senha-incorreta')
  await pessoa.click(screen.getByRole('button', { name: 'Confirmar exclusão dos meus dados' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('A senha atual está incorreta.')
  expect(tokenStorage.get()).toBe('sessao-de-teste')
  await pessoa.clear(senha)
  await pessoa.type(senha, 'Senha-de-teste')
  await pessoa.click(screen.getByRole('button', { name: 'Confirmar exclusão dos meus dados' }))
  expect(await screen.findByText(/EXC-20261128-12345678/)).toBeVisible()
  expect(tokenStorage.get()).toBeNull()
  expect(tokenStorage.getRefresh()).toBeNull()
  expect(enviadosPara(fetch, rota)).toEqual([
    { senha_atual: 'Senha-incorreta', confirmado: true },
    { senha_atual: 'Senha-de-teste', confirmado: true },
  ])
})
