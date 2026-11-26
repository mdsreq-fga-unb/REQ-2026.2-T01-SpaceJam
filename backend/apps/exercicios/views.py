from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Exercicio, Fundamento
from .serializers import ExercicioSerializer
from apps.contas.permissions import IsTreinador, TermosVigentesAceitos


class ExercicioViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
    ):
    queryset = Exercicio.objects.all()
    serializer_class = ExercicioSerializer
    permission_classes = [ IsAuthenticated, TermosVigentesAceitos, IsTreinador,]

    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)

    @action(detail=False, methods=["get"])
    def fundamentos(self, request):
        return Response(
            [{"valor": valor, "nome": nome} for valor, nome in Fundamento.choices]
        )