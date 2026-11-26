"""
Tudo que muda entre máquinas (senha do banco, SECRET_KEY, DEBUG) vem de
variáveis de ambiente, definidas no arquivo .env da raiz do repositório.
Nunca coloque senha real direto neste arquivo.
"""
import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_bool(nome, padrao=False):
    return os.environ.get(nome, str(padrao)).lower() in ("1", "true", "yes", "sim")


SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-inseguro-troque-no-env")
DEBUG = env_bool("DJANGO_DEBUG", True)
if not DEBUG and len(SECRET_KEY) < 50:
    raise RuntimeError(
        "Configure DJANGO_SECRET_KEY com uma chave aleatoria "
        "de pelo menos 50 caracteres antes de executar em producao."
    )
ALLOWED_HOSTS = os.environ.get("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,backend").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Terceiros
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",  # Necessário para US03 (Logout)
    # Apps do projeto (uma por grupo de características do catálogo)
    "apps.contas",      # CP1, CP7 — cadastro, login, papéis aluno/treinador
    "apps.exercicios",  # CP4 — biblioteca de exercícios
    "apps.treinos",     # CP2, CP3 — planejamento, status, dificuldade
    "apps.videos",      # CP5, CP6, CP8 — vídeos de execução e feedback
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", "basquete"),
        "USER": os.environ.get("POSTGRES_USER", "basquete"),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", "basquete"),
        "HOST": os.environ.get("POSTGRES_HOST", "localhost"),
        "PORT": os.environ.get("POSTGRES_PORT", "5432"),
    }
}

# Usuário customizado. Precisa existir ANTES da primeira migração.
AUTH_USER_MODEL = "contas.Usuario"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 6},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Vídeos e imagens enviados pelos usuários
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "apps.contas.authentication.BlacklistableJWTAuthentication",
    ],
    # Fechado por padrão: toda rota exige login (CP8) e aceite dos termos vigentes (US63/RN15).
    # A ordem importa: sem login responde 401 antes do 403 TERMOS_PENDENTES.
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
        "apps.contas.permissions.TermosVigentesAceitos",
    ],
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
}

# Regras de Negócio (US01, US02, US04, US05)
COACH_ACTIVATION_CODE = os.environ.get("COACH_ACTIVATION_CODE", "TREINADOR-MVP-2026")
TERMOS_VERSAO_ATUAL = os.environ.get("TERMOS_VERSAO_ATUAL", "1.0")
# US63 (RN15) — Documentos vigentes. Sem os dois, o aceite fica indisponível (503).
# Aceita URL absoluta http(s):// ou caminho relativo iniciado por "/".
TERMOS_USO_URL = os.environ.get("TERMOS_USO_URL", "").strip()
POLITICA_PRIVACIDADE_URL = os.environ.get("POLITICA_PRIVACIDADE_URL", "").strip()
if not DEBUG and (
    not COACH_ACTIVATION_CODE.strip()
    or COACH_ACTIVATION_CODE == "TREINADOR-MVP-2026"
):
    raise RuntimeError(
        "Configure COACH_ACTIVATION_CODE com um codigo privado "
        "antes de executar em producao."
    )


# US10 — Recuperação de senha. Em desenvolvimento, use o console sem SMTP externo.
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173" if DEBUG else "").strip()
PASSWORD_RESET_TIMEOUT_SECONDS = min(3600, max(1, int(os.environ.get("PASSWORD_RESET_TIMEOUT_SECONDS", "3600"))))
PASSWORD_RESET_EMAIL_LIMIT = max(1, int(os.environ.get("PASSWORD_RESET_EMAIL_LIMIT", "5")))
PASSWORD_RESET_IP_LIMIT = max(1, int(os.environ.get("PASSWORD_RESET_IP_LIMIT", "20")))
PASSWORD_RESET_WINDOW_SECONDS = max(1, int(os.environ.get("PASSWORD_RESET_WINDOW_SECONDS", "900")))
EMAIL_BACKEND = os.environ.get(
    "EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend" if DEBUG else "django.core.mail.backends.smtp.EmailBackend",
)
EMAIL_HOST = os.environ.get("EMAIL_HOST", "localhost")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = env_bool("EMAIL_USE_TLS", True)
EMAIL_USE_SSL = env_bool("EMAIL_USE_SSL", False)
EMAIL_TIMEOUT = int(os.environ.get("EMAIL_TIMEOUT", "10"))
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@spacejam.local")
