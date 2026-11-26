from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.permissions import IsAluno, IsTreinador, ROTA_PROTEGIDA

from .models import FeedbackAluno, ItemTreino, Treino
from .serializers import (
    AvaliarConclusaoTreinadorSerializer,
    FeedbackAlunoSerializer,
    RegistrarStatusAlunoSerializer,
    SalvarFeedbackAlunoSerializer,
    TreinoDetalheSerializer,
    TreinoStatusConsultaSerializer,
)


def _obter_treino_com_permissao(request, treino_id: int) -> Treino:
    """Busca o treino (404 se não existir) e valida vínculo por papel (403 se fora do escopo)."""
    treino = get_object_or_404(
        Treino.objects.select_related("aluno", "treinador").prefetch_related(
            "exercicios__feedback_aluno__aluno"
        ),
        pk=treino_id,
    )
    usuario = request.user
    if usuario.is_treinador:
        if treino.treinador_id != usuario.id and treino.aluno.treinador_id != usuario.id:
            raise PermissionDenied("Você não tem permissão para acessar treinos de alunos fora da sua carteira.")
    elif usuario.is_aluno:
        if treino.aluno_id != usuario.id:
            raise PermissionDenied("Você só pode acessar os seus próprios treinos.")
    else:
        raise PermissionDenied("Perfil sem permissão para acessar treinos.")
    return treino


class TreinoDetalheView(APIView):
    """Consulta completa do treino (usada pela tela DetalheTreino)."""

    permission_classes = [*ROTA_PROTEGIDA]

    def get(self, request, treino_id: int):
        treino = _obter_treino_com_permissao(request, treino_id)
        serializer = TreinoDetalheSerializer(treino)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TreinoStatusView(APIView):
    """US23 (RF2306) — Consultar status do treino (Treinador da carteira ou próprio Aluno)."""

    permission_classes = [*ROTA_PROTEGIDA]

    def get(self, request, treino_id: int):
        treino = _obter_treino_com_permissao(request, treino_id)
        serializer = TreinoStatusConsultaSerializer(treino)
        return Response(serializer.data, status=status.HTTP_200_OK)


class TreinoRegistrarStatusAlunoView(APIView):
    """US29 (RF2312) — Aluno marca treino como FEITO (idempotente) ou desfaz para EM_ANDAMENTO."""

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]

    def patch(self, request, treino_id: int):
        treino = _obter_treino_com_permissao(request, treino_id)

        if treino.esta_concluido:
            return Response(
                {"detail": "Treinos já concluídos pelo treinador não podem ter o status alterado."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = RegistrarStatusAlunoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        novo_status = serializer.validated_data.get("status", Treino.Status.FEITO)

        if novo_status == Treino.Status.FEITO:
            # Idempotente: se já estiver FEITO, mantém o realizado_em original sem duplicar
            if treino.status != Treino.Status.FEITO:
                treino.status = Treino.Status.FEITO
                treino.realizado_em = timezone.now()
                treino.save(update_fields=["status", "realizado_em", "atualizado_em"])
        elif novo_status == Treino.Status.EM_ANDAMENTO:
            # Desfazer marcação de FEITO enquanto não concluído/devolvido
            if treino.status == Treino.Status.CORRIGIR_REFAZER:
                return Response(
                    {"detail": "Treino devolvido para correção deve ser marcado como Feito após nova execução."},
                    status=status.HTTP_409_CONFLICT,
                )
            if treino.status != Treino.Status.EM_ANDAMENTO:
                treino.status = Treino.Status.EM_ANDAMENTO
                treino.realizado_em = None
                treino.save(update_fields=["status", "realizado_em", "atualizado_em"])

        return Response(TreinoStatusConsultaSerializer(treino).data, status=status.HTTP_200_OK)


class TreinoConcluirTreinadorView(APIView):
    """US15 (RF1215) — Treinador registra conclusão irreversível (CONCLUIDO) ou devolve (CORRIGIR_REFAZER)."""

    permission_classes = [*ROTA_PROTEGIDA, IsTreinador]

    def patch(self, request, treino_id: int):
        treino = _obter_treino_com_permissao(request, treino_id)

        if treino.esta_concluido:
            return Response(
                {"detail": "Este treino já foi concluído e não pode mais ser alterado."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = AvaliarConclusaoTreinadorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        novo_status = serializer.validated_data.get("status", Treino.Status.CONCLUIDO)

        treino.status = novo_status
        treino.save(update_fields=["status", "atualizado_em"])

        return Response(TreinoStatusConsultaSerializer(treino).data, status=status.HTTP_200_OK)
    
def _obter_item_treino_do_aluno(request, item_id: int) -> ItemTreino:
    """Busca o ItemTreino (404 se não existir) e garante que pertence ao aluno autenticado (403)."""
    item = get_object_or_404(
        ItemTreino.objects.select_related(
            "treino",
            "treino__aluno",
            "feedback_aluno",
            "feedback_aluno__aluno",
        ),
        pk=item_id,
    )
    if item.treino.aluno_id != request.user.id:
        raise PermissionDenied("Você só pode registrar ou editar feedback nos exercícios do seu próprio treino.")
    return item


class ItemTreinoFeedbackAlunoView(APIView):
    """US49 (RF3608 — POST) e US50 (RF3609 — PATCH) — Registrar e editar feedback do aluno."""

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]

    def post(self, request, item_id: int):
        """US49 (RF3608) — Registrar feedback único do aluno enquanto o treino não estiver concluído."""
        item = _obter_item_treino_do_aluno(request, item_id)

        if item.treino.esta_concluido:
            return Response(
                {"detail": "Não é possível registrar feedback em um treino já concluído."},
                status=status.HTTP_409_CONFLICT,
            )

        if hasattr(item, "feedback_aluno"):
            return Response(
                {"detail": "Você já registrou um feedback para este exercício. Utilize a edição."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = SalvarFeedbackAlunoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback = FeedbackAluno.objects.create(
            item_treino=item,
            aluno=request.user,
            texto=serializer.validated_data["texto"],
        )

        return Response(
            FeedbackAlunoSerializer(feedback).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request, item_id: int):
        """US50 (RF3609) — Editar feedback do próprio aluno enquanto o treino não estiver concluído."""
        item = _obter_item_treino_do_aluno(request, item_id)

        if not hasattr(item, "feedback_aluno"):
            return Response(
                {"detail": "Nenhum feedback encontrado para este exercício."},
                status=status.HTTP_404_NOT_FOUND,
            )

        feedback = item.feedback_aluno
        if feedback.aluno_id != request.user.id:
            raise PermissionDenied("Apenas o autor pode editar este feedback.")

        if item.treino.esta_concluido:
            return Response(
                {"detail": "Não é possível editar feedback de um treino já concluído."},
                status=status.HTTP_409_CONFLICT,
            )

        serializer = SalvarFeedbackAlunoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feedback.texto = serializer.validated_data["texto"]
        feedback.editado_em = timezone.now()
        feedback.save(update_fields=["texto", "editado_em"])

        return Response(
            FeedbackAlunoSerializer(feedback).data,
            status=status.HTTP_200_OK,
        )