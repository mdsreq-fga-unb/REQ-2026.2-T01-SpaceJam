
export type Papel = 'ALUNO' | 'TREINADOR'

export interface PerfilAluno {
  altura: string | number | null
  peso: string | number | null
  envergadura: string | number | null
  frequencia_semanal: number | null
  objetivos: string | null
}

export interface Usuario {
  id: number
  apelido: string
  first_name: string
  last_name: string
  email: string
  telefone: string
  termos_pendentes?: boolean
  codigo_convite?: string | null
  papel: Papel

  data_nascimento?: string | null
  perfil_aluno?: PerfilAluno | null
}
