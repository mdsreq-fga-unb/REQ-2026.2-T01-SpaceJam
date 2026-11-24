
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import styles from './BibliotecaExercicios.module.css';
import logoSpaceJam from '../imagens/logo_space_jam.png';
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

  const exerciciosFiltrados = exercicios.filter((exercicio) =>
    exercicio.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main className={styles.pagina}>
      <header className={styles.cabecalho}>
        <img
          src={logoSpaceJam}
          alt="Logo Space Jam"
          className={styles.logo}
        />

        <Link className={styles.linkAlunos} to="/treinador/alunos">Alunos</Link>
      </header>

      <section className={styles.conteudo}>
        <h1 className={styles.titulo}>
          Biblioteca de exercícios
        </h1>

        <div className={styles.busca}>
          <input
            type="text"
            placeholder="Buscar:"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            className={styles.campoBusca}
          />

          <span className={styles.iconeBusca}></span>
        </div>

        <button
          type="button"
          className={styles.botaoAdicionar}
          disabled={carregando || salvando}
          onClick={() => {
            setErro('');
            setFormulario('novo');
            if (exercicioId) navegar('/exercicios');
          }}
        >
          <span>Adicionar exercício</span>
          <span className={styles.iconeMais}>+</span>
        </button>

        {erro && (
          <p role="alert" className="mensagemErro">
            {erro}
          </p>
        )}

        {mostrarFormulario && (
          <ExerciseForm
            key={exercicioEmEdicao?.id ?? 'novo'}
            exercicioInicial={exercicioEmEdicao}
            onSalvar={salvarExercicio}
            onCancelar={() => {
              setErro('');
              setFormulario(null);
            }}
            salvando={salvando}
          />
        )}

        {!mostrarFormulario && (
          <section className={styles.listaExercicios}>
            {exerciciosFiltrados.map((exercicio) => (
              <button
                type="button"
                className={styles.exercicio}
                key={exercicio.id}
                disabled={salvando}
                onClick={() => {
                  setErro('');
                  setFormulario(null);
                  if (exercicio.id !== undefined) navegar(`/exercicios/${exercicio.id}`);
                }}
              >
                {exercicio.nome}
              </button>
            ))}
          </section>
        )}

        {!mostrarFormulario && carregando && <p>Carregando exercícios...</p>}

        {!mostrarFormulario &&
          !carregando &&
          !erro &&
          exerciciosFiltrados.length === 0 && (
            <p>
              {exercicios.length === 0
                ? 'Nenhum exercício cadastrado.'
                : 'Nenhum exercício encontrado.'}
            </p>
          )}

        {exercicioId && !mostrarFormulario && (
          erroDetalhe ? (
            <p role="alert" className="mensagemErro">{erroDetalhe}</p>
          ) : exercicioSelecionado ? (
            <ExerciseDetails
              exercicio={exercicioSelecionado}
              onEditar={() => {
                setErro('');
                setFormulario({ exercicioId });
              }}
              onFechar={() => {
                setFormulario(null);
                navegar('/exercicios');
              }}
              edicaoIndisponivel={carregando || salvando}
            />
          ) : (
            <p role="status">Carregando exercício...</p>
          )
        )}
      </section>
    </main>
  );
}