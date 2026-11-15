from rest_framework import serializers

from .models import Usuario


class UsuarioSerializer(serializers.ModelSerializer):
    apelido = serializers.CharField(source="username", read_only=True)

    class Meta:
        model = Usuario
        fields = ["id", "apelido", "first_name", "last_name", "email", "telefone", "papel"]
        read_only_fields = fields
