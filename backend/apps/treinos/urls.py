from django.urls import path

from . import views
from .views_execucao import (
    ItemTreinoFeedbackAlunoView,
    TreinoConcluirTreinadorView,
    TreinoDetalheView,
    TreinoRegistrarStatusAlunoView,
    TreinoStatusView,
)

urlpatterns = [
    # Consultar o próprio planejamento de treino
    path("meu-planejamento/", views.consultar_meu_planejamento, name="meu-planejamento"),
    # Cadastrar planejamento de treino
    path("planejamentos/", views.cadastrar_planejamento, name="planejamento-cadastrar"),
    # Criar treino com exercícios dentro de um planejamento
    path(
        "planejamentos/<int:planejamento_id>/treinos/",
        views.criar_treino,
        name="treino-criar",
    ),
    # Consultar planejamento de aluno acompanhado
    path("alunos/", views.listar_carteira_planejamentos, name="carteira-planejamentos"),
    path(
        "alunos/<int:aluno_id>/planejamento-vigente/",
        views.consultar_planejamento_vigente,
        name="planejamento-vigente",
    ),
    # Consultar histórico de treinos de aluno acompanhado
    path(
        "alunos/<int:aluno_id>/historico/",
        views.HistoricoTreinosAlunoView.as_view(),
        name="aluno-historico-treinos",
    ),
    # Consultar e registrar a execução de um treino prescrito
    path("<int:treino_id>/", TreinoDetalheView.as_view(), name="treino-detalhe"),
    path("<int:treino_id>/status/", TreinoStatusView.as_view(), name="treino-status"),
    path("<int:treino_id>/feito/", TreinoRegistrarStatusAlunoView.as_view(), name="treino-feito"),
    path("<int:treino_id>/concluir/", TreinoConcluirTreinadorView.as_view(), name="treino-concluir"),
    path(
        "exercicios/<int:item_id>/feedback-aluno/",
        ItemTreinoFeedbackAlunoView.as_view(),
        name="item-treino-feedback-aluno",
    ),
]
