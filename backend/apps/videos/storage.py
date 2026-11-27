"""US42 — Acesso ao Supabase Storage (RNF12).

Único ponto do backend que fala com o Storage. As views usam só estas funções,
e os testes fazem mock delas (nenhum teste acessa o Supabase de verdade).
Qualquer falha do Storage (fora do ar, chave errada, .env incompleto) vira
`ErroArmazenamento`, que a API responde como 503.
"""
import uuid
from functools import lru_cache

from django.conf import settings
from supabase import create_client

# Link de leitura curto: o vídeo só é exibido a quem o backend autorizou (RNF12, CA04).
# 10 min cobrem uma revisão normal do treinador; se vencer com a tela aberta, o front
# pede um link novo sozinho. Um link vazado deixa de funcionar nesse mesmo prazo.
VALIDADE_LEITURA_SEGUNDOS = 600
# O link de envio gerado pelo Supabase vale 2 horas; o comprovante usa o mesmo prazo.
VALIDADE_UPLOAD_SEGUNDOS = 2 * 60 * 60
EXTENSOES_PERMITIDAS = {".mp4", ".mov"}  # RN09, RNF06


class ErroArmazenamento(Exception):
    """O Storage não respondeu como esperado ou não está configurado."""


@lru_cache(maxsize=1)
def _bucket():
    """Cria o cliente uma única vez e reaproveita nas próximas chamadas."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SECRET_KEY:
        raise ErroArmazenamento("SUPABASE_URL e SUPABASE_SECRET_KEY não estão configuradas.")
    cliente = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
    return cliente.storage.from_(settings.SUPABASE_BUCKET_VIDEOS)


def _executar(operacao):
    try:
        return operacao()
    except ErroArmazenamento:
        raise
    except Exception as erro:  # biblioteca, rede ou resposta inesperada do Supabase
        raise ErroArmazenamento(str(erro)) from erro


def montar_caminho(aluno_id: int, item_id: int, extensao: str) -> str:
    """Caminho do arquivo no bucket. Sempre gerado pelo backend, nunca pelo front.

    Ex.: dev-maria/aluno_7/item_15/3f2b9c...e1.mp4
    - prefixo: separa os arquivos de cada integrante/ambiente no bucket compartilhado;
    - uuid: nome único, então um envio nunca sobrescreve outro.
    """
    extensao = extensao.lower()
    if extensao not in EXTENSOES_PERMITIDAS:
        raise ValueError(f"Extensão não permitida: {extensao}")
    return f"{settings.SUPABASE_PREFIXO}/aluno_{aluno_id}/item_{item_id}/{uuid.uuid4().hex}{extensao}"


def gerar_url_upload(caminho: str) -> str:
    """Link para o navegador enviar o arquivo direto ao Storage (válido por ~2h)."""
    return _executar(lambda: _bucket().create_signed_upload_url(caminho)["signed_url"])


def gerar_url_leitura(caminho: str, segundos: int = VALIDADE_LEITURA_SEGUNDOS) -> str:
    """Link temporário para tocar o vídeo, sem URL pública permanente (RNF12)."""
    return _executar(lambda: _bucket().create_signed_url(caminho, segundos)["signedURL"])


def obter_info(caminho: str) -> dict | None:
    """Dados reais do arquivo no Storage (`size`, `content_type`...), ou None se não existir."""

    def consultar():
        if not _bucket().exists(caminho):
            return None
        return _bucket().info(caminho)

    return _executar(consultar)


def remover(caminho: str) -> None:
    """Apaga o arquivo do Storage (substituição de vídeo; RN05 na exclusão de conta)."""
    _executar(lambda: _bucket().remove([caminho]))
