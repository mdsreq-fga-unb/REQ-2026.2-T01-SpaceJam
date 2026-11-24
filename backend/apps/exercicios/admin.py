from django.contrib import admin

from .models import Exercicio


@admin.register(Exercicio)
class ExercicioAdmin(admin.ModelAdmin):
    list_display = ["nome", "fundamento", "criado_por", "criado_em"]
    list_filter = ["fundamento"]
    search_fields = ["nome", "objetivo"]