import { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import estilos from './ErrosOrientacoes.module.css';
import botoes from './BibliotecaExercicios.module.css';
import { AuthContext } from '../../auth/contexto';
import { ApiError } from '../../api/client';
import { LayoutTreinador } from '../treinador/LayoutTreinador';
import type { Exercicio } from '../../types/exercicio';
import ErroOrientacaoForm, {
  type CampoErroOrientacao,
  type ErrosDosCampos,
  type TextosErroOrientacao,
} from './components/ErroOrientacaoForm';
import { IconeVoltar, idDeRotaValido } from './ErrosOrientacoesExercicio';
import {
  atualizarErroOrientacao,
  consultarExercicio,
  criarErroOrientacao,
  mensagemDeErro,
  mensagemDeErroOrientacao,
} from './exerciciosApi';

// US37 — telas "Adicionar nova orientação" e "Editar orientação" (CA01).

const CAMPO_DA_API: Record<string, CampoErroOrientacao> = {
  erro: 'erro',
  orientacao_corretiva: 'orientacaoCorretiva',
};

function errosDosCamposDaApi(falha: unknown): ErrosDosCampos | null {
  if (!(falha instanceof ApiError) || falha.status !== 400) return null;
  const erros: ErrosDosCampos = {};
  for (const [campoApi, mensagens] of Object.entries(falha.campos)) {
    const campo = CAMPO_DA_API[campoApi];
    if (campo) erros[campo] = mensagens.join(' ');
  }
  return Object.keys(erros).length > 0 ? erros : null;
}

export default function ErroOrientacaoPage() {
  const navegar = useNavigate();
  const treinador = useContext(AuthContext)?.usuario;
  const { exercicioId, erroId } = useParams();
  const modo = erroId === undefined ? 'novo' : 'edicao';
  const idsValidos = idDeRotaValido(exercicioId) && (modo === 'novo' || idDeRotaValido(erroId));
  const rotaLista = `/exercicios/${exercicioId}/erros-orientacoes`;
  const titulo = modo === 'novo' ? 'Adicionar nova orientação' : 'Editar orientação';

  const [carga, setCarga] = useState<{ chave: string; exercicio?: Exercicio; erro?: string } | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [errosServidor, setErrosServidor] = useState<ErrosDosCampos>({});
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
  const item = modo === 'edicao'
    ? exercicio?.errosOrientacoes?.find((existente) => existente.id === Number(erroId))
    : undefined;
  const erroCarga = !idsValidos
    ? 'Erro comum não encontrado. Ele pode ter sido removido.'
    : atual?.erro
      ?? (exercicio && modo === 'edicao' && !item ? 'Erro comum não encontrado. Ele pode ter sido removido.' : undefined);

  function voltarParaLista() {
    navegar(rotaLista);
  }

  async function salvar(textos: TextosErroOrientacao) {
    if (envioEmCurso.current || !exercicio?.id) return;
    envioEmCurso.current = true;
    setSalvando(true);
    setErroGeral('');
    setErrosServidor({});
    try {
      if (modo === 'novo') {
        await criarErroOrientacao(exercicio.id, textos);
      } else {
        await atualizarErroOrientacao(exercicio.id, Number(erroId), textos);
      }
      navegar(rotaLista, { state: { aviso: modo === 'novo' ? 'Erro comum adicionado.' : 'Alterações salvas.' } });
    } catch (falha) {
      const porCampo = errosDosCamposDaApi(falha);
      if (porCampo) setErrosServidor(porCampo);
      else setErroGeral(mensagemDeErroOrientacao(falha));
    } finally {
      envioEmCurso.current = false;
      setSalvando(false);
    }
  }

  function limparErroDoCampo(campo: CampoErroOrientacao) {
    setErrosServidor((atuais) => (atuais[campo] ? { ...atuais, [campo]: undefined } : atuais));
  }

  return (
    <LayoutTreinador nome={treinador?.first_name || treinador?.apelido || 'Treinador'} secao="Biblioteca">
      <div className={estilos.pagina}>
        <Link className={`${estilos.voltar} ${estilos.cancelarTopo}`} to={idDeRotaValido(exercicioId) ? rotaLista : '/exercicios'}>
          <IconeVoltar />
          Cancelar
        </Link>

        <header className={estilos.cabecalhoFormulario}>
          <h1>{titulo}</h1>
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
        ) : !exercicio ? (
          <p role="status">Carregando...</p>
        ) : (
          <>
            {erroGeral && <p role="alert" className={estilos.erro}>{erroGeral}</p>}
            <ErroOrientacaoForm
              key={`${modo}-${item?.id ?? 'novo'}`}
              modo={modo}
              inicial={item}
              salvando={salvando}
              errosServidor={errosServidor}
              onAlterarCampo={limparErroDoCampo}
              onSalvar={salvar}
              onCancelar={voltarParaLista}
              acoesExtras={modo === 'edicao' && (
                <button
                  type="button"
                  className={botoes.secundario}
                  disabled={salvando}
                  onClick={() => navegar(`${rotaLista}/${erroId}/remover`)}
                >
                  Remover orientação
                </button>
              )}
            />
          </>
        )}
      </div>
    </LayoutTreinador>
  );
}
