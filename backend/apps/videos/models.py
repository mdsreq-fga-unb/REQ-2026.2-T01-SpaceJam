from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist, ValidationError
from django.db import models
from django.db.models import Q


class VideoExecucao(models.Model):
    """US42 (RF3501) — Vídeo da execução de um exercício do treino, enviado pelo aluno.

    O arquivo fica no Supabase Storage (RNF12); aqui guardamos só os metadados e o
    caminho dele no bucket. O link para assistir é gerado a cada consulta, com
    validade curta, e nunca é salvo.

    Só existem registros de vídeos que já chegaram ao Storage: a rota de confirmação
    confere o arquivo antes de criar ou atualizar o registro.

    Tentativas (RN09 + RN06): cada submissão tem exatamente um vídeo. Enquanto o
    treinador não avalia, um novo envio SUBSTITUI o vídeo da submissão atual (RN10).
    Depois do feedback, o vídeo fica imutável; só quando o exercício é devolvido para
    correção ("Corrigir/Refazer") o aluno abre uma NOVA submissão (tentativa + 1), e as
    anteriores ficam no histórico com o feedback recebido.
    """

    class Formato(models.TextChoices):
        MP4 = "video/mp4", "MP4"
        MOV = "video/quicktime", "MOV"

    item_treino = models.ForeignKey(
        "treinos.TreinoExercicio",
        on_delete=models.CASCADE,
        related_name="videos",
    )
    # Número da submissão do exercício (1, 2, ...). A maior é a submissão atual.
    tentativa = models.PositiveSmallIntegerField(default=1)
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
    # Lida pelo servidor no próprio arquivo (cabeçalho MP4/MOV) na confirmação (RNF13).
    duracao_segundos = models.PositiveSmallIntegerField()
    enviado_em = models.DateTimeField(auto_now_add=True)
    substituido_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Vídeo de execução"
        verbose_name_plural = "Vídeos de execução"
        ordering = ["-enviado_em"]
        constraints = [
            # RN09 — um vídeo por submissão do exercício.
            models.UniqueConstraint(
                fields=["item_treino", "tentativa"], name="video_execucao_um_por_tentativa"
            ),
            models.CheckConstraint(
                condition=Q(tentativa__gte=1), name="video_execucao_tentativa_positiva"
            ),
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

    @property
    def feedback(self):
        """Feedback do treinador sobre este vídeo, ou None (usa o cache do select_related)."""
        try:
            return self.feedback_treinador
        except ObjectDoesNotExist:
            return None

    @property
    def foi_avaliado(self):
        """RN10 — com feedback do treinador, o vídeo não pode mais ser trocado."""
        return self.feedback is not None

    def __str__(self):
        return f"Vídeo de {self.aluno.username} em {self.item_treino.nome} (tentativa {self.tentativa})"


class FeedbackTreinador(models.Model):
    """RN10 / RN11 — Feedback avaliativo do treinador vinculado a UM vídeo de execução.

    A simples existência deste registro torna o vídeo imutável para o aluno (RN10).
    Fica preso ao vídeo (e não só ao exercício) porque cada submissão é avaliada à
    parte: numa nova tentativa (RN09/RN06) o vídeo novo começa sem feedback.
    As rotas de registro e edição pelo treinador são da US45/US46.
    """

    video = models.OneToOneField(
        VideoExecucao, on_delete=models.CASCADE, related_name="feedback_treinador"
    )
    treinador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedbacks_registrados",
        limit_choices_to={"papel": "TREINADOR"},
    )
    texto = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    editado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Feedback do treinador"
        verbose_name_plural = "Feedbacks do treinador"
        ordering = ["-criado_em"]
        constraints = [
            # US45 CA02 — texto obrigatório (espaços em branco são barrados no clean/API).
            models.CheckConstraint(
                condition=~Q(texto=""), name="feedback_treinador_texto_obrigatorio"
            ),
        ]

    def clean(self):
        if not (self.texto or "").strip():
            raise ValidationError({"texto": "O feedback não pode ficar vazio."})
        # RN03 / RN11 — só o treinador da carteira do aluno avalia o vídeo.
        if self.video_id and self.treinador_id:
            if self.video.aluno.treinador_id != self.treinador_id:
                raise ValidationError(
                    {"treinador": "Só o treinador do aluno pode avaliar este vídeo."}
                )

    @property
    def editado(self):
        return self.editado_em is not None

    def __str__(self):
        return f"Feedback de {self.treinador.username} em {self.video}"
