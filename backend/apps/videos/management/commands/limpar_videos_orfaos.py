"""RNF15 / RNF12 — Apaga do bucket os vídeos enviados que nunca foram confirmados.

Se o app sobe o arquivo e fecha antes da confirmação (passo 3), o arquivo fica no
Storage sem ficha no banco: um "rascunho" que a RNF15 diz que não pode ficar guardado.
Depois de 2 horas o comprovante vence e esse arquivo não pode mais ser confirmado,
então é seguro apagá-lo.

Uso (rodar periodicamente, ex.: cron diário):
    python manage.py limpar_videos_orfaos            # apaga
    python manage.py limpar_videos_orfaos --simular  # só lista

Só percorre a pasta do ambiente (`SUPABASE_PREFIXO`), nunca a de outro integrante.
"""
from datetime import timedelta

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.utils import timezone

from apps.videos import storage
from apps.videos.models import VideoExecucao

# Folga além da validade do comprovante, para não pegar um envio confirmando agora.
MARGEM = timedelta(minutes=10)


class Command(BaseCommand):
    help = "Apaga do Storage os vídeos enviados e não confirmados há mais de 2 horas (RNF15)."

    def add_arguments(self, parser):
        parser.add_argument("--simular", action="store_true", help="Só lista, sem apagar.")

    def handle(self, *args, simular=False, **options):
        limite = timezone.now() - timedelta(seconds=storage.VALIDADE_UPLOAD_SEGUNDOS) - MARGEM
        try:
            arquivos = list(storage.listar_arquivos(settings.SUPABASE_PREFIXO))
        except storage.ErroArmazenamento as erro:
            raise CommandError(f"Storage indisponível: {erro}") from erro

        antigos = [caminho for caminho, criado_em in arquivos if criado_em < limite]
        registrados = set(
            VideoExecucao.objects.filter(caminho_storage__in=antigos).values_list("caminho_storage", flat=True)
        )
        orfaos = [caminho for caminho in antigos if caminho not in registrados]

        for caminho in orfaos:
            if simular:
                self.stdout.write(f"[simulação] apagaria {caminho}")
                continue
            try:
                storage.remover(caminho)
            except storage.ErroArmazenamento as erro:
                self.stderr.write(f"Falha ao apagar {caminho}: {erro}")
                continue
            self.stdout.write(f"Apagado {caminho}")

        acao = "encontrados" if simular else "apagados"
        self.stdout.write(self.style.SUCCESS(f"{len(orfaos)} vídeo(s) não confirmado(s) {acao}."))
