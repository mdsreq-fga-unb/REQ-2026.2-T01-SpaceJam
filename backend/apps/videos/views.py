"""US42 (RF3501) — Envio do vídeo de execução de um exercício do treino.

O vídeo não passa pelo Django: o app pede um link de envio, manda o arquivo direto
ao Supabase Storage e depois confirma. O Django decide quem pode enviar e assistir,
confere o arquivo que chegou e guarda a ficha (VideoExecucao).

    1. POST exercicios/<id>/video/upload-url/  → link de envio + comprovante assinado
    2. (app envia o arquivo ao Storage pelo link, com barra de progresso)
    3. POST exercicios/<id>/video/              → confirma: cria, substitui ou abre nova tentativa
    4. GET  exercicios/<id>/video/              → dados do vídeo + link de 10 min
    5. GET  meus-videos/                        → todos os vídeos do aluno e o que ele pode fazer

O que cada envio pode fazer (novo, substituição, nova tentativa ou bloqueio) está em
`tentativas.situacao_envio` (RN06, RN07, RN09, RN10).

Todo erro destas rotas responde `{"detail", "code"}`, para o app mostrar a mensagem
certa ou a tela genérica "Não foi possível concluir".
"""
import math

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

from . import midia, storage, tentativas
from .models import VideoExecucao
from .serializers import (
    TIPOS_PERMITIDOS,
    ConfirmarEnvioSerializer,
    MeuVideoSerializer,
    SolicitarEnvioSerializer,
    VideoExecucaoSerializer,
    limite_em_mb,
    mensagem_duracao,
)
from .signals import remover_arquivo_depois_do_commit

SALT_COMPROVANTE = "videos.envio-execucao"


# --- Erros com corpo padronizado {"detail", "code"} (mesmo formato de apps.contas.termos) ---


class ErroVideo(APIException):
    def __init__(self, detail=None, **extras):
        super().__init__({"detail": detail or self.default_detail, "code": self.default_code, **extras})


class TreinoConcluido(ErroVideo):
    status_code = status.HTTP_409_CONFLICT
    default_code = tentativas.TREINO_CONCLUIDO
    default_detail = "Este treino já foi concluído pelo treinador e não recebe novos vídeos."


class ExercicioConcluido(ErroVideo):
    status_code = status.HTTP_409_CONFLICT
    default_code = tentativas.EXERCICIO_CONCLUIDO
    default_detail = "Este exercício já foi validado pelo treinador e não recebe novos vídeos."


class VideoAvaliado(ErroVideo):
    """RN10 — com feedback do treinador, o vídeo não pode mais ser trocado."""

    status_code = status.HTTP_409_CONFLICT
    default_code = tentativas.VIDEO_AVALIADO
    default_detail = (
        "O treinador já avaliou este vídeo, então ele não pode mais ser substituído. "
        "Um novo envio só é possível se o exercício for devolvido para correção."
    )


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
    default_detail = "O vídeo não atende aos limites de envio."


class VideoNaoEncontrado(ErroVideo):
    status_code = status.HTTP_404_NOT_FOUND
    default_code = "VIDEO_NAO_ENCONTRADO"
    default_detail = "Nenhum vídeo foi enviado para este exercício."


class ArmazenamentoIndisponivel(ErroVideo):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_code = "ARMAZENAMENTO_INDISPONIVEL"
    default_detail = "O envio de vídeos está indisponível no momento. Tente novamente mais tarde."


ERRO_POR_BLOQUEIO = {
    tentativas.TREINO_CONCLUIDO: TreinoConcluido,
    tentativas.EXERCICIO_CONCLUIDO: ExercicioConcluido,
    tentativas.VIDEO_AVALIADO: VideoAvaliado,
}

# Erros do DRF (login, permissão, rota) ganham um `code` também.
CODIGO_POR_STATUS = {
    401: "NAO_AUTENTICADO",
    403: "SEM_PERMISSAO",
    404: "NAO_ENCONTRADO",
    405: "METODO_NAO_PERMITIDO",
}


class ErroPadronizadoMixin:
    """Garante `{"detail", "code"}` em qualquer erro destas rotas."""

    def handle_exception(self, exc):
        resposta = super().handle_exception(exc)
        dados = resposta.data
        if resposta.status_code >= 400 and not (isinstance(dados, dict) and "code" in dados):
            detalhe = dados.get("detail") if isinstance(dados, dict) else None
            resposta.data = {
                "detail": str(detalhe or "Não foi possível concluir a operação."),
                "code": CODIGO_POR_STATUS.get(resposta.status_code, "ERRO"),
            }
        return resposta


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


def _situacao_ou_erro(treino, item, atual):
    situacao = tentativas.situacao_envio(treino, item, atual)
    if not situacao.permitido:
        raise ERRO_POR_BLOQUEIO[situacao.bloqueio]()
    return situacao


def _remover_sem_falhar(caminho):
    """Limpa um arquivo recusado; se o Storage falhar aqui, não esconde o erro principal."""
    try:
        storage.remover(caminho)
    except storage.ErroArmazenamento:
        pass


def _recusar_arquivo(caminho, mensagem):
    _remover_sem_falhar(caminho)
    raise ArquivoInvalido(mensagem)


# --- Rotas ---


class SolicitarEnvioVideoView(ErroPadronizadoMixin, APIView):
    """Passo 1 — Valida o arquivo informado e devolve o link de envio + comprovante.

    O app só chama esta rota depois que o aluno confirma o envio na prévia (RNF15):
    antes disso nada sai do aparelho.
    """

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]

    def post(self, request, item_id: int):
        serializer = SolicitarEnvioSerializer(data=request.data)
        if not serializer.is_valid():
            campos = {campo: [str(m) for m in msgs] for campo, msgs in serializer.errors.items()}
            primeira = next(iter(campos.values()))[0]
            raise ArquivoInvalido(primeira, campos=campos)
        dados = serializer.validated_data

        treino, item = _obter_treino_e_item(request, item_id)
        situacao = _situacao_ou_erro(treino, item, tentativas.video_atual(item))

        # O caminho é sempre montado aqui, nunca recebido do app.
        caminho = storage.montar_caminho(request.user.id, item.id, dados["extensao"])
        url_upload = _no_storage(storage.gerar_url_upload, caminho)
        comprovante = signing.dumps(
            {"item": item.id, "aluno": request.user.id, "caminho": caminho},
            salt=SALT_COMPROVANTE,
        )
        return Response(
            {
                "urlUpload": url_upload,
                # O app deve enviar o arquivo com este tipo; o bucket recusa outros.
                "tipoConteudo": dados["tipo"],
                "comprovante": comprovante,
                "validadeSegundos": storage.VALIDADE_UPLOAD_SEGUNDOS,
                # NOVO | SUBSTITUICAO (CA05) | NOVA_TENTATIVA (RN09/RN06).
                "modo": situacao.modo,
                "substituiVideo": situacao.modo == tentativas.SUBSTITUICAO,
            },
            status=status.HTTP_200_OK,
        )


class VideoExecucaoView(ErroPadronizadoMixin, APIView):
    """Passo 3 (POST, aluno) — confirma o envio. Passo 4 (GET, aluno ou treinador) — assistir."""

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissao() for permissao in (*ROTA_PROTEGIDA, IsAluno)]
        return [permissao() for permissao in ROTA_PROTEGIDA]

    def get(self, request, item_id: int):
        """Vídeo atual do exercício; `?tentativa=N` consulta uma submissão anterior."""
        _, item = _obter_treino_e_item(request, item_id)
        videos = item.videos.select_related("feedback_treinador")
        tentativa = request.query_params.get("tentativa")
        if tentativa is not None:
            video = videos.filter(tentativa=tentativa).first() if tentativa.isdigit() else None
        else:
            video = videos.order_by("-tentativa").first()
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
        if not serializer.is_valid():
            raise ComprovanteInvalido()
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
        _obter_treino_e_item(request, item_id)
        ja_confirmado = (
            VideoExecucao.objects.select_related("feedback_treinador")
            .filter(caminho_storage=caminho, item_treino_id=item_id)
            .first()
        )
        if ja_confirmado is not None:
            # Mesmo comprovante confirmado de novo (ex.: o app repetiu a chamada).
            return Response(VideoExecucaoSerializer(ja_confirmado).data, status=status.HTTP_200_OK)

        duracao = self._conferir_arquivo(caminho)

        with transaction.atomic():
            treino, item = _obter_treino_e_item(request, item_id, bloquear=True)
            situacao = tentativas.situacao_envio(treino, item, tentativas.video_atual(item))
            if situacao.permitido:
                video = self._salvar(treino, item, situacao.modo, caminho, duracao)

        if not situacao.permitido:
            # Ex.: o treinador avaliou ou concluiu o treino enquanto o arquivo subia.
            _remover_sem_falhar(caminho)
            raise ERRO_POR_BLOQUEIO[situacao.bloqueio]()

        return Response(
            {**VideoExecucaoSerializer(video).data, "modo": situacao.modo},
            status=status.HTTP_200_OK if situacao.modo == tentativas.SUBSTITUICAO else status.HTTP_201_CREATED,
        )

    @staticmethod
    def _conferir_arquivo(caminho):
        """Confere o arquivo que chegou de verdade, não o que o app informou (RNF06, RNF13).

        Devolve os dados reais: (formato, tamanho, duração em segundos inteiros).
        Arquivo fora dos limites é apagado do Storage antes de responder.
        """
        info = _no_storage(storage.obter_info, caminho)
        if info is None:
            raise ArquivoNaoEncontrado()
        tamanho = int(info.get("size") or 0)
        formato = (info.get("content_type") or "").lower()
        if formato not in TIPOS_PERMITIDOS or not 1 <= tamanho <= settings.VIDEO_MAX_BYTES:
            _recusar_arquivo(
                caminho, f"O vídeo deve estar em .mp4 ou .mov e ter no máximo {limite_em_mb()} MB."
            )

        try:
            segundos = _no_storage(storage.ler_duracao, caminho, tamanho)
        except midia.ArquivoIlegivel:
            _recusar_arquivo(
                caminho, "Não foi possível ler este vídeo. Envie um arquivo .mp4 ou .mov gravado pelo celular ou câmera."
            )
        if segundos > settings.VIDEO_MAX_SEGUNDOS:
            _recusar_arquivo(caminho, mensagem_duracao())
        # 59.97 s vira 60: o valor salvo nunca fica abaixo da duração real.
        return formato, tamanho, max(1, math.ceil(segundos))

    @staticmethod
    def _salvar(treino, item, modo, caminho, dados_arquivo):
        """Cria a submissão, substitui o vídeo atual ou abre nova tentativa. Roda com o treino travado."""
        formato, tamanho, duracao = dados_arquivo
        campos = {"caminho_storage": caminho, "formato": formato,
                  "tamanho_bytes": tamanho, "duracao_segundos": duracao}
        atual = tentativas.video_atual(item)

        if modo == tentativas.SUBSTITUICAO:
            # RN10 / CA05 — mesma submissão, vídeo ainda sem feedback.
            caminho_antigo = atual.caminho_storage
            for campo, valor in campos.items():
                setattr(atual, campo, valor)
            atual.substituido_em = timezone.now()
            atual.save(update_fields=[*campos, "substituido_em"])
            remover_arquivo_depois_do_commit(caminho_antigo)
            return atual

        # NOVO (1ª submissão) ou NOVA_TENTATIVA (RN09/RN06): a anterior fica no histórico.
        # O dono vem do treino, não do app (RN03).
        return VideoExecucao.objects.create(
            item_treino=item,
            aluno=treino.planejamento.aluno,
            tentativa=(atual.tentativa + 1) if atual else 1,
            **campos,
        )


class MeusVideosView(ErroPadronizadoMixin, APIView):
    """US42 — "Meus vídeos": todas as execuções enviadas pelo aluno, de todos os treinos.

    Cada item traz o status (aguardando avaliação ou avaliado), o feedback do treinador,
    a tentativa e, no vídeo atual de cada exercício, o que o aluno ainda pode fazer
    (`envio`). Filtro opcional: `?treino=<id>`. Só os vídeos do próprio aluno (RN03).
    """

    permission_classes = [*ROTA_PROTEGIDA, IsAluno]

    def get(self, request):
        videos = (
            VideoExecucao.objects.filter(item_treino__treino__planejamento__aluno=request.user)
            .select_related("item_treino__treino", "feedback_treinador")
            .order_by("-enviado_em", "-id")
        )
        treino = request.query_params.get("treino")
        if treino is not None:
            if not treino.isdigit():
                return Response([], status=status.HTTP_200_OK)
            videos = videos.filter(item_treino__treino_id=treino)
        videos = list(videos)

        # Vídeo atual = maior tentativa de cada exercício.
        maiores = {}
        for video in videos:
            atual = maiores.get(video.item_treino_id)
            if atual is None or video.tentativa > atual.tentativa:
                maiores[video.item_treino_id] = video
        atuais = {item_id: video.id for item_id, video in maiores.items()}

        dados = MeuVideoSerializer(videos, many=True, context={"atuais": atuais}).data
        return Response(dados, status=status.HTTP_200_OK)
