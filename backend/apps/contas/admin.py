from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import HistoricoAceiteTermos, PerfilAluno, Usuario


class PerfilAlunoInline(admin.StackedInline):
    model = PerfilAluno
    can_delete = False
    extra = 0


class HistoricoAceiteTermosInline(admin.TabularInline):
    """US63 (RF4812) — Histórico de aceites somente leitura (RNF16).

    Exibido apenas como inline: um ModelAdmin próprio sem permissão de exclusão
    impediria a exclusão do usuário pelo admin (RN05), pois o Django exige
    permissão de exclusão sobre os objetos removidos em cascata.
    """

    model = HistoricoAceiteTermos
    fields = ("versao", "data_hora", "origem")
    readonly_fields = fields
    extra = 0
    can_delete = False
    show_change_link = False

    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ("username", "email", "first_name", "last_name", "papel", "codigo_convite", "treinador", "is_active")
    list_filter = ("papel", "is_active")
    inlines = [PerfilAlunoInline, HistoricoAceiteTermosInline]
    # Cache do aceite vigente: só o fluxo de aceite (US63) altera esses campos.
    readonly_fields = ("versao_termos_aceita", "data_aceite_termos")
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