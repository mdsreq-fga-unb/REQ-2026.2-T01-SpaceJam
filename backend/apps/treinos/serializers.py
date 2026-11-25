from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.contas.models import Usuario
from apps.exercicios.models import Exercicio

from .models import Planejamento, Treino, TreinoExercicio


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

class TreinoExercicioSerializer(serializers.ModelSerializer):

    exercicio = serializers.PrimaryKeyRelatedField(
        queryset=Exercicio.objects.all(),
        source="exercicio_origem",
        error_messages={
            "required": "Selecione o exercício.",
            "null": "Selecione o exercício.",
            "does_not_exist": "Exercício não encontrado na biblioteca.",
            "incorrect_type": "Exercício inválido.",
        },
    )
    series = serializers.IntegerField(
        min_value=1,
        error_messages={
            "required": "Informe as séries.",
            "null": "Informe as séries.",
            "invalid": "Séries deve ser um número inteiro.",
            "min_value": "As séries devem ser no mínimo 1.",
        },
    )
    repeticoes = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
        error_messages={
            "invalid": "Repetições deve ser um número inteiro.",
            "min_value": "As repetições devem ser no mínimo 1.",
        },
    )
    duracao_segundos = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
        error_messages={
            "invalid": "Duração deve ser um número inteiro de segundos.",
            "min_value": "A duração deve ser de no mínimo 1 segundo.",
        },
    )

    class Meta:
        model = TreinoExercicio
        fields = [
            "id",
            "exercicio",
            "ordem",
            "nome",
            "objetivo",
            "fundamento",
            "orientacoes",
            "erros_comuns",
            "video_base",
            "series",
            "repeticoes",
            "duracao_segundos",
            "status",
        ]
        read_only_fields = [
            "id", "ordem", "nome", "objetivo", "fundamento",
            "orientacoes", "erros_comuns", "video_base", "status",
        ]
        validators = []

    def validate(self, attrs):
        repeticoes = attrs.get("repeticoes")
        duracao = attrs.get("duracao_segundos")
        if repeticoes is None and duracao is None:
            raise serializers.ValidationError(
                "Informe as repetições ou a duração do exercício."
            )
        if repeticoes is not None and duracao is not None:
            raise serializers.ValidationError(
                "Informe repetições ou duração, não os dois."
            )
        return attrs


class TreinoSerializer(serializers.ModelSerializer):

    nome = serializers.CharField(
        max_length=255,
        error_messages={
            "required": "Informe o nome do treino.",
            "blank": "Informe o nome do treino.",
            "max_length": "O nome do treino deve ter no máximo 255 caracteres.",
        },
    )
    exercicios = TreinoExercicioSerializer(
        many=True,
        allow_empty=False,
        error_messages={
            "required": "Selecione ao menos um exercício.",
            "empty": "Selecione ao menos um exercício.",
            "not_a_list": "Envie a lista de exercícios.",
        },
    )
    planejamento = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Treino
        fields = ["id", "planejamento", "nome", "status", "criado_em", "exercicios"]
        read_only_fields = ["id", "planejamento", "status", "criado_em"]

    def create(self, validated_data):
        itens = validated_data.pop("exercicios")
        planejamento = self.context["planejamento"]
        with transaction.atomic():
            # Trava o planejamento e revalida: ele pode ter virado histórico
            # (RN27) entre a leitura da view e este ponto.
            atual = Planejamento.objects.select_for_update().get(pk=planejamento.pk)
            if not atual.is_vigente:
                raise serializers.ValidationError(
                    {"planejamento": "Só é possível criar treinos em um planejamento vigente."}
                )
            treino = Treino.objects.create(planejamento=atual, **validated_data)
            TreinoExercicio.objects.bulk_create(
                [
                    TreinoExercicio(
                        treino=treino,
                        ordem=ordem,
                        exercicio_origem=origem,
                        # RN23 — cópia dos dados da biblioteca na data da prescrição
                        nome=origem.nome,
                        objetivo=origem.objetivo,
                        fundamento=origem.fundamento,
                        orientacoes=origem.orientacoes,
                        erros_comuns=origem.erros_comuns,
                        video_base=origem.video_base,
                        series=item["series"],
                        repeticoes=item.get("repeticoes"),
                        duracao_segundos=item.get("duracao_segundos"),
                    )
                    for ordem, item in enumerate(itens, start=1)
                    for origem in [item["exercicio_origem"]]
                ]
            )
        return treino