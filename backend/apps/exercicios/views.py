from django.shortcuts import get_object_or_404
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.contas.permissions import ROTA_PROTEGIDA, IsTreinador

from .models import Exercicio, Fundamento
from .serializers import ErroComumExercicioSerializer, ExercicioSerializer


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
    permission_classes = [IsAuthenticated, IsTreinador]

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
    viewsets.GenericViewSet,
):
    """US37 / RF2420 — Erros comuns e orientações corretivas de um exercício.

    Só o treinador com os termos vigentes aceitos acessa (RN14, RNF08, US63); o
    aluno recebe 403 (CA04). O exercício vem sempre da URL e, se não existir, 404.
    Um item só é encontrado pelo exercício a que pertence: pelo exercício errado, 404.
    A edição (CA01) substitui o texto anterior do item na biblioteca.
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
