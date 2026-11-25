from rest_framework import serializers

from .models import ErroComumExercicio, Exercicio


class ErroComumExercicioSerializer(serializers.ModelSerializer):
    """US37 / RF2420 — Item de erro comum + orientação corretiva de um exercício."""

    class Meta:
        model = ErroComumExercicio
        fields = ["id", "erro", "orientacao_corretiva", "criado_em", "atualizado_em"]
        read_only_fields = ["id", "criado_em", "atualizado_em"]


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
