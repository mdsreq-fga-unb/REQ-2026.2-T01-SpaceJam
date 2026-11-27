import math
import os

from django.conf import settings
from rest_framework import serializers

from .models import VideoExecucao
from .storage import EXTENSOES_PERMITIDAS

TIPO_POR_EXTENSAO = {".mp4": VideoExecucao.Formato.MP4, ".mov": VideoExecucao.Formato.MOV}
TIPOS_PERMITIDOS = set(TIPO_POR_EXTENSAO.values())

MENSAGEM_FORMATO = "Envie um vídeo nos formatos .mp4 ou .mov."


def limite_em_mb() -> int:
    return settings.VIDEO_MAX_BYTES // (1024 * 1024)


class SolicitarEnvioSerializer(serializers.Serializer):
    """US42 CA01 — Dados do arquivo informados pelo app ANTES do envio (RN09, RNF06, RNF13).

    É a mesma validação que o app faz na tela (RNF15), repetida no servidor: quem chamar
    a API direto também é barrado. O bucket ainda confere tipo e tamanho na hora do envio.
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
            raise serializers.ValidationError(
                {"duracaoSegundos": f"O vídeo deve ter no máximo {settings.VIDEO_MAX_SEGUNDOS} segundos."}
            )

        return {
            "extensao": extensao,
            "tipo": tipo,
            # 59.97 s vira 60: o valor salvo nunca fica abaixo da duração real.
            "duracao_segundos": math.ceil(dados["duracaoSegundos"]),
        }


class ConfirmarEnvioSerializer(serializers.Serializer):
    comprovante = serializers.CharField()


class VideoExecucaoSerializer(serializers.ModelSerializer):
    """Dados do vídeo, sem o link: o link é gerado só na consulta do próprio vídeo."""

    exercicioId = serializers.IntegerField(source="item_treino_id", read_only=True)
    tamanhoBytes = serializers.IntegerField(source="tamanho_bytes", read_only=True)
    duracaoSegundos = serializers.IntegerField(source="duracao_segundos", read_only=True)
    enviadoEm = serializers.DateTimeField(source="enviado_em", read_only=True)
    substituidoEm = serializers.DateTimeField(source="substituido_em", read_only=True)
    substituido = serializers.BooleanField(source="foi_substituido", read_only=True)

    class Meta:
        model = VideoExecucao
        fields = [
            "id", "exercicioId", "formato", "tamanhoBytes", "duracaoSegundos",
            "enviadoEm", "substituidoEm", "substituido",
        ]
