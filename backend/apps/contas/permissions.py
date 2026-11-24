from rest_framework.permissions import BasePermission, IsAuthenticated

from . import termos


class IsTreinador(BasePermission):
    message = "Apenas treinadores podem fazer isso."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_treinador)


class IsAluno(BasePermission):
    message = "Apenas alunos podem fazer isso."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_aluno)


class TermosVigentesAceitos(BasePermission):
    """US63 (RN15, RNF16) — Bloqueia rotas protegidas enquanto houver termos pendentes.

    Anônimos passam adiante para que `IsAuthenticated` responda 401. A verificação usa só
    o cache do `request.user` já carregado na autenticação JWT (0 queries extras).
    """

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated and termos.termos_pendentes(request.user):
            raise termos.TermosPendentes(versao_atual=termos.versao_vigente())
        return True


# Padrão das rotas de negócio; compor com papel quando preciso: [*ROTA_PROTEGIDA, IsTreinador].
ROTA_PROTEGIDA = [IsAuthenticated, TermosVigentesAceitos]
