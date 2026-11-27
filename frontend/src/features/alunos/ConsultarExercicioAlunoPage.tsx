
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { consultarExercicio } from '../exercicios/exerciciosApi'
import type { Exercicio } from '../../types/exercicio'
import ExerciseDetails from '../exercicios/components/ExerciseDetails'

export function ConsultarExercicioAlunoPage() {
  const { exercicioId } = useParams()
  const [exercicio, setExercicio] = useState<Exercicio | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregarExercicio() {
      try {
        if (!exercicioId || !/^\d+$/.test(exercicioId)) {
          throw new Error('Identificador de exercício inválido.')
        }

        const resultado = await consultarExercicio(Number(exercicioId))

        if (ativo) setExercicio(resultado)
      } catch {
        if (ativo) setErro('Não foi possível carregar os dados deste exercício.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregarExercicio()

    return () => {
      ativo = false
    }
  }, [exercicioId])

  if (carregando) return <p>Carregando exercício...</p>

  if (erro || !exercicio) {
    return (
      <main>
        <h1>Exercício indisponível</h1>
        <p>{erro || 'Exercício não encontrado.'}</p>
        <Link to="/">Voltar ao início</Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">Voltar ao início</Link>
      <ExerciseDetails
        exercicio={exercicio}
        onEditar={() => {}}
        somenteConsulta
      />
    </main>
  )
}
