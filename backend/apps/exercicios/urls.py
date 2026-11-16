from rest_framework.routers import DefaultRouter

from .views import ExercicioViewSet

router = DefaultRouter()
router.register("exercicios", ExercicioViewSet, basename="exercicio")

urlpatterns = router.urls