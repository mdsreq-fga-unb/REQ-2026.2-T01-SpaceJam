from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .serializers import UsuarioSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    """Confirma que a API está de pé e conversando com o banco."""
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    return Response({"status": "ok", "banco": "ok"})


@api_view(["GET"])
def me(request):
    """Dados do usuário logado (usado pelo front logo após o login)."""
    return Response(UsuarioSerializer(request.user).data)
