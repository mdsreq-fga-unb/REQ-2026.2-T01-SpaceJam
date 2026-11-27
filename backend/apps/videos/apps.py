from django.apps import AppConfig


class VideosConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.videos"
    verbose_name = "Vídeos e feedback"

    def ready(self):
        from . import signals  # noqa: F401 — registra a faxina do Storage (RN05)
