export const escala = [
  { nota: 1, rotulo: 'Muito fácil' },
  { nota: 2, rotulo: 'Fácil' },
  { nota: 3, rotulo: 'Moderado' },
  { nota: 4, rotulo: 'Difícil' },
  { nota: 5, rotulo: 'Muito difícil' },
] as const

export type NotaDificuldade = typeof escala[number]['nota']

export interface FeedbackDeAluno {
  texto: string
  editado: boolean
}

export function CartaoDificuldade({ nota, titulo = 'Dificuldade' }: {
  nota: NotaDificuldade | null
  titulo?: string
}) {
  const selecao = escala.find(item => item.nota === nota)

  return (
    <section className="conta-aluno__cartao registros-cartao">
      <h2>{titulo}</h2>
      <p>{selecao ? selecao.nota + ' de 5 · ' + selecao.rotulo : 'Não registrada.'}</p>
    </section>
  )
}

export function CartaoFeedback({ feedback, aluno = false }: { feedback: FeedbackDeAluno | null; aluno?: boolean }) {
  const titulo = aluno ? 'Seu feedback' : 'Feedback do aluno'
  return (
    <section className="conta-aluno__cartao registros-cartao">
      <h2>{titulo}{feedback?.editado && ' · editado'}</h2>
      <p>{feedback?.texto || 'Nenhum feedback registrado.'}</p>
    </section>
  )
}
