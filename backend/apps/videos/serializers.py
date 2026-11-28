import os

from django.conf import settings
from rest_framework import serializers

from . import tentativas
from .models import FeedbackTreinador, VideoExecucao
from .storage import EXTENSOES_PERMITIDAS

TIPO_POR_EXTENSAO = {".mp4": VideoExecucao.Formato.MP4, ".mov": VideoExecucao.Formato.MOV}
TIPOS_PERMITIDOS = set(TIPO_POR_EXTENSAO.values())

MENSAGEM_FORMATO = "Envie um vídeo nos formatos .mp4 ou .mov."

AGUARDANDO_AVALIACAO = "AGUARDANDO_AVALIACAO"
AVALIADO = "AVALIADO"


def limite_em_mb() -> int:
    return settings.VIDEO_MAX_BYTES // (1024 * 1024)


def mensagem_duracao() -> str:
    return f"O vídeo deve ter no máximo {settings.VIDEO_MAX_SEGUNDOS} segundos."


class SolicitarEnvioSerializer(serializers.Serializer):
    """US42 CA01 — Dados do arquivo informados pelo app ANTES do envio (RN09, RNF06, RNF13).

    É a mesma validação que o app faz na tela (RNF15), repetida no servidor: quem chamar
    a API direto também é barrado. Depois do envio, a confirmação confere tudo de novo
    no arquivo real (tamanho, tipo e duração lida no cabeçalho do vídeo).
    """

    nomeArquivo = serializers.CharField(max_length=255)
    # Alguns navegadores (comum com .mov no iPhone) não informam o tipo; aí ele vem da extensão.
    tipo = serializers.CharField(max_length=50, required=False, allow_blank=True, default="")
    tamanhoBytes = serializers.IntegerField(min_value=1)
    # O navegador lê a duração com casas decimais (ex.: 59.97).
    duracaoSegundos = serializers.FloatField(min_value=0.001)

    def validate(self, dados):
        extensao = os.path.splitext(dados["nomeArquivo"])[1].lower()
        if extensao not in EXTENSOES_PERMITIDAS:
            raise serializers.ValidationError({"nomeArquivo": MENSAGEM_FORMATO})

        tipo = dados["tipo"].strip().lower() or TIPO_POR_EXTENSAO[extensao]
        if tipo not in TIPOS_PERMITIDOS:
            raise serializers.ValidationError({"tipo": MENSAGEM_FORMATO})

        if dados["tamanhoBytes"] > settings.VIDEO_MAX_BYTES:
            raise serializers.ValidationError(
                {"tamanhoBytes": f"O vídeo deve ter no máximo {limite_em_mb()} MB."}
            )
        if dados["duracaoSegundos"] > settings.VIDEO_MAX_SEGUNDOS:
            raise serializers.ValidationError({"duracaoSegundos": mensagem_duracao()})

        return {"extensao": extensao, "tipo": tipo}


class ConfirmarEnvioSerializer(serializers.Serializer):
    comprovante = serializers.CharField()


class FeedbackTreinadorSerializer(serializers.ModelSerializer):
    """Leitura do feedback do treinador (o aluno só consulta, RN11)."""

    criadoEm = serializers.DateTimeField(source="criado_em", read_only=True)
    editadoEm = serializers.DateTimeField(source="editado_em", read_only=True)

    class Meta:
        model = FeedbackTreinador
        fields = ["id", "texto", "criadoEm", "editadoEm"]


class VideoExecucaoSerializer(serializers.ModelSerializer):
    """Dados do vídeo, sem o link: o link é gerado só na consulta do próprio vídeo.

    Para não fazer uma consulta por vídeo, carregue com `select_related("feedback_treinador")`.
    """

    exercicioId = serializers.IntegerField(source="item_treino_id", read_only=True)
    tamanhoBytes = serializers.IntegerField(source="tamanho_bytes", read_only=True)
    duracaoSegundos = serializers.IntegerField(source="duracao_segundos", read_only=True)
    enviadoEm = serializers.DateTimeField(source="enviado_em", read_only=True)
    substituidoEm = serializers.DateTimeField(source="substituido_em", read_only=True)
    substituido = serializers.BooleanField(source="foi_substituido", read_only=True)
    # RN10 — AVALIADO = tem feedback do treinador; não pode mais ser trocado.
    status = serializers.SerializerMethodField()
    feedbackTreinador = FeedbackTreinadorSerializer(source="feedback", read_only=True)

    class Meta:
        model = VideoExecucao
        fields = [
            "id", "exercicioId", "tentativa", "formato", "tamanhoBytes", "duracaoSegundos",
            "enviadoEm", "substituidoEm", "substituido", "status", "feedbackTreinador",
        ]

    def get_status(self, obj):
        return AVALIADO if obj.foi_avaliado else AGUARDANDO_AVALIACAO


def dados_situacao(situacao: tentativas.SituacaoEnvio) -> dict:
    """O que a tela pode oferecer no exercício: enviar, substituir, nova tentativa ou nada."""
    return {"permitido": situacao.permitido, "modo": situacao.modo, "motivo": situacao.bloqueio}


class MeuVideoSerializer(VideoExecucaoSerializer):
    """Item de "Meus vídeos": o vídeo + onde ele está + o que o aluno ainda pode fazer.

    `envio` só vem no vídeo atual do exercício (as tentativas antigas são histórico).
    Precisa no contexto `atuais`: {item_id: id do vídeo atual}.
    """

    exercicioNome = serializers.CharField(source="item_treino.nome", read_only=True)
    treinoId = serializers.IntegerField(source="item_treino.treino_id", read_only=True)
    treinoNome = serializers.CharField(source="item_treino.treino.nome", read_only=True)
    atual = serializers.SerializerMethodField()
    envio = serializers.SerializerMethodField()

    class Meta(VideoExecucaoSerializer.Meta):
        fields = [
            *VideoExecucaoSerializer.Meta.fields,
            "exercicioNome", "treinoId", "treinoNome", "atual", "envio",
        ]

    def _eh_atual(self, obj):
        return self.context["atuais"].get(obj.item_treino_id) == obj.id

    def get_atual(self, obj):
        return self._eh_atual(obj)

    def get_envio(self, obj):
        if not self._eh_atual(obj):
            return None
        item = obj.item_treino
        return dados_situacao(tentativas.situacao_envio(item.treino, item, obj))
