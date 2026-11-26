from rest_framework import serializers

from .models import ItemTreino, Treino
from .models import FeedbackAluno, ItemTreino, Treino

STATUS_API_PARA_FRONT = {
    Treino.Status.EM_ANDAMENTO: "em-andamento",
    Treino.Status.FEITO: "feito",
    Treino.Status.CORRIGIR_REFAZER: "corrigir-refazer",
    Treino.Status.CONCLUIDO: "concluido",
}


class FeedbackAlunoSerializer(serializers.ModelSerializer):
    """Representação do feedback do aluno alinhada a FeedbackExercicio.tsx e DetalheTreino.tsx."""

    autorId = serializers.IntegerField(source="aluno_id", read_only=True)
    autorNome = serializers.SerializerMethodField()
    exercicioId = serializers.IntegerField(source="item_treino_id", read_only=True)
    criadoEm = serializers.DateTimeField(source="criado_em", read_only=True)
    editadoEm = serializers.DateTimeField(source="editado_em", read_only=True)
    editado = serializers.BooleanField(read_only=True)

    class Meta:
        model = FeedbackAluno
        fields = [
            "id",
            "exercicioId",
            "autorId",
            "autorNome",
            "texto",
            "editado",
            "criadoEm",
            "editadoEm",
        ]

    def get_autorNome(self, obj: FeedbackAluno) -> str:
        nome = f"{obj.aluno.first_name} {obj.aluno.last_name}".strip()
        return nome or obj.aluno.username


class SalvarFeedbackAlunoSerializer(serializers.Serializer):
    """US49 / US50 — Valida texto obrigatório, não vazio e com no máximo 1.000 caracteres (RN19, RNF14)."""

    texto = serializers.CharField(
        allow_blank=False,
        trim_whitespace=False,
        max_length=1000,
        error_messages={
            "blank": "Escreva um feedback antes de salvar.",
            "required": "Escreva um feedback antes de salvar.",
            "max_length": "Use no máximo 1.000 caracteres.",
        },
    )

    def validate_texto(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Escreva um feedback antes de salvar.")
        if len(value) > 1000:
            raise serializers.ValidationError("Use no máximo 1.000 caracteres.")
        return value
class FeedbackAlunoSerializer(serializers.ModelSerializer):
    """Representação do feedback do aluno alinhada a FeedbackExercicio.tsx e DetalheTreino.tsx."""

    autorId = serializers.IntegerField(source="aluno_id", read_only=True)
    autorNome = serializers.SerializerMethodField()
    exercicioId = serializers.IntegerField(source="item_treino_id", read_only=True)
    criadoEm = serializers.DateTimeField(source="criado_em", read_only=True)
    editadoEm = serializers.DateTimeField(source="editado_em", read_only=True)
    editado = serializers.BooleanField(read_only=True)

    class Meta:
        model = FeedbackAluno
        fields = [
            "id",
            "exercicioId",
            "autorId",
            "autorNome",
            "texto",
            "editado",
            "criadoEm",
            "editadoEm",
        ]

    def get_autorNome(self, obj: FeedbackAluno) -> str:
        nome = f"{obj.aluno.first_name} {obj.aluno.last_name}".strip()
        return nome or obj.aluno.username


class SalvarFeedbackAlunoSerializer(serializers.Serializer):
    """US49 / US50 — Valida texto obrigatório, não vazio e com no máximo 1.000 caracteres (RN19, RNF14)."""

    texto = serializers.CharField(
        allow_blank=False,
        trim_whitespace=False,
        max_length=1000,
        error_messages={
            "blank": "Escreva um feedback antes de salvar.",
            "required": "Escreva um feedback antes de salvar.",
            "max_length": "Use no máximo 1.000 caracteres.",
        },
    )

    def validate_texto(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Escreva um feedback antes de salvar.")
        if len(value) > 1000:
            raise serializers.ValidationError("Use no máximo 1.000 caracteres.")
        return value
class ItemTreinoSerializer(serializers.ModelSerializer):
    errosComuns = serializers.CharField(source="erros_comuns", read_only=True)
    feedback = FeedbackAlunoSerializer(source="feedback_aluno", read_only=True)

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
            "feedback",
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
        default=Treino.Status.FEITO,
        required=False,
    )


class AvaliarConclusaoTreinadorSerializer(serializers.Serializer):
    """US15 (RF1215) — Treinador conclui (CONCLUIDO) ou devolve (CORRIGIR_REFAZER)."""

    status = serializers.ChoiceField(
        choices=[Treino.Status.CONCLUIDO, Treino.Status.CORRIGIR_REFAZER],
        default=Treino.Status.CONCLUIDO,
        required=False,
    )