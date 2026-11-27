import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EditarDadosAluno } from '../src/features/alunos/EditarDadosAluno'
import { MinhaContaAluno } from '../src/features/alunos/MinhaContaAluno'
import { dadosDoUsuario, dadosParaAtualizacao, validarDadosAluno } from '../src/features/alunos/validacaoPerfilAluno'
import type { Usuario } from '../src/types/usuario'

const usuario: Usuario = {
  id: 5, papel: 'ALUNO', apelido: 'beatriz.costa',
  first_name: 'Beatriz', last_name: 'Costa', email: 'beatriz@example.com', telefone: '61999990000',
  data_nascimento: '2003-04-12',
  perfil_aluno: { altura: '1.72', peso: '68.00', envergadura: '1.75', frequencia_semanal: 3, objetivos: 'Melhorar o arremesso' },
}

function renderizar(onSalvar?: (payload: ReturnType<typeof dadosParaAtualizacao>) => Promise<void>) {
  return render(<EditarDadosAluno usuario={usuario} onCancelar={vi.fn()} onSalvar={onSalvar} />)
}

describe('US07 — Editar informações do próprio perfil', () => {
  it('carrega os dados recebidos da sessão sem inventar informações', () => {
    renderizar()
    expect(screen.getByRole('heading', { name: 'Editar meus dados' })).toBeTruthy()
    expect((screen.getByRole('textbox', { name: 'Nome' }) as HTMLInputElement).value).toBe('Beatriz')
    expect((screen.getByLabelText(/Altura \(cm\)/i) as HTMLInputElement).value).toBe('172')
    expect((screen.getByLabelText(/Peso \(kg\)/i) as HTMLInputElement).value).toBe('68')
    expect((screen.getByLabelText(/Envergadura \(cm\)/i) as HTMLInputElement).value).toBe('175')
    expect((screen.getByLabelText(/Meus objetivos/i) as HTMLTextAreaElement).value).toBe('Melhorar o arremesso')
  })

  it('mantém os objetivos separados sem expor avisos internos', () => {
    const { container } = renderizar()
    expect(screen.getByRole('textbox', { name: 'Meus objetivos' }).closest('.editar-aluno__campo--objetivos')).toBeTruthy()
    expect(screen.queryByRole('heading', { name: 'Sobre a atualização dos dados' })).toBeNull()
    const salvar = screen.getByRole('button', { name: 'Salvar alterações' }) as HTMLButtonElement
    expect(salvar.disabled).toBe(true)
    expect(salvar.getAttribute('aria-describedby')).toBe('us07-salvamento-indisponivel')
    expect(screen.getByText('A atualização dos dados está indisponível no momento. Nenhuma alteração será salva.')).toBeTruthy()
    expect(container.querySelector('.editar-aluno__acoes')).toBeTruthy()
  })

  it('não apresenta uma confirmação enganosa sem integração de salvamento', () => {
    renderizar()
    expect((screen.getByRole('button', { name: 'Salvar alterações' }) as HTMLButtonElement).disabled).toBe(true)
    expect(screen.queryByRole('button', { name: 'Conferir preenchimento' })).toBeNull()
    expect(screen.queryByRole('status')).toBeNull()
  })

  it('mostra erros de dados incompletos e foca primeiro campo inválido', async () => {
    renderizar(vi.fn())
    const nome = screen.getByRole('textbox', { name: 'Nome' }) as HTMLInputElement
    fireEvent.change(nome, { target: { value: '   ' } })
    await userEvent.setup().click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(nome.getAttribute('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(nome)
    expect(screen.getByRole('alert')).toHaveProperty('textContent', expect.stringContaining('Confira os campos'))
  })

  it('converte centímetros em metros e vírgula para valores de API', () => {
    const dados = dadosDoUsuario(usuario)
    expect(dadosParaAtualizacao({ ...dados, altura_cm: '185', peso_kg: '80,5', envergadura_cm: '190', frequencia_semanal: '4' }))
      .toEqual({ nome: 'Beatriz', sobrenome: 'Costa', apelido: 'beatriz.costa', email: 'beatriz@example.com', telefone: '61999990000', altura: '1.85', peso: '80.50', envergadura: '1.90', objetivos: 'Melhorar o arremesso' })
  })

  it('exige intervalo coerente para frequência e medidas', () => {
    const dados = dadosDoUsuario(usuario)
    const erros = validarDadosAluno({ ...dados, altura_cm: '400', peso_kg: '5', envergadura_cm: 'foo', frequencia_semanal: '8' })
    expect(erros.altura_cm).toBeTruthy()
    expect(erros.peso_kg).toBeTruthy()
    expect(erros.envergadura_cm).toBeTruthy()
    expect(erros.frequencia_semanal).toBeUndefined() // não editável pela US07
  })

  it('rejeita data de nascimento impossível, e-mail incorreto e apelido com espaços', () => {
    const dados = dadosDoUsuario(usuario)
    const erros = validarDadosAluno({ ...dados, data_nascimento: '2003-02-30', email: 'sem-arroba', apelido: 'um apelido' })
    expect(erros.data_nascimento).toBeUndefined() // não editável pela US07
    expect(erros.email).toBeTruthy()
    expect(erros.apelido).toBeTruthy()
  })

  it('não pressupõe dados quando o perfil da API está ausente', () => {
    const dados = dadosDoUsuario({ ...usuario, perfil_aluno: null, data_nascimento: null })
    expect(dados.altura_cm).toBe('')
    expect(dados.frequencia_semanal).toBe('')
    expect(dados.objetivos).toBe('')
  })

  it('envia apenas através do callback fornecido pela integração', async () => {
    const salvar = vi.fn().mockResolvedValue(undefined)
    renderizar(salvar)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Salvar alterações' }))
    await waitFor(() => expect(salvar).toHaveBeenCalledOnce())
    expect(salvar.mock.calls[0][0].apelido).toBe('beatriz.costa')
    expect(salvar.mock.calls[0][0].altura).toBe('1.72')
    expect(await screen.findByText('Alterações salvas com sucesso.')).toBeTruthy()
  })

  it('não afirma que salvou se o callback falhar', async () => {
    const salvar = vi.fn().mockRejectedValue(new Error('sem conexão'))
    renderizar(salvar)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Salvar alterações' }))
    expect(await screen.findByRole('alert')).toHaveProperty('textContent', expect.stringContaining('Nenhuma alteração foi confirmada'))
    expect(screen.queryByText('Alterações salvas com sucesso.')).toBeNull()
  })

  it('valida o telefone editável e permite apagar o contato opcional', async () => {
    const salvar = vi.fn().mockResolvedValue(undefined)
    renderizar(salvar)
    const pessoa = userEvent.setup()
    const telefone = screen.getByLabelText('Telefone')
    const botao = screen.getByRole('button', { name: 'Salvar alterações' })

    expect(telefone).toBeEnabled()
    await pessoa.clear(telefone)
    await pessoa.type(telefone, 'ramal')
    await pessoa.click(botao)
    expect(telefone).toHaveAttribute('aria-invalid', 'true')
    expect(salvar).not.toHaveBeenCalled()

    await pessoa.clear(telefone)
    await pessoa.click(botao)
    await waitFor(() => expect(salvar).toHaveBeenCalledWith(expect.objectContaining({ telefone: '' })))
  })

  it('mantém a navegação da US53 compatível com os testes existentes', () => {
    const editar = vi.fn()
    const logout = vi.fn()
    render(<MinhaContaAluno usuario={usuario} logout={logout} editarDados={editar} />)
    fireEvent.click(screen.getByRole('button', { name: 'Editar meus dados' }))
    expect(editar).toHaveBeenCalledOnce()
  })

  it('tem atalho de navegação e rótulos explícitos nos campos', () => {
    const { container } = renderizar()
    expect(screen.getByRole('link', { name: 'Pular para o conteúdo principal' }).getAttribute('href')).toBe('#conteudo-us07')
    expect(container.querySelector('main#conteudo-us07')?.getAttribute('tabindex')).toBe('-1')
    expect(screen.getByLabelText(/Data de nascimento/i)).toBeTruthy()
    expect(screen.getByLabelText(/Telefone/i)).toBeTruthy()
  })
})
