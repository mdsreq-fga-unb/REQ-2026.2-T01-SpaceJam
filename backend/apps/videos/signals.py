"""Faxina do Storage (RN05, RNF12): o arquivo sai junto com a ficha do vídeo.

A ficha pode ser apagada de vários jeitos: exclusão do exercício na edição do treino
(US25), exclusão do treino, do planejamento ou da conta (cascata). Em todos eles o
Django dispara o `post_delete`, então o arquivo é removido do bucket sem depender
de cada tela lembrar disso.
"""
import logging

from django.db import transaction
from django.db.models.signals import post_delete
from django.dispatch import receiver

from . import storage
from .models import VideoExecucao

logger = logging.getLogger(__name__)


def remover_arquivo_depois_do_commit(caminho: str) -> None:
    """Apaga o arquivo só se a transação do banco der certo.

    Se a exclusão no banco for desfeita (rollback), o arquivo continua no bucket,
    e a ficha continua apontando para ele. Se o Storage falhar, a exclusão no banco
    já aconteceu: registramos o caminho no log para remoção manual.
    """

    def remover():
        try:
            storage.remover(caminho)
        except storage.ErroArmazenamento:
            logger.exception("Não foi possível remover o vídeo %s do Storage.", caminho)

    transaction.on_commit(remover)


@receiver(post_delete, sender=VideoExecucao, dispatch_uid="videos_remover_arquivo_do_storage")
def remover_arquivo_ao_apagar_ficha(sender, instance, **kwargs):
    remover_arquivo_depois_do_commit(instance.caminho_storage)
