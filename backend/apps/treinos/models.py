from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.exercicios.models import LIMITE_DESCRICAO_VIDEO_BASE, LIMITE_TITULO_VIDEO_BASE


class Planejamento(models.Model):
    class Status(models.TextChoices):
        VIGENTE = "VIGENTE", "Vigente"
        HISTORICO = "HISTORICO", "Histórico"

    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="planejamentos",
        limit_choices_to={"papel": "ALUNO"},
    )
    treinador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="planejamentos_criados",
        limit_choices_to={"papel": "TREINADOR"},
    )
    # Obrigatório na interface e na API; 255 é só um teto técnico do banco.
    nome = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.VIGENTE)
    criado_em = models.DateTimeField(auto_now_add=True)
    encerrado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-criado_em"]
        verbose_name = "Planejamento"
        verbose_name_plural = "Planejamentos"
        constraints = [
            models.UniqueConstraint(
                fields=["aluno"],
                condition=Q(status="VIGENTE"),
                name="planejamento_vigente_unico_por_aluno",
            ),
        ]

    @property
    def is_vigente(self):
        return self.status == self.Status.VIGENTE

    def __str__(self):
        return f"{self.nome} — {self.aluno.username} ({self.get_status_display()})"

class Treino(models.Model):

    class Status(models.TextChoices):
        EM_ANDAMENTO = "EM_ANDAMENTO", "Em andamento"
        FEITO = "FEITO", "Feito"
        CORRIGIR_REFAZER = "CORRIGIR_REFAZER", "Corrigir/Refazer"
        CONCLUIDO = "CONCLUIDO", "Concluído"

    planejamento = models.ForeignKey(
        Planejamento, on_delete=models.CASCADE, related_name="treinos"
    )
    # Obrigatório; "Treino A" é só o exemplo exibido na interface.
    nome = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.EM_ANDAMENTO
    )
    realizado_em = models.DateTimeField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["criado_em", "id"]
        verbose_name = "Treino"
        verbose_name_plural = "Treinos"

    @property
    def esta_concluido(self):
        return self.status == self.Status.CONCLUIDO

    def __str__(self):
        return f"{self.nome} ({self.planejamento.nome})"


class TreinoExercicio(models.Model):

    class Status(models.TextChoices):
        A_FAZER = "A_FAZER", "A fazer"
        FEITO = "FEITO", "Feito"
        CONCLUIDO = "CONCLUIDO", "Concluído"
        CORRIGIR = "CORRIGIR", "Corrigir/Refazer"

    treino = models.ForeignKey(Treino, on_delete=models.CASCADE, related_name="exercicios")
    exercicio_origem = models.ForeignKey(
        "exercicios.Exercicio",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,  # RN13 — excluir da biblioteca não apaga o prescrito
        related_name="prescricoes",
    )
    ordem = models.PositiveSmallIntegerField()

    # Cópia (RN23)
    nome = models.CharField(max_length=120)
    objetivo = models.TextField()
    fundamento = models.CharField(max_length=30)
    orientacoes = models.TextField(blank=True)
    erros_comuns = models.TextField(blank=True)
    erros_orientacoes = models.JSONField(default=list, blank=True)
    video_base = models.URLField(max_length=500, blank=True)
    # US35 CA03 — título e descrição do vídeo-base copiados na prescrição.
    video_titulo = models.CharField(max_length=LIMITE_TITULO_VIDEO_BASE, blank=True)
    video_descricao = models.CharField(max_length=LIMITE_DESCRICAO_VIDEO_BASE, blank=True)

    series = models.PositiveSmallIntegerField()
    repeticoes = models.PositiveSmallIntegerField(null=True, blank=True)
    duracao_segundos = models.PositiveIntegerField(null=True, blank=True)

    status = models.CharField(max_length=10, choices=Status.choices, default=Status.A_FAZER)

    class Meta:
        ordering = ["treino", "ordem"]
        verbose_name = "Exercício do treino"
        verbose_name_plural = "Exercícios do treino"
        constraints = [
            models.UniqueConstraint(fields=["treino", "ordem"], name="treino_exercicio_ordem_unica"),
            models.CheckConstraint(
                condition=Q(series__gte=1), name="treino_exercicio_series_minimo_1"
            ),
            models.CheckConstraint(
                condition=(
                    Q(repeticoes__isnull=False, repeticoes__gte=1, duracao_segundos__isnull=True)
                    | Q(repeticoes__isnull=True, duracao_segundos__isnull=False, duracao_segundos__gte=1)
                ),
                name="treino_exercicio_repeticoes_xor_duracao",
            ),
        ]

    def __str__(self):
        return f"{self.ordem}. {self.nome}"


class FeedbackAluno(models.Model):
    """Relato do próprio aluno sobre um exercício prescrito (US49/US50)."""

    item_treino = models.OneToOneField(
        TreinoExercicio, on_delete=models.CASCADE, related_name="feedback_aluno"
    )
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="feedbacks_enviados",
        limit_choices_to={"papel": "ALUNO"},
    )
    texto = models.TextField(max_length=1000)
    criado_em = models.DateTimeField(auto_now_add=True)
    editado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Feedback do aluno"
        verbose_name_plural = "Feedbacks dos alunos"
        ordering = ["-criado_em"]

    @property
    def editado(self):
        return self.editado_em is not None

    def __str__(self):
        return f"Feedback de {self.aluno.username} em {self.item_treino.nome}"

class DificuldadeAluno(models.Model):
    """Percepção de dificuldade (escala 1 a 5) registrada pelo aluno em um exercício do treino (US12/US13/US14)."""

    item_treino = models.OneToOneField(
        TreinoExercicio, on_delete=models.CASCADE, related_name="dificuldade_aluno"
    )
    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="dificuldades_registradas",
        limit_choices_to={"papel": "ALUNO"},
    )
    nota = models.PositiveSmallIntegerField()
    criado_em = models.DateTimeField(auto_now_add=True)
    editado_em = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Dificuldade do aluno"
        verbose_name_plural = "Dificuldades dos alunos"
        ordering = ["-criado_em"]
        constraints = [
            models.CheckConstraint(
                condition=Q(nota__gte=1, nota__lte=5),
                name="dificuldade_aluno_nota_entre_1_e_5",
            ),
        ]

    @property
    def editado(self):
        return self.editado_em is not None

    def __str__(self):
        return f"Dificuldade {self.nota}/5 de {self.aluno.username} em {self.item_treino.nome}"