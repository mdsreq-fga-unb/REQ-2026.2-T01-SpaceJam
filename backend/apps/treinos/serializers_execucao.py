from rest_framework import serializers

from apps.videos.serializers import VideoExecucaoSerializer

from .models import FeedbackAluno, Treino, TreinoExercicio
from .serializers import nome_do_aluno


STATUS_API_PARA_FRONT = {
    Treino.Status.EM_ANDAMENTO: "em-andamento",
    Treino.Status.FEITO: "feito",
    Treino.Status.CORRIGIR_REFAZER: "corrigir-refazer",
    Treino.Status.CONCLUIDO: "concluido",
}


class FeedbackAlunoSerializer(serializers.ModelSerializer):
    autorId = serializers.IntegerField(source="aluno_id", read_only=True)
    autorNome = serializers.SerializerMethodField()
    exercicioId = serializers.IntegerField(source="item_treino_id", read_only=True)
    criadoEm = serializers.DateTimeField(source="criado_em", read_only=True)
    editadoEm = serializers.DateTimeField(source="editado_em", read_only=True)
    editado = serializers.BooleanField(read_only=True)

    class Meta:
        model = FeedbackAluno
        fields = [
            "id", "exercicioId", "autorId", "autorNome", "texto", "editado", "criadoEm", "editadoEm",
        ]

    def get_autorNome(self, obj):
        return nome_do_aluno(obj.aluno)


class SalvarFeedbackAlunoSerializer(serializers.Serializer):
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

    def validate_texto(self, value):
        if not value.strip():
            raise serializers.ValidationError("Escreva um feedback antes de salvar.")
        return value


class ExercicioExecucaoSerializer(serializers.ModelSerializer):
    parametros = serializers.SerializerMethodField()
    errosComuns = serializers.CharField(source="erros_comuns", read_only=True)
    errosOrientacoes = serializers.JSONField(source="erros_orientacoes", read_only=True)
    # US35 CA03: título e descrição do vídeo-base copiados na prescrição (RN23).
    videoTitulo = serializers.CharField(source="video_titulo", read_only=True)
    videoDescricao = serializers.CharField(source="video_descricao", read_only=True)
    feedback = FeedbackAlunoSerializer(source="feedback_aluno", read_only=True)
    # US42 CA05: null = "Enviar vídeo"; preenchido = "Substituir vídeo". Sem link: o link
    # de 10 min só é gerado quando alguém abre o vídeo (GET exercicios/<id>/video/).
    videoExecucao = VideoExecucaoSerializer(source="video_execucao", read_only=True)

    class Meta:
        model = TreinoExercicio
        fields = [
            "id", "ordem", "nome", "parametros", "orientacoes", "errosComuns", "errosOrientacoes",
            "videoTitulo", "videoDescricao", "feedback", "videoExecucao",
        ]

    def get_parametros(self, obj):
        series = f"{obj.series} {'série' if obj.series == 1 else 'séries'}"
        if obj.repeticoes is not None:
            repeticoes = "repetição" if obj.repeticoes == 1 else "repetições"
            return f"{series} · {obj.repeticoes} {repeticoes}"
        duracao = "segundo" if obj.duracao_segundos == 1 else "segundos"
        return f"{series} · {obj.duracao_segundos} {duracao}"


class TreinoStatusConsultaSerializer(serializers.ModelSerializer):
    alunoId = serializers.IntegerField(source="planejamento.aluno_id", read_only=True)
    statusSlug = serializers.SerializerMethodField()
    statusLabel = serializers.CharField(source="get_status_display", read_only=True)
    realizadoEm = serializers.DateTimeField(source="realizado_em", read_only=True)

    class Meta:
        model = Treino
        fields = ["id", "nome", "alunoId", "status", "statusSlug", "statusLabel", "realizadoEm"]

    def get_statusSlug(self, obj):
        return STATUS_API_PARA_FRONT[obj.status]


class TreinoDetalheSerializer(TreinoStatusConsultaSerializer):
    planejamentoId = serializers.IntegerField(source="planejamento_id", read_only=True)
    alunoNome = serializers.SerializerMethodField()
    treinadorNome = serializers.SerializerMethodField()
    exercicios = ExercicioExecucaoSerializer(many=True, read_only=True)

    class Meta(TreinoStatusConsultaSerializer.Meta):
        fields = [
            *TreinoStatusConsultaSerializer.Meta.fields, "planejamentoId", "alunoNome",
            "treinadorNome", "exercicios",
        ]

    def get_alunoNome(self, obj):
        return nome_do_aluno(obj.planejamento.aluno)

    def get_treinadorNome(self, obj):
        return nome_do_aluno(obj.planejamento.treinador)


class RegistrarStatusAlunoSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[Treino.Status.FEITO, Treino.Status.EM_ANDAMENTO])


class AvaliarConclusaoTreinadorSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[Treino.Status.CONCLUIDO, Treino.Status.CORRIGIR_REFAZER])
