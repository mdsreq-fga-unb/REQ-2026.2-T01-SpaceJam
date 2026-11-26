import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import estilos from '../ErrosOrientacoes.module.css';
import botoes from '../BibliotecaExercicios.module.css';
import { LIMITE_TEXTO_ERRO_ORIENTACAO, type ErroOrientacao } from '../../../types/exercicio';

// US37 — formulário do par erro comum + orientação corretiva (adicionar e editar).

export type TextosErroOrientacao = Pick<ErroOrientacao, 'erro' | 'orientacaoCorretiva'>;
export type CampoErroOrientacao = keyof TextosErroOrientacao;
export type ErrosDosCampos = Partial<Record<CampoErroOrientacao, string>>;

interface ErroOrientacaoFormProps {
  modo: 'novo' | 'edicao';
  inicial?: TextosErroOrientacao;
  salvando?: boolean;
  /** Erros por campo devolvidos pelo backend (400). */
  errosServidor?: ErrosDosCampos;
  onAlterarCampo?: (campo: CampoErroOrientacao) => void;
  onSalvar: (textos: TextosErroOrientacao) => void;
  onCancelar: () => void;
  /** Ações extras entre "Salvar" e "Cancelar" (ex.: remover, no modo edição). */
  acoesExtras?: ReactNode;
}

const MENSAGEM_VAZIO: Record<CampoErroOrientacao, string> = {
  erro: 'Informe o erro comum.',
  orientacaoCorretiva: 'Informe a orientação corretiva.',
};

export default function ErroOrientacaoForm({
  modo,
  inicial,
  salvando = false,
  errosServidor = {},
  onAlterarCampo,
  onSalvar,
  onCancelar,
  acoesExtras,
}: ErroOrientacaoFormProps) {
  const id = useId();
  const [textos, setTextos] = useState<TextosErroOrientacao>({
    erro: inicial?.erro ?? '',
    orientacaoCorretiva: inicial?.orientacaoCorretiva ?? '',
  });
  const [errosLocais, setErrosLocais] = useState<ErrosDosCampos>({});
  const campos = {
    erro: useRef<HTMLTextAreaElement>(null),
    orientacaoCorretiva: useRef<HTMLTextAreaElement>(null),
  };

  function alterar(campo: CampoErroOrientacao, valor: string) {
    setTextos((atuais) => ({ ...atuais, [campo]: valor }));
    setErrosLocais((atuais) => ({ ...atuais, [campo]: undefined }));
    onAlterarCampo?.(campo);
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (salvando) return;

    const limpos = { erro: textos.erro.trim(), orientacaoCorretiva: textos.orientacaoCorretiva.trim() };
    const novosErros: ErrosDosCampos = {};
    (Object.keys(MENSAGEM_VAZIO) as CampoErroOrientacao[]).forEach((campo) => {
      if (!limpos[campo]) novosErros[campo] = MENSAGEM_VAZIO[campo];
    });
    setErrosLocais(novosErros);

    const primeiroInvalido = (['erro', 'orientacaoCorretiva'] as const).find((campo) => novosErros[campo]);
    if (primeiroInvalido) {
      campos[primeiroInvalido].current?.focus();
      return;
    }
    onSalvar(limpos);
  }

  function campo(nome: CampoErroOrientacao, rotulo: string, exemplo: string) {
    const mensagem = errosLocais[nome] ?? errosServidor[nome];
    const idErro = `${id}-${nome}-erro`;
    const idContador = `${id}-${nome}-contador`;
    return (
      <div className={estilos.campo}>
        <label htmlFor={`${id}-${nome}`}>{rotulo} <span aria-hidden="true">*</span></label>
        <textarea
          id={`${id}-${nome}`}
          ref={campos[nome]}
          value={textos[nome]}
          disabled={salvando}
          required
          maxLength={LIMITE_TEXTO_ERRO_ORIENTACAO}
          placeholder={exemplo}
          aria-invalid={Boolean(mensagem)}
          aria-describedby={mensagem ? `${idErro} ${idContador}` : idContador}
          onChange={(evento) => alterar(nome, evento.target.value)}
        />
        <div className={estilos.rodapeCampo}>
          {mensagem ? <span id={idErro} className={estilos.erroCampo}>{mensagem}</span> : <span />}
          <small id={idContador} className={estilos.contador}>
            {textos[nome].length}/{LIMITE_TEXTO_ERRO_ORIENTACAO}
          </small>
        </div>
      </div>
    );
  }

  return (
    <form className={estilos.formulario} onSubmit={enviar} aria-busy={salvando} noValidate>
      <div className={estilos.campos}>
        {campo('erro', 'Erro comum', 'Ex.: Olhar somente para a bola.')}
        {campo('orientacaoCorretiva', 'Orientação corretiva', 'Ex.: Mantenha o olhar à frente durante o deslocamento.')}
      </div>

      <aside className={estilos.aviso}>
        {modo === 'novo' ? (
          <>
            <strong>Campos obrigatórios</strong>
            <p>Erro e orientação não podem ficar vazios. Os dois aparecem juntos na biblioteca deste exercício.</p>
          </>
        ) : (
          <>
            <strong>Treinos existentes</strong>
            <p>A edição atualiza a biblioteca. Treinos já prescritos mantêm as orientações anteriores.</p>
          </>
        )}
      </aside>

      <div className={estilos.acoes}>
        <button type="submit" className={botoes.principal} disabled={salvando}>
          {salvando ? 'Salvando…' : modo === 'novo' ? 'Salvar' : 'Salvar alterações'}
        </button>
        {acoesExtras}
        <button type="button" className={botoes.secundario} onClick={onCancelar} disabled={salvando}>Cancelar</button>
      </div>
    </form>
  );
}
