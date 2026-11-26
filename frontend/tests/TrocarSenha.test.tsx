import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TrocarSenha } from '../src/features/conta/TrocarSenha'
import { criteriosNovaSenha, prepararTrocaSenha, validarTrocaSenha } from '../src/features/conta/regrasTrocaSenha'
import type { Usuario } from '../src/types/usuario'

const aluno: Usuario = {
  id: 12, papel: 'ALUNO', apelido: 'atleta12', first_name: 'Camila', last_name: 'Silva',
  email: 'camila@example.com', telefone: '',
}
const validos = { senha_atual: 'Antiga#2026', nova_senha: 'Nova@1234', confirmar_senha: 'Nova@1234' }

function abrir(onTrocarSenha?: (dados: { senha_atual: string; nova_senha: string }) => Promise<void>, usuario=aluno) {
  const voltar = vi.fn()
  render(<TrocarSenha usuario={usuario} onVoltar={voltar} onTrocarSenha={onTrocarSenha} />)
  return { voltar }
}

async function preencher(dados=validos) {
  const user = userEvent.setup()
  for (const [chave, valor] of Object.entries(dados)) {
    const input = document.querySelector<HTMLInputElement>(`[name="${chave}"]`)
    if (!input) throw Error(`Campo ausente: ${chave}`)
    await user.type(input, valor)
  }
  return user
}

describe('US08 — Trocar senha (RF1108)', () => {
  it('não publica recados de desenvolvimento nem permite envio sem integração real', () => {
    abrir()
    expect(screen.getByRole('heading', { name: 'Trocar minha senha' })).toBeTruthy()
    expect(screen.queryByText(/funcionalidade em preparação|fictícias|US10|ainda não está disponível/i)).toBeNull()
    expect(screen.queryByRole('button', { name: 'Conferir campos' })).toBeNull()
    expect((screen.getByRole('button', { name: 'Alterar senha' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('mantém os três campos de senha ocultos por padrão e com autocomplete apropriado', () => {
    abrir()
    for (const campo of ['senha_atual', 'nova_senha', 'confirmar_senha']) {
      const input = document.querySelector<HTMLInputElement>(`[name="${campo}"]`)
      expect(input?.type).toBe('password')
      expect(input?.getAttribute('autocomplete')).toBe(campo === 'senha_atual' ? 'current-password' : 'new-password')
    }
  })

  it('permite exibir e voltar a ocultar apenas o campo escolhido', async () => {
    abrir()
    const user=userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Mostrar senha atual' }))
    expect(document.querySelector<HTMLInputElement>('[name="senha_atual"]')?.type).toBe('text')
    expect(document.querySelector<HTMLInputElement>('[name="nova_senha"]')?.type).toBe('password')
    await user.click(screen.getByRole('button', { name: 'Ocultar senha atual' }))
    expect(document.querySelector<HTMLInputElement>('[name="senha_atual"]')?.type).toBe('password')
  })

  it('foca o primeiro campo inválido e não chama a integração', async () => {
    const api = vi.fn()
    abrir(api)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Alterar senha' }))
    expect(document.activeElement).toBe(document.querySelector('[name="senha_atual"]'))
    expect(screen.getByRole('alert').textContent).toMatch(/campos destacados/i)
    expect(document.querySelector('[name="senha_atual"]')?.getAttribute('aria-invalid')).toBe('true')
    expect(api).not.toHaveBeenCalled()
  })

  it('rejeita menos de 6 caracteres e aceita senhas válidas sem números ou símbolos', () => {
    expect(validarTrocaSenha({ ...validos, nova_senha: 'Ab!2' }).nova_senha).toMatch(/6 caracteres/)
    expect(validarTrocaSenha({ ...validos, nova_senha: 'abcdef', confirmar_senha: 'abcdef' }).nova_senha).toBeUndefined()
    expect(validarTrocaSenha({ ...validos, nova_senha: 'SemNumero!', confirmar_senha: 'SemNumero!' }).nova_senha).toBeUndefined()
    expect(validarTrocaSenha({ ...validos, nova_senha: 'SemEspecial123', confirmar_senha: 'SemEspecial123' }).nova_senha).toBeUndefined()
  })

  it('rejeita nova senha igual à atual', () => {
    expect(validarTrocaSenha({ ...validos, nova_senha: validos.senha_atual, confirmar_senha: validos.senha_atual }).nova_senha).toMatch(/diferente/i)
  })

  it('rejeita confirmação diferente sem alterar o conteúdo inserido', () => {
    expect(validarTrocaSenha({ ...validos, confirmar_senha: 'Diferente@123' }).confirmar_senha).toMatch(/não coincidem/i)
  })

  it('conta caracteres Unicode corretamente na regra de comprimento', () => {
    expect(criteriosNovaSenha('Açúcar').comprimento).toBe(true)
    expect(criteriosNovaSenha('Ab!2').comprimento).toBe(false)
  })

  it('não remove espaços ou modifica senhas antes do envio', () => {
    expect(prepararTrocaSenha({ senha_atual: ' antiga#1 ', nova_senha: ' nova@2 ', confirmar_senha: ' nova@2 ' }))
      .toEqual({ senha_atual: ' antiga#1 ', nova_senha: ' nova@2 ', confirmacao_senha: ' nova@2 ' })
  })

  it('não fornece simulação de envio ou mensagem fictícia de sucesso', async () => {
    abrir()
    await preencher()
    expect((screen.getByRole('button', { name: 'Alterar senha' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText('Senha alterada com sucesso.')).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('encaminha somente as senhas esperadas quando callback real está presente', async () => {
    const api=vi.fn().mockResolvedValue(undefined)
    abrir(api)
    const user=await preencher()
    await user.click(screen.getByRole('button', { name: 'Alterar senha' }))
    await waitFor(() => expect(api).toHaveBeenCalledOnce())
    expect(api).toHaveBeenCalledWith({ senha_atual: 'Antiga#2026', nova_senha: 'Nova@1234', confirmacao_senha: 'Nova@1234' })
    expect(screen.getByText('Senha alterada com sucesso.')).toBeTruthy()
    expect((document.querySelector('[name="nova_senha"]') as HTMLInputElement).value).toBe('')
  })

  it('não anuncia sucesso quando o serviço falha', async () => {
    abrir(vi.fn().mockRejectedValue(new Error('serviço indisponível')))
    const user=await preencher()
    await user.click(screen.getByRole('button', { name: 'Alterar senha' }))
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining('Não foi possível confirmar'))
    expect(screen.queryByText('Senha alterada com sucesso.')).toBeNull()
  })

  it('evita duplo envio enquanto resposta de API está pendente', async () => {
    let resolver: (()=>void)|undefined
    const api=vi.fn().mockImplementation(()=>new Promise<void>(r=>{resolver=()=>r()}))
    abrir(api)
    const user=await preencher()
    const enviar=screen.getByRole('button', { name: 'Alterar senha' })
    await user.click(enviar)
    expect((enviar as HTMLButtonElement).disabled).toBe(true)
    expect(api).toHaveBeenCalledOnce()
    resolver?.()
    await waitFor(()=>expect(screen.getByRole('status').textContent).toMatch(/alterada com sucesso/i))
  })

  it('mantém a opção voltar e a navegação acessível por teclado', async () => {
    const { voltar }=abrir()
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' }).getAttribute('href')).toBe('#conteudo-us08')
    fireEvent.click(screen.getByRole('button', { name: 'Voltar à conta' }))
    expect(voltar).toHaveBeenCalledOnce()
  })

  it('identifica os requisitos sem rótulos técnicos e atualiza os indicadores de senha', async () => {
    abrir()
    expect(screen.getByText(/Pelo menos 6 caracteres/i)).toBeTruthy()
    expect(screen.queryByText(/Pendente/i)).toBeNull()
    const senha = document.querySelector<HTMLInputElement>('[name="nova_senha"]')
    if (!senha) throw Error('Campo de senha não encontrado')
    fireEvent.change(senha, { target: { value: 'Nova@1234' } })
    expect(document.querySelectorAll('.troca-senha__criterio--atendido')).toHaveLength(1)
  })
})
