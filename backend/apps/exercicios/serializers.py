from rest_framework import serializers

from .models import Exercicio


class ExercicioSerializer(serializers.ModelSerializer):
    fundamento_nome = serializers.CharField(
        source="get_fundamento_display", read_only=True
    )

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
            "video_base",
            "criado_por",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = ["id", "criado_por", "criado_em", "atualizado_em"]