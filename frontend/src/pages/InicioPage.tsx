import { useAuth } from '../auth/useAuth'

export function InicioPage() {
  const { usuario, logout } = useAuth()
  if (!usuario) return null

  return (
    <main className="card">
      <h1>Olá, {usuario.first_name || usuario.apelido}</h1>
      <p>
        Você entrou como <strong>{usuario.papel === 'TREINADOR' ? 'treinador' : 'aluno'}</strong>.
      </p>
      <button onClick={logout}>Sair</button>
    </main>
  )
}
