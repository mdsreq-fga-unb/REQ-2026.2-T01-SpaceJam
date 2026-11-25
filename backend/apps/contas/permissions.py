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


class IsAlunoProprietarioPerfil(BasePermission):
    """US07 / RF1107 — Permite editar apenas o próprio perfil básico do aluno."""

    message = "Apenas o próprio aluno pode editar estas informações do perfil."

    def has_permission(self, request, view):
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        if getattr(user, "is_treinador", False):
            return False
        return bool(getattr(user, "is_aluno", False))

    def has_object_permission(self, request, view, obj):
        alvo_usuario = getattr(obj, "usuario", obj)
        return alvo_usuario == request.user


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
