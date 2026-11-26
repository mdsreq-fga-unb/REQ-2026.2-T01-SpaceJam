from django.conf import settings
from django.db import models


class Treino(models.Model):
    class Status(models.TextChoices):
        EM_ANDAMENTO = "EM_ANDAMENTO", "Em andamento"
        FEITO = "FEITO", "Feito"
        CORRIGIR_REFAZER = "CORRIGIR_REFAZER", "Corrigir/Refazer"
        CONCLUIDO = "CONCLUIDO", "Concluído"

    aluno = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="treinos",
        limit_choices_to={"papel": "ALUNO"},
    )
    treinador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="treinos_prescritos",
        limit_choices_to={"papel": "TREINADOR"},
    )
    nome = models.CharField(max_length=150)
    titulo = models.CharField(max_length=150, blank=True)
    objetivo = models.TextField(blank=True)
    data_prevista = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.EM_ANDAMENTO,
    )
    realizado_em = models.DateTimeField(null=True, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Treino"
        verbose_name_plural = "Treinos"
        ordering = ["-data_prevista", "-criado_em"]
        indexes = [
            models.Index(fields=["aluno", "status"], name="treinos_aluno_status_idx"),
            models.Index(fields=["treinador", "aluno"], name="treinos_treinador_aluno_idx"),
        ]

    @property
    def esta_concluido(self) -> bool:
        return self.status == self.Status.CONCLUIDO

    def __str__(self) -> str:
        return f"{self.nome} — {self.aluno.username} ({self.get_status_display()})"


class ItemTreino(models.Model):
    treino = models.ForeignKey(
        Treino,
        on_delete=models.CASCADE,
        related_name="exercicios",
    )
    ordem = models.PositiveSmallIntegerField(default=1)
    # Snapshot técnico do exercício no momento da prescrição (RN23)
    nome = models.CharField(max_length=150)
    parametros = models.CharField(max_length=150, blank=True)
    resumo = models.CharField(max_length=255, blank=True)
    orientacoes = models.TextField(blank=True)
    erros_comuns = models.TextField(blank=True)

    class Meta:
        verbose_name = "Item de Treino"
        verbose_name_plural = "Itens de Treino"
        ordering = ["ordem", "id"]

    def __str__(self) -> str:
        return f"{self.ordem}. {self.nome} ({self.treino.nome})"