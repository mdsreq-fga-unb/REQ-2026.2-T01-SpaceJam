from rest_framework import status
from rest_framework.exceptions import APIException
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


class TermosPendentes(APIException):
    """US63 (RN15, RNF16) — 403 para usuário autenticado sem aceite da versão vigente."""

    status_code = status.HTTP_403_FORBIDDEN
    default_code = "TERMOS_PENDENTES"
    default_detail = "É necessário aceitar a versão vigente dos Termos de Uso e da Política de Privacidade."

    def __init__(self):
        super().__init__(
            {
                "detail": self.default_detail,
                "code": self.default_code,
                "versao_atual": termos.versao_vigente(),
            }
        )


class TermosVigentesAceitos(BasePermission):
    """US63 (RN15, RNF16) — Bloqueia rotas protegidas enquanto houver termos pendentes.

    Anônimos passam adiante para que `IsAuthenticated` responda 401. A verificação usa só
    o cache do `request.user` já carregado na autenticação JWT (0 queries extras).
    """

    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated and termos.termos_pendentes(request.user):
            raise TermosPendentes()
        return True


# Padrão das rotas de negócio; compor com papel quando preciso: [*ROTA_PROTEGIDA, IsTreinador].
ROTA_PROTEGIDA = [IsAuthenticated, TermosVigentesAceitos]
