from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.contas.permissions import IsTreinador

from .models import Exercicio, Fundamento
from .serializers import ExercicioSerializer


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