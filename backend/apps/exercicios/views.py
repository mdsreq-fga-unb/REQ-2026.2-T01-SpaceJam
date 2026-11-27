from django.db import transaction
from django.db.models import Min
from django.shortcuts import get_object_or_404
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.contas.permissions import ROTA_PROTEGIDA, IsTreinador, IsTreinadorOuAluno


from .models import ErroComumExercicio, Exercicio, Fundamento
from .serializers import (
    AssociarErrosComunsSerializer,
    ErroComumExercicioSerializer,
    ExercicioSerializer,
)


class ExercicioViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
    ):
    # prefetch: traz os erros e orientações (US37) sem uma consulta por exercício.
    queryset = Exercicio.objects.prefetch_related("erros_orientacoes")
    serializer_class = ExercicioSerializer
    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsTreinadorOuAluno]
        else:
            permission_classes = [IsAuthenticated, IsTreinador]

        return [permission() for permission in permission_classes]
    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

    @action(detail=False, methods=["get"])
    def fundamentos(self, request):
        return Response(
            [{"valor": valor, "nome": nome} for valor, nome in Fundamento.choices]
        )


class ErroComumExercicioViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """US37 / RF2420 — Erros comuns e orientações corretivas de um exercício.

    Só o treinador com os termos vigentes aceitos acessa (RN14, RNF08, US63); o
    aluno recebe 403 (CA04). O exercício vem sempre da URL e, se não existir, 404.
    Um item só é encontrado pelo exercício a que pertence: pelo exercício errado, 404.
    A edição (CA01) substitui o texto anterior do item na biblioteca.
    A remoção (CA02) é definitiva e tira o item deste exercício ("Remover orientação"
    nas telas). Treinos já prescritos não dependem do item: a RN23 é garantida pela
    cópia dos dados no momento da prescrição (RF2307).
    """

    serializer_class = ErroComumExercicioSerializer
    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]

    def get_exercicio(self):
        if not hasattr(self, "_exercicio"):
            self._exercicio = get_object_or_404(Exercicio, pk=self.kwargs["exercicio_pk"])
        return self._exercicio

    def get_queryset(self):
        return self.get_exercicio().erros_orientacoes.all()

    def perform_create(self, serializer):
        serializer.save(exercicio=self.get_exercicio())




# Texto vazio ou só com espaços (RNF14): nunca é oferecido nem associado.
_TEXTO_EM_BRANCO = r"^\s*$"


def _pares_candidatos(exercicio):
    """Pares de outros exercícios que o exercício ainda não tem (US33).

    Textos iguais em exercícios diferentes aparecem uma vez só, e pares cujo texto já
    existe no exercício ficam de fora.
    """
    de_outros = (
        ErroComumExercicio.objects.exclude(exercicio=exercicio)
        .exclude(erro__regex=_TEXTO_EM_BRANCO)
        .exclude(orientacao_corretiva__regex=_TEXTO_EM_BRANCO)
    )
    representantes = (
        de_outros.values("erro", "orientacao_corretiva")
        .annotate(menor_id=Min("id"))
        .values_list("menor_id", flat=True)
    )
    ja_no_exercicio = set(
        exercicio.erros_orientacoes.values_list("erro", "orientacao_corretiva")
    )
    return [
        par
        for par in ErroComumExercicio.objects.filter(id__in=list(representantes)).order_by("erro", "id")
        if (par.erro, par.orientacao_corretiva) not in ja_no_exercicio
    ]


class ErrosComunsCandidatosView(APIView):
    """US33 / RF2416 — Pares de erro e orientação de outros exercícios, disponíveis para associar.

    Só o treinador acessa (RN14, RNF08); o aluno recebe 403 (CA04).
    """

    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]

    def get(self, request, exercicio_pk):
        exercicio = get_object_or_404(Exercicio, pk=exercicio_pk)
        return Response(ErroComumExercicioSerializer(_pares_candidatos(exercicio), many=True).data)


class AssociarErrosComunsView(APIView):
    """US33 — Associa ao exercício pares já documentados em outros exercícios."""

    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]

    def post(self, request, exercicio_pk):
        entrada = AssociarErrosComunsSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        ids = list(dict.fromkeys(entrada.validated_data["ids"]))

        with transaction.atomic():
            exercicio = get_object_or_404(Exercicio.objects.select_for_update(), pk=exercicio_pk)
            origens = ErroComumExercicio.objects.in_bulk(ids)
            if len(origens) != len(ids):
                raise ValidationError({"ids": ["Um ou mais pares não foram encontrados."]})
            if any(not par.erro.strip() or not par.orientacao_corretiva.strip() for par in origens.values()):
                raise ValidationError({"ids": ["Orientação corretiva obrigatória."]})

            ja_no_exercicio = set(
                exercicio.erros_orientacoes.values_list("erro", "orientacao_corretiva")
            )
            criados = []
            for par_id in ids:
                origem = origens[par_id]
                texto = (origem.erro, origem.orientacao_corretiva)
                if texto in ja_no_exercicio:
                    continue
                ja_no_exercicio.add(texto)
                criados.append(
                    ErroComumExercicio.objects.create(
                        exercicio=exercicio,
                        erro=origem.erro,
                        orientacao_corretiva=origem.orientacao_corretiva,
                    )
                )

        return Response(
            {
                "criados": ErroComumExercicioSerializer(criados, many=True).data,
                "ignorados": len(ids) - len(criados),
            },
            status=status.HTTP_201_CREATED if criados else status.HTTP_200_OK,
        )
