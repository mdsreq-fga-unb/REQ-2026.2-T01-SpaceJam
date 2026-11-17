import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import BibliotecaExercicios from './features/exercicios/BibliotecaExercicios'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <InicioPage />
              </RotaProtegida>
            }
          />
                    <Route
            path="/exercicios"
            element={
              <RotaProtegida papel="TREINADOR">
                <BibliotecaExercicios />
              </RotaProtegida>
            }
          />
          {/* Novas telas: crie em src/features/<area>/ e registre aqui */}
          <Route path="*" element={<Navigate to="/exercicios" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
