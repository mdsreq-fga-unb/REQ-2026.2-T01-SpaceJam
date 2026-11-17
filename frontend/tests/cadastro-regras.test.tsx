import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import App from '../src/App'
import { validarCadastro } from '../src/features/acesso/cadastro'

afterEach(() => window.history.replaceState({}, '', '/'))

describe('cadastros conforme RN24 e RN25', () => {
  it('solicita e-mail e nascimento do aluno em vez de contato genérico', () => {
    window.history.replaceState({}, '', '/cadastro/aluno')
    render(<App />)
    expect((screen.getByLabelText('E-mail') as HTMLInputElement).type).toBe('email')
    expect((screen.getByLabelText('Data de nascimento') as HTMLInputElement).type).toBe('date')
    expect(screen.queryByLabelText('Contato')).toBeNull()
  })

  it('solicita código de ativação do treinador', () => {
    window.history.replaceState({}, '', '/cadastro/treinador')
    render(<App />)
    expect((screen.getByLabelText('Código de ativação') as HTMLInputElement).required).toBe(true)
  })

  it.each(['ALUNO', 'TREINADOR'] as const)('recusa senha menor que seis caracteres no perfil %s', perfil => {
    expect(validarCadastro(perfil, { senha: '12345' }).senha).toBeTruthy()
    expect(validarCadastro(perfil, { senha: '123456' }).senha).toBeUndefined()
  })

  it.each(['0', '8', '1.5', '2,5', 'texto'])('recusa frequência semanal %s', frequencia => {
    expect(validarCadastro('ALUNO', { frequencia }).frequencia).toBeTruthy()
  })

  it.each(['1', '7'])('aceita frequência semanal %s', frequencia => {
    expect(validarCadastro('ALUNO', { frequencia }).frequencia).toBeUndefined()
  })

  it.each(['2026-02-30', '9999-01-01', 'data inválida'])('recusa nascimento inválido %s', dataNascimento => {
    expect(validarCadastro('ALUNO', { dataNascimento }).dataNascimento).toBeTruthy()
  })

  it('aceita data de nascimento válida', () => {
    expect(validarCadastro('ALUNO', { dataNascimento: '2008-02-29' }).dataNascimento).toBeUndefined()
  })
})


describe('formato básico de telefone do treinador', () => {
  it.each(['telefone', '61abc9999', '+--', '61/9999'])('recusa telefone malformado %s', telefone => {
    expect(validarCadastro('TREINADOR', { telefone }).telefone).toBeTruthy()
  })

  it.each(['61999990000', '(61) 99999-0000', '+1 (415) 555-0123', '+351 912 345 678'])('preserva formatos usuais %s', telefone => {
    expect(validarCadastro('TREINADOR', { telefone }).telefone).toBeUndefined()
  })
})
