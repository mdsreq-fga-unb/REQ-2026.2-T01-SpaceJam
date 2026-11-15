export type Papel = 'ALUNO' | 'TREINADOR'

export interface Usuario {
  id: number
  apelido: string
  first_name: string
  last_name: string
  email: string
  telefone: string
  papel: Papel
}
