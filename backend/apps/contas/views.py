from datetime import datetime, timezone as dt_timezone

from django.conf import settings
from django.core.cache import cache
from django.db import connection
from rest_framework import status
from rest_framework.fields import BooleanField
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from . import termos
from .models import HistoricoAceiteTermos, Usuario
from .permissions import IsAlunoProprietarioPerfil, ROTA_PROTEGIDA
from .serializers import (
    CadastroAlunoSerializer,
    CadastroTreinadorSerializer,
    DadosCadastraisAlunoSerializer,
    EditarPerfilAlunoSerializer,
    LoginAlunoSerializer,
    LoginTreinadorSerializer,
    PerfilAlunoAcompanhadoSerializer,
    UsuarioSerializer,
    TrocarSenhaSerializer,
    SolicitarRecuperacaoSenhaSerializer,
    RedefinirSenhaRecuperacaoSerializer,
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
@permission_classes([IsAuthenticated])  # Isenta da RN15: encerrar a sessão é sempre permitido.
def logout_view(request):
    """US03 — Deslogar da conta invalidando o refresh token e o access token atual (RF1103)."""
    refresh_token = request.data.get("refresh")
    if not refresh_token:
        return Response(
            {"detail": "O campo 'refresh' é obrigatório para encerrar a sessão."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh_token)
        # Garante que o refresh token pertence ao usuário logado
        if str(token.payload.get("user_id")) != str(request.user.id):
            return Response(
                {"detail": "Este token não pertence ao usuário autenticado."},
                status=status.HTTP_403_FORBIDDEN,
            )
        token.blacklist()
    except TokenError:
        return Response(
            {"detail": "Token inválido ou já encerrado."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # Invalida imediatamente o access token usado nesta requisição via cache
    if request.auth:
        jti = request.auth.get("jti")
        exp = request.auth.get("exp")
        if jti and exp:
            ttl = max(int(exp - datetime.now(dt_timezone.utc).timestamp()), 1)
            cache.set(f"blacklist_access_{jti}", True, timeout=ttl)

    return Response({"detail": "Sessão encerrada com sucesso."}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def termos_vigentes(request):
    """US63 (RF4812) — Consulta pública da versão vigente e dos documentos (RN15)."""
    disponivel = termos.documentos_configurados()
    return Response(
        {
            "versao": termos.versao_vigente(),
            "termos_uso_url": settings.TERMOS_USO_URL if disponivel else None,
            "politica_privacidade_url": settings.POLITICA_PRIVACIDADE_URL if disponivel else None,
            "disponivel": disponivel,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Isenta da RN15: é a rota que regulariza o aceite.
def aceitar_termos(request):
    """US63 (RF4812) — Registra aceite da versão vigente dos termos (RN15, RNF16, CA01/CA03).

    - 400 ACEITE_OBRIGATORIO: `aceite_termos` ausente ou diferente de true.
    - 503 TERMOS_INDISPONIVEIS: documentos não configurados no servidor.
    - 409 TERMOS_VERSAO_DIVERGENTE: `versao` (opcional) enviada difere da vigente.
    - 200: versão vigente já aceita; nenhum registro novo (idempotente).
    - 201: aceite registrado no histórico e no cache do usuário.
    """
    # Mesmos valores aceitos pelo BooleanField dos cadastros (true, "true", 1, "1"...).
    aceite = request.data.get("aceite_termos")
    aceito = isinstance(aceite, (bool, int, str)) and aceite in BooleanField.TRUE_VALUES
    termos.validar_aceite(aceito, request.data.get("versao"))

    if not termos.termos_pendentes(request.user):
        return Response(UsuarioSerializer(request.user).data, status=status.HTTP_200_OK)

    termos.registrar_aceite(request.user, HistoricoAceiteTermos.Origem.ACEITE)
    return Response(UsuarioSerializer(request.user).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Isenta da RN15: o front lê `termos_pendentes` aqui.
def me(request):
    """Dados do usuário logado (usado pelo front logo após o login)."""
    return Response(UsuarioSerializer(request.user).data)

@api_view(["GET"])
@permission_classes(ROTA_PROTEGIDA)
def meus_dados_aluno(request):
    """US53 — Consultar próprios dados cadastrais do aluno (RF4802, RN03, RN25, RN26, RNF08)."""
    if request.user.papel != Usuario.Papel.ALUNO:
        return Response(
            {
                "detail": "Apenas alunos podem consultar esta rota. Treinadores devem usar a consulta de alunos."
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    aluno = (
        Usuario.objects.select_related("perfil_aluno", "treinador")
        .filter(pk=request.user.pk)
        .first()
    )
    serializer = DadosCadastraisAlunoSerializer(aluno or request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes(ROTA_PROTEGIDA)
def consultar_perfil_aluno_acompanhado(request, aluno_id):
    """US61 — Consultar perfil de aluno acompanhado pelo treinador (RF4810, RN03, RN04, RN25, RN26)."""
    if request.user.papel != Usuario.Papel.TREINADOR:
        return Response(
            {"detail": "Apenas treinadores podem consultar o perfil de alunos acompanhados."},
            status=status.HTTP_403_FORBIDDEN,
        )

    aluno = (
        Usuario.objects.select_related("perfil_aluno", "treinador")
        .filter(id=aluno_id, papel=Usuario.Papel.ALUNO)
        .first()
    )

    if not aluno:
        return Response(
            {"detail": "Aluno não encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )

    # RN03: treinador só pode consultar alunos vinculados à própria carteira
    if aluno.treinador_id != request.user.id:
        return Response(
            {"detail": "Você não tem permissão para visualizar o perfil deste aluno."},
            status=status.HTTP_403_FORBIDDEN,
        )

    return Response(PerfilAlunoAcompanhadoSerializer(aluno).data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes(ROTA_PROTEGIDA)
def trocar_senha(request):
    """US08 — Trocar senha de usuário autenticado (RF1108, RN24, RNF08)."""
    serializer = TrocarSenhaSerializer(
        data=request.data, context={"request": request}
    )
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {"detail": "Senha alterada com sucesso."},
        status=status.HTTP_200_OK,
    )

@api_view(["PATCH", "PUT"])
@permission_classes([*ROTA_PROTEGIDA, IsAlunoProprietarioPerfil])
def editar_perfil_aluno(request, aluno_id=None):
    """US07 — Editar informações pessoais e corporais básicas do aluno (RF1107)."""
    if request.user.papel != Usuario.Papel.ALUNO:
        return Response(
            {"detail": "Apenas o próprio aluno pode editar estas informações do perfil."},
            status=status.HTTP_403_FORBIDDEN,
        )

    if aluno_id is not None and int(aluno_id) != int(request.user.pk):
        return Response(
            {"detail": "Você não tem permissão para editar o perfil de outro aluno."},
            status=status.HTTP_403_FORBIDDEN,
        )

    aluno = (
        Usuario.objects.select_related("perfil_aluno", "treinador")
        .filter(pk=request.user.pk)
        .first()
        or request.user
    )

    # Garante que campos protegidos/clínicos enviados no payload não sejam aplicados
    # (se vierem isoladamente ou junto a campos válidos, não alteram dados protegidos).
    dados_filtrados = {
        chave: valor
        for chave, valor in request.data.items()
        if chave in EditarPerfilAlunoSerializer.CAMPOS_PERMITIDOS
    }

    serializer = EditarPerfilAlunoSerializer(
        aluno,
        data=dados_filtrados,
        partial=True,
        context={"request": request},
    )
    serializer.is_valid(raise_exception=True)
    usuario_atualizado = serializer.save()
    return Response(UsuarioSerializer(usuario_atualizado).data, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([AllowAny])
def solicitar_recuperacao_senha(request):
    """US10 — Solicita envio de link temporário de recuperação de senha (RF1110 / RN12)."""
    serializer = SolicitarRecuperacaoSenhaSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    resultado = serializer.save()
    return Response(resultado, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([AllowAny])
def redefinir_senha_recuperacao(request):
    """US10 — Redefine a senha utilizando link/token válido de uso único (RF1110 / RN12 / RN24)."""
    serializer = RedefinirSenhaRecuperacaoSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(
        {"detail": "Senha redefinida com sucesso."},
        status=status.HTTP_200_OK,
    )