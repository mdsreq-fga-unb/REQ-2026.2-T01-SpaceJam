from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import PerfilAluno, Usuario


class PerfilAlunoInline(admin.StackedInline):
    model = PerfilAluno
    can_delete = False
    extra = 0


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "papel", "codigo_convite", "treinador", "is_active")
    list_filter = ("papel", "is_active")
    inlines = [PerfilAlunoInline]
    fieldsets = UserAdmin.fieldsets + (
        (
            "Basquete & LGPD",
            {
                "fields": (
                    "papel",
                    "telefone",
                    "data_nascimento",
                    "codigo_convite",
                    "treinador",
                    "versao_termos_aceita",
                    "data_aceite_termos",
                    "consentimento_responsavel",
                )
            },
        ),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Basquete & LGPD",
            {
                "fields": (
                    "papel",
                    "telefone",
                    "data_nascimento",
                    "treinador",
                    "consentimento_responsavel",
                )
            },
        ),
    )