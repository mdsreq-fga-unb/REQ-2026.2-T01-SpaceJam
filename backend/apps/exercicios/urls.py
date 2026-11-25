from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ErroComumExercicioViewSet, ExercicioViewSet

router = DefaultRouter()
router.register("exercicios", ExercicioViewSet, basename="exercicio")

# US37 — Erros comuns e orientações corretivas de um exercício (rotas explícitas).
erros_comuns_lista = ErroComumExercicioViewSet.as_view({"get": "list", "post": "create"})
erros_comuns_detalhe = ErroComumExercicioViewSet.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update"}
)

urlpatterns = [
    path(
        "exercicios/<int:exercicio_pk>/erros-comuns/",
        erros_comuns_lista,
        name="exercicio-erro-comum-list",
    ),
    path(
        "exercicios/<int:exercicio_pk>/erros-comuns/<int:pk>/",
        erros_comuns_detalhe,
        name="exercicio-erro-comum-detail",
    ),
    *router.urls,
]
