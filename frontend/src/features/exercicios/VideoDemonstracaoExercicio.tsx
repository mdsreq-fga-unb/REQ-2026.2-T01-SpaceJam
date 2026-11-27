import { useContext, useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import estilos from './ErrosOrientacoes.module.css';
import video from './VideoDemonstracao.module.css';
import botoes from './BibliotecaExercicios.module.css';
import { AuthContext } from '../../auth/contexto';
import { ApiError } from '../../api/client';
import { LayoutTreinador } from '../treinador/LayoutTreinador';
import {
  LIMITE_DESCRICAO_VIDEO_BASE,
  LIMITE_TITULO_VIDEO_BASE,
  type Exercicio,
  type InformacoesVideoBase,
} from '../../types/exercicio';
import { classeBotaoVoltar, idDeRotaValido } from './ErrosOrientacoesExercicio';
import { atualizarInformacoesVideoBase, consultarExercicio, mensagemDeErro } from './exerciciosApi';

// US35 / RF2418 — título e descrição breve do vídeo-base do exercício.
// O envio e a reprodução do vídeo-base são de outra história: aqui o quadro só informa
// se há um vídeo vinculado. Os textos são opcionais e salváveis sem vídeo (RN22).

type CampoVideo = keyof InformacoesVideoBase;
type ErrosDosCampos = Partial<Record<CampoVideo, string>>;

const CAMPO_DA_API: Record<string, CampoVideo> = {
  video_titulo: 'videoTitulo',
  video_descricao: 'videoDescricao',
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

function textosDe(exercicio: Exercicio): InformacoesVideoBase {
  return { videoTitulo: exercicio.videoTitulo ?? '', videoDescricao: exercicio.videoDescricao ?? '' };
}

function IconePlay() {
  return (
    <svg viewBox="0 0 32 32" width="36" height="36" aria-hidden="true" focusable="false">
      <path d="M11 7v18l15-9z" fill="currentColor" />
    </svg>
  );
}

function FormularioVideoBase({ exercicio, onCancelar }: { exercicio: Exercicio; onCancelar: () => void }) {
  const id = useId();
  const [textos, setTextos] = useState<InformacoesVideoBase>(() => textosDe(exercicio));
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState('');
  const [erroGeral, setErroGeral] = useState('');
  const [errosCampos, setErrosCampos] = useState<ErrosDosCampos>({});
  const envioEmCurso = useRef(false);

  function alterar(campo: CampoVideo, valor: string) {
    setTextos((atuais) => ({ ...atuais, [campo]: valor }));
    setErrosCampos((atuais) => ({ ...atuais, [campo]: undefined }));
    setAviso('');
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (envioEmCurso.current || exercicio.id === undefined) return;
    envioEmCurso.current = true;
    setSalvando(true);
    setAviso('');
    setErroGeral('');
    setErrosCampos({});
    try {
      const atualizado = await atualizarInformacoesVideoBase(exercicio.id, {
        videoTitulo: textos.videoTitulo.trim(),
        videoDescricao: textos.videoDescricao.trim(),
      });
      setTextos(textosDe(atualizado));
      setAviso('Informações salvas.');
    } catch (falha) {
      const porCampo = errosDosCamposDaApi(falha);
      if (porCampo) setErrosCampos(porCampo);
      else setErroGeral(mensagemDeErro(falha));
    } finally {
      envioEmCurso.current = false;
      setSalvando(false);
    }
  }

  function campo(nome: CampoVideo, rotulo: string, limite: number, classe: string) {
    const idCampo = `${id}-${nome}`;
    const idErro = `${idCampo}-erro`;
    const idContador = `${idCampo}-contador`;
    const mensagem = errosCampos[nome];
    const comum = {
      id: idCampo,
      value: textos[nome],
      maxLength: limite,
      disabled: salvando,
      'aria-invalid': Boolean(mensagem),
      'aria-describedby': mensagem ? `${idErro} ${idContador}` : idContador,
    };
    return (
      <div className={`${estilos.campo} ${classe}`}>
        <label htmlFor={idCampo}>{rotulo}</label>
        {nome === 'videoTitulo'
          ? <input {...comum} type="text" onChange={(evento) => alterar(nome, evento.target.value)} />
          : <textarea {...comum} onChange={(evento) => alterar(nome, evento.target.value)} />}
        <div className={estilos.rodapeCampo}>
          {mensagem ? <span id={idErro} className={estilos.erroCampo}>{mensagem}</span> : <span />}
          <small id={idContador} className={estilos.contador}>{textos[nome].length}/{limite}</small>
        </div>
      </div>
    );
  }

  return (
    <>
      {aviso && <p role="status" className={estilos.sucesso}>{aviso}</p>}
      {erroGeral && <p role="alert" className={estilos.erro}>{erroGeral}</p>}
      <form className={video.formulario} onSubmit={salvar} aria-busy={salvando} noValidate>
        <section className={video.video} aria-labelledby={`${id}-video`}>
          <h2 id={`${id}-video`}>Vídeo-base</h2>
          <div className={video.quadro}><IconePlay /></div>
          {exercicio.videoUrl ? (
            <>
              <p className={video.situacao}>Vídeo-base vinculado a este exercício.</p>
              <a className={video.assistir} href={exercicio.videoUrl} target="_blank" rel="noopener noreferrer">
                Assistir vídeo
              </a>
            </>
          ) : (
            <p className={video.situacao}>Nenhum vídeo-base vinculado a este exercício.</p>
          )}
          <p className={video.nota}>
            O envio do vídeo ainda não está disponível nesta tela. O título e a descrição podem ser cadastrados mesmo sem vídeo.
          </p>
        </section>

        {campo('videoTitulo', 'Título', LIMITE_TITULO_VIDEO_BASE, video.titulo)}
        {campo('videoDescricao', 'Descrição', LIMITE_DESCRICAO_VIDEO_BASE, video.descricao)}

        <div className={video.acoes}>
          <button type="submit" className={botoes.principal} disabled={salvando}>
            {salvando ? 'Salvando…' : 'Salvar informações'}
          </button>
          <button type="button" className={botoes.secundario} onClick={onCancelar} disabled={salvando}>Cancelar</button>
        </div>
      </form>
    </>
  );
}

export default function VideoDemonstracaoExercicio() {
  const treinador = useContext(AuthContext)?.usuario;
  const { exercicioId } = useParams();
  const navegar = useNavigate();
  const idValido = idDeRotaValido(exercicioId);
  const rotaExercicio = idValido ? `/exercicios/${exercicioId}` : '/exercicios';
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

  return (
    <LayoutTreinador nome={treinador?.first_name || treinador?.apelido || 'Treinador'} secao="Biblioteca">
      <div className={estilos.pagina}>
        <Link className={classeBotaoVoltar} to={rotaExercicio}>
          {idValido ? 'Voltar ao exercício' : 'Voltar à biblioteca'}
        </Link>

        <header className={estilos.cabecalhoFormulario}>
          <h1>Vídeo de demonstração</h1>
          {exercicio && <p>{exercicio.nome}</p>}
        </header>

        {erro ? (
          <p role="alert" className={estilos.erro}>{erro}</p>
        ) : !exercicio ? (
          <p role="status">Carregando...</p>
        ) : (
          <FormularioVideoBase
            key={exercicio.id}
            exercicio={exercicio}
            onCancelar={() => navegar(rotaExercicio)}
          />
        )}
      </div>
    </LayoutTreinador>
  );
}
