from django.conf import settings
from django.db import models
from django.db.models import Q


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