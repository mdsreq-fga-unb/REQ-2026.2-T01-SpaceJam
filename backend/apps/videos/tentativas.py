"""Regra única do que o aluno pode fazer com o vídeo de um exercício.

Usada pelas rotas de envio (que decidem de verdade, com o treino travado) e pelas
consultas (detalhe do treino e "Meus vídeos"), para a tela mostrar só os botões que
o servidor vai aceitar.

Ordem das regras:
1. Treino concluído pelo treinador (RN07)          → bloqueado: TREINO_CONCLUIDO
2. Exercício validado como "Concluído" (RN06)       → bloqueado: EXERCICIO_CONCLUIDO
3. Sem vídeo                                        → NOVO (1ª submissão)
4. Vídeo atual sem feedback do treinador (RN10)     → SUBSTITUICAO (mesma submissão)
5. Vídeo avaliado + exercício devolvido (RN09/RN06) → NOVA_TENTATIVA (nova submissão)
6. Vídeo avaliado, sem devolução                    → bloqueado: VIDEO_AVALIADO
"""
from dataclasses import dataclass

from apps.treinos.models import Treino, TreinoExercicio

NOVO = "NOVO"
SUBSTITUICAO = "SUBSTITUICAO"
NOVA_TENTATIVA = "NOVA_TENTATIVA"

TREINO_CONCLUIDO = "TREINO_CONCLUIDO"
EXERCICIO_CONCLUIDO = "EXERCICIO_CONCLUIDO"
VIDEO_AVALIADO = "VIDEO_AVALIADO"


@dataclass(frozen=True)
class SituacaoEnvio:
    modo: str | None = None       # NOVO | SUBSTITUICAO | NOVA_TENTATIVA
    bloqueio: str | None = None   # código do motivo, quando não pode enviar

    @property
    def permitido(self):
        return self.bloqueio is None


def exercicio_devolvido(treino, item):
    """RN06 — devolvido para correção no próprio exercício ou no treino inteiro (US15)."""
    return (
        item.status == TreinoExercicio.Status.CORRIGIR
        or treino.status == Treino.Status.CORRIGIR_REFAZER
    )


def situacao_envio(treino, item, video_atual) -> SituacaoEnvio:
    if treino.esta_concluido:
        return SituacaoEnvio(bloqueio=TREINO_CONCLUIDO)
    if item.status == TreinoExercicio.Status.CONCLUIDO:
        return SituacaoEnvio(bloqueio=EXERCICIO_CONCLUIDO)
    if video_atual is None:
        return SituacaoEnvio(modo=NOVO)
    if not video_atual.foi_avaliado:
        return SituacaoEnvio(modo=SUBSTITUICAO)
    if exercicio_devolvido(treino, item):
        return SituacaoEnvio(modo=NOVA_TENTATIVA)
    return SituacaoEnvio(bloqueio=VIDEO_AVALIADO)


def video_atual(item):
    """Vídeo da submissão atual (maior tentativa) do exercício, com o feedback junto."""
    return (
        item.videos.select_related("feedback_treinador").order_by("-tentativa").first()
    )
