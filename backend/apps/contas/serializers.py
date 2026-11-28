from datetime import date

from django.conf import settings
from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken

from . import recuperacao, termos
from .authentication import SessaoRefreshToken
from .models import HistoricoAceiteTermos, Lesao, PerfilAluno, Usuario


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
    versao_termos_vigente = serializers.SerializerMethodField()

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
            "versao_termos_aceita",
            "versao_termos_vigente",
        ]
        read_only_fields = fields

    def get_termos_pendentes(self, obj):
        return termos.termos_pendentes(obj)

    def get_versao_termos_vigente(self, obj):
        return termos.versao_vigente()


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
    # Ausente equivale a false para responder 400 ACEITE_OBRIGATORIO, não "campo obrigatório".
    aceite_termos = serializers.BooleanField(write_only=True, required=False, default=False)

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

    def validate_data_nascimento(self, value):
        if value >= date.today():
            raise serializers.ValidationError("A data de nascimento deve ser anterior à data atual.")
        return value

    def validate(self, attrs):
        termos.validar_aceite(attrs["aceite_termos"])
        # RN16 / Termos de Uso v1.0 (3.3): sem fluxo verificável de consentimento do responsável
        # (US65, ainda não implementada), menores de 18 anos não podem se cadastrar. Uma marcação
        # enviada pelo próprio aluno não comprova o consentimento (art. 14 da LGPD).
        if calcular_idade(attrs["data_nascimento"]) < 18:
            raise serializers.ValidationError(
                {
                    "data_nascimento": (
                        "O cadastro está disponível apenas para maiores de 18 anos. O cadastro de menores "
                        "depende do consentimento do responsável legal, ainda não disponível (RN16)."
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
        )
        PerfilAluno.objects.create(
            usuario=usuario,
            altura=validated_data["altura"],
            peso=validated_data["peso"],
            envergadura=validated_data["envergadura"],
            frequencia_semanal=validated_data["frequencia_semanal"],
            objetivos=validated_data["objetivos"].strip(),
        )
        # US63 (RN15) — aceite registrado no histórico na mesma transação do cadastro.
        termos.registrar_aceite(usuario, HistoricoAceiteTermos.Origem.CADASTRO)
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
    # Ausente equivale a false para responder 400 ACEITE_OBRIGATORIO, não "campo obrigatório".
    aceite_termos = serializers.BooleanField(write_only=True, required=False, default=False)

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

    def validate(self, attrs):
        termos.validar_aceite(attrs["aceite_termos"])
        # Regra do treinador único definida na Conferência do DoR (RN01 / CA03)
        if Usuario.objects.filter(papel=Usuario.Papel.TREINADOR).exists():
            raise serializers.ValidationError(
                {"detail": "O cadastro de treinador não está disponível pois já existe um treinador registrado."}
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
            telefone=validated_data["telefone"].strip(),
            papel=Usuario.Papel.TREINADOR,
        )
        # US63 (RN15) — aceite registrado no histórico na mesma transação do cadastro.
        termos.registrar_aceite(usuario, HistoricoAceiteTermos.Origem.CADASTRO)
        return usuario


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

        refresh = SessaoRefreshToken.for_user(usuario)
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

        refresh = SessaoRefreshToken.for_user(usuario)
        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "usuario": UsuarioSerializer(usuario).data,
        }

class DadosCadastraisAlunoSerializer(serializers.ModelSerializer):
    """US53 (RF4802) — Consulta dos próprios dados cadastrais do aluno (RN25, RN26, sem senha)."""

    apelido = serializers.CharField(source="username", read_only=True)
    data_nascimento = serializers.DateField(read_only=True)
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
            return ""
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
        # exposto em modo somente leitura.
        return LesaoSerializer(obj.lesoes.all(), many=True).data


class AlunoAcompanhadoSerializer(serializers.ModelSerializer):
    """US52 — Dados dos alunos acompanhados pelo treinador."""

    apelido = serializers.CharField(source="username", read_only=True)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "apelido",
            "first_name",
            "last_name",
            "email",
            "telefone",
        ]
        read_only_fields = fields
    
class PerfilAlunoAcompanhadoSerializer(DadosCadastraisAlunoSerializer):
    """US61 (RF4810) — Consulta do perfil completo de aluno acompanhado pelo treinador (RN03, RN04, RN25, RN26)."""

    historico_lesoes = serializers.SerializerMethodField()

    class Meta(DadosCadastraisAlunoSerializer.Meta):
        fields = DadosCadastraisAlunoSerializer.Meta.fields + ["historico_lesoes"]
        read_only_fields = fields

    
    def get_objetivos(self, obj):
        perfil = getattr(obj, "perfil_aluno", None)
        if not perfil or not perfil.objetivos or not perfil.objetivos.strip():
            return "Não informado"
        return perfil.objetivos

    def get_historico_lesoes(self, obj):
        # exposto em modo somente leitura.
        return LesaoSerializer(obj.lesoes.all(), many=True).data
    
class TrocarSenhaSerializer(serializers.Serializer):
    """US08 (RF1108) — Troca de senha para usuário autenticado (RN24)."""

    senha_atual = serializers.CharField(write_only=True, required=True)
    nova_senha = serializers.CharField(write_only=True, required=True, min_length=6)
    confirmacao_senha = serializers.CharField(write_only=True, required=True)

    def validate_senha_atual(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Senha atual incorreta.")
        return value

    def validate(self, attrs):
        senha_atual = attrs.get("senha_atual")
        nova_senha = attrs.get("nova_senha")
        confirmacao_senha = attrs.get("confirmacao_senha")

        if nova_senha != confirmacao_senha:
            raise serializers.ValidationError(
                {"confirmacao_senha": "A confirmação da nova senha não confere."}
            )

        if senha_atual == nova_senha:
            raise serializers.ValidationError(
                {"nova_senha": "A nova senha deve ser diferente da senha atual."}
            )

        return attrs

    @transaction.atomic
    def save(self, **kwargs):
        user = Usuario.objects.select_for_update().get(pk=self.context["request"].user.pk)
        if not user.check_password(self.validated_data["senha_atual"]):
            raise serializers.ValidationError({"senha_atual": "Senha atual incorreta."})

        user.set_password(self.validated_data["nova_senha"])
        user.versao_sessao += 1
        user.save(update_fields=["password", "versao_sessao"])

        tokens = OutstandingToken.objects.filter(user=user).values_list("pk", flat=True)
        BlacklistedToken.objects.bulk_create(
            [BlacklistedToken(token_id=pk) for pk in tokens], ignore_conflicts=True
        )
        return user


class EditarPerfilAlunoSerializer(serializers.Serializer):
    """US07 — Editar informações pessoais e corporais básicas do aluno (RF1107)."""

    CAMPOS_PERMITIDOS = {
        "nome",
        "sobrenome",
        "apelido",
        "email",
        "telefone",
        "altura",
        "peso",
        "envergadura",
        "objetivos",
    }

    nome = serializers.CharField(max_length=150, required=False)
    sobrenome = serializers.CharField(max_length=150, required=False)
    apelido = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    telefone = serializers.RegexField(
        r"\A\+?(?=[0-9 ().-]*[0-9])[0-9 ().-]+\Z",
        max_length=20,
        required=False,
        allow_blank=True,
        error_messages={"invalid": "Informe um telefone válido."},
    )
    altura = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=0.5, max_value=2.6, required=False
    )
    peso = serializers.DecimalField(
        max_digits=5, decimal_places=2, min_value=20.0, max_value=300.0, required=False
    )
    envergadura = serializers.DecimalField(
        max_digits=4, decimal_places=2, min_value=0.5, max_value=2.6, required=False
    )
    objetivos = serializers.CharField(max_length=500, required=False)

    def _usuario_alvo(self):
        instance = self.instance
        if isinstance(instance, PerfilAluno):
            return instance.usuario
        if isinstance(instance, Usuario):
            return instance
        request = self.context.get("request")
        return getattr(request, "user", None)

    def validate_nome(self, value):
        nome = value.strip()
        if not nome:
            raise serializers.ValidationError("O nome não pode ficar em branco.")
        return nome

    def validate_sobrenome(self, value):
        sobrenome = value.strip()
        if not sobrenome:
            raise serializers.ValidationError("O sobrenome não pode ficar em branco.")
        return sobrenome

    def validate_apelido(self, value):
        apelido = value.strip()
        if not apelido:
            raise serializers.ValidationError("O apelido não pode ficar em branco.")

        qs = Usuario.objects.filter(username__iexact=apelido)
        usuario_alvo = self._usuario_alvo()
        if usuario_alvo and usuario_alvo.pk:
            qs = qs.exclude(pk=usuario_alvo.pk)
        if qs.exists():
            raise serializers.ValidationError("Este apelido já está em uso.")
        return apelido

    def validate_email(self, value):
        email = value.strip().lower()
        if not email:
            raise serializers.ValidationError("O e-mail não pode ficar em branco.")

        qs = Usuario.objects.filter(email__iexact=email)
        usuario_alvo = self._usuario_alvo()
        if usuario_alvo and usuario_alvo.pk:
            qs = qs.exclude(pk=usuario_alvo.pk)
        if qs.exists():
            raise serializers.ValidationError("Este e-mail já está em uso.")
        return email

    def validate_objetivos(self, value):
        objetivos = value.strip()
        if not objetivos:
            raise serializers.ValidationError("Os objetivos não podem ficar em branco.")
        return objetivos

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "Informe ao menos um campo válido para edição do perfil."
            )
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        usuario = self._usuario_alvo()
        perfil, _ = PerfilAluno.objects.get_or_create(usuario=usuario)

        campos_usuario_atualizados = []
        if "nome" in validated_data:
            usuario.first_name = validated_data["nome"]
            campos_usuario_atualizados.append("first_name")
        if "sobrenome" in validated_data:
            usuario.last_name = validated_data["sobrenome"]
            campos_usuario_atualizados.append("last_name")
        if "apelido" in validated_data:
            usuario.username = validated_data["apelido"]
            campos_usuario_atualizados.append("username")
        if "email" in validated_data:
            usuario.email = validated_data["email"]
            campos_usuario_atualizados.append("email")
        if "telefone" in validated_data:
            usuario.telefone = validated_data["telefone"]
            campos_usuario_atualizados.append("telefone")

        if campos_usuario_atualizados:
            usuario.save(update_fields=campos_usuario_atualizados)

        campos_perfil_atualizados = []
        for campo in ("altura", "peso", "envergadura", "objetivos"):
            if campo in validated_data:
                setattr(perfil, campo, validated_data[campo])
                campos_perfil_atualizados.append(campo)

        if campos_perfil_atualizados:
            perfil.save(update_fields=campos_perfil_atualizados)

        usuario.refresh_from_db()
        return usuario


class SolicitarRecuperacaoSenhaSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def save(self, **kwargs):
        email = self.validated_data["email"].lower()
        ip = self.context["request"].META.get("REMOTE_ADDR") or "indisponivel"
        recuperacao.solicitar(email, ip)
        return {"detail": recuperacao.MENSAGEM_GENERICA}


class RedefinirSenhaRecuperacaoSerializer(serializers.Serializer):
    token = serializers.CharField(write_only=True)
    nova_senha = serializers.CharField(write_only=True, min_length=6, trim_whitespace=False)
    confirmacao_senha = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if attrs["nova_senha"] != attrs["confirmacao_senha"]:
            raise serializers.ValidationError(
                {"confirmacao_senha": "A confirmação da nova senha não confere."}
            )
        return attrs

    def save(self, **kwargs):
        recuperacao.redefinir(self.validated_data["token"], self.validated_data["nova_senha"])


class LesaoSerializer(serializers.ModelSerializer):
    """Registro de lesão no histórico do aluno."""

    descricao = serializers.CharField(
        max_length=Lesao.DESCRICAO_MAX,
        error_messages={
            "required": "Informe a descrição da lesão.",
            "blank": "Informe a descrição da lesão.",
            "null": "Informe a descrição da lesão.",
            "max_length": f"A descrição deve ter no máximo {Lesao.DESCRICAO_MAX} caracteres.",
        },
    )

    class Meta:
        model = Lesao
        fields = ["id", "descricao", "criado_em"]
        read_only_fields = ["id", "criado_em"]

class ExcluirContaSerializer(serializers.Serializer):
    """US64 (RF4813) — Validação de confirmação explícita e senha atual para exclusão de conta (RN05, RNF05)."""

    senha_atual = serializers.CharField(
        write_only=True,
        required=True,
        allow_blank=False,
        error_messages={
            "required": "Informe sua senha atual para confirmar a exclusão.",
            "blank": "Informe sua senha atual para confirmar a exclusão.",
        },
    )
    confirmacao = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
    )
    confirmado = serializers.BooleanField(
        write_only=True,
        required=False,
        default=False,
    )

    def validate_senha_atual(self, value):
        usuario = self.context["request"].user
        if not usuario.check_password(value):
            raise serializers.ValidationError("A senha atual está incorreta.")
        return value

    def validate(self, attrs):
        confirmacao_texto = (attrs.get("confirmacao") or "").strip().upper()
        confirmado_flag = attrs.get("confirmado", False)

        if confirmacao_texto != "EXCLUIR" and confirmado_flag is not True:
            raise serializers.ValidationError(
                {
                    "confirmacao": (
                        "Confirmação explícita obrigatória. Envie 'confirmacao': 'EXCLUIR' "
                        "ou 'confirmado': true após ler o aviso de irreversibilidade."
                    )
                }
            )
        return attrs