import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styles from './BibliotecaExercicios.module.css';
import { AuthContext } from '../../auth/contexto';
import { LayoutTreinador } from '../treinador/LayoutTreinador';
import type { Exercicio } from '../../types/exercicio';
import ExerciseForm from './components/ExerciseForm';
import ExerciseDetails from './components/ExerciseDetails';
import {
  atualizarExercicio,
  consultarExercicio,
  criarExercicio,
  listarExercicios,
  mensagemDeErro,
} from './exerciciosApi';

function ordenarPorNome(lista: Exercicio[]) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export default function BibliotecaExercicios() {
  const navegar = useNavigate();
  const treinador = useContext(AuthContext)?.usuario;
  const resultados = useRef<HTMLElement>(null);
  const campoBusca = useRef<HTMLInputElement>(null);
  const { exercicioId } = useParams();
  const [busca, setBusca] = useState('');
  const [formulario, setFormulario] = useState<'novo' | { exercicioId: string } | null>(null);
  const [detalhe, setDetalhe] = useState<{
    id: string;
    exercicio?: Exercicio;
    erro?: string;
  } | null>(null);
  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const envioEmCurso = useRef(false);

  const idValido = /^[1-9]\d*$/.test(exercicioId ?? '') && Number.isSafeInteger(Number(exercicioId));
  const detalheAtual = detalhe?.id === exercicioId ? detalhe : null;
  const exercicioSelecionado = detalheAtual?.exercicio;
  const erroDetalhe = idValido ? detalheAtual?.erro : 'Exercício não encontrado.';
  const exercicioEmEdicao = formulario && formulario !== 'novo' && formulario.exercicioId === exercicioId
    ? exercicioSelecionado
    : undefined;
  const mostrarFormulario = (formulario === 'novo' && !exercicioId) || Boolean(exercicioEmEdicao);

  useEffect(() => {
    let ativo = true;

    listarExercicios()
      .then((lista) => {
        if (ativo) setExercicios(ordenarPorNome(lista));
      })
      .catch((falha) => {
        if (ativo) setErro(mensagemDeErro(falha));
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    if (!exercicioId || !idValido) return;
    let ativo = true;

    consultarExercicio(Number(exercicioId))
      .then((exercicio) => {
        if (ativo) setDetalhe({ id: exercicioId, exercicio });
      })
      .catch((falha: unknown) => {
        if (ativo) setDetalhe({ id: exercicioId, erro: mensagemDeErro(falha) });
      });

    return () => { ativo = false; };
  }, [exercicioId, idValido]);

  async function salvarExercicio(exercicio: Exercicio) {
    if (carregando || envioEmCurso.current) return;
    envioEmCurso.current = true;
    setSalvando(true);
    setErro('');

    const id = exercicioEmEdicao?.id;
    try {
      const salvo = id === undefined
        ? await criarExercicio(exercicio)
        : await atualizarExercicio(id, exercicio);
      setExercicios((lista) => ordenarPorNome([
        ...lista.filter((item) => item.id !== salvo.id),
        salvo,
      ]));
      if (exercicioId && id !== undefined) setDetalhe({ id: exercicioId, exercicio: salvo });
      setFormulario(null);
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    } finally {
      envioEmCurso.current = false;
      setSalvando(false);
    }
  }

  const termoDeBusca = busca.trim().toLocaleLowerCase('pt-BR');
  const exerciciosFiltrados = exercicios.filter((exercicio) =>
    exercicio.nome.toLocaleLowerCase('pt-BR').includes(termoDeBusca)
  );
  const buscaSemResultado = !carregando && !erro && Boolean(termoDeBusca) && exerciciosFiltrados.length === 0;
  const totalEncontrado = exerciciosFiltrados.length;


  function voltarBiblioteca() {
    setErro('');
    setFormulario(null);
    if (exercicioId) navegar('/exercicios');
  }

  return (
    <LayoutTreinador nome={treinador?.first_name || treinador?.apelido || 'Treinador'} secao="Biblioteca">
      <div className={styles.biblioteca}>
        {(exercicioId || mostrarFormulario) && (
          <button type="button" className={styles.voltar} onClick={voltarBiblioteca} disabled={salvando}>Voltar à biblioteca</button>
        )}
        {erro && <p role="alert" className={styles.erro}>{erro}</p>}
        {mostrarFormulario ? (
          <ExerciseForm
            key={exercicioEmEdicao?.id ?? 'novo'}
            exercicioInicial={exercicioEmEdicao}
            onSalvar={salvarExercicio}
            onCancelar={() => { setErro(''); setFormulario(null); }}
            salvando={salvando}
          />
        ) : exercicioId ? (
          erroDetalhe ? (
            <section>
              <header className="sj52__intro"><h1>Biblioteca de exercícios</h1></header>
              <p role="alert" className={styles.erro}>{erroDetalhe}</p>
            </section>
          ) : exercicioSelecionado ? (
            <ExerciseDetails
              exercicio={exercicioSelecionado}
              onEditar={() => { setErro(''); setFormulario({ exercicioId }); }}
              onErrosOrientacoes={() => navegar(`/exercicios/${exercicioId}/erros-orientacoes`)}
              edicaoIndisponivel={carregando || salvando}
            />
          ) : (
            <p role="status">Carregando exercício...</p>
          )
        ) : (
          <div>
            <header className="sj52__intro">
              <div><h1>Biblioteca de exercícios</h1><p>Consulte e prepare exercícios para seus alunos.</p></div>
            </header>
            <button type="button" className={styles.adicionar} disabled={carregando || salvando}
              onClick={() => { setErro(''); setFormulario('novo'); }}>
              Adicionar exercício
            </button>
            <form className={styles.busca} role="search" aria-label="Biblioteca de exercícios" onSubmit={(evento) => {
              evento.preventDefault();
              setBusca(busca.trim());
              resultados.current?.focus();
            }}>
              <label htmlFor="biblioteca-busca">Buscar por nome</label>
              <input id="biblioteca-busca" ref={campoBusca} type="search" placeholder="Nome do exercício" value={busca}
                onChange={(evento) => setBusca(evento.target.value)} aria-describedby="biblioteca-busca-ajuda" />
              <small id="biblioteca-busca-ajuda">A busca também aceita parte do nome.</small>
              <button type="submit" className={styles.buscar}>Buscar</button>
            </form>
            <section className={styles.resultados} ref={resultados} tabIndex={-1} aria-label="Resultados da busca">
              <div role="status">
                {carregando && <p>Carregando exercícios...</p>}
                {buscaSemResultado && (
                  <div className={styles.buscaVazia}>
                    <h2>Nenhum exercício encontrado.</h2>
                    <p>Tente outro nome ou consulte todos os exercícios da biblioteca.</p>
                  </div>
                )}
                {!carregando && !erro && !termoDeBusca && totalEncontrado === 0 && <p>Nenhum exercício cadastrado.</p>}
                {termoDeBusca && totalEncontrado > 0 && <span className="sr-only">
                  {totalEncontrado === 1 ? '1 exercício encontrado.' : totalEncontrado + ' exercícios encontrados.'}
                </span>}
              </div>
              {buscaSemResultado && (
                <button type="button" className={styles.limparBusca} onClick={() => {
                  setBusca('');
                  campoBusca.current?.focus();
                }}>Limpar busca</button>
              )}
              {totalEncontrado > 0 && <ul className={styles.lista}>
                {exerciciosFiltrados.map((exercicio) => (
                  <li key={exercicio.id}>
                    <button type="button" className={styles.exercicio} aria-label={exercicio.nome}
                      disabled={salvando || exercicio.id === undefined}
                      onClick={() => { setErro(''); navegar(`/exercicios/${exercicio.id}`); }}>
                      <strong>{exercicio.nome}</strong>
                      <small>{exercicio.fundamento}</small>
                      <span>{exercicio.objetivo}</span>
                      <span className={styles.consultar}>Consultar exercício</span>
                      <img className={styles.icone} src={exercicio.fundamento === 'Arremesso' ? '/biblioteca/cesta.svg' : '/biblioteca/estrategia.svg'}
                        width={48} height={48} alt="" />
                    </button>
                  </li>
                ))}
              </ul>}
            </section>
          </div>
        )}
      </div>
    </LayoutTreinador>
  );
}
