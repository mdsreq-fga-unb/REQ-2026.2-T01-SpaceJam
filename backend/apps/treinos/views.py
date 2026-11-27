from django.db.models import Count, Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from apps.contas.models import Usuario
from apps.contas.permissions import ROTA_PROTEGIDA, IsAluno, IsTreinador

from .models import Planejamento, Treino
from .serializers import (
    AlunoCarteiraSerializer,
    PlanejamentoSerializer,
    PlanejamentoVigenteSerializer,
    TreinoSerializer,
    nome_do_aluno,
)
from .serializers_execucao import TreinoStatusConsultaSerializer


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



class HistoricoTreinosPaginacao(PageNumberPagination):
    """A listagem do histórico é paginada para manter o carregamento dentro de 5 s."""

    page_size = 20
    page_size_query_param = "tamanho"
    max_page_size = 100


def _treinos_do_historico(aluno, estados=None):
    """Treinos do aluno em qualquer planejamento (RN13), do mais recente para o mais antigo."""
    treinos = Treino.objects.filter(planejamento__aluno=aluno)
    if estados is not None:
        treinos = treinos.filter(status__in=estados)
    return (
        treinos.select_related("planejamento")
        .annotate(total_exercicios=Count("exercicios"))
        .order_by("-criado_em", "-id")
    )


class HistoricoTreinosAlunoView(ListAPIView):
    """US28 — Treinador consulta o histórico de treinos de um aluno da sua carteira."""

    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]
    serializer_class = TreinoStatusConsultaSerializer
    pagination_class = HistoricoTreinosPaginacao

    def _aluno(self):
        if not hasattr(self, "_aluno_consultado"):
            aluno = get_object_or_404(
                Usuario, pk=self.kwargs["aluno_id"], papel=Usuario.Papel.ALUNO
            )
            # RN03 / RNF09 — só a carteira do próprio treinador.
            if aluno.treinador_id != self.request.user.pk:
                raise PermissionDenied("Você não tem permissão para acessar este aluno.")
            self._aluno_consultado = aluno
        return self._aluno_consultado

    def get_queryset(self):
        return _treinos_do_historico(self._aluno(), [Treino.Status.CONCLUIDO])

    def list(self, request, *args, **kwargs):
        resposta = super().list(request, *args, **kwargs)
        aluno = self._aluno()
        resposta.data["aluno"] = {"id": aluno.pk, "nome": nome_do_aluno(aluno)}
        return resposta

class MeuHistoricoTreinosView(ListAPIView):
    """US58 — Aluno consulta o próprio histórico de treinos."""

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]
    serializer_class = TreinoStatusConsultaSerializer
    pagination_class = HistoricoTreinosPaginacao

    def get_queryset(self):
        return _treinos_do_historico(self.request.user)