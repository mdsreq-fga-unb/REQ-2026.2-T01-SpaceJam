from django.contrib import admin

from .models import VideoExecucao


@admin.register(VideoExecucao)
class VideoExecucaoAdmin(admin.ModelAdmin):
    """Só consulta: o envio e a troca do arquivo passam pela API, que fala com o Storage."""

    list_display = ("item_treino", "aluno", "formato", "tamanho_bytes", "duracao_segundos", "enviado_em")
    list_filter = ("formato",)
    # Busca exercício e aluno junto, em vez de uma consulta extra por linha da lista.
    list_select_related = ("item_treino", "aluno")
    search_fields = ("aluno__username", "item_treino__nome")
    readonly_fields = [campo.name for campo in VideoExecucao._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        # Apagar aqui removeria só o registro e deixaria o arquivo órfão no bucket.
        return False
