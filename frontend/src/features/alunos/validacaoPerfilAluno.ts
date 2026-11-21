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
  first_name: string
  last_name: string
  apelido: string
  email: string
  telefone: string
  data_nascimento: string
  perfil_aluno: {
    altura: string
    peso: string
    envergadura: string
    frequencia_semanal: number
    objetivos: string
  }
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
  if (dados.telefone.trim() && (!/^[+\d\s()-]+$/.test(dados.telefone.trim()) || dados.telefone.trim().length > 20)) {
    erros.telefone = 'Informe um telefone válido de até 20 caracteres.'
  }
  const nascimento = dados.data_nascimento
  const data = /^\d{4}-\d{2}-\d{2}$/.test(nascimento) ? new Date(`${nascimento}T00:00:00Z`) : null
  if (!data || Number.isNaN(data.getTime()) || data.toISOString().slice(0, 10) !== nascimento) {
    erros.data_nascimento = 'Informe uma data de nascimento válida.'
  } else {
    const hoje = new Date()
    const hojeISO = [hoje.getFullYear(), String(hoje.getMonth() + 1).padStart(2, '0'), String(hoje.getDate()).padStart(2, '0')].join('-')
    if (nascimento >= hojeISO) erros.data_nascimento = 'A data deve ser anterior a hoje.'
  }
  const faixas = [
    ['altura_cm', 50, 260, 'altura'] as const,
    ['peso_kg', 20, 300, 'peso'] as const,
    ['envergadura_cm', 50, 280, 'envergadura'] as const,
  ]
  for (const [campo, minimo, maximo, rotulo] of faixas) {
    const n = numeroSeguro(dados[campo])
    if (!Number.isFinite(n) || n < minimo || n > maximo) {
      erros[campo] = `Informe ${rotulo} entre ${minimo} e ${maximo} ${campo === 'peso_kg' ? 'kg' : 'cm'}.`
    }
  }
  const frequencia = numeroSeguro(dados.frequencia_semanal)
  if (!Number.isInteger(frequencia) || frequencia < 1 || frequencia > 7) {
    erros.frequencia_semanal = 'Informe um número inteiro entre 1 e 7.'
  }
  if (!dados.objetivos.trim()) erros.objetivos = 'Descreva ao menos um objetivo pessoal.'
  else if (dados.objetivos.trim().length > 1500) erros.objetivos = 'Use no máximo 1500 caracteres.'
  return erros
}

/** Formato de envio proposto. A URL e o contrato de escrita devem ser aprovados pelo backend. */
export function dadosParaAtualizacao(dados: FormularioDadosAluno): AtualizacaoPerfilAluno {
  return {
    first_name: dados.first_name.trim(),
    last_name: dados.last_name.trim(),
    apelido: dados.apelido.trim(),
    email: dados.email.trim().toLowerCase(),
    telefone: dados.telefone.trim(),
    data_nascimento: dados.data_nascimento,
    perfil_aluno: {
      altura: (numeroSeguro(dados.altura_cm) / 100).toFixed(2),
      peso: numeroSeguro(dados.peso_kg).toFixed(2),
      envergadura: (numeroSeguro(dados.envergadura_cm) / 100).toFixed(2),
      frequencia_semanal: Number(dados.frequencia_semanal),
      objetivos: dados.objetivos.trim(),
    },
  }
}
