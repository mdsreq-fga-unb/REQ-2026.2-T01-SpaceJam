from datetime import date

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from .models import PerfilAluno, Usuario


def calcular_idade(data_nascimento: date) -> int:
    hoje = date.today()
    return (
        hoje.year
        - data_nascimento.year
        - ((hoje.month, hoje.day) < (data_nascimento.month, data_nascimento.day))
    )


class PerfilAlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilAluno
        fields = ["altura", "peso", "envergadura", "frequencia_semanal", "objetivos"]


class UsuarioSerializer(serializers.ModelSerializer):
    apelido = serializers.CharField(source="username", read_only=True)
    perfil_aluno = PerfilAlunoSerializer(read_only=True)
    termos_pendentes = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "apelido",
            "first_name",
            "last_name",
            "email",
            "telefone",
            "data_nascimento",
            "papel",
            "codigo_convite",
            "treinador",
            "perfil_aluno",
            "termos_pendentes",
        ]
        read_only_fields = fields

    def get_termos_pendentes(self, obj):
        return obj.versao_termos_aceita != settings.TERMOS_VERSAO_ATUAL


class CadastroAlunoSerializer(serializers.Serializer):
    """US01 — Cadastrar aluno (RF1101)."""

    codigo_treinador = serializers.CharField(write_only=True)
    nome = serializers.CharField(max_length=150)
    sobrenome = serializers.CharField(max_length=150)
    apelido = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    telefone = serializers.CharField(max_length=20, required=False, allow_blank=True, default="")
    data_nascimento = serializers.DateField()
    altura = serializers.DecimalField(max_digits=4, decimal_places=2, min_value=0.5, max_value=2.6)
    peso = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=20.0, max_value=300.0)
    envergadura = serializers.DecimalField(max_digits=4, decimal_places=2, min_value=0.5, max_value=2.8)
    frequencia_semanal = serializers.IntegerField(min_value=1, max_value=7)
    objetivos = serializers.CharField()
    senha = serializers.CharField(write_only=True, min_length=6)
    aceite_termos = serializers.BooleanField(write_only=True)
    consentimento_responsavel = serializers.BooleanField(write_only=True, required=False, default=False)

    def validate_codigo_treinador(self, value):
        try:
            treinador = Usuario.objects.get(
                codigo_convite=value.strip().upper(),
                papel=Usuario.Papel.TREINADOR,
                is_active=True,
            )
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Código de treinador inválido ou inexistente.")
        self._treinador_encontrado = treinador
        return value

    def validate_apelido(self, value):
        if Usuario.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError("Este apelido já está em uso.")
        return value.strip()

    def validate_email(self, value):
        if Usuario.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value.strip().lower()

    def validate_aceite_termos(self, value):
        if not value:
            raise serializers.ValidationError("É obrigatório aceitar os Termos de Uso e Política de Privacidade.")
        return value

    def validate_data_nascimento(self, value):
        if value >= date.today():
            raise serializers.ValidationError("A data de nascimento deve ser anterior à data atual.")
        return value

    def validate(self, attrs):
        idade = calcular_idade(attrs["data_nascimento"])
        if idade < 18 and not attrs.get("consentimento_responsavel"):
            raise serializers.ValidationError(
                {
                    "consentimento_responsavel": (
                        "Alunos menores de 18 anos precisam do consentimento prévio de um responsável legal (RN16)."
                    )
                }
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        usuario = Usuario.objects.create_user(
            username=validated_data["apelido"],
            email=validated_data["email"],
            password=validated_data["senha"],
            first_name=validated_data["nome"].strip(),
            last_name=validated_data["sobrenome"].strip(),
            telefone=validated_data.get("telefone", "").strip(),
            data_nascimento=validated_data["data_nascimento"],
            papel=Usuario.Papel.ALUNO,
            treinador=self._treinador_encontrado,
            versao_termos_aceita=settings.TERMOS_VERSAO_ATUAL,
            data_aceite_termos=timezone.now(),
            consentimento_responsavel=validated_data.get("consentimento_responsavel", False),
        )
        PerfilAluno.objects.create(
            usuario=usuario,
            altura=validated_data["altura"],
            peso=validated_data["peso"],
            envergadura=validated_data["envergadura"],
            frequencia_semanal=validated_data["frequencia_semanal"],
            objetivos=validated_data["objetivos"].strip(),
        )
        return usuario


class CadastroTreinadorSerializer(serializers.Serializer):
    """US02 — Cadastrar treinador (RF1102)."""

    codigo_ativacao = serializers.CharField(write_only=True)
    nome = serializers.CharField(max_length=150)
    sobrenome = serializers.CharField(max_length=150)
    apelido = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    telefone = serializers.CharField(max_length=20)
    senha = serializers.CharField(write_only=True, min_length=6)
    aceite_termos = serializers.BooleanField(write_only=True)

    def validate_codigo_ativacao(self, value):
        if value.strip() != settings.COACH_ACTIVATION_CODE:
            raise serializers.ValidationError("Código de ativação inválido.")
        return value

    def validate_apelido(self, value):
        if Usuario.objects.filter(username__iexact=value.strip()).exists():
            raise serializers.ValidationError("Este apelido já está em uso.")
        return value.strip()

    def validate_email(self, value):
        if Usuario.objects.filter(email__iexact=value.strip()).exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return value.strip().lower()

    def validate_aceite_termos(self, value):
        if not value:
            raise serializers.ValidationError("É obrigatório aceitar os Termos de Uso e Política de Privacidade.")
        return value

    def validate(self, attrs):
        # Regra do treinador único definida na Conferência do DoR (RN01 / CA03)
        if Usuario.objects.filter(papel=Usuario.Papel.TREINADOR).exists():
            raise serializers.ValidationError(
                {"detail": "O cadastro de treinador não está disponível pois já existe um treinador registrado."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        return Usuario.objects.create_user(
            username=validated_data["apelido"],
            email=validated_data["email"],
            password=validated_data["senha"],
            first_name=validated_data["nome"].strip(),
            last_name=validated_data["sobrenome"].strip(),
            telefone=validated_data["telefone"].strip(),
            papel=Usuario.Papel.TREINADOR,
            versao_termos_aceita=settings.TERMOS_VERSAO_ATUAL,
            data_aceite_termos=timezone.now(),
        )


class LoginAlunoSerializer(serializers.Serializer):
    """US04 — Logar com conta própria (Aluno) via apelido e senha."""

    apelido = serializers.CharField(required=False)
    username = serializers.CharField(required=False)  # Compatibilidade com o esqueleto anterior
    senha = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        apelido = (attrs.get("apelido") or attrs.get("username") or "").strip()
        senha = attrs.get("senha") or attrs.get("password") or ""

        if not apelido or not senha:
            raise AuthenticationFailed("Apelido ou senha inválidos")

        usuario = Usuario.objects.filter(username__iexact=apelido, papel=Usuario.Papel.ALUNO).first()
        if not usuario or not usuario.is_active or not usuario.check_password(senha):
            raise AuthenticationFailed("Apelido ou senha inválidos")

        refresh = RefreshToken.for_user(usuario)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": UsuarioSerializer(usuario).data,
        }


class LoginTreinadorSerializer(serializers.Serializer):
    """US05 — Logar com conta própria (Treinador) via e-mail e senha."""

    email = serializers.EmailField()
    senha = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    def validate(self, attrs):
        email = attrs.get("email", "").strip().lower()
        senha = attrs.get("senha") or attrs.get("password") or ""

        if not email or not senha:
            raise AuthenticationFailed("E-mail ou senha inválidos")

        usuario = Usuario.objects.filter(email__iexact=email, papel=Usuario.Papel.TREINADOR).first()
        if not usuario or not usuario.is_active or not usuario.check_password(senha):
            raise AuthenticationFailed("E-mail ou senha inválidos")

        refresh = RefreshToken.for_user(usuario)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": UsuarioSerializer(usuario).data,
        }

class DadosCadastraisAlunoSerializer(serializers.ModelSerializer):
    """US53 (RF4802) — Consulta dos próprios dados cadastrais do aluno (RN25, RN26, sem senha)."""

    apelido = serializers.CharField(source="username", read_only=True)
    data_nascimento = serializers.DateField(source="perfil_aluno.data_nascimento", read_only=True)
    altura = serializers.DecimalField(
        source="perfil_aluno.altura", max_digits=4, decimal_places=2, read_only=True
    )
    peso = serializers.DecimalField(
        source="perfil_aluno.peso", max_digits=5, decimal_places=2, read_only=True
    )
    envergadura = serializers.DecimalField(
        source="perfil_aluno.envergadura", max_digits=4, decimal_places=2, read_only=True
    )
    frequencia_semanal = serializers.IntegerField(
        source="perfil_aluno.frequencia_semanal", read_only=True
    )
    objetivos = serializers.SerializerMethodField()
    treinador_vinculado = serializers.SerializerMethodField()
    historico_lesoes = serializers.SerializerMethodField()

    class Meta:
        model = Usuario
        fields = [
            "id",
            "first_name",
            "last_name",
            "apelido",
            "email",
            "telefone",
            "data_nascimento",
            "altura",
            "peso",
            "envergadura",
            "frequencia_semanal",
            "objetivos",
            "treinador_vinculado",
            "historico_lesoes",
        ]
        read_only_fields = fields

    def get_objetivos(self, obj):
        perfil = getattr(obj, "perfil_aluno", None)
        if not perfil or not perfil.objetivos or not perfil.objetivos.strip():
            return "Não informado"
        return perfil.objetivos

    def get_treinador_vinculado(self, obj):
        if not obj.treinador:
            return None
        nome_completo = f"{obj.treinador.first_name} {obj.treinador.last_name}".strip()
        return {
            "id": obj.treinador.id,
            "nome": nome_completo or obj.treinador.username,
            "codigo_convite": obj.treinador.codigo_convite,
        }

    def get_historico_lesoes(self, obj):
        lesoes_rel = getattr(obj, "lesoes", None)
        if lesoes_rel is not None and hasattr(lesoes_rel, "all"):
            return list(lesoes_rel.values())
        return []
    
class PerfilAlunoAcompanhadoSerializer(DadosCadastraisAlunoSerializer):
    """US61 (RF4810) — Consulta do perfil completo de aluno acompanhado pelo treinador (RN03, RN04, RN25, RN26)."""

    historico_lesoes = serializers.SerializerMethodField()

    class Meta(DadosCadastraisAlunoSerializer.Meta):
        fields = DadosCadastraisAlunoSerializer.Meta.fields + ["historico_lesoes"]
        read_only_fields = fields

    def get_historico_lesoes(self, obj):
        # RN26: exposto em modo somente leitura quando houver vínculo; lista vazia até haver modelo de lesões
        lesoes_rel = getattr(obj, "lesoes", None)
        if lesoes_rel is not None and hasattr(lesoes_rel, "all"):
            return list(lesoes_rel.values())
        return []