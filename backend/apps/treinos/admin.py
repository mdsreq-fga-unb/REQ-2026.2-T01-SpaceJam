from django.contrib import admin

from .models import Planejamento


@admin.register(Planejamento)
class PlanejamentoAdmin(admin.ModelAdmin):
    list_display = ("nome", "aluno", "treinador", "status", "criado_em", "encerrado_em")
    list_filter = ("status",)
    search_fields = ("nome", "aluno_username", "aluno_first_name")