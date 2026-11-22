from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    # US01 e US02 — Cadastros
    path("auth/cadastro/aluno/", views.cadastrar_aluno, name="cadastro-aluno"),
    path("auth/cadastro/treinador/", views.cadastrar_treinador, name="cadastro-treinador"),
    # US04 e US05 — Logins (mantendo auth/login/ como alias para aluno)
    path("auth/login/", views.login_aluno, name="login"),
    path("auth/login/aluno/", views.login_aluno, name="login-aluno"),
    path("auth/login/treinador/", views.login_treinador, name="login-treinador"),
    # US03 — Logout e Refresh
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # Perfil e Termos
    path("auth/me/", views.me, name="me"),
    path("auth/aceitar-termos/", views.aceitar_termos, name="aceitar-termos"),
    # US53 — Consultar próprios dados cadastrais do aluno
    path("contas/me/", views.meus_dados_aluno, name="contas-me-aluno"),
    path(
        "contas/alunos/<int:aluno_id>/",
        views.consultar_perfil_aluno_acompanhado,
        name="contas-perfil-aluno",
    ),
    path("auth/trocar-senha/", views.trocar_senha, name="trocar-senha"),
    path("contas/me/editar/", views.editar_perfil_aluno, name="contas-me-editar-aluno"),
    path(
        "contas/alunos/<int:aluno_id>/editar/",
        views.editar_perfil_aluno,
        name="contas-aluno-editar",
    ),
]