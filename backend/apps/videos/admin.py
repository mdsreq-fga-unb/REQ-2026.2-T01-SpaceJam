from django.contrib import admin

from .models import FeedbackTreinador, VideoExecucao


@admin.register(VideoExecucao)
class VideoExecucaoAdmin(admin.ModelAdmin):
    """Só consulta: o envio e a troca do arquivo passam pela API, que fala com o Storage."""

    list_display = (
        "item_treino", "tentativa", "aluno", "formato", "tamanho_bytes", "duracao_segundos", "enviado_em",
    )
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


@admin.register(FeedbackTreinador)
class FeedbackTreinadorAdmin(admin.ModelAdmin):
    """RN10 — Enquanto a US45 não tem rota própria, o feedback pode ser lançado aqui para testes.

    O `clean()` do modelo garante texto não vazio e que o treinador é o da carteira do aluno.
    """

    list_display = ("video", "treinador", "criado_em", "editado_em")
    list_select_related = ("video__item_treino", "video__aluno", "treinador")
    raw_id_fields = ("video",)
    search_fields = ("video__aluno__username", "video__item_treino__nome", "treinador__username")
    readonly_fields = ("criado_em", "editado_em")
