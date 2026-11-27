from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("apps.contas.urls")),
    path("api/treinos/", include("apps.treinos.urls")),
    path("api/", include("apps.exercicios.urls")),
    # US42 — vídeos de execução, pendurados no exercício do treino.
    path("api/treinos/", include("apps.videos.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)