from rest_framework.permissions import BasePermission


class IsTreinador(BasePermission):
    message = "Apenas treinadores podem fazer isso."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_treinador)


class IsAluno(BasePermission):
    message = "Apenas alunos podem fazer isso."

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_aluno)
