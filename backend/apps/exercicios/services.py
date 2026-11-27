"""Serviços do app de exercícios."""

from .models import Exercicio


def snapshot_exercicio(exercicio: Exercicio) -> dict:
    """RN23 / US37 CA03 — Cópia dos dados vigentes do exercício para a prescrição.

    Contrato para o RF2307 (prescrição de treino): ao incluir o exercício no treino,
    gravar o resultado desta função junto do treino, em vez de referenciar o
    exercício ou os itens de erro + orientação. Assim, editar ou remover itens na
    biblioteca (US37) não altera treinos já prescritos, e a nova versão vale só
    para novas prescrições.

    Devolve dados puros e serializáveis em JSON, sem ids. Usa os itens já carregados
    quando o exercício vem com `prefetch_related("erros_orientacoes")`.
    """
    return {
        "nome": exercicio.nome,
        "objetivo": exercicio.objetivo,
        "fundamento": exercicio.fundamento,
        "fundamento_nome": exercicio.get_fundamento_display(),
        "orientacoes": exercicio.orientacoes,
        "erros_comuns": exercicio.erros_comuns,
        "video_base": exercicio.video_base,
        # US35 CA03: contrato para a prescrição (RF2307) copiar título e descrição.
        "video_titulo": exercicio.video_titulo,
        "video_descricao": exercicio.video_descricao,
        "erros_orientacoes": [
            {"erro": item.erro, "orientacao_corretiva": item.orientacao_corretiva}
            for item in exercicio.erros_orientacoes.all()
        ],
    }
