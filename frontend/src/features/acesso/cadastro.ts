import type { Papel } from '../../types/usuario'

export type CampoCadastro = 'nome' | 'sobrenome' | 'apelido' | 'telefone' |
  'email' | 'dataNascimento' | 'senha' | 'codigoTreinador' | 'codigoAtivacao' |
  'altura' | 'peso' | 'envergadura' | 'frequencia' | 'objetivos'

export type DadosCadastro = Partial<Record<CampoCadastro, string>>
export type ErrosCadastro = Partial<Record<CampoCadastro, string>>

export interface CampoFormulario {
  nome: CampoCadastro
  rotulo: string
  tipo?: 'email' | 'tel' | 'password' | 'date'
  autocomplete?: string
  decimal?: boolean
  inteiro?: boolean
  textoLongo?: boolean
}

const identidade: CampoFormulario[] = [
  { nome: 'nome', rotulo: 'Nome', autocomplete: 'given-name' },
  { nome: 'sobrenome', rotulo: 'Sobrenome', autocomplete: 'family-name' },
  { nome: 'apelido', rotulo: 'Apelido', autocomplete: 'username' },
]

export function gruposCadastro(perfil: Papel): { titulo: string; campos: CampoFormulario[] }[] {
  const senha: CampoFormulario = { nome: 'senha', rotulo: 'Senha', tipo: 'password', autocomplete: 'new-password' }
  if (perfil === 'TREINADOR') {
    return [{ titulo: 'Dados da conta', campos: [...identidade,
      { nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', autocomplete: 'tel' },
      { nome: 'email', rotulo: 'E-mail', tipo: 'email', autocomplete: 'email' }, senha,
      { nome: 'codigoAtivacao', rotulo: 'Código de ativação' },
    ] }]
  }
  return [
    { titulo: 'Dados da conta', campos: [...identidade,
      { nome: 'email', rotulo: 'E-mail', tipo: 'email', autocomplete: 'email' }, senha,
    ] },
    { titulo: 'Seu treinador', campos: [{ nome: 'codigoTreinador', rotulo: 'Código do treinador' }] },
    { titulo: 'Dados do aluno', campos: [
      { nome: 'dataNascimento', rotulo: 'Data de nascimento', tipo: 'date', autocomplete: 'bday' },
      { nome: 'altura', rotulo: 'Altura (cm)', decimal: true },
      { nome: 'peso', rotulo: 'Peso (kg)', decimal: true },
      { nome: 'envergadura', rotulo: 'Envergadura (cm)', decimal: true },
      { nome: 'frequencia', rotulo: 'Frequência de atividade física (dias por semana)', inteiro: true },
      { nome: 'objetivos', rotulo: 'Objetivos', textoLongo: true },
    ] },
  ]
}

export function validarCadastro(perfil: Papel, dados: DadosCadastro): ErrosCadastro {
  const erros: ErrosCadastro = {}
  for (const campo of gruposCadastro(perfil).flatMap(grupo => grupo.campos)) {
    const valor = dados[campo.nome]?.trim() ?? ''
    if (!valor) {
      erros[campo.nome] = 'Preencha este campo.'
    } else if (campo.tipo === 'email' && !/^[^\s@]+@[^\s@]+$/.test(valor)) {
      erros[campo.nome] = 'Informe um e-mail válido.'
    } else if (campo.tipo === 'tel' && (!/^\+?[\d\s().-]+$/.test(valor) || !/\d/.test(valor))) {
      erros[campo.nome] = 'Informe um telefone válido.'
    } else if (campo.nome === 'senha' && (dados.senha?.length ?? 0) < 6) {
      erros[campo.nome] = 'Use uma senha com pelo menos 6 caracteres.'
    } else if (campo.nome === 'frequencia' && !/^[1-7]$/.test(valor)) {
      erros[campo.nome] = 'Informe de 1 a 7 dias por semana.'
    } else if (campo.nome === 'dataNascimento') {
      const nascimento = new Date(`${valor}T00:00:00`)
      const [ano, mes, dia] = valor.split('-').map(Number)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(valor) || ano < 1 || Number.isNaN(nascimento.getTime())
        || nascimento.getFullYear() !== ano || nascimento.getMonth() !== mes - 1
        || nascimento.getDate() !== dia || nascimento > new Date()) {
        erros[campo.nome] = 'Informe uma data de nascimento válida, sem data futura.'
      }
    } else if (campo.decimal) {
      const numero = Number(valor.replace(',', '.'))
      if (!/^\d+(?:[.,]\d+)?$/.test(valor) || !Number.isFinite(numero) || numero <= 0) {
        erros[campo.nome] = 'Informe uma medida maior que zero.'
      }
    }
  }
  return erros
}

export function dadosParaApi(perfil: Papel, dados: DadosCadastro, aceite: boolean) {
  const texto = (campo: CampoCadastro) => dados[campo]?.trim() ?? ''
  const identidade = {
    nome: texto('nome'), sobrenome: texto('sobrenome'), apelido: texto('apelido'),
    email: texto('email'), senha: dados.senha ?? '', aceite_termos: aceite,
  }
  if (perfil === 'TREINADOR') return { ...identidade, telefone: texto('telefone'), codigo_ativacao: texto('codigoAtivacao') }
  return {
    ...identidade, codigo_treinador: texto('codigoTreinador'), data_nascimento: texto('dataNascimento'),
    altura: String(Number(texto('altura').replace(',', '.')) / 100),
    peso: texto('peso').replace(',', '.'),
    envergadura: String(Number(texto('envergadura').replace(',', '.')) / 100),
    frequencia_semanal: Number(texto('frequencia')), objetivos: texto('objetivos'),
  }
}

export const camposDaApi: Record<string, CampoCadastro> = {
  nome: 'nome', sobrenome: 'sobrenome', apelido: 'apelido', email: 'email', telefone: 'telefone',
  senha: 'senha', codigo_treinador: 'codigoTreinador', codigo_ativacao: 'codigoAtivacao',
  data_nascimento: 'dataNascimento', altura: 'altura', peso: 'peso', envergadura: 'envergadura',
  frequencia_semanal: 'frequencia', objetivos: 'objetivos',
}
