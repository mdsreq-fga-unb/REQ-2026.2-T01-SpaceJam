
import { useEffect, useState } from 'react';
import styles from './BibliotecaExercicios.module.css';
import logoSpaceJam from '../imagens/logo_space_jam.png';
import type { Exercicio } from '../../types/exercicio';
import ExerciseForm from './components/ExerciseForm';
import ExerciseDetails from './components/ExerciseDetails';
import {
  atualizarExercicio as atualizarNaApi,
  criarExercicio,
  listarExercicios,
  mensagemDeErro,
} from './exerciciosApi';

function ordenarPorNome(lista: Exercicio[]) {
  return [...lista].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
}

export default function BibliotecaExercicios() {
  const [busca, setBusca] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);

  const [exercicioSelecionado, setExercicioSelecionado] =
    useState<Exercicio | null>(null);

  const [exercicios, setExercicios] = useState<Exercicio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

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

  async function adicionarExercicio(novoExercicio: Exercicio) {
    setErro('');

    try {
      const criado = await criarExercicio(novoExercicio);
      setExercicios((listaAtual) => ordenarPorNome([...listaAtual, criado]));
      setMostrarFormulario(false);
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    }
  }

  function iniciarEdicao() {
    setErro('');
    setModoEdicao(true);
    setMostrarFormulario(true);
  }

  async function atualizarExercicio(exercicioEditado: Exercicio) {
    if (!exercicioSelecionado || exercicioSelecionado.id === undefined) return;

    setErro('');

    try {
      const atualizado = await atualizarNaApi(
        exercicioSelecionado.id,
        exercicioEditado
      );

      setExercicios((listaAtual) =>
        ordenarPorNome(
          listaAtual.map((exercicio) =>
            exercicio.id === atualizado.id ? atualizado : exercicio
          )
        )
      );

      setExercicioSelecionado(atualizado);
      setMostrarFormulario(false);
      setModoEdicao(false);
    } catch (falha) {
      setErro(mensagemDeErro(falha));
    }
  }

  function cancelarFormulario() {
    setErro('');
    setMostrarFormulario(false);
    setModoEdicao(false);
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

        <button className={styles.botaoMenu} aria-label="Abrir menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
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
          className={styles.botaoAdicionar}
          onClick={() => {
            setErro('');
            setExercicioSelecionado(null);
            setModoEdicao(false);
            setMostrarFormulario(true);
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
            exercicioInicial={
              modoEdicao
                ? exercicioSelecionado ?? undefined
                : undefined
            }
            onSalvar={modoEdicao ? atualizarExercicio : adicionarExercicio}
            onCancelar={cancelarFormulario}
          />
        )}

        {!mostrarFormulario && (
          <section className={styles.listaExercicios}>
            {exerciciosFiltrados.map((exercicio) => (
              <button
                className={styles.exercicio}
                key={exercicio.id}
                onClick={() => {
                  setExercicioSelecionado(exercicio);
                  setMostrarFormulario(false);
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

        {exercicioSelecionado && !mostrarFormulario && (
          <ExerciseDetails
            exercicio={exercicioSelecionado}
            onEditar={iniciarEdicao}
            onFechar={() => setExercicioSelecionado(null)}
          />
        )}
      </section>
    </main>
  );
}