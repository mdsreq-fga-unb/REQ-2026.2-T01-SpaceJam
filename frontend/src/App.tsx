
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { PerfilAlunoAcompanhadoPage } from './features/treinador/PerfilAlunoAcompanhadoPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/cadastro"
            element={<Navigate to="/cadastro/aluno" replace />}
          />

          <Route
            path="/cadastro/aluno"
            element={<CadastroPage key="aluno" perfil="ALUNO" />}
          />

          <Route
            path="/cadastro/treinador"
            element={<CadastroPage key="treinador" perfil="TREINADOR" />}
          />

          <Route
            path="/"
            element={
              <RotaProtegida>
                <InicioPage />
              </RotaProtegida>
            }
          />

          {/* US61 — Perfil de aluno acompanhado */}
          <Route
            path="/treinador/alunos/:alunoId"
            element={
              <RotaProtegida papel="TREINADOR">
                <PerfilAlunoAcompanhadoPage />
              </RotaProtegida>
            }
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
