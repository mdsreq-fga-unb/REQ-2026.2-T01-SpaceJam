import { lazy, Suspense } from 'react'

import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './auth/AuthContext'
import { RotaProtegida } from './auth/RotaProtegida'
import { InicioPage } from './pages/InicioPage'
import { LoginPage } from './pages/LoginPage'
import { CadastroPage } from './pages/CadastroPage'
import { EditarDadosAlunoPage } from './features/alunos/EditarDadosAlunoPage'
import { MeuPlanejamentoPage } from './features/alunos/MeuPlanejamentoPage'
import { TrocarSenhaPage } from './features/conta/TrocarSenhaPage'
import { RecuperarSenhaPage } from './features/conta/RecuperarSenhaPage'
import { RedefinirSenhaPage } from './features/conta/RedefinirSenhaPage'
import { DocumentoLegalPage } from './features/termos/DocumentoLegalPage'
import { PreferenciasPrivacidadePage } from './features/conta/PreferenciasPrivacidadePage'
import { AlunosAcompanhadosPage } from './features/treinador/AlunosAcompanhadosPage'
import { PerfilAlunoAcompanhadoPage } from './features/treinador/PerfilAlunoAcompanhadoPage'
import BibliotecaExercicios from './features/exercicios/BibliotecaExercicios'
import VideoDemonstracaoExercicio from './features/exercicios/VideoDemonstracaoExercicio'
import ErrosOrientacoesExercicio from './features/exercicios/ErrosOrientacoesExercicio'
import ErroOrientacaoPage from './features/exercicios/ErroOrientacaoPage'
import RemoverErroOrientacaoPage from './features/exercicios/RemoverErroOrientacaoPage'
import { ConsultarExercicioAlunoPage } from './features/alunos/ConsultarExercicioAlunoPage'
import { TreinadorDetalhesPlanejamento } from './features/treinador/TreinadorDetalhesPlanejamento'
import { TreinadorPlanejamentosPage } from './features/treinador/TreinadorPlanejamentosPage'
import { TreinadorNovoPlanejamento } from './features/treinador/TreinadorNovoPlanejamento'
import { TreinadorNovoTreino } from './features/treinador/TreinadorNovoTreino'
import {TreinadorEditarPlanejamento, TreinadorPlanejamentosAnteriores, TreinadorEditarTreino,} from './features/treinador/TreinadorHistoriasComplementares'
import { TreinoPage } from './features/treinos/TreinoPage'
import { HistoricoTreinosPage } from './features/treinos/HistoricoTreinosPage'
import { AssociarErrosOrientacoesPage } from './features/exercicios/AssociarErrosOrientacoesPage'

const PreviaIteracao4 = import.meta.env.DEV ? lazy(() => import('./pages/PreviaIteracao4')) : null

const PreviaRegistrosIteracao4 = import.meta.env.DEV ? lazy(() => import('./pages/PreviaRegistrosIteracao4')) : null

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* US19 — Editar planejamento */}
          <Route
            path="/treinador/alunos/:alunoId/planejamento/:planejamentoId/editar"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorEditarPlanejamento />
              </RotaProtegida>
            }
          />

          {/* US21 — Consultar planejamentos anteriores */}
          <Route
            path="/treinador/alunos/:alunoId/planejamentos-anteriores"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorPlanejamentosAnteriores />
              </RotaProtegida>
            }
          />

          {/* US25 — Editar treino */}
          <Route
            path="/treinador/alunos/:alunoId/planejamento/:planejamentoId/treinos/:treinoId/editar"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorEditarTreino />
              </RotaProtegida>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
          <Route path="/recuperar-senha/redefinir" element={<RedefinirSenhaPage />} />
          <Route path="/redefinir-senha" element={<RedefinirSenhaPage />} />
          <Route path="/cadastro" element={<Navigate to="/cadastro/aluno" replace />} />
          <Route path="/cadastro/aluno" element={<CadastroPage key="aluno" perfil="ALUNO" />} />
          <Route path="/cadastro/treinador" element={<CadastroPage key="treinador" perfil="TREINADOR" />} />

          {/* US63 — documentos públicos */}
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

          {/* US18 - Planejamentos do treinador */}
          <Route
            path="/treinador/planejamentos"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorPlanejamentosPage />
              </RotaProtegida>
            }
          />

          {/* US18 - Criar planejamento */}
          <Route
            path="/treinador/novo-planejamento"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorNovoPlanejamento />
              </RotaProtegida>
            }
          />

          {/* US27 - Planejamento vigente do aluno */}
          <Route
            path="/treinador/alunos/:alunoId/planejamento"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorDetalhesPlanejamento />
              </RotaProtegida>
            }
          />

          {/* US24 - Criar treino */}
          <Route
            path="/treinador/alunos/:alunoId/planejamento/:planejamentoId/novo-treino"
            element={
              <RotaProtegida papel="TREINADOR">
                <TreinadorNovoTreino />
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
          {/* US60 — planejamento vigente do aluno */}
          <Route
            path="/treinos"
            element={
              <RotaProtegida papel="ALUNO">
                <MeuPlanejamentoPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/treinos/planejamento/:treinoId"
            element={
              <RotaProtegida papel="ALUNO">
                <MeuPlanejamentoPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/aluno/exercicios/:exercicioId"
            element={
              <RotaProtegida papel="ALUNO">
                <ConsultarExercicioAlunoPage />
              </RotaProtegida>
            }
          />
          <Route
            path="/conta/senha"
            element={
              <RotaProtegida>
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
          <Route path="/historico/:treinoId?" element={
            <RotaProtegida papel="ALUNO"><HistoricoTreinosPage /></RotaProtegida>
          } />
          <Route path="/treinador/alunos/:alunoId/historico/:treinoId?" element={
            <RotaProtegida papel="TREINADOR"><HistoricoTreinosPage /></RotaProtegida>
          } />
          <Route path="/exercicios/:exercicioId/erros-orientacoes/associar" element={
            <RotaProtegida papel="TREINADOR"><AssociarErrosOrientacoesPage /></RotaProtegida>
          } />
          {/* US37 — erros comuns e orientações corretivas do exercício */}
          <Route
            path="/exercicios/:exercicioId/erros-orientacoes"
            element={
              <RotaProtegida papel="TREINADOR">
                <ErrosOrientacoesExercicio />
              </RotaProtegida>
            }
          />
          <Route
            path="/exercicios/:exercicioId/erros-orientacoes/novo"
            element={
              <RotaProtegida papel="TREINADOR">
                <ErroOrientacaoPage key="novo" />
              </RotaProtegida>
            }
          />
          <Route
            path="/exercicios/:exercicioId/erros-orientacoes/:erroId/editar"
            element={
              <RotaProtegida papel="TREINADOR">
                <ErroOrientacaoPage key="editar" />
              </RotaProtegida>
            }
          />
          <Route
            path="/exercicios/:exercicioId/erros-orientacoes/:erroId/remover"
            element={
              <RotaProtegida papel="TREINADOR">
                <RemoverErroOrientacaoPage />
              </RotaProtegida>
            }
          />
          {/* US35 — título e descrição do vídeo-base do exercício */}
          <Route
            path="/exercicios/:exercicioId/video-demonstracao"
            element={
              <RotaProtegida papel="TREINADOR">
                <VideoDemonstracaoExercicio />
              </RotaProtegida>
            }
          />
          <Route path="/treinos/:treinoId" element={<RotaProtegida><TreinoPage /></RotaProtegida>} />
          {import.meta.env.DEV && PreviaIteracao4 && (
            <Route path="/previa/iteracao-4/:tela?/:treinoId?" element={
              <Suspense fallback={<p role="status">Carregando prévia...</p>}><PreviaIteracao4 /></Suspense>
            } />
          )}
          {import.meta.env.DEV && PreviaRegistrosIteracao4 && (
            <Route path="/previa/iteracao-4/registros/:tela?" element={
              <Suspense fallback={<p role="status">Carregando prévia...</p>}><PreviaRegistrosIteracao4 /></Suspense>
            } />
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
