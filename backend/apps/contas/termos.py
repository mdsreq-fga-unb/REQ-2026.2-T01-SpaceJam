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

from .models import HistoricoAceiteTermos, Usuario

# Mesma regra do front (AceiteTermos.tsx): http(s):// ou caminho absoluto "/..." (não "//host").
_URL_DOCUMENTO_VALIDA = re.compile(r"^(https?://|/(?!/))")


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
