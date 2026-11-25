import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import estilos from './ErrosOrientacoes.module.css';
import botoes from './BibliotecaExercicios.module.css';
import { AuthContext } from '../../auth/contexto';
import { LayoutTreinador } from '../treinador/LayoutTreinador';
import type { Exercicio } from '../../types/exercicio';
import { IconeVoltar, idDeRotaValido } from './ErrosOrientacoesExercicio';
import {
  consultarExercicio,
  mensagemDeErro,
  mensagemDeErroOrientacao,
  removerErroOrientacao,
} from './exerciciosApi';

// US37 — confirmação "Remover orientação?" (CA02). A remoção é definitiva e vale só
// para este exercício; treinos já prescritos mantêm a cópia (RN23).

const NAO_ENCONTRADO = 'Erro comum não encontrado. Ele pode ter sido removido.';

export default function RemoverErroOrientacaoPage() {
  const navegar = useNavigate();
  const treinador = useContext(AuthContext)?.usuario;
  const { exercicioId, erroId } = useParams();
  const idsValidos = idDeRotaValido(exercicioId) && idDeRotaValido(erroId);
  const rotaLista = `/exercicios/${exercicioId}/erros-orientacoes`;
  const rotaEdicao = `${rotaLista}/${erroId}/editar`;

  const [carga, setCarga] = useState<{ chave: string; exercicio?: Exercicio; erro?: string } | null>(null);
  const [removendo, setRemovendo] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const envioEmCurso = useRef(false);
  const chave = `${exercicioId}`;

  useEffect(() => {
    if (!idsValidos) return;
    let ativo = true;
    consultarExercicio(Number(exercicioId))
      .then((exercicio) => { if (ativo) setCarga({ chave, exercicio }); })
      .catch((falha: unknown) => { if (ativo) setCarga({ chave, erro: mensagemDeErro(falha) }); });
    return () => { ativo = false; };
  }, [chave, exercicioId, idsValidos]);

  const atual = carga?.chave === chave ? carga : null;
  const exercicio = atual?.exercicio;
  const item = exercicio?.errosOrientacoes?.find((existente) => existente.id === Number(erroId));
  const erroCarga = !idsValidos ? NAO_ENCONTRADO : atual?.erro ?? (exercicio && !item ? NAO_ENCONTRADO : undefined);

  async function confirmar() {
    if (envioEmCurso.current || !exercicio?.id || !item) return;
    envioEmCurso.current = true;
    setRemovendo(true);
    setErroGeral('');
    try {
      await removerErroOrientacao(exercicio.id, item.id);
      navegar(rotaLista, { state: { aviso: 'Erro comum removido.' } });
    } catch (falha) {
      setErroGeral(mensagemDeErroOrientacao(falha));
    } finally {
      envioEmCurso.current = false;
      setRemovendo(false);
    }
  }

  return (
    <LayoutTreinador nome={treinador?.first_name || treinador?.apelido || 'Treinador'} secao="Biblioteca">
      <div className={estilos.pagina}>
        <header className={estilos.cabecalhoFormulario}>
          <h1>Remover orientação?</h1>
          {exercicio && <p>{exercicio.nome}</p>}
        </header>

        {erroCarga ? (
          <>
            <p role="alert" className={estilos.erro}>{erroCarga}</p>
            <Link className={estilos.voltar} to={idDeRotaValido(exercicioId) ? rotaLista : '/exercicios'}>
              <IconeVoltar />
              {idDeRotaValido(exercicioId) ? 'Voltar aos erros e orientações' : 'Biblioteca de exercícios'}
            </Link>
          </>
        ) : !exercicio || !item ? (
          <p role="status">Carregando...</p>
        ) : (
          <>
            <section className={estilos.escopo} aria-labelledby="us37-escopo">
              <h2 id="us37-escopo">Escopo da alteração</h2>
              <div className={estilos.escopoItem}>
                <p className={estilos.textoErro}>{item.erro}</p>
                <p className={estilos.textoOrientacao}>{item.orientacaoCorretiva}</p>
              </div>
              <p>A orientação deixa de aparecer na biblioteca para este exercício. Prescrições anteriores são preservadas.</p>
            </section>

            {erroGeral && <p role="alert" className={estilos.erro}>{erroGeral}</p>}

            <div className={estilos.acoes}>
              <button type="button" className={botoes.principal} onClick={confirmar} disabled={removendo}>
                {removendo ? 'Removendo…' : 'Confirmar remoção'}
              </button>
              <button type="button" className={botoes.secundario} onClick={() => navegar(rotaEdicao)} disabled={removendo}>
                Cancelar
              </button>
            </div>
          </>
        )}
      </div>
    </LayoutTreinador>
  );
}
