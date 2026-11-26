from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.contas.permissions import ROTA_PROTEGIDA, IsTreinador

from .models import Planejamento, Treino
from .serializers import (
    EdicaoBloqueada,
    PlanejamentoEdicaoSerializer,
    PlanejamentoSerializer,
    TreinoEdicaoSerializer,
    TreinoSerializer,
    motivo_bloqueio_edicao,
    motivo_bloqueio_planejamento,
    motivo_bloqueio_remocao,
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

def _planejamento_da_carteira(request, planejamento_id):
    return get_object_or_404(
        Planejamento.objects.select_for_update(of=("self",)),
        pk=planejamento_id,
        aluno__treinador=request.user,
    )


@api_view(["PATCH"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def editar_planejamento(request, planejamento_id):
    with transaction.atomic():
        planejamento = _planejamento_da_carteira(request, planejamento_id)
        motivo = motivo_bloqueio_planejamento(planejamento)
        if motivo:
            raise EdicaoBloqueada(motivo)
        serializer = PlanejamentoEdicaoSerializer(
            planejamento, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def remover_treino(request, planejamento_id, treino_id):
    with transaction.atomic():
        planejamento = _planejamento_da_carteira(request, planejamento_id)
        treino = get_object_or_404(
            Treino.objects.select_for_update(), pk=treino_id, planejamento=planejamento
        )
        list(treino.exercicios.select_for_update())
        motivo = motivo_bloqueio_planejamento(planejamento) or motivo_bloqueio_remocao(treino)
        if motivo:
            raise EdicaoBloqueada(motivo)
        treino.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)