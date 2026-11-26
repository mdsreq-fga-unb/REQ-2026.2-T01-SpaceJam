from django.core.cache import cache
from django.db import transaction
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Usuario


class SessaoRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        token["versao_sessao"] = user.versao_sessao
        return token


class RenovarSessaoSerializer(TokenRefreshSerializer):
    @transaction.atomic
    def validate(self, attrs):
        token = self.token_class(attrs["refresh"])
        usuario = (
            Usuario.objects.select_for_update()
            .filter(**{api_settings.USER_ID_FIELD: token[api_settings.USER_ID_CLAIM]})
            .first()
        )
        if usuario is None or token.get("versao_sessao", 0) != usuario.versao_sessao:
            raise InvalidToken("A sessão foi encerrada. Entre novamente.")
        return super().validate(attrs)


class BlacklistableJWTAuthentication(JWTAuthentication):
    def get_validated_token(self, raw_token):
        validated_token = super().get_validated_token(raw_token)
        jti = validated_token.get("jti")
        if jti and cache.get(f"blacklist_access_{jti}"):
            raise InvalidToken("Token de acesso encerrado via logout.")
        return validated_token

    def get_user(self, validated_token):
        usuario = super().get_user(validated_token)
        if validated_token.get("versao_sessao", 0) != usuario.versao_sessao:
            raise InvalidToken("A sessão foi encerrada. Entre novamente.")
        return usuario
