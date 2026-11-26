from django.contrib import admin

from .models import ErroComumExercicio, Exercicio


class ErroComumExercicioInline(admin.TabularInline):
    model = ErroComumExercicio
    extra = 0
    fields = ["erro", "orientacao_corretiva", "criado_em", "atualizado_em"]
    readonly_fields = ["criado_em", "atualizado_em"]


@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = ["nome", "fundamento", "criado_por", "criado_em"]
    list_filter = ["fundamento"]
    search_fields = ["nome", "objetivo"]
    inlines = [ErroComumExercicioInline]
