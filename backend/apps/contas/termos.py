"""US63 (RF4812) — Fonte única da regra RN15 (aceite dos Termos de Uso e da Política de Privacidade).

Views, serializers e permissões devem consultar e registrar aceites somente por aqui.
O histórico (`HistoricoAceiteTermos`) é a trilha auditável e imutável (RNF16); os campos
`versao_termos_aceita`/`data_aceite_termos` do `Usuario` são apenas o cache do aceite vigente,
lido sem queries extras na verificação de bloqueio.
"""
import re

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import APIException

from .models import HistoricoAceiteTermos, Usuario

# Mesma regra do front (AceiteTermos.tsx): http(s):// ou caminho absoluto "/..." (não "//host").
_URL_DOCUMENTO_VALIDA = re.compile(r"^(https?://|/(?!/))")


class ErroTermos(APIException):
    """Erros da RN15 com corpo padronizado `{"detail", "code", ...}`.

    Não herda de `ValidationError` de propósito: levantado dentro de um serializer,
    não é agrupado sob o nome do campo e mantém o mesmo corpo da view de aceite.
    """

    def __init__(self, **extras):
        super().__init__({"detail": self.default_detail, "code": self.default_code, **extras})


class AceiteObrigatorio(ErroTermos):
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = "ACEITE_OBRIGATORIO"
    default_detail = "É obrigatório aceitar os Termos de Uso e a Política de Privacidade."


class TermosIndisponiveis(ErroTermos):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_code = "TERMOS_INDISPONIVEIS"
    default_detail = "Os Termos de Uso e a Política de Privacidade estão indisponíveis no momento."


class TermosVersaoDivergente(ErroTermos):
    status_code = status.HTTP_409_CONFLICT
    default_code = "TERMOS_VERSAO_DIVERGENTE"
    default_detail = "A versão aceita não corresponde à versão vigente dos termos."


class TermosPendentes(ErroTermos):
    status_code = status.HTTP_403_FORBIDDEN
    default_code = "TERMOS_PENDENTES"
    default_detail = "É necessário aceitar a versão vigente dos Termos de Uso e da Política de Privacidade."


def versao_vigente() -> str:
    return settings.TERMOS_VERSAO_ATUAL


def _url_valida(url: str) -> bool:
    return bool(url) and bool(_URL_DOCUMENTO_VALIDA.match(url))


def documentos_configurados() -> bool:
    """True somente se os dois documentos estiverem publicados com URL válida."""
    return _url_valida(settings.TERMOS_USO_URL) and _url_valida(settings.POLITICA_PRIVACIDADE_URL)


def termos_pendentes(usuario: Usuario) -> bool:
    """True se o usuário não aceitou a versão vigente (inclui contas sem nenhum aceite)."""
    return usuario.versao_termos_aceita != versao_vigente()


def validar_aceite(aceito: bool, versao=None) -> None:
    """Valida um aceite antes de registrá-lo (cadastro e aceite posterior), na ordem 400 → 503 → 409."""
    if not aceito:
        raise AceiteObrigatorio()
    if not documentos_configurados():
        raise TermosIndisponiveis()
    if versao is not None and str(versao).strip() != versao_vigente():
        raise TermosVersaoDivergente(versao_atual=versao_vigente())


@transaction.atomic(savepoint=False)
def registrar_aceite(usuario: Usuario, origem: str = HistoricoAceiteTermos.Origem.ACEITE) -> HistoricoAceiteTermos:
    """Registra o aceite da versão vigente: 1 INSERT no histórico + 1 UPDATE no cache do usuário.

    O mesmo `data_hora` é gravado nos dois lugares. `savepoint=False` evita a query de
    SAVEPOINT quando chamado dentro de outra transação (ex.: cadastro); qualquer falha
    aqui invalida a transação externa inteira, o que é o comportamento desejado.
    """
    versao = versao_vigente()
    data_hora = timezone.now()

    registro = HistoricoAceiteTermos.objects.create(
        usuario=usuario,
        versao=versao,
        data_hora=data_hora,
        origem=origem,
    )
    # UPDATE direto (sem Usuario.save) para manter exatamente 1 query e não disparar regras de save.
    Usuario.objects.filter(pk=usuario.pk).update(versao_termos_aceita=versao, data_aceite_termos=data_hora)
    usuario.versao_termos_aceita = versao
    usuario.data_aceite_termos = data_hora
    return registro
