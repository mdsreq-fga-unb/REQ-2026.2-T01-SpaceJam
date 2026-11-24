"""US63 (RF4812) — Cria o registro inicial no histórico para aceites já gravados no usuário.

Usuários com `versao_termos_aceita` preenchida recebem um registro com origem
MIGRACAO, usando `data_aceite_termos` como data/hora (ou o momento da migração,
se ausente). Usuários sem aceite não recebem registro e ficarão com termos pendentes.
"""
from django.db import migrations
from django.utils import timezone


def criar_historico_inicial(apps, schema_editor):
    Usuario = apps.get_model("contas", "Usuario")
    HistoricoAceiteTermos = apps.get_model("contas", "HistoricoAceiteTermos")
    agora = timezone.now()
    registros = [
        HistoricoAceiteTermos(
            usuario_id=usuario.pk,
            versao=usuario.versao_termos_aceita,
            data_hora=usuario.data_aceite_termos or agora,
            origem="MIGRACAO",
        )
        for usuario in Usuario.objects.exclude(versao_termos_aceita="").only(
            "pk", "versao_termos_aceita", "data_aceite_termos"
        )
    ]
    HistoricoAceiteTermos.objects.bulk_create(registros, batch_size=500)


class Migration(migrations.Migration):

    dependencies = [
        ("contas", "0003_historicoaceitetermos"),
    ]

    operations = [
        # Reversão sem efeito: o histórico é imutável e é removido junto com a tabela ao reverter a 0003.
        migrations.RunPython(criar_historico_inicial, migrations.RunPython.noop),
    ]
