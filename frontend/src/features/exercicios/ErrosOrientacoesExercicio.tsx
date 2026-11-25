import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router';
import estilos from './ErrosOrientacoes.module.css';
import botoes from './BibliotecaExercicios.module.css';
import { AuthContext } from '../../auth/contexto';
import { LayoutTreinador } from '../treinador/LayoutTreinador';
import type { Exercicio } from '../../types/exercicio';
import { consultarExercicio, mensagemDeErro } from './exerciciosApi';

// US37 — tela de erros comuns e orientações corretivas de um exercício.

export function idDeRotaValido(valor?: string) {
  return /^[1-9]\d*$/.test(valor ?? '') && Number.isSafeInteger(Number(valor));
}

function contagemDeItens(total: number) {
  if (total === 0) return 'Nenhum item cadastrado';
  return `${total === 1 ? '1 item' : `${total} itens`} · selecione um item para editar`;
}

function IconeMais() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconeAvancar() {
  return (
    <svg className={estilos.iconeAvancar} viewBox="0 0 16 16" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Botão de voltar no mesmo estilo do "Voltar à biblioteca" do detalhe do exercício. */
export const classeBotaoVoltar = `${botoes.voltar} ${estilos.voltarBotao}`;

export function IconeVoltar() {
  return (
    <svg className={estilos.iconeVoltar} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
      <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ErrosOrientacoesExercicio() {
  const treinador = useContext(AuthContext)?.usuario;
  const { exercicioId } = useParams();
  const local = useLocation();
  const navegar = useNavigate();
  // Aviso de sucesso vindo das telas de adicionar, editar ou remover. É lido uma vez e
  // retirado do histórico, para não reaparecer ao recarregar a página.
  const [aviso] = useState(() => (local.state as { aviso?: string } | null)?.aviso);
  useEffect(() => {
    if ((local.state as { aviso?: string } | null)?.aviso) {
      navegar(local.pathname, { replace: true, state: null });
    }
  }, [local, navegar]);
  const idValido = idDeRotaValido(exercicioId);
  const rotaNovo = `/exercicios/${exercicioId}/erros-orientacoes/novo`;
  const [estado, setEstado] = useState<{ id: string; exercicio?: Exercicio; erro?: string } | null>(null);

  useEffect(() => {
    if (!exercicioId || !idValido) return;
    let ativo = true;
    consultarExercicio(Number(exercicioId))
      .then((exercicio) => { if (ativo) setEstado({ id: exercicioId, exercicio }); })
      .catch((falha: unknown) => { if (ativo) setEstado({ id: exercicioId, erro: mensagemDeErro(falha) }); });
    return () => { ativo = false; };
  }, [exercicioId, idValido]);

  const atual = estado?.id === exercicioId ? estado : null;
  const erro = idValido ? atual?.erro : 'Exercício não encontrado.';
  const exercicio = atual?.exercicio;
  const itens = exercicio?.errosOrientacoes ?? [];

  return (
    <LayoutTreinador nome={treinador?.first_name || treinador?.apelido || 'Treinador'} secao="Biblioteca">
      <div className={estilos.pagina}>
        <Link className={classeBotaoVoltar} to={idValido ? `/exercicios/${exercicioId}` : '/exercicios'}>
          {idValido ? 'Voltar ao exercício' : 'Voltar à biblioteca'}
        </Link>

        {erro ? (
          <section>
            <header className="sj52__intro"><h1>Erros e orientações</h1></header>
            <p role="alert" className={estilos.erro}>{erro}</p>
          </section>
        ) : !exercicio ? (
          <p role="status">Carregando erros e orientações...</p>
        ) : (
          <>
            <header className={estilos.cabecalho}>
              <h1>{exercicio.nome}</h1>
              <span className={estilos.selo}>{exercicio.fundamento}</span>
            </header>

            <div className={estilos.contexto}>
              <section className={estilos.cartaoInfo} aria-labelledby="us37-objetivo">
                <h2 id="us37-objetivo">Objetivo</h2>
                <p>{exercicio.objetivo}</p>
              </section>
              <section className={estilos.cartaoInfo} aria-labelledby="us37-orientacoes">
                <h2 id="us37-orientacoes">Orientações de execução</h2>
                <p className={exercicio.orientacoes ? undefined : estilos.vazio}>{exercicio.orientacoes || 'Não informado'}</p>
              </section>
            </div>

            {aviso && <p role="status" className={estilos.sucesso}>{aviso}</p>}

            <section className={estilos.secao} aria-labelledby="us37-erros-titulo">
              <div className={estilos.cabecalhoSecao}>
                <div>
                  <h2 id="us37-erros-titulo">Erros comuns e orientações</h2>
                  <p>{contagemDeItens(itens.length)}</p>
                </div>
                {itens.length > 0 && (
                  <Link className={estilos.adicionar} to={rotaNovo}>
                    <IconeMais />
                    Adicionar erro/orientação
                  </Link>
                )}
              </div>

              {itens.length > 0 ? (
                <ul className={estilos.lista}>
                  {itens.map((item) => (
                    <li key={item.id}>
                      <Link
                        className={estilos.item}
                        to={`/exercicios/${exercicioId}/erros-orientacoes/${item.id}/editar`}
                        aria-label={`Editar erro comum: ${item.erro}`}
                      >
                        <div>
                          <span className={estilos.rotulo}>Erro comum</span>
                          <p className={estilos.textoErro}>{item.erro}</p>
                        </div>
                        <div>
                          <span className={estilos.rotulo}>Orientação corretiva</span>
                          <p className={estilos.textoOrientacao}>{item.orientacaoCorretiva}</p>
                        </div>
                        <IconeAvancar />
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={estilos.vazioCartao}>
                  <svg className={estilos.vazioIcone} viewBox="0 0 32 32" width="36" height="36" aria-hidden="true" focusable="false">
                    <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 9v9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    <circle cx="16" cy="23" r="1.6" fill="currentColor" />
                  </svg>
                  <h3>Nenhum erro comum cadastrado</h3>
                  <p>Erros e orientações são opcionais. Adicione os erros mais frequentes e como corrigi-los para orientar os alunos.</p>
                  <Link className={`${estilos.adicionar} ${estilos.adicionarPrincipal}`} to={rotaNovo}>
                    <IconeMais />
                    Adicionar erro/orientação
                  </Link>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </LayoutTreinador>
  );
}
