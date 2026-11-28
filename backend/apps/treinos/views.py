from django.db import transaction
from django.db.models import Count, F, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.contas.models import Usuario
from apps.contas.permissions import ROTA_PROTEGIDA, IsAluno, IsTreinador

from .models import Planejamento, Treino
from .serializers import (
    AlunoCarteiraSerializer,
    EdicaoBloqueada,
    PlanejamentoEdicaoSerializer,
    PlanejamentoHistoricoResumoSerializer,
    PlanejamentoHistoricoSerializer,
    PlanejamentoSerializer,
    PlanejamentoVigenteSerializer,
    TreinoEdicaoSerializer,
    TreinoSerializer,
    motivo_bloqueio_edicao,
    motivo_bloqueio_planejamento,
    nome_do_aluno,
    remover_treinos_do_planejamento,
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

def _alunos_da_carteira(treinador):
    return Usuario.objects.filter(
        papel=Usuario.Papel.ALUNO, treinador=treinador, is_active=True
    )


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def listar_carteira_planejamentos(request):
    alunos = (
        _alunos_da_carteira(request.user)
        .prefetch_related(
            Prefetch(
                "planejamentos",
                queryset=Planejamento.objects.filter(status=Planejamento.Status.VIGENTE),
                to_attr="planejamentos_vigentes",
            )
        )
        .order_by("first_name", "last_name", "username")
    )
    return Response(AlunoCarteiraSerializer(alunos, many=True).data)


def _planejamento_vigente_do_aluno(aluno):
    return (
        Planejamento.objects.filter(aluno=aluno, status=Planejamento.Status.VIGENTE)
        .prefetch_related(
            Prefetch(
                "treinos",
                queryset=Treino.objects.annotate(total_exercicios=Count("exercicios"))
                .prefetch_related("exercicios"),
            )
        )
        .first()
    )


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def consultar_planejamento_vigente(request, aluno_id):
    aluno = get_object_or_404(_alunos_da_carteira(request.user), pk=aluno_id)
    planejamento = _planejamento_vigente_do_aluno(aluno)
    return Response(
        {
            "aluno": {"id": aluno.id, "nome": nome_do_aluno(aluno)},
            "planejamento": (
                PlanejamentoVigenteSerializer(planejamento).data if planejamento else None
            ),
        }
    )


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsAluno])
def consultar_meu_planejamento(request):
    planejamento = _planejamento_vigente_do_aluno(request.user)
    return Response({
        "planejamento": PlanejamentoVigenteSerializer(planejamento).data if planejamento else None,
    })

def _treinos_com_exercicios():
    return Prefetch(
        "treinos",
        queryset=Treino.objects.annotate(total_exercicios=Count("exercicios"))
        .prefetch_related("exercicios"),
    )


# US25 — Editar treino
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
    serializer.save()
    treino = Treino.objects.prefetch_related("exercicios").get(pk=treino.pk)
    return Response(TreinoSerializer(treino, context={"request": request}).data)


# US19 — Editar planejamento de treino
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
        serializer = PlanejamentoEdicaoSerializer(planejamento, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def remover_treino(request, planejamento_id, treino_id):
    with transaction.atomic():
        planejamento = _planejamento_da_carteira(request, planejamento_id)
        remover_treinos_do_planejamento(planejamento, [treino_id])
    return Response(status=status.HTTP_204_NO_CONTENT)


# US21 — Consultar histórico de planejamentos
def _planejamentos_historico(aluno):
    return Planejamento.objects.filter(aluno=aluno, status=Planejamento.Status.HISTORICO)


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def listar_historico_planejamentos(request, aluno_id):
    aluno = get_object_or_404(_alunos_da_carteira(request.user), pk=aluno_id)
    planejamentos = (
        _planejamentos_historico(aluno)
        .annotate(total_treinos=Count("treinos"))
        .order_by(F("encerrado_em").desc(nulls_last=True), "-id")
    )
    return Response(
        {
            "aluno": {"id": aluno.id, "nome": nome_do_aluno(aluno)},
            "planejamentos": PlanejamentoHistoricoResumoSerializer(planejamentos, many=True).data,
        }
    )


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def consultar_planejamento_historico(request, aluno_id, planejamento_id):
    aluno = get_object_or_404(_alunos_da_carteira(request.user), pk=aluno_id)
    planejamento = get_object_or_404(
        _planejamentos_historico(aluno).prefetch_related(_treinos_com_exercicios()),
        pk=planejamento_id,
    )
    return Response(
        {
            "aluno": {"id": aluno.id, "nome": nome_do_aluno(aluno)},
            "planejamento": PlanejamentoHistoricoSerializer(planejamento).data,
        }
    )
