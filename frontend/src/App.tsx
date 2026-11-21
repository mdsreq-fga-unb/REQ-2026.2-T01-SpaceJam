import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { AlunosAcompanhadosPage } from './features/treinador/AlunosAcompanhadosPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<Navigate to="/cadastro/aluno" replace />} />
          <Route path="/cadastro/aluno" element={<CadastroPage key="aluno" perfil="ALUNO" />} />
          <Route path="/cadastro/treinador" element={<CadastroPage key="treinador" perfil="TREINADOR" />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <InicioPage />
              </RotaProtegida>
            }
          />
          {/* US52 — Carteira de alunos acompanhados pelo treinador */}
          <Route
            path="/treinador/alunos"
            element={
              <RotaProtegida papel="TREINADOR">
                <AlunosAcompanhadosPage />
              </RotaProtegida>
            }
          />
          {/* Novas telas: crie em src/features/<area>/ e registre aqui */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
