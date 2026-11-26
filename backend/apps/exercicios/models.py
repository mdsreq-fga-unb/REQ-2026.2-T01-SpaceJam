from django.conf import settings
from django.db import models


class Fundamento(models.TextChoices):
    ARREMESSO = "ARREMESSO", "Arremesso"
    DRIBLE = "DRIBLE", "Drible"
    PASSE = "PASSE", "Passe"
    DEFESA = "DEFESA", "Defesa"
    REBOTE = "REBOTE", "Rebote"
    CONDICIONAMENTO_FISICO = "CONDICIONAMENTO_FISICO", "Condicionamento físico"


class Exercicio(models.Model):
    nome = models.CharField(max_length=120)
    objetivo = models.TextField()
    fundamento = models.CharField(
        max_length=30, choices=Fundamento.choices, db_index=True
    )
    orientacoes = models.TextField(blank=True)
    erros_comuns = models.TextField(blank=True)
    video_base = models.URLField(max_length=500, blank=True)
    criado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,
        related_name="exercicios_criados",
    )
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome"]
        verbose_name = "exercício"
        verbose_name_plural = "exercícios"

    def __str__(self):
        return self.nome


class ErroComumExercicio(models.Model):
    """US37 / RF2420 — Erro comum e sua orientação corretiva, ligados a um exercício.

    Cada item pertence a um único exercício (não há catálogo compartilhado). A
    preservação dos treinos já prescritos (RN23) é feita copiando estes dados no
    momento da prescrição, nunca referenciando o item.
    """

    exercicio = models.ForeignKey(
        Exercicio,
        on_delete=models.CASCADE,
        related_name="erros_orientacoes",
    )
    erro = models.TextField()
    orientacao_corretiva = models.TextField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["criado_em", "id"]
        verbose_name = "erro comum do exercício"
        verbose_name_plural = "erros comuns do exercício"

    def __str__(self):
        return f"{self.exercicio.nome}: {self.erro[:50]}"