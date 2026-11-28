import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { consultarMeusDados, type DadosCadastraisApi } from '../api/integracaoUs'
import type { Usuario } from '../types/usuario'

import { useAuth } from '../auth/useAuth'
import { LayoutTreinador } from '../features/treinador/LayoutTreinador'
import './InicioPage.css'
import { MinhaContaAluno } from '../features/alunos/MinhaContaAluno'

export function InicioPage() {
  const { usuario, logout } = useAuth()
  const navegar = useNavigate()
  const [dadosRemotos, setDadosRemotos] = useState<{ usuarioId: number; dados: DadosCadastraisApi } | null>(null)
  const [erroConsulta, setErroConsulta] = useState(false)

  useEffect(() => {
    if (usuario?.papel !== 'ALUNO' || usuario.termos_pendentes) return
    let ativo = true
    consultarMeusDados().then(dados => {
      if (ativo) { setDadosRemotos({ usuarioId: usuario.id, dados }); setErroConsulta(false) }
    }).catch(() => {
      if (ativo) setErroConsulta(true)
    })
    return () => { ativo = false }
  }, [usuario?.id, usuario?.papel, usuario?.termos_pendentes])

  const dadosValidos = dadosRemotos !== null && usuario?.id === dadosRemotos.usuarioId ? dadosRemotos.dados : null
  const dadosDoAluno: Usuario | null = usuario?.papel === 'ALUNO' && dadosValidos
    ? {
        ...usuario,
        first_name: dadosValidos.first_name,
        last_name: dadosValidos.last_name,
        apelido: dadosValidos.apelido,
        email: dadosValidos.email,
        telefone: dadosValidos.telefone ?? usuario.telefone,
        data_nascimento: dadosValidos.data_nascimento ?? usuario.data_nascimento,
        perfil_aluno: {
          altura: dadosValidos.altura ?? usuario.perfil_aluno?.altura ?? null,
          peso: dadosValidos.peso ?? usuario.perfil_aluno?.peso ?? null,
          envergadura: dadosValidos.envergadura ?? usuario.perfil_aluno?.envergadura ?? null,
          frequencia_semanal: dadosValidos.frequencia_semanal ?? usuario.perfil_aluno?.frequencia_semanal ?? null,
          objetivos: dadosValidos.objetivos ?? usuario.perfil_aluno?.objetivos ?? null,
        },
      }
    : usuario

  if (!usuario) return null

  // US53 — Consultar os próprios dados cadastrais; US07 — navegar para edição.
  if (usuario.papel === 'ALUNO') {
    return <>
      {erroConsulta && <p role="alert">Não foi possível atualizar os dados da conta. Exibindo informações da sessão.</p>}
      <MinhaContaAluno usuario={dadosDoAluno!} treinadorVinculado={dadosValidos?.treinador_vinculado ?? null} historicoLesoes={dadosValidos?.historico_lesoes} logout={logout} editarDados={() => navegar('/aluno/conta/editar')} trocarSenha={() => navegar('/conta/senha')} preferenciasPrivacidade={() => navegar('/conta/privacidade')} />
    </>
  }

  const nome = [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.apelido

  return (
    <LayoutTreinador nome={usuario.first_name || usuario.apelido} secao="Conta">
      <header className="sj52__intro">
        <div><h1>Minha conta</h1><p>{nome} · Treinador</p></div>
      </header>
      <div className="conta-treinador__grade">
        <section className="treinador-v2__cartao conta-treinador__bloco">
          <h2>Dados do cadastro</h2>
          <dl>
            <div><dt>Nome:</dt><dd>{nome}</dd></div>
            <div><dt>Apelido:</dt><dd>{usuario.apelido}</dd></div>
            {usuario.email && <div><dt>E-mail:</dt><dd>{usuario.email}</dd></div>}
            <div><dt>Telefone:</dt><dd>{usuario.telefone || 'Não informado'}</dd></div>
          </dl>
        </section>
        <section className="treinador-v2__cartao conta-treinador__bloco">
          <h2>Código para seus alunos</h2>
          {usuario.codigo_convite ? (
            <>
              <strong className="conta-treinador__codigo">{usuario.codigo_convite}</strong>
              <p>Compartilhe este código para vincular novos alunos à sua carteira.</p>
            </>
          ) : (
            <p>Código de convite indisponível no perfil.</p>
          )}
        </section>
        <section className="treinador-v2__cartao conta-treinador__bloco conta-treinador__cadastro">
          <h2>Cadastro único</h2>
          <p>A conta do treinador já está ativada. Novos cadastros de treinador estão encerrados.</p>
        </section>
      </div>
      <div className="conta-treinador__acoes">
        <button type="button" className="treinador-v2__botao treinador-v2__botao--principal" onClick={() => navegar('/treinador/alunos')}>Consultar alunos</button>
        <button type="button" className="treinador-v2__botao" onClick={() => navegar('/conta/privacidade')}>Preferências de privacidade</button>
        <button type="button" className="treinador-v2__botao" onClick={() => navegar('/conta/senha')}>Trocar senha</button>
        <button type="button" className="treinador-v2__botao" onClick={logout}>Sair da conta</button>
      </div>
    </LayoutTreinador>
  )
}
