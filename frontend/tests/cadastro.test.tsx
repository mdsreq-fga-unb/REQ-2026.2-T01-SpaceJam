import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { abrir, enviadosPara, simularApi } from './apoio'

afterEach(() => {
  vi.unstubAllGlobals()
  window.history.replaceState({}, '', '/')
})

describe('formulários de cadastro', () => {
  it('permite chegar ao cadastro do aluno a partir do login', async () => {
    const pessoa = abrir('/login')
    await pessoa.click(screen.getByText('Criar conta', { exact: true }))
    expect(await screen.findByRole('heading', { name: 'Cadastro', exact: true })).toBeTruthy()
    expect(screen.getByLabelText('Código do treinador')).toBeTruthy()
  })

  it('apresenta os dados do aluno e do vínculo previstos no requisito', () => {
    abrir('/cadastro/aluno')
    for (const nome of ['Nome', 'Sobrenome', 'Apelido', 'E-mail', 'Data de nascimento', 'Senha', 'Código do treinador',
      'Altura (cm)', 'Peso (kg)', 'Envergadura (cm)', 'Frequência de atividade física (dias por semana)', 'Objetivos']) {
      expect((screen.getByLabelText(nome, { exact: true }) as HTMLInputElement).required).toBe(true)
    }
  })

  it('apresenta os dados do treinador sem exigir as medidas do aluno', () => {
    abrir('/cadastro/treinador')
    expect(screen.getByRole('heading', { name: 'Cadastro', exact: true })).toBeTruthy()
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).type).toBe('email')
    expect(screen.getByLabelText('Telefone')).toBeTruthy()
    expect(screen.queryByLabelText('Código do treinador')).toBeNull()
    expect(screen.queryByLabelText('Altura (cm)')).toBeNull()
  })

  it('indica medidas inválidas e leva o foco ao primeiro campo com erro', async () => {
    const pessoa = abrir('/cadastro/aluno')
    await pessoa.type(screen.getByLabelText('Altura (cm)'), '0')
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(screen.getByLabelText('Altura (cm)').getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByRole('alert').textContent).toMatch(/campos/i)
    expect(document.activeElement).toBe(screen.getByLabelText('Nome', { exact: true }))
  })

  it('indica e-mail inválido sem apagar o que a pessoa digitou', async () => {
    const pessoa = abrir('/cadastro/treinador')
    await pessoa.type(screen.getByLabelText('E-mail'), 'email-sem-arroba')
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    const email = screen.getByLabelText('E-mail') as HTMLInputElement
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(email.value).toBe('email-sem-arroba')
  })

  it('não envia nem anuncia cadastro sem aceite dos termos', async () => {
    const requisicao = simularApi()
    const pessoa = abrir('/cadastro/treinador')
    for (const [campo, valor] of [
      ['Nome', 'Treinador'], ['Sobrenome', 'Teste'], ['Apelido', 'treinador.teste'],
      ['Telefone', '61999990000'], ['E-mail', 'treinador@example.com'], ['Senha', 'Senha#2026'],
      ['Código de ativação', 'codigo-teste'],
    ]) {
      await pessoa.type(screen.getByLabelText(campo, { exact: true }), valor)
    }
    await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
    expect(screen.getByText(/consulte e aceite/i)).toBeTruthy()
    expect(screen.queryByText(/cadastrado com sucesso/i)).toBeNull()
    expect(enviadosPara(requisicao, 'POST /api/auth/cadastro/treinador/')).toEqual([])
    expect(localStorage.length).toBe(0)
  })

  it('descarta os dados do formulário ao trocar o perfil de cadastro', async () => {
    const pessoa = abrir('/cadastro/aluno')
    await pessoa.type(screen.getByLabelText('Senha', { exact: true }), 'Senha#2026')
    await pessoa.click(screen.getByRole('link', { name: 'Treinador', exact: true }))
    expect(screen.getByLabelText('E-mail')).toBeTruthy()
    expect((screen.getByLabelText('Senha', { exact: true }) as HTMLInputElement).value).toBe('')
  })

  it('permite voltar do cadastro ao login', async () => {
    const pessoa = abrir('/cadastro/aluno')
    await pessoa.click(screen.getByRole('link', { name: 'Voltar ao login' }))
    expect(await screen.findByRole('heading', { name: 'Login', exact: true })).toBeTruthy()
  })
})


it('associa o erro de telefone ao campo e bloqueia cadastro sem enviar dados', async () => {
  const requisicao = simularApi()
  const pessoa = abrir('/cadastro/treinador')
  for (const [campo, valor] of [
    ['Nome', 'Treinador'], ['Sobrenome', 'Teste'], ['Apelido', 'treinador.teste'],
    ['Telefone', 'telefone'], ['E-mail', 'treinador@example.com'], ['Senha', 'Senha#2026'],
    ['Código de ativação', 'codigo-teste'],
  ]) await pessoa.type(screen.getByLabelText(campo, { exact: true }), valor)
  await pessoa.click(screen.getByRole('button', { name: 'Cadastre-se', exact: true }))
  const telefone = screen.getByLabelText('Telefone')
  expect(telefone.getAttribute('aria-invalid')).toBe('true')
  expect(telefone.getAttribute('aria-describedby')).toBe('cadastro-telefone-erro')
  expect(document.activeElement).toBe(telefone)
  expect(screen.getByRole('alert')).toBeTruthy()
  expect(enviadosPara(requisicao, 'POST /api/auth/cadastro/treinador/')).toEqual([])
})


it('mantém o perfil do treinador ao voltar do cadastro ao login', async () => {
  const pessoa = abrir('/cadastro/treinador')
  await pessoa.click(screen.getByRole('link', { name: 'Voltar ao login' }))
  expect(await screen.findByRole('heading', { name: 'Login', exact: true })).toBeTruthy()
  expect(screen.getByLabelText('E-mail')).toBeTruthy()
  expect(screen.queryByLabelText('Apelido')).toBeNull()
})
