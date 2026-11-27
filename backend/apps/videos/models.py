from django.conf import settings
from django.db import models
from django.db.models import Q


class VideoExecucao(models.Model):
    """US42 (RF3501) — Vídeo da execução de um exercício do treino, enviado pelo aluno.

    O arquivo fica no Supabase Storage (RNF12); aqui guardamos só os metadados e o
    caminho dele no bucket. O link para assistir é gerado a cada consulta, com
    validade curta, e nunca é salvo.

    Só existem registros de vídeos que já chegaram ao Storage: a rota de confirmação
    confere o arquivo antes de criar ou atualizar o registro.
    """

    class Formato(models.TextChoices):
        MP4 = "video/mp4", "MP4"
        MOV = "video/quicktime", "MOV"

    # RN09 / CA05 — um vídeo por exercício do treino; um novo envio substitui o anterior.
    item_treino = models.OneToOneField(
        "treinos.TreinoExercicio",
        on_delete=models.CASCADE,
        related_name="video_execucao",
    )
    # Redundante com item_treino → treino → planejamento → aluno, mas deixa direto o
    # dono do arquivo: útil na checagem de acesso e na exclusão de dados (RN05).
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="videos_execucao",
        limit_choices_to={"papel": "ALUNO"},
    )
    caminho_storage = models.CharField(max_length=255, unique=True)
    formato = models.CharField(max_length=20, choices=Formato.choices)
    tamanho_bytes = models.PositiveBigIntegerField()
    # Informada pelo navegador (lida dos metadados do vídeo). O servidor não decodifica
    # o arquivo no MVP; a validação de tamanho e formato é feita também pelo bucket.
    duracao_segundos = models.PositiveSmallIntegerField()
    enviado_em = models.DateTimeField(auto_now_add=True)
    substituido_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Vídeo de execução"
        verbose_name_plural = "Vídeos de execução"
        ordering = ["-enviado_em"]
        constraints = [
            models.CheckConstraint(
                condition=Q(tamanho_bytes__gte=1), name="video_execucao_tamanho_positivo"
            ),
            models.CheckConstraint(
                condition=Q(duracao_segundos__gte=1), name="video_execucao_duracao_positiva"
            ),
        ]

    @property
    def foi_substituido(self):
        return self.substituido_em is not None

    def __str__(self):
        return f"Vídeo de {self.aluno.username} em {self.item_treino.nome}"
