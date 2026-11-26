from django.urls import path

from .views import (
    TreinoConcluirTreinadorView,
    TreinoDetalheView,
    TreinoRegistrarStatusAlunoView,
    TreinoStatusView,
)

urlpatterns = [
    path("treinos/<int:treino_id>/", TreinoDetalheView.as_view(), name="treino-detalhe"),
    path("treinos/<int:treino_id>/status/", TreinoStatusView.as_view(), name="treino-status"),
    path("treinos/<int:treino_id>/feito/", TreinoRegistrarStatusAlunoView.as_view(), name="treino-feito"),
    path("treinos/<int:treino_id>/concluir/", TreinoConcluirTreinadorView.as_view(), name="treino-concluir"),
]