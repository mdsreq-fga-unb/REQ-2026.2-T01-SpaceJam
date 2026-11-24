from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.contas.models import Usuario

from .models import Planejamento


class PlanejamentoSerializer(serializers.ModelSerializer):

    aluno = serializers.PrimaryKeyRelatedField(
        queryset=Usuario.objects.none(),
        error_messages={
            "required": "Selecione o aluno.",
            "null": "Selecione o aluno.",
            "does_not_exist": "Aluno não encontrado na sua carteira.",
            "incorrect_type": "Aluno inválido.",
        },
    )
    nome = serializers.CharField(
        max_length=255,
        error_messages={
            "required": "Informe o nome do planejamento.",
            "blank": "Informe o nome do planejamento.",
            "max_length": "O nome do planejamento deve ter no máximo 255 caracteres.",
        },
    )
    aluno_nome = serializers.SerializerMethodField()
    planejamento_anterior = serializers.SerializerMethodField()

    class Meta:
        model = Planejamento
        fields = [
            "id",
            "aluno",
            "aluno_nome",
            "nome",
            "status",
            "criado_em",
            "encerrado_em",
            "planejamento_anterior",
        ]
        read_only_fields = ["id", "status", "criado_em", "encerrado_em"]
        # o 2º planejamento. A RN27 manda trocar o vigente, então a regra fica no create().
        validators = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            self.fields["aluno"].queryset = Usuario.objects.filter(
                papel=Usuario.Papel.ALUNO,
                treinador=request.user,
                is_active=True,
            )

    def get_aluno_nome(self, obj):
        return obj.aluno.get_full_name() or obj.aluno.username

    def get_planejamento_anterior(self, obj):
        anterior = getattr(obj, "_planejamento_anterior", None)
        return anterior.id if anterior else None

    def create(self, validated_data):
        aluno = validated_data["aluno"]
        with transaction.atomic():
            Usuario.objects.select_for_update().get(pk=aluno.pk)

            # O vigente anterior vai para o histórico; seus treinos ficam congelados.
            anterior = (
                Planejamento.objects.select_for_update()
                .filter(aluno=aluno, status=Planejamento.Status.VIGENTE)
                .first()
            )
            if anterior:
                anterior.status = Planejamento.Status.HISTORICO
                anterior.encerrado_em = timezone.now()
                anterior.save(update_fields=["status", "encerrado_em"])

            planejamento = Planejamento.objects.create(
                treinador=self.context["request"].user,
                **validated_data,
            )
        planejamento._planejamento_anterior = anterior
        return planejamento