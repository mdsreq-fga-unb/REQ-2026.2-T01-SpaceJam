from django.contrib import admin

from .models import Planejamento, Treino, TreinoExercicio


@admin.register(Planejamento)
class PlanejamentoAdmin(admin.ModelAdmin):
    list_display = ("nome", "aluno", "treinador", "status", "criado_em", "encerrado_em")
    list_filter = ("status",)
    search_fields = ("nome", "aluno__username", "aluno__first_name")

class TreinoExercicioInline(admin.TabularInline):
    model = TreinoExercicio
    extra = 0


@admin.register(Treino)
class TreinoAdmin(admin.ModelAdmin):
    list_display = ("nome", "planejamento", "status", "criado_em")
    list_filter = ("status",)
    inlines = [TreinoExercicioInline]