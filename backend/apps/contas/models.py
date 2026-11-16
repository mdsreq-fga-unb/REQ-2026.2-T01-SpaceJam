from django.contrib.auth.models import AbstractUser
from django.db import models


class Usuario(AbstractUser):

    class Papel(models.TextChoices):
        ALUNO = "ALUNO", "Aluno"
        TREINADOR = "TREINADOR", "Treinador"

    papel = models.CharField(max_length=10, choices=Papel.choices, default=Papel.ALUNO)
    telefone = models.CharField(max_length=20, blank=True)

    # Carteira do treinador: cada aluno aponta para o seu treinador (RF04701).
    treinador = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alunos",
        limit_choices_to={"papel": Papel.TREINADOR},
    )

    @property
    def is_aluno(self):
        return self.papel == self.Papel.ALUNO

    @property
    def is_treinador(self):
        return self.papel == self.Papel.TREINADOR

    def __str__(self):
        return f"{self.username} ({self.get_papel_display()})"
