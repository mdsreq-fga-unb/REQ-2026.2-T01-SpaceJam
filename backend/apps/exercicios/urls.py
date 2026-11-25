from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ErroComumExercicioViewSet, ExercicioViewSet

router = DefaultRouter()
router.register("exercicios", ExercicioViewSet, basename="exercicio")

# US37 — Erros comuns e orientações corretivas de um exercício (rotas explícitas).
erros_comuns_lista = ErroComumExercicioViewSet.as_view({"get": "list", "post": "create"})

urlpatterns = [
    path(
        "exercicios/<int:exercicio_pk>/erros-comuns/",
        erros_comuns_lista,
        name="exercicio-erro-comum-list",
    ),
    *router.urls,
]
