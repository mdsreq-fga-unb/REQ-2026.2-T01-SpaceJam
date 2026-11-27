from django.urls import path

from .views import SolicitarEnvioVideoView, VideoExecucaoView

# Incluídas em /api/treinos/, ao lado de exercicios/<id>/feedback-aluno/.
urlpatterns = [
    path(
        "exercicios/<int:item_id>/video/upload-url/",
        SolicitarEnvioVideoView.as_view(),
        name="video-execucao-upload-url",
    ),
    path(
        "exercicios/<int:item_id>/video/",
        VideoExecucaoView.as_view(),
        name="video-execucao",
    ),
]
