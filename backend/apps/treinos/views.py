from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.contas.models import Usuario
from apps.contas.permissions import ROTA_PROTEGIDA, IsTreinador

from .models import Planejamento, Treino
from .serializers import (
    AlunoCarteiraSerializer,
    PlanejamentoSerializer,
    PlanejamentoVigenteSerializer,
    TreinoSerializer,
    nome_do_aluno,
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


@api_view(["GET"])
@permission_classes([*ROTA_PROTEGIDA, IsTreinador])
def consultar_planejamento_vigente(request, aluno_id):
    aluno = get_object_or_404(_alunos_da_carteira(request.user), pk=aluno_id)
    planejamento = (
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
    return Response(
        {
            "aluno": {"id": aluno.id, "nome": nome_do_aluno(aluno)},
            "planejamento": (
                PlanejamentoVigenteSerializer(planejamento).data if planejamento else None
            ),
        }
    )