import hashlib
import logging
import secrets
from datetime import timedelta
from smtplib import SMTPException
from urllib.parse import urlencode, urlsplit

from django.conf import settings
from django.core.mail import send_mail
from django.core.signing import BadSignature, SignatureExpired, TimestampSigner
from django.db import transaction
from django.utils import timezone
from django.utils.crypto import constant_time_compare, salted_hmac
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from .models import LimiteRecuperacaoSenha, RecuperacaoSenha, Usuario

logger = logging.getLogger(__name__)
MENSAGEM_GENERICA = "Se o e-mail informado estiver cadastrado, enviamos um link de recuperação de senha."
ASSINADOR = "us10-recuperar-senha"


def _resumo(token):
    return hashlib.sha256(token.encode()).hexdigest()


@transaction.atomic
def _registrar_pedido(tipo, identificador, limite, agora):
    chave = salted_hmac(f"contas.recuperacao.{tipo}", identificador, algorithm="sha256").hexdigest()
    expira_em = agora + timedelta(seconds=settings.PASSWORD_RESET_WINDOW_SECONDS)
    registro, _ = LimiteRecuperacaoSenha.objects.select_for_update().get_or_create(
        chave=chave, defaults={"expira_em": expira_em, "pedidos": 0}
    )
    if registro.expira_em <= agora:
        registro.expira_em = expira_em
        registro.pedidos = 0
    if registro.pedidos >= limite:
        return False
    registro.pedidos += 1
    registro.save(update_fields=["pedidos", "expira_em"])
    return True


@transaction.atomic
def _emitir_link(email):
    usuario = Usuario.objects.select_for_update().filter(email__iexact=email, is_active=True).first()
    if usuario is None:
        return None
    token = TimestampSigner(salt=ASSINADOR).sign(f"{usuario.pk}:{secrets.token_urlsafe(24)}")
    RecuperacaoSenha.objects.update_or_create(
        usuario=usuario,
        defaults={
            "resumo_token": _resumo(token),
            "expira_em": timezone.now() + timedelta(seconds=settings.PASSWORD_RESET_TIMEOUT_SECONDS),
            "usado": False,
        },
    )
    return usuario, token


def solicitar(email, ip):
    agora = timezone.now()
    if not _registrar_pedido("ip", ip, settings.PASSWORD_RESET_IP_LIMIT, agora):
        return
    if not _registrar_pedido("email", email, settings.PASSWORD_RESET_EMAIL_LIMIT, agora):
        return
    LimiteRecuperacaoSenha.objects.filter(expira_em__lte=agora).delete()

    url = settings.FRONTEND_URL.rstrip("/")
    try:
        origem = urlsplit(url)
    except ValueError:
        origem = urlsplit("")
    esquemas = {"http", "https"} if settings.DEBUG else {"https"}
    if origem.scheme not in esquemas or not origem.hostname or origem.query or origem.fragment or origem.username:
        logger.warning("Recuperação de senha indisponível: configure um endereço válido para o frontend.")
        return
    emissao = _emitir_link(email)
    if emissao is None:
        return
    usuario, token = emissao
    link = f"{url}/redefinir-senha?{urlencode({'token': token})}"
    minutos, segundos = divmod(settings.PASSWORD_RESET_TIMEOUT_SECONDS, 60)
    validade = f"{minutos} min e {segundos} s" if segundos else f"{minutos} min"
    try:
        send_mail(
            "Recuperação de senha",
            "Recebemos uma solicitação para redefinir a sua senha.\n"
            f"Acesse o link de uso único, válido por {validade}:\n{link}\n\n"
            "Se você não solicitou essa alteração, ignore este e-mail.",
            settings.DEFAULT_FROM_EMAIL,
            [usuario.email],
        )
    except (OSError, SMTPException):
        RecuperacaoSenha.objects.filter(usuario=usuario, resumo_token=_resumo(token)).delete()
        logger.warning("Falha no envio do e-mail de recuperação de senha.")


@transaction.atomic
def redefinir(token, nova_senha):
    try:
        valor = TimestampSigner(salt=ASSINADOR).unsign(token, max_age=settings.PASSWORD_RESET_TIMEOUT_SECONDS)
        usuario_id, _ = valor.split(":", 1)
        usuario_id = int(usuario_id)
    except SignatureExpired as erro:
        raise ValidationError({
            "codigo": "token_expirado",
            "detail": "Este link de recuperação expirou. Solicite um novo link.",
        }) from erro
    except (BadSignature, ValueError) as erro:
        raise ValidationError({
            "codigo": "token_invalido",
            "detail": "O link de recuperação é inválido. Solicite um novo link.",
        }) from erro

    usuario = Usuario.objects.select_for_update().filter(pk=usuario_id, is_active=True).first()
    registro = RecuperacaoSenha.objects.filter(usuario=usuario).first() if usuario else None
    if registro is None or not constant_time_compare(registro.resumo_token, _resumo(token)):
        raise ValidationError({
            "codigo": "token_expirado",
            "detail": "Este link de recuperação não é mais válido. Solicite um novo link.",
        })
    if registro.usado:
        raise ValidationError({
            "codigo": "token_usado",
            "detail": "Este link de recuperação já foi utilizado. Solicite um novo link.",
        })
    if registro.expira_em <= timezone.now():
        raise ValidationError({
            "codigo": "token_expirado",
            "detail": "Este link de recuperação expirou. Solicite um novo link.",
        })

    usuario.set_password(nova_senha)
    usuario.versao_sessao += 1
    usuario.save(update_fields=["password", "versao_sessao"])
    registro.usado = True
    registro.save(update_fields=["usado"])
    BlacklistedToken.objects.bulk_create(
        [
            BlacklistedToken(token_id=pk)
            for pk in OutstandingToken.objects.filter(user=usuario, expires_at__gt=timezone.now()).values_list("pk", flat=True)
        ],
        ignore_conflicts=True,
    )
