from rest_framework import serializers

from .models import ErroComumExercicio, Exercicio


LIMITE_TEXTO_ERRO_ORIENTACAO = 1000


class ErroComumExercicioSerializer(serializers.ModelSerializer):
    """US37 / RF2420 — Item de erro comum + orientação corretiva de um exercício.

    Os dois textos são obrigatórios dentro do item (RN22, RNF14): o padrão do DRF
    para campos obrigatórios recusa ausente, vazio ou só com espaços
    (allow_blank=False, trim_whitespace=True). O exercício vem sempre da URL.
    """

    class Meta:
        model = ErroComumExercicio
        fields = ["id", "erro", "orientacao_corretiva", "criado_em", "atualizado_em"]
        read_only_fields = ["id", "criado_em", "atualizado_em"]
        extra_kwargs = {
            "erro": {"max_length": LIMITE_TEXTO_ERRO_ORIENTACAO},
            "orientacao_corretiva": {"max_length": LIMITE_TEXTO_ERRO_ORIENTACAO},
        }

class AssociarErrosComunsSerializer(serializers.Serializer):
    """US33 — Ids dos pares (de outros exercícios) a associar ao exercício."""

    ids = serializers.ListField(
        child=serializers.IntegerField(min_value=1),
        allow_empty=False,
        max_length=50,
        error_messages={
            "required": "Selecione ao menos um par.",
            "empty": "Selecione ao menos um par.",
            "not_a_list": "Informe a lista de pares.",
            "max_length": "Selecione no máximo 50 pares por vez.",
        },
    )

class ExercicioSerializer(serializers.ModelSerializer):
    fundamento_nome = serializers.CharField(
        source="get_fundamento_display", read_only=True
    )
    # Somente leitura: a edição dos itens tem rotas próprias (US37), e o PUT do
    # exercício (US39) não altera nem apaga a lista.
    erros_orientacoes = ErroComumExercicioSerializer(many=True, read_only=True)

    class Meta:
        model = Exercicio
        fields = [
            "id",
            "nome",
            "objetivo",
            "fundamento",
            "fundamento_nome",
            "orientacoes",
            "erros_comuns",
            "erros_orientacoes",
            "video_base",
            # US35: gravados pelo PATCH; ausentes no PUT da edição (US39) são preservados.
            "video_titulo",
            "video_descricao",
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_por", "criado_em", "atualizado_em"]
