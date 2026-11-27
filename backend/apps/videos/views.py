"""US42 (RF3501) — Envio do vídeo de execução de um exercício do treino.

O vídeo não passa pelo Django: o app pede um link de envio, manda o arquivo direto
ao Supabase Storage e depois confirma. O Django decide quem pode enviar e assistir,
confere o arquivo que chegou e guarda a ficha (VideoExecucao).

    1. POST exercicios/<id>/video/upload-url/  → link de envio + comprovante assinado
    2. (app envia o arquivo ao Storage pelo link, com barra de progresso)
    3. POST exercicios/<id>/video/              → confirma e cria/substitui a ficha
    4. GET  exercicios/<id>/video/              → dados do vídeo + link de 10 min
"""
from django.conf import settings
from django.core import signing
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.contas.permissions import ROTA_PROTEGIDA, IsAluno
from apps.treinos.models import Treino, TreinoExercicio
from apps.treinos.views_execucao import _validar_acesso_treino

from . import storage
from .models import VideoExecucao
from .serializers import (
    TIPOS_PERMITIDOS,
    ConfirmarEnvioSerializer,
    SolicitarEnvioSerializer,
    VideoExecucaoSerializer,
    limite_em_mb,
)
from .signals import remover_arquivo_depois_do_commit

SALT_COMPROVANTE = "videos.envio-execucao"


# --- Erros com corpo padronizado {"detail", "code"} (mesmo formato de apps.contas.termos) ---


class ErroVideo(APIException):
    def __init__(self, detail=None):
        super().__init__({"detail": detail or self.default_detail, "code": self.default_code})


class TreinoConcluido(ErroVideo):
    status_code = status.HTTP_409_CONFLICT
    default_code = "TREINO_CONCLUIDO"
    default_detail = "Este treino já foi concluído pelo treinador e não recebe novos vídeos."


class ComprovanteInvalido(ErroVideo):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "COMPROVANTE_INVALIDO"
    default_detail = "O envio expirou ou não é válido. Selecione o vídeo e envie novamente."


class ArquivoNaoEncontrado(ErroVideo):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "ARQUIVO_NAO_ENCONTRADO"
    default_detail = "O vídeo não chegou ao armazenamento. Envie novamente."


class ArquivoInvalido(ErroVideo):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "ARQUIVO_INVALIDO"


class VideoNaoEncontrado(ErroVideo):
    status_code = status.HTTP_404_NOT_FOUND
    default_code = "VIDEO_NAO_ENCONTRADO"
    default_detail = "Nenhum vídeo foi enviado para este exercício."


class ArmazenamentoIndisponivel(ErroVideo):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_code = "ARMAZENAMENTO_INDISPONIVEL"
    default_detail = "O envio de vídeos está indisponível no momento. Tente novamente mais tarde."


# --- Apoio ---


def _no_storage(operacao, *args):
    """Executa uma operação do Storage e transforma a falha em 503."""
    try:
        return operacao(*args)
    except storage.ErroArmazenamento as erro:
        raise ArmazenamentoIndisponivel() from erro


def _obter_treino_e_item(request, item_id, *, bloquear=False):
    """Exercício do treino + checagem de acesso: aluno dono ou treinador da carteira (RN03, RNF09)."""
    treinos = Treino.objects.select_related("planejamento__aluno")
    if bloquear:
        treinos = treinos.select_for_update(of=("self",))
    treino = get_object_or_404(treinos, exercicios__pk=item_id)
    _validar_acesso_treino(request.user, treino)
    item = get_object_or_404(TreinoExercicio, pk=item_id, treino=treino)
    return treino, item


def _video_do_item(item):
    return VideoExecucao.objects.filter(item_treino=item).first()


def _remover_sem_falhar(caminho):
    """Limpa um arquivo recusado; se o Storage falhar aqui, não esconde o erro principal."""
    try:
        storage.remover(caminho)
    except storage.ErroArmazenamento:
        pass


# --- Rotas ---


class SolicitarEnvioVideoView(APIView):
    """Passo 1 — Valida o arquivo informado e devolve o link de envio + comprovante."""

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]

    def post(self, request, item_id: int):
        serializer = SolicitarEnvioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dados = serializer.validated_data

        treino, item = _obter_treino_e_item(request, item_id)
        if treino.esta_concluido:
            raise TreinoConcluido()

        # O caminho é sempre montado aqui, nunca recebido do app.
        caminho = storage.montar_caminho(request.user.id, item.id, dados["extensao"])
        url_upload = _no_storage(storage.gerar_url_upload, caminho)
        comprovante = signing.dumps(
            {"item": item.id, "aluno": request.user.id, "caminho": caminho,
             "duracao": dados["duracao_segundos"]},
            salt=SALT_COMPROVANTE,
        )
        return Response(
            {
                "urlUpload": url_upload,
                # O app deve enviar o arquivo com este tipo; o bucket recusa outros.
                "tipoConteudo": dados["tipo"],
                "comprovante": comprovante,
                "validadeSegundos": storage.VALIDADE_UPLOAD_SEGUNDOS,
                # CA05: o app avisa que o envio vai substituir o vídeo atual.
                "substituiVideo": _video_do_item(item) is not None,
            },
            status=status.HTTP_200_OK,
        )


class VideoExecucaoView(APIView):
    """Passo 3 (POST, aluno) — confirma o envio. Passo 4 (GET, aluno ou treinador) — assistir."""

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissao() for permissao in (*ROTA_PROTEGIDA, IsAluno)]
        return [permissao() for permissao in ROTA_PROTEGIDA]

    def get(self, request, item_id: int):
        _, item = _obter_treino_e_item(request, item_id)
        video = _video_do_item(item)
        if video is None:
            raise VideoNaoEncontrado()

        url = _no_storage(storage.gerar_url_leitura, video.caminho_storage)
        return Response(
            {
                **VideoExecucaoSerializer(video).data,
                "urlVisualizacao": url,
                "validadeSegundos": storage.VALIDADE_LEITURA_SEGUNDOS,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request, item_id: int):
        serializer = ConfirmarEnvioSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            envio = signing.loads(
                serializer.validated_data["comprovante"],
                salt=SALT_COMPROVANTE,
                max_age=storage.VALIDADE_UPLOAD_SEGUNDOS,
            )
        except signing.BadSignature as erro:  # inclui SignatureExpired
            raise ComprovanteInvalido() from erro
        if envio["item"] != item_id or envio["aluno"] != request.user.id:
            raise ComprovanteInvalido()

        caminho = envio["caminho"]
        _, item = _obter_treino_e_item(request, item_id)
        atual = _video_do_item(item)
        if atual is not None and atual.caminho_storage == caminho:
            # Mesmo comprovante confirmado de novo (ex.: o app repetiu a chamada).
            return Response(VideoExecucaoSerializer(atual).data, status=status.HTTP_200_OK)

        # Confere o arquivo que chegou de verdade, não o que o app informou (RNF13).
        info = _no_storage(storage.obter_info, caminho)
        if info is None:
            raise ArquivoNaoEncontrado()
        tamanho = int(info.get("size") or 0)
        formato = (info.get("content_type") or "").lower()
        if formato not in TIPOS_PERMITIDOS or not 1 <= tamanho <= settings.VIDEO_MAX_BYTES:
            _remover_sem_falhar(caminho)
            raise ArquivoInvalido(
                f"O vídeo deve estar em .mp4 ou .mov e ter no máximo {limite_em_mb()} MB."
            )

        with transaction.atomic():
            treino, item = _obter_treino_e_item(request, item_id, bloquear=True)
            concluido = treino.esta_concluido
            if not concluido:
                video, criado = self._salvar(treino, item, caminho, formato, tamanho, envio["duracao"])

        if concluido:
            _remover_sem_falhar(caminho)
            raise TreinoConcluido()

        return Response(
            VideoExecucaoSerializer(video).data,
            status=status.HTTP_201_CREATED if criado else status.HTTP_200_OK,
        )

    @staticmethod
    def _salvar(treino, item, caminho, formato, tamanho, duracao):
        """Cria a ficha ou substitui o vídeo atual (RN09, CA05). Roda com o treino travado."""
        campos = {"caminho_storage": caminho, "formato": formato,
                  "tamanho_bytes": tamanho, "duracao_segundos": duracao}
        video = _video_do_item(item)
        if video is None:
            # O dono vem do treino, não do app (RN03).
            video = VideoExecucao.objects.create(
                item_treino=item, aluno=treino.planejamento.aluno, **campos
            )
            return video, True

        caminho_antigo = video.caminho_storage
        for campo, valor in campos.items():
            setattr(video, campo, valor)
        video.substituido_em = timezone.now()
        video.save(update_fields=[*campos, "substituido_em"])
        remover_arquivo_depois_do_commit(caminho_antigo)
        return video, False
