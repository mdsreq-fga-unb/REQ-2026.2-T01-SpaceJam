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
]