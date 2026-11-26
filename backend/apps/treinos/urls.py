from django.urls import path

from . import views

urlpatterns = [
    # Cadastrar planejamento de treino
    path("planejamentos/", views.cadastrar_planejamento, name="planejamento-cadastrar"),
    # Criar treino com exercícios dentro de um planejamento
    path(
        "planejamentos/<int:planejamento_id>/treinos/",
        views.criar_treino,
        name="treino-criar",
    ),
    # Editar treino
    path("treinos/<int:treino_id>/", views.editar_treino, name="treino-editar"),
    # Editar planejamento de treino
    path(
        "planejamentos/<int:planejamento_id>/",
        views.editar_planejamento,
        name="planejamento-editar",
    ),
    path(
        "planejamentos/<int:planejamento_id>/treinos/<int:treino_id>/",
        views.remover_treino,
        name="planejamento-remover-treino",
    ),
]