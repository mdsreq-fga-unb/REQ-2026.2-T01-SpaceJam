from hashlib import sha256
from unittest.mock import patch
from urllib.parse import parse_qs, urlsplit

from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import RecuperacaoSenha, Usuario


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    FRONTEND_URL="https://spacejam.example.test",
)
class RecuperacaoSenhaTests(APITestCase):
    def setUp(self):
        self.aluno = Usuario.objects.create_user(
            username="aluno_teste", email="aluno@example.test", password="SenhaAnterior#1"
        )

    def solicitar(self, email=None, ip="192.0.2.10"):
        return self.client.post(
            "/api/auth/recuperar-senha/",
            {"email": email or self.aluno.email},
            format="json",
            REMOTE_ADDR=ip,
        )

    def token_recebido(self):
        self.assertEqual(self.solicitar().status_code, 200)
        linha = next(linha for linha in mail.outbox[-1].body.splitlines() if "?token=" in linha)
        return parse_qs(urlsplit(linha).query)["token"][0]

    def redefinir(self, token, **extra):
        return self.client.post(
            "/api/auth/redefinir-senha/",
            {"token": token, "nova_senha": "NovaSenha#2026", **extra},
            format="json",
        )

    def test_falha_de_entrega_preserva_a_resposta_generica(self):
        esperado = self.solicitar("ausente@example.test")
        self.client.raise_request_exception = False
        with patch("django.core.mail.backends.locmem.EmailBackend.send_messages", side_effect=OSError):
            resposta = self.solicitar()
        self.assertEqual(resposta.status_code, esperado.status_code)
        self.assertEqual(resposta.data, esperado.data)

    def test_link_mais_recente_funciona_sem_cache(self):
        anterior = self.token_recebido()
        ultimo = self.token_recebido()
        cache.clear()
        registro = RecuperacaoSenha.objects.get(usuario=self.aluno)
        self.assertNotEqual(registro.resumo_token, sha256(anterior.encode()).hexdigest())
        self.assertEqual(registro.resumo_token, sha256(ultimo.encode()).hexdigest())
        resposta = self.redefinir(ultimo, confirmacao_senha="NovaSenha#2026")
        self.assertEqual(resposta.status_code, 200)
        registro.refresh_from_db()
        self.assertTrue(registro.usado)
        self.assertEqual(registro.resumo_token, sha256(ultimo.encode()).hexdigest())

    def test_confirmacao_e_obrigatoria(self):
        token = self.token_recebido()
        resposta = self.redefinir(token)
        self.assertEqual(resposta.status_code, 400)
        self.assertIn("confirmacao_senha", resposta.data)
        self.assertEqual(self.redefinir(token, confirmacao_senha="NovaSenha#2026").status_code, 200)

    @override_settings(PASSWORD_RESET_EMAIL_LIMIT=1, PASSWORD_RESET_IP_LIMIT=2)
    def test_limites_por_email_e_ip_mantem_a_resposta_generica(self):
        Usuario.objects.create_user(
            username="outro_teste", email="outro@example.test", password="SenhaAnterior#2"
        )
        primeira = self.solicitar()
        self.assertEqual(primeira.status_code, 200)
        for resposta in (
            self.solicitar(self.aluno.email.upper()),
            self.solicitar("outro@example.test"),
            self.solicitar(ip="192.0.2.11"),
        ):
            self.assertEqual(resposta.status_code, 200)
            self.assertEqual(resposta.data, primeira.data)
        self.assertEqual(len(mail.outbox), 1)

    def test_redefinicao_encerra_sessao_anterior_e_permite_novo_login(self):
        sessao_anterior = RefreshToken.for_user(self.aluno)
        access_anterior = str(sessao_anterior.access_token)
        token = self.token_recebido()
        self.assertEqual(self.redefinir(token, confirmacao_senha="NovaSenha#2026").status_code, 200)
        self.assertEqual(
            self.client.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {access_anterior}").status_code,
            401,
        )
        self.assertEqual(
            self.client.post("/api/auth/refresh/", {"refresh": str(sessao_anterior)}, format="json").status_code,
            401,
        )
        login = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": self.aluno.username, "senha": "NovaSenha#2026"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.assertEqual(
            self.client.get("/api/auth/me/", HTTP_AUTHORIZATION=f"Bearer {login.data['access']}").status_code,
            200,
        )
