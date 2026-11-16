import secrets
import string
from datetime import date

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


def gerar_codigo_convite():
    caracteres = string.ascii_uppercase + string.digits
    sufixo = "".join(secrets.choice(caracteres) for _ in range(6))
    return f"TRN-{sufixo}"


class Usuario(AbstractUser):

    class Papel(models.TextChoices):
        ALUNO = "ALUNO", "Aluno"
        TREINADOR = "TREINADOR", "Treinador"

    papel = models.CharField(max_length=10, choices=Papel.choices, default=Papel.ALUNO)
    telefone = models.CharField(max_length=20, blank=True)
    data_nascimento = models.DateField(null=True, blank=True)

    # Código único gerado automaticamente para o treinador (RN02 / US02)
    codigo_convite = models.CharField(
        max_length=12,
        unique=True,
        null=True,
        blank=True,
        help_text="Código único usado pelos alunos para se vincularem a este treinador.",
    )

    # Carteira do treinador: cada aluno aponta para o seu treinador (RF04701 / US01).
    treinador = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="alunos",
        limit_choices_to={"papel": Papel.TREINADOR},
    )

    # Rastreabilidade LGPD: Termos (RN15) e Consentimento de Menor (RN16)
    versao_termos_aceita = models.CharField(max_length=20, blank=True)
    data_aceite_termos = models.DateTimeField(null=True, blank=True)
    consentimento_responsavel = models.BooleanField(default=False)

    @property
    def is_aluno(self):
        return self.papel == self.Papel.ALUNO

    @property
    def is_treinador(self):
        return self.papel == self.Papel.TREINADOR

    @property
    def is_menor_idade(self):
        if not self.data_nascimento:
            return False
        hoje = date.today()
        idade = (
            hoje.year
            - self.data_nascimento.year
            - ((hoje.month, hoje.day) < (self.data_nascimento.month, self.data_nascimento.day))
        )
        return idade < 18

    def save(self, *args, **kwargs):
        if self.papel == self.Papel.TREINADOR and not self.codigo_convite:
            codigo = gerar_codigo_convite()
            while Usuario.objects.filter(codigo_convite=codigo).exists():
                codigo = gerar_codigo_convite()
            self.codigo_convite = codigo
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.get_papel_display()})"


class PerfilAluno(models.Model):
    usuario = models.OneToOneField(
        Usuario,
        on_delete=models.CASCADE,
        related_name="perfil_aluno",
        limit_choices_to={"papel": Usuario.Papel.ALUNO},
    )
    altura = models.DecimalField(max_digits=4, decimal_places=2, help_text="Altura em metros (ex: 1.85)")
    peso = models.DecimalField(max_digits=5, decimal_places=2, help_text="Peso em kg (ex: 78.50)")
    envergadura = models.DecimalField(max_digits=4, decimal_places=2, help_text="Envergadura em metros (ex: 1.92)")
    frequencia_semanal = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(7)],
        help_text="Dias por semana (1 a 7)",
    )
    objetivos = models.TextField()

    class Meta:
        verbose_name = "Perfil do Aluno"
        verbose_name_plural = "Perfis dos Alunos"

    def __str__(self):
        return f"Perfil de {self.usuario.username}"