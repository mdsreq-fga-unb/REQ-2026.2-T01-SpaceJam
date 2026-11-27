from django.db import transaction
from django.db.models import prefetch_related_objects
from django.utils import timezone
from rest_framework import serializers, status
from rest_framework.exceptions import APIException

from apps.contas.models import Usuario
from apps.exercicios.models import Exercicio
from apps.exercicios.services import snapshot_exercicio

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
        max_value=32_767,
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
        max_value=32_767,
        error_messages={
            "invalid": "Repetições deve ser um número inteiro.",
            "min_value": "As repetições devem ser no mínimo 1.",
        },
    )
    duracao_segundos = serializers.IntegerField(
        required=False,
        allow_null=True,
        min_value=1,
        max_value=2_147_483_647,
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
            "erros_orientacoes",
            "video_base",
            "video_titulo",
            "video_descricao",
            "series",
            "repeticoes",
            "duracao_segundos",
            "status",
        ]
        read_only_fields = [
            "id", "ordem", "nome", "objetivo", "fundamento",
            "orientacoes", "erros_comuns", "erros_orientacoes", "video_base",
            "video_titulo", "video_descricao", "status",
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
            prefetch_related_objects([item["exercicio_origem"] for item in itens], "erros_orientacoes")
            prescritos = []
            for ordem, item in enumerate(itens, start=1):
                origem = item["exercicio_origem"]
                dados_prescritos = snapshot_exercicio(origem)
                dados_prescritos.pop("fundamento_nome")  # O modelo persiste o código do fundamento.
                prescritos.append(
                    TreinoExercicio(
                        treino=treino,
                        ordem=ordem,
                        exercicio_origem=origem,
                        series=item["series"],
                        repeticoes=item.get("repeticoes"),
                        duracao_segundos=item.get("duracao_segundos"),
                        **dados_prescritos,
                    )
                )
            TreinoExercicio.objects.bulk_create(prescritos)
        return treino

class TreinoResumoSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    total_exercicios = serializers.IntegerField(read_only=True)
    exercicios = TreinoExercicioSerializer(many=True, read_only=True)

    class Meta:
        model = Treino
        fields = ["id", "nome", "status", "status_display", "total_exercicios", "exercicios"]


class PlanejamentoVigenteSerializer(serializers.ModelSerializer):
    treinos = TreinoResumoSerializer(many=True, read_only=True)

    class Meta:
        model = Planejamento
        fields = ["id", "nome", "criado_em", "treinos"]


class PlanejamentoResumoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planejamento
        fields = ["id", "nome"]


def nome_do_aluno(aluno):
    return aluno.get_full_name() or aluno.username


class AlunoCarteiraSerializer(serializers.ModelSerializer):
    nome = serializers.SerializerMethodField()
    planejamento_vigente = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = ["id", "nome", "planejamento_vigente"]

    def get_nome(self, obj):
        return nome_do_aluno(obj)

    def get_planejamento_vigente(self, obj):
        vigentes = obj.planejamentos_vigentes
        return PlanejamentoResumoSerializer(vigentes[0]).data if vigentes else None

class EdicaoBloqueada(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_code = "EDICAO_BLOQUEADA"
    default_detail = "Esta alteração não é permitida."

    def __init__(self, detail=None):
        super().__init__({"detail": detail or self.default_detail, "code": self.default_code})


def motivo_bloqueio_planejamento(planejamento):
    if not planejamento.is_vigente:
        return "Este planejamento está no histórico e é somente leitura."
    return None


# US25 — Editar treino
def motivo_bloqueio_edicao(treino):
    if not treino.planejamento.is_vigente:
        return "O planejamento deste treino está no histórico e é somente leitura."
    if treino.status == Treino.Status.CONCLUIDO:
        return "Treino concluído é somente leitura."
    return None


class TreinoExercicioEdicaoSerializer(TreinoExercicioSerializer):
    id = serializers.IntegerField(required=False)
    exercicio = serializers.PrimaryKeyRelatedField(
        queryset=Exercicio.objects.all(),
        source="exercicio_origem",
        required=False,
        error_messages={
            "null": "Selecione o exercício.",
            "does_not_exist": "Exercício não encontrado na biblioteca.",
            "incorrect_type": "Exercício inválido.",
        },
    )

    def validate(self, attrs):
        attrs = super().validate(attrs)
        tem_id = "id" in attrs
        tem_exercicio = "exercicio_origem" in attrs
        if tem_id and tem_exercicio:
            raise serializers.ValidationError(
                "Informe o id do exercício do treino ou o exercício da biblioteca, não os dois."
            )
        if not tem_id and not tem_exercicio:
            raise serializers.ValidationError("Selecione o exercício.")
        return attrs


class TreinoEdicaoSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(
        max_length=255,
        error_messages={
            "required": "Informe o nome do treino.",
            "blank": "Informe o nome do treino.",
            "max_length": "O nome do treino deve ter no máximo 255 caracteres.",
        },
    )
    exercicios = TreinoExercicioEdicaoSerializer(
        many=True,
        allow_empty=False,
        error_messages={
            "required": "Selecione ao menos um exercício.",
            "empty": "Selecione ao menos um exercício.",
            "not_a_list": "Envie a lista de exercícios.",
        },
    )

    class Meta:
        model = Treino
        fields = ["id", "planejamento", "nome", "status", "criado_em", "exercicios"]
        read_only_fields = ["id", "planejamento", "status", "criado_em"]

    def validate(self, attrs):
        itens = attrs["exercicios"]
        do_treino = set(self.instance.exercicios.values_list("id", flat=True))
        erros = [{} for _ in itens]
        vistos = set()
        for posicao, item in enumerate(itens):
            if "id" not in item:
                continue
            if item["id"] not in do_treino:
                erros[posicao]["id"] = ["Exercício não pertence a este treino."]
            elif item["id"] in vistos:
                erros[posicao]["id"] = ["Exercício repetido na lista."]
            vistos.add(item["id"])
        if any(erros):
            raise serializers.ValidationError({"exercicios": erros})
        return attrs

    def update(self, instance, validated_data):
        itens = validated_data["exercicios"]
        with transaction.atomic():
            Planejamento.objects.select_for_update().get(pk=instance.planejamento_id)
            treino = (
                Treino.objects.select_for_update(of=("self",))
                .select_related("planejamento")
                .get(pk=instance.pk)
            )
            motivo = motivo_bloqueio_edicao(treino)
            if motivo:
                raise EdicaoBloqueada(motivo)

            existentes = {
                te.id: te for te in TreinoExercicio.objects.select_for_update().filter(treino=treino)
            }
            enviados = {item["id"]: item for item in itens if "id" in item}
            novos = [item for item in itens if "id" not in item]

            for te_id, te in existentes.items():
                if te_id not in enviados and te.status != TreinoExercicio.Status.A_FAZER:
                    raise EdicaoBloqueada(
                        f"O exercício \"{te.nome}\" já foi executado e não pode ser removido."
                    )

            for te_id, item in enviados.items():
                te = existentes[te_id]
                novos_valores = (item["series"], item.get("repeticoes"), item.get("duracao_segundos"))
                valores_atuais = (te.series, te.repeticoes, te.duracao_segundos)
                if te.status != TreinoExercicio.Status.A_FAZER and novos_valores != valores_atuais:
                    raise EdicaoBloqueada(
                        f"O exercício \"{te.nome}\" já foi executado e não pode ser alterado."
                    )

            treino.nome = validated_data["nome"]
            if novos and treino.status == Treino.Status.FEITO:
                treino.status = Treino.Status.EM_ANDAMENTO
            treino.save(update_fields=["nome", "status"])

            TreinoExercicio.objects.filter(
                pk__in=[te_id for te_id in existentes if te_id not in enviados]
            ).delete()

            restantes = sorted(
                (te for te_id, te in existentes.items() if te_id in enviados),
                key=lambda te: te.ordem,
            )
            for posicao, te in enumerate(restantes, start=1):
                item = enviados[te.id]
                te.series = item["series"]
                te.repeticoes = item.get("repeticoes")
                te.duracao_segundos = item.get("duracao_segundos")
                te.ordem = posicao
                te.save(update_fields=["series", "repeticoes", "duracao_segundos", "ordem"])

            prefetch_related_objects([item["exercicio_origem"] for item in novos], "erros_orientacoes")
            prescritos = []
            for posicao, item in enumerate(novos, start=len(restantes) + 1):
                origem = item["exercicio_origem"]
                dados_prescritos = snapshot_exercicio(origem)
                dados_prescritos.pop("fundamento_nome")
                prescritos.append(
                    TreinoExercicio(
                        treino=treino,
                        ordem=posicao,
                        exercicio_origem=origem,
                        series=item["series"],
                        repeticoes=item.get("repeticoes"),
                        duracao_segundos=item.get("duracao_segundos"),
                        **dados_prescritos,
                    )
                )
            TreinoExercicio.objects.bulk_create(prescritos)
        return treino


# US19 — Editar planejamento de treino
class PlanejamentoEdicaoSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(
        max_length=255,
        error_messages={
            "required": "Informe o nome do planejamento.",
            "blank": "Informe o nome do planejamento.",
            "max_length": "O nome do planejamento deve ter no máximo 255 caracteres.",
        },
    )
    aluno_nome = serializers.SerializerMethodField()

    class Meta:
        model = Planejamento
        fields = ["id", "aluno", "aluno_nome", "nome", "status", "criado_em", "encerrado_em"]
        read_only_fields = ["id", "aluno", "status", "criado_em", "encerrado_em"]

    def get_aluno_nome(self, obj):
        return nome_do_aluno(obj.aluno)


def motivo_bloqueio_remocao(treino):
    if treino.status != Treino.Status.EM_ANDAMENTO:
        return "Só é possível remover treinos que ainda não foram executados."
    if treino.exercicios.exclude(status=TreinoExercicio.Status.A_FAZER).exists():
        return "Este treino já tem exercícios executados e não pode ser removido."
    return None


# US21 — Consultar histórico de planejamentos
class PlanejamentoHistoricoResumoSerializer(serializers.ModelSerializer):
    total_treinos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Planejamento
        fields = ["id", "nome", "criado_em", "encerrado_em", "total_treinos"]


class PlanejamentoHistoricoSerializer(serializers.ModelSerializer):
    treinos = TreinoResumoSerializer(many=True, read_only=True)

    class Meta:
        model = Planejamento
        fields = ["id", "nome", "criado_em", "encerrado_em", "treinos"]