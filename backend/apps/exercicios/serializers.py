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
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_por", "criado_em", "atualizado_em"]
