import { screen } from '@testing-library/react'
import { afterEach, expect, it } from 'vitest'
import { abrir } from './apoio'

afterEach(() => window.history.replaceState({}, '', '/'))

it('mostra ao treinador a dificuldade registrada e editada na prévia do aluno', async () => {
  const usuario = abrir('/previa/iteracao-4/registros')
  await usuario.click(await screen.findByRole('link', { name: 'Registrar ou editar dificuldade' }))
  await usuario.click(screen.getByRole('button', { name: 'Registrar dificuldade' }))
  await usuario.click(screen.getByRole('radio', { name: '4 · Difícil' }))
  await usuario.click(screen.getByRole('button', { name: 'Salvar nota' }))
  expect(await screen.findByText('4 de 5 · Difícil')).toBeVisible()
  await usuario.click(screen.getByRole('button', { name: 'Editar dificuldade' }))
  await usuario.click(screen.getByRole('radio', { name: '2 · Fácil' }))
  await usuario.click(screen.getByRole('button', { name: 'Salvar nota' }))
  expect(await screen.findByText('2 de 5 · Fácil')).toBeVisible()
  await usuario.click(screen.getByRole('button', { name: 'Voltar ao exercício' }))
  await usuario.click(screen.getByRole('link', { name: 'Consultar dificuldade e feedback' }))
  expect(screen.getByText('2 de 5 · Fácil')).toBeVisible()
  expect(screen.getByRole('heading', { name: 'Feedback do aluno · editado' })).toBeVisible()
  expect(screen.queryByRole('button', { name: /editar|excluir/i })).not.toBeInTheDocument()
})

it('permite manter a conta e simula a confirmação de exclusão separadamente', async () => {
  const usuario = abrir('/previa/iteracao-4/registros/exclusao')
  await usuario.click(await screen.findByRole('button', { name: 'Manter minha conta' }))
  expect(await screen.findByRole('heading', { name: 'Prévia da Iteração 4' })).toBeVisible()
  await usuario.click(screen.getByRole('link', { name: 'Solicitar exclusão dos dados' }))
  await usuario.click(screen.getByRole('button', { name: 'Confirmar exclusão dos meus dados' }))
  expect(await screen.findByRole('heading', { name: 'Solicitação registrada' })).toBeVisible()
  expect(screen.getByText('Esta é uma simulação.')).toBeVisible()
})
