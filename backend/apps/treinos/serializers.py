from rest_framework import serializers

from .models import ItemTreino, Treino


STATUS_API_PARA_FRONT = {
    Treino.Status.EM_ANDAMENTO: "em-andamento",
    Treino.Status.FEITO: "feito",
    Treino.Status.CORRIGIR_REFAZER: "corrigir-refazer",
    Treino.Status.CONCLUIDO: "concluido",
}


class ItemTreinoSerializer(serializers.ModelSerializer):
    errosComuns = serializers.CharField(source="erros_comuns", read_only=True)

    class Meta:
        model = ItemTreino
        fields = [
            "id",
            "ordem",
            "nome",
            "parametros",
            "resumo",
            "orientacoes",
            "errosComuns",
        ]


class TreinoDetalheSerializer(serializers.ModelSerializer):
    alunoId = serializers.IntegerField(source="aluno_id", read_only=True)
    alunoNome = serializers.SerializerMethodField()
    treinadorNome = serializers.SerializerMethodField()
    statusSlug = serializers.SerializerMethodField()
    statusLabel = serializers.CharField(source="get_status_display", read_only=True)
    data = serializers.DateField(source="data_prevista", read_only=True)
    realizadoEm = serializers.DateTimeField(source="realizado_em", read_only=True)
    exercicios = ItemTreinoSerializer(many=True, read_only=True)

    class Meta:
        model = Treino
        fields = [
            "id",
            "nome",
            "titulo",
            "objetivo",
            "data",
            "status",
            "statusSlug",
            "statusLabel",
            "realizadoEm",
            "alunoId",
            "alunoNome",
            "treinadorNome",
            "exercicios",
        ]

    def _nome_usuario(self, usuario) -> str:
        nome = f"{usuario.first_name} {usuario.last_name}".strip()
        return nome or usuario.username

    def get_alunoNome(self, obj: Treino) -> str:
        return self._nome_usuario(obj.aluno)

    def get_treinadorNome(self, obj: Treino) -> str:
        return self._nome_usuario(obj.treinador)

    def get_statusSlug(self, obj: Treino) -> str:
        return STATUS_API_PARA_FRONT.get(obj.status, "em-andamento")


class TreinoStatusConsultaSerializer(serializers.ModelSerializer):
    """US23 (RF2306) — Retorno enxuto de consulta de status."""

    alunoId = serializers.IntegerField(source="aluno_id", read_only=True)
    statusSlug = serializers.SerializerMethodField()
    statusLabel = serializers.CharField(source="get_status_display", read_only=True)
    realizadoEm = serializers.DateTimeField(source="realizado_em", read_only=True)

    class Meta:
        model = Treino
        fields = [
            "id",
            "nome",
            "alunoId",
            "status",
            "statusSlug",
            "statusLabel",
            "realizadoEm",
        ]

    def get_statusSlug(self, obj: Treino) -> str:
        return STATUS_API_PARA_FRONT.get(obj.status, "em-andamento")


class RegistrarStatusAlunoSerializer(serializers.Serializer):
    """US29 (RF2312) — Aluno marca como FEITO ou desfaz para EM_ANDAMENTO."""

    status = serializers.ChoiceField(
        choices=[Treino.Status.FEITO, Treino.Status.EM_ANDAMENTO],
        required=True,
    )


class AvaliarConclusaoTreinadorSerializer(serializers.Serializer):
    """US15 (RF1215) — Treinador conclui (CONCLUIDO) ou devolve (CORRIGIR_REFAZER)."""

    status = serializers.ChoiceField(
        choices=[Treino.Status.CONCLUIDO, Treino.Status.CORRIGIR_REFAZER],
        required=True,
    )