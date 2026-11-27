"""US42 — Acesso ao Supabase Storage (RNF12).

Único ponto do backend que fala com o Storage. As views usam só estas funções,
e os testes fazem mock delas (nenhum teste acessa o Supabase de verdade).
"""
import uuid
from functools import lru_cache

from django.conf import settings
from supabase import create_client

# Link de leitura curto: o vídeo só é exibido a quem o backend autorizou (RNF12, CA04).
# 10 min cobrem uma revisão normal do treinador; se vencer com a tela aberta, o front
# pede um link novo sozinho. Um link vazado deixa de funcionar nesse mesmo prazo.
VALIDADE_LEITURA_SEGUNDOS = 600
EXTENSOES_PERMITIDAS = {".mp4", ".mov"}  # RN09, RNF06


@lru_cache(maxsize=1)
def _bucket():
    """Cria o cliente uma única vez e reaproveita nas próximas chamadas."""
    cliente = create_client(settings.SUPABASE_URL, settings.SUPABASE_SECRET_KEY)
    return cliente.storage.from_(settings.SUPABASE_BUCKET_VIDEOS)


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
    return _bucket().create_signed_upload_url(caminho)["signed_url"]


def gerar_url_leitura(caminho: str, segundos: int = VALIDADE_LEITURA_SEGUNDOS) -> str:
    """Link temporário para tocar o vídeo, sem URL pública permanente (RNF12)."""
    return _bucket().create_signed_url(caminho, segundos)["signedURL"]


def obter_info(caminho: str) -> dict | None:
    """Dados reais do arquivo no Storage, ou None se ele não existir."""
    if not _bucket().exists(caminho):
        return None
    return _bucket().info(caminho)


def remover(caminho: str) -> None:
    """Apaga o arquivo do Storage (substituição de vídeo; RN05 na exclusão de conta)."""
    _bucket().remove([caminho])
