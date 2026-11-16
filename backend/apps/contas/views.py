from django.conf import settings
from django.db import connection
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    CadastroAlunoSerializer,
    CadastroTreinadorSerializer,
    LoginAlunoSerializer,
    LoginTreinadorSerializer,
    UsuarioSerializer,
)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """Confirma que a API está de pé e conversando com o banco."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return Response({"status": "ok", "banco": "ok"})


@api_view(["POST"])
@permission_classes([AllowAny])
def cadastrar_aluno(request):
    """US01 — Cadastrar aluno (RF1101)."""
    serializer = CadastroAlunoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    usuario = serializer.save()
    return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def cadastrar_treinador(request):
    """US02 — Cadastrar treinador (RF1102)."""
    serializer = CadastroTreinadorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    usuario = serializer.save()
    return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_aluno(request):
    """US04 — Logar aluno por apelido e senha (RF1104)."""
    serializer = LoginAlunoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.validated_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_treinador(request):
    """US05 — Logar treinador por e-mail e senha (RF1105)."""
    serializer = LoginTreinadorSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response(serializer.validated_data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """US03 — Deslogar da conta invalidando o refresh token (RF1103 / RNF08)."""
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response(
            {"detail": "O campo 'refresh' é obrigatório para encerrar a sessão."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except TokenError:
        return Response(
            {"detail": "Token inválido ou já encerrado."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return Response({"detail": "Sessão encerrada com sucesso."}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def aceitar_termos(request):
    """Registra aceite da versão vigente dos termos (CA03 de US04/US05)."""
    if not request.data.get("aceite_termos"):
        return Response(
            {"detail": "É necessário confirmar o aceite dos termos."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    request.user.versao_termos_aceita = settings.TERMOS_VERSAO_ATUAL
    request.user.data_aceite_termos = timezone.now()
    request.user.save(update_fields=["versao_termos_aceita", "data_aceite_termos"])
    return Response(UsuarioSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Dados do usuário logado (usado pelo front logo após o login)."""
    return Response(UsuarioSerializer(request.user).data)