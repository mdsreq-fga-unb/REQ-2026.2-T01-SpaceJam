import type { Usuario } from '../../types/usuario'

export interface FormularioDadosAluno {
  first_name: string
  last_name: string
  apelido: string
  email: string
  telefone: string
  data_nascimento: string
  altura_cm: string
  peso_kg: string
  envergadura_cm: string
  frequencia_semanal: string
  objetivos: string
}

export type CampoDadosAluno = keyof FormularioDadosAluno
export type ErrosDadosAluno = Partial<Record<CampoDadosAluno, string>>

export interface AtualizacaoPerfilAluno {
  nome: string
  sobrenome: string
  apelido: string
  email: string
  altura: string
  peso: string
  envergadura: string
  objetivos: string
}

function numeroSeguro(valor: string) {
  const normalizado = valor.trim().replace(',', '.')
  return /^\d+(\.\d+)?$/.test(normalizado) ? Number(normalizado) : NaN
}

function emCentimetros(metros: string | number | null | undefined) {
  if (metros == null || metros === '') return ''
  const n = Number(metros)
  return Number.isFinite(n) ? String(Number((n * 100).toFixed(2))).replace('.', ',') : ''
}

function formatarPeso(valor: string | number | null | undefined) {
  if (valor == null || valor === '') return ''
  const n = Number(valor)
  return Number.isFinite(n) ? String(n).replace('.', ',') : ''
}

export function dadosDoUsuario(usuario: Usuario): FormularioDadosAluno {
  return {
    first_name: usuario.first_name || '',
    last_name: usuario.last_name || '',
    apelido: usuario.apelido || '',
    email: usuario.email || '',
    telefone: usuario.telefone || '',
    data_nascimento: usuario.data_nascimento || '',
    altura_cm: emCentimetros(usuario.perfil_aluno?.altura),
    peso_kg: formatarPeso(usuario.perfil_aluno?.peso),
    envergadura_cm: emCentimetros(usuario.perfil_aluno?.envergadura),
    frequencia_semanal: usuario.perfil_aluno?.frequencia_semanal?.toString() || '',
    objetivos: usuario.perfil_aluno?.objetivos || '',
  }
}

export function validarDadosAluno(dados: FormularioDadosAluno): ErrosDadosAluno {
  const erros: ErrosDadosAluno = {}
  for (const campo of ['first_name', 'last_name', 'apelido'] as const) {
    if (!dados[campo].trim()) erros[campo] = 'Preencha este campo.'
    else if (dados[campo].trim().length > 150) erros[campo] = 'Use no máximo 150 caracteres.'
  }
  if (dados.apelido.trim() && /\s/.test(dados.apelido)) {
    erros.apelido = 'O apelido não pode conter espaços.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email.trim()) || dados.email.length > 254) {
    erros.email = 'Informe um e-mail válido.'
  }
  const faixas = [
    ['altura_cm', 50, 260, 'altura'] as const,
    ['peso_kg', 20, 300, 'peso'] as const,
    ['envergadura_cm', 50, 260, 'envergadura'] as const,
  ]
  for (const [campo, minimo, maximo, rotulo] of faixas) {
    const n = numeroSeguro(dados[campo])
    if (!Number.isFinite(n) || n < minimo || n > maximo) {
      erros[campo] = `Informe ${rotulo} entre ${minimo} e ${maximo} ${campo === 'peso_kg' ? 'kg' : 'cm'}.`
    }
  }
  if (!dados.objetivos.trim()) erros.objetivos = 'Descreva ao menos um objetivo pessoal.'
  else if (dados.objetivos.trim().length > 500) erros.objetivos = 'Use no máximo 500 caracteres.'
  return erros
}

/** Campos efetivamente autorizados pelo contrato PATCH /contas/me/editar/. */
export function dadosParaAtualizacao(dados: FormularioDadosAluno): AtualizacaoPerfilAluno {
  return {
    nome: dados.first_name.trim(),
    sobrenome: dados.last_name.trim(),
    apelido: dados.apelido.trim(),
    email: dados.email.trim().toLowerCase(),
    altura: (numeroSeguro(dados.altura_cm) / 100).toFixed(2),
    peso: numeroSeguro(dados.peso_kg).toFixed(2),
    envergadura: (numeroSeguro(dados.envergadura_cm) / 100).toFixed(2),
    objetivos: dados.objetivos.trim(),
  }
}
