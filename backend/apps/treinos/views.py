from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.contas.permissions import ROTA_PROTEGIDA, IsTreinador

from .models import Planejamento, Treino
from .serializers import (
    EdicaoBloqueada,
    PlanejamentoSerializer,
    TreinoEdicaoSerializer,
    TreinoSerializer,
    motivo_bloqueio_edicao,
)


@api_view(["POST"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def cadastrar_planejamento(request):
    serializer = PlanejamentoSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    planejamento = serializer.save()
    return Response(
        PlanejamentoSerializer(planejamento, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(["POST"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def criar_treino(request, planejamento_id):
    planejamento = get_object_or_404(
        Planejamento, pk=planejamento_id, aluno__treinador=request.user
    )
    if not planejamento.is_vigente:
        return Response(
            {"planejamento": ["Só é possível criar treinos em um planejamento vigente."]},
            status=status.HTTP_400_BAD_REQUEST,
        )
    serializer = TreinoSerializer(
        data=request.data,
        context={"request": request, "planejamento": planejamento},
    )
    serializer.is_valid(raise_exception=True)
    treino = serializer.save()
    return Response(
        TreinoSerializer(treino, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )

@api_view(["PUT"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def editar_treino(request, treino_id):
    treino = get_object_or_404(
        Treino.objects.select_related("planejamento"),
        pk=treino_id,
        planejamento__aluno__treinador=request.user,
    )
    motivo = motivo_bloqueio_edicao(treino)
    if motivo:
        raise EdicaoBloqueada(motivo)
    serializer = TreinoEdicaoSerializer(treino, data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    treino = serializer.save()
    treino = Treino.objects.get(pk=treino.pk)
    return Response(TreinoSerializer(treino, context={"request": request}).data)