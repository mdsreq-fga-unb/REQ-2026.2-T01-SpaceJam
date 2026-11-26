import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ApiError } from '../src/api/client'
import { SolicitarRecuperacaoSenha } from '../src/features/conta/SolicitarRecuperacaoSenha'
import { RedefinirSenha } from '../src/features/conta/RedefinirSenha'
import { RecuperarSenhaPage } from '../src/features/conta/RecuperarSenhaPage'
import { RedefinirSenhaPage } from '../src/features/conta/RedefinirSenhaPage'
import {
  normalizarEmail, prepararRedefinicao, validarEmailRecuperacao, validarRedefinicao,
} from '../src/features/conta/regrasRecuperacaoSenha'

function abrirSolicitacao(onSolicitar?: (email: string) => Promise<void>) {
  render(<MemoryRouter><SolicitarRecuperacaoSenha onSolicitar={onSolicitar} /></MemoryRouter>)
}

function abrirRedefinicao(token: string, onRedefinir?: (dados: { token: string; nova_senha: string }) => Promise<void>) {
  render(<MemoryRouter><RedefinirSenha token={token} onRedefinir={onRedefinir} /></MemoryRouter>)
}

async function preencherNovasSenhas(nova = 'senhaNova', confirmar = nova) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Nova senha'), nova)
  await user.type(screen.getByLabelText('Confirmar nova senha'), confirmar)
  return user
}

describe('US10 — Recuperar senha (RF1110)', () => {
  it('não simula envio de e-mail quando não existe callback de API', () => {
    abrirSolicitacao()
    expect(screen.getByRole('heading', { name: 'Recuperar senha' })).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Enviar instruções' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText(/você receberá instruções/i)).toBeNull()
  })

  it('valida e-mail vazio, malformado e comprido', () => {
    expect(validarEmailRecuperacao('')).toMatch(/informe/i)
    expect(validarEmailRecuperacao('invalido')).toMatch(/válido/i)
    expect(validarEmailRecuperacao(`${'a'.repeat(250)}@exemplo.com`)).toBeTruthy()
    expect(validarEmailRecuperacao('pessoa@example.com')).toBeNull()
  })

  it('remove espaços do e-mail e mantém o retorno ao login', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)
    abrirSolicitacao(callback)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('E-mail'), '  Pessoa@Exemplo.com  ')
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }))
    await waitFor(() => expect(callback).toHaveBeenCalledWith('pessoa@exemplo.com'))
    expect(normalizarEmail('  PESSOA@EXEMPLO.COM  ')).toBe('pessoa@exemplo.com')
    expect(screen.getByRole('link', { name: 'Voltar ao login' }).getAttribute('href')).toBe('/login')
  })

  it('foca o e-mail inválido e não chama o serviço', async () => {
    const callback = vi.fn()
    abrirSolicitacao(callback)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Enviar instruções' }))
    expect(document.activeElement).toBe(screen.getByLabelText('E-mail'))
    expect(screen.getByLabelText('E-mail').getAttribute('aria-invalid')).toBe('true')
    expect(callback).not.toHaveBeenCalled()
  })

  it('mostra mensagem genérica idêntica para qualquer e-mail depois de resposta bem-sucedida', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)
    abrirSolicitacao(callback)
    await userEvent.setup().type(screen.getByLabelText('E-mail'), 'naoexiste@example.com')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Enviar instruções' }))
    const status = await screen.findByRole('status')
    expect(status.textContent).toMatch(/se houver uma conta associada/i)
    expect(status.textContent).not.toMatch(/enviado com sucesso|conta encontrada|conta inexistente/i)
  })

  it('não afirma que enviou e-mail se o serviço falhar', async () => {
    abrirSolicitacao(vi.fn().mockRejectedValue(new Error('falha do serviço')))
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('E-mail'), 'pessoa@example.com')
    await user.click(screen.getByRole('button', { name: 'Enviar instruções' }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/não foi possível/i)
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('evita duas solicitações simultâneas', async () => {
    let resolver: (() => void) | undefined
    const callback = vi.fn().mockImplementation(() => new Promise<void>(resolve => { resolver = resolve }))
    abrirSolicitacao(callback)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('E-mail'), 'pessoa@example.com')
    const botao = screen.getByRole('button', { name: 'Enviar instruções' })
    await user.dblClick(botao)
    expect(callback).toHaveBeenCalledOnce()
    expect((botao as HTMLButtonElement).disabled).toBe(true)
    resolver?.()
    await screen.findByRole('status')
  })

  it('preserva o retorno ao login do treinador', () => {
    render(<MemoryRouter initialEntries={['/recuperar-senha?perfil=treinador']}><RecuperarSenhaPage /></MemoryRouter>)
    expect(screen.getByRole('link', { name: 'Voltar ao login' }).getAttribute('href')).toBe('/login?perfil=treinador')
  })

  it('mostra orientação segura para link ausente, sem formulário', () => {
    abrirRedefinicao('')
    expect(screen.getByRole('alert').textContent).toMatch(/inválido/i)
    expect(screen.getByRole('link', { name: 'Solicitar outro link' }).getAttribute('href')).toBe('/recuperar-senha')
    expect(screen.queryByRole('button', { name: 'Redefinir senha' })).toBeNull()
  })

  it('não simula redefinição sem API conectada', () => {
    abrirRedefinicao('token-de-teste')
    expect((screen.getByRole('button', { name: 'Redefinir senha' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByText(/sua senha foi redefinida/i)).toBeNull()
  })

  it('respeita RN24: aceita seis caracteres sem exigir números ou símbolos', () => {
    expect(validarRedefinicao({ nova_senha: 'abcdef', confirmar_senha: 'abcdef' })).toEqual({})
    expect(validarRedefinicao({ nova_senha: 'abcde', confirmar_senha: 'abcde' }).nova_senha).toMatch(/6 caracteres/i)
    expect(validarRedefinicao({ nova_senha: 'abcdef', confirmar_senha: 'abcdeg' }).confirmar_senha).toMatch(/não coincidem/i)
  })

  it('destaca e foca o primeiro erro antes de enviar', async () => {
    const callback = vi.fn()
    abrirRedefinicao('token-de-teste', callback)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Redefinir senha' }))
    expect(document.activeElement).toBe(screen.getByLabelText('Nova senha'))
    expect(screen.getByLabelText('Nova senha').getAttribute('aria-invalid')).toBe('true')
    expect(callback).not.toHaveBeenCalled()
  })

  it('não altera senhas nem envia o campo de confirmação', async () => {
    const callback = vi.fn().mockResolvedValue(undefined)
    abrirRedefinicao('token-privado', callback)
    const user = await preencherNovasSenhas('abcdef', 'abcdef')
    await user.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    await waitFor(() => expect(callback).toHaveBeenCalledWith({ token: 'token-privado', nova_senha: 'abcdef', confirmacao_senha: 'abcdef' }))
    expect(prepararRedefinicao('token', { nova_senha: ' abcdef ', confirmar_senha: ' abcdef ' }))
      .toEqual({ token: 'token', nova_senha: ' abcdef ', confirmacao_senha: ' abcdef ' })
    expect((await screen.findByRole('status')).textContent).toMatch(/senha foi redefinida/i)
    expect(screen.queryByLabelText('Nova senha')).toBeNull()
  })

  it('oferece nova solicitação quando o backend recusa token expirado ou usado', async () => {
    abrirRedefinicao('token-expirado', vi.fn().mockRejectedValue(new ApiError(410, 'Expired')))
    const user = await preencherNovasSenhas()
    await user.click(screen.getByRole('button', { name: 'Redefinir senha' }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/expirou|utilizado/i)
    expect(screen.getByRole('link', { name: 'Solicitar outro link' })).toBeTruthy()
    expect(screen.queryByText(/senha foi redefinida/i)).toBeNull()
  })

  it('mantém os campos ocultos e permite exibir cada senha separadamente', async () => {
    abrirRedefinicao('token-de-teste', vi.fn())
    const nova = screen.getByLabelText('Nova senha') as HTMLInputElement
    const confirmacao = screen.getByLabelText('Confirmar nova senha') as HTMLInputElement
    expect(nova.type).toBe('password')
    expect(confirmacao.type).toBe('password')
    await userEvent.setup().click(screen.getByRole('button', { name: 'Mostrar nova senha' }))
    expect(nova.type).toBe('text')
    expect(confirmacao.type).toBe('password')
  })

  it('retira o token da URL sem expô-lo na interface', async () => {
    function Endereco() {
      const local = useLocation()
      return (
        <output
          data-testid="endereco"
          data-token-no-historico={typeof local.state?.tokenRecuperacao === 'string'}
        >
          {local.search}
        </output>
      )
    }
    render(<MemoryRouter initialEntries={['/recuperar-senha/redefinir?token=segredo&origem=email']}>
      <RedefinirSenhaPage />
      <Endereco />
    </MemoryRouter>)
    await waitFor(() => expect(screen.getByTestId('endereco').textContent).not.toContain('token='))
    expect(screen.getByTestId('endereco').textContent).toContain('origem=email')
    expect(screen.getByTestId('endereco').getAttribute('data-token-no-historico')).toBe('true')
    expect(screen.getByRole('heading', { name: 'Definir nova senha' })).toBeTruthy()
    expect(screen.queryByText('segredo')).toBeNull()
  })

  it('reabre o formulário ao restaurar o token do histórico após recarregar', () => {
    render(
      <MemoryRouter initialEntries={[{
        pathname: '/recuperar-senha/redefinir',
        state: { tokenRecuperacao: 'token-do-historico' },
      }]}>
        <RedefinirSenhaPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Definir nova senha' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Redefinir senha' })).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('mantém o foco acessível e não coloca mensagem interna da US na interface', () => {
    abrirSolicitacao()
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' }).getAttribute('href')).toBe('#conteudo-recuperacao')
    expect(screen.queryByText(/US10|API pendente|em preparação/i)).toBeNull()
    fireEvent.blur(screen.getByLabelText('E-mail'))
    expect(screen.getByText('Informe seu e-mail.')).toBeTruthy()
  })
})
