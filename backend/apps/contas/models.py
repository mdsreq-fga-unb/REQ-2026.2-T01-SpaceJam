import secrets
import string
from datetime import date

from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone


def gerar_codigo_convite():
    caracteres = string.ascii_uppercase + string.digits
    sufixo = "".join(secrets.choice(caracteres) for _ in range(6))
    return f"TRN-{sufixo}"


class Usuario(AbstractUser):

    class Papel(models.TextChoices):
        ALUNO = "ALUNO", "Aluno"
        TREINADOR = "TREINADOR", "Treinador"

    papel = models.CharField(max_length=10, choices=Papel.choices, default=Papel.ALUNO)
    versao_sessao = models.PositiveIntegerField(default=0, editable=False)
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


class Lesao(models.Model):

    DESCRICAO_MAX = 300

    aluno = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="lesoes",
        limit_choices_to={"papel": Usuario.Papel.ALUNO},
    )
    descricao = models.CharField(max_length=DESCRICAO_MAX)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Histórico da mais recente para a mais antiga; o id desempata registros no mesmo instante.
        ordering = ["-criado_em", "-id"]
        verbose_name = "Lesão"
        verbose_name_plural = "Lesões"

    def __str__(self):
        return f"Lesão de {self.aluno.username} em {self.criado_em:%d/%m/%Y}"


class HistoricoImutavelError(Exception):
    """Tentativa de alterar ou apagar um registro de aceite (RNF16)."""


class HistoricoAceiteTermosQuerySet(models.QuerySet):
    def update(self, **kwargs):
        raise HistoricoImutavelError("O histórico de aceite dos termos é imutável (RNF16).")

    def delete(self):
        raise HistoricoImutavelError("O histórico de aceite dos termos é imutável (RNF16).")


class HistoricoAceiteTermos(models.Model):
    """US63 (RF4812) — Registro auditável e imutável de cada aceite dos termos (RN15, RNF16).

    Os registros só podem ser inseridos. A única remoção possível é a exclusão
    do titular (RN05/US64), feita em cascata pelo Django ao excluir o usuário.
    """

    class Origem(models.TextChoices):
        CADASTRO = "CADASTRO", "Cadastro"
        ACEITE = "ACEITE", "Aceite posterior"
        MIGRACAO = "MIGRACAO", "Migração de dados"

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name="aceites_termos",
    )
    versao = models.CharField(max_length=20)
    data_hora = models.DateTimeField(default=timezone.now, editable=False)
    origem = models.CharField(max_length=10, choices=Origem.choices, default=Origem.ACEITE)

    objects = HistoricoAceiteTermosQuerySet.as_manager()

    class Meta:
        verbose_name = "Aceite dos Termos"
        verbose_name_plural = "Histórico de Aceites dos Termos"
        ordering = ["-data_hora"]
        indexes = [
            models.Index(fields=["usuario", "-data_hora"], name="contas_aceite_usuario_idx"),
        ]

    def save(self, *args, **kwargs):
        if self.pk is not None:
            raise HistoricoImutavelError("O histórico de aceite dos termos é imutável (RNF16).")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        raise HistoricoImutavelError("O histórico de aceite dos termos é imutável (RNF16).")

    def __str__(self):
        data_hora_local = timezone.localtime(self.data_hora)
        return f"{self.usuario_id} aceitou v{self.versao} em {data_hora_local:%d/%m/%Y %H:%M:%S}"


class RecuperacaoSenha(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE)
    resumo_token = models.CharField(max_length=64)
    expira_em = models.DateTimeField()
    usado = models.BooleanField(default=False)


class LimiteRecuperacaoSenha(models.Model):
    chave = models.CharField(max_length=64, primary_key=True)
    expira_em = models.DateTimeField(db_index=True)
    pedidos = models.PositiveIntegerField()
