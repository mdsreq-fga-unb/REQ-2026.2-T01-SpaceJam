from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from apps.contas.permissions import IsTreinador

from .serializers import PlanejamentoSerializer


@api_view(["POST"])
@permission_classes([IsTreinador])
def cadastrar_planejamento(request):
    serializer = PlanejamentoSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    planejamento = serializer.save()
    return Response(
        PlanejamentoSerializer(planejamento, context={"request": request}).data,
        status=status.HTTP_201_CREATED,
    )