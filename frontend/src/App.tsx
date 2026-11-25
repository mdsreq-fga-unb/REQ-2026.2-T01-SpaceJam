import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { EditarDadosAlunoPage } from './features/alunos/EditarDadosAlunoPage'
import { TrocarSenhaPage } from './features/conta/TrocarSenhaPage'
import { RecuperarSenhaPage } from './features/conta/RecuperarSenhaPage'
import { RedefinirSenhaPage } from './features/conta/RedefinirSenhaPage'
import { DocumentoLegalPage } from './features/termos/DocumentoLegalPage'
import { PreferenciasPrivacidadePage } from './features/conta/PreferenciasPrivacidadePage'

import { AlunosAcompanhadosPage } from './features/treinador/AlunosAcompanhadosPage'

import { PerfilAlunoAcompanhadoPage } from './features/treinador/PerfilAlunoAcompanhadoPage'
import BibliotecaExercicios from './features/exercicios/BibliotecaExercicios'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/recuperar-senha/redefinir" element={<RedefinirSenhaPage />} />
          <Route path="/cadastro" element={<Navigate to="/cadastro/aluno" replace />} />
          <Route path="/cadastro/aluno" element={<CadastroPage key="aluno" perfil="ALUNO" />} />
          <Route path="/cadastro/treinador" element={<CadastroPage key="treinador" perfil="TREINADOR" />} />
          {/* US63 — documentos públicos, acessíveis antes do login e com termos pendentes */}
          <Route path="/termos-de-uso" element={<DocumentoLegalPage key="termos" documento="termos" />} />
          <Route path="/politica-de-privacidade" element={<DocumentoLegalPage key="privacidade" documento="privacidade" />} />
          <Route
            path="/"
            element={
              <RotaProtegida>
                <InicioPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/aluno/conta/editar"
            element={
              <RotaProtegida papel="ALUNO">
                <EditarDadosAlunoPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/conta/senha"
            element={
              <RotaProtegida papel="ALUNO">
                <TrocarSenhaPage />
              </RotaProtegida>
            }
          />
          {/* US63 (CA04) — aluno e treinador */}
          <Route
            path="/conta/privacidade"
            element={
              <RotaProtegida>
                <PreferenciasPrivacidadePage />
              </RotaProtegida>
            }
          />
          <Route
            path="/treinador/alunos"
            element={
              <RotaProtegida papel="TREINADOR">
                <AlunosAcompanhadosPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/treinador/alunos/:alunoId"
            element={
              <RotaProtegida papel="TREINADOR">
                <PerfilAlunoAcompanhadoPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/exercicios/:exercicioId?"
            element={
              <RotaProtegida papel="TREINADOR">
                <BibliotecaExercicios />
              </RotaProtegida>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
