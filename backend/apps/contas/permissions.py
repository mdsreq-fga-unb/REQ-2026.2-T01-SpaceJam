from rest_framework.permissions import BasePermission


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
