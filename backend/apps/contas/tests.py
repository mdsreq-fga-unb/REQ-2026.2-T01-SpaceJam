from rest_framework.test import APITestCase

from .models import Usuario


class LoginTests(APITestCase):
    def setUp(self):
        Usuario.objects.create_user(username="joaozinho", password="SenhaForte#2026", papel="ALUNO")

    def test_login_por_apelido_retorna_token(self):
        r = self.client.post("/api/auth/login/", {"username": "joaozinho", "password": "SenhaForte#2026"})
        self.assertEqual(r.status_code, 200)
        self.assertIn("access", r.data)

    def test_me_exige_login(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_me_retorna_papel(self):
        token = self.client.post(
            "/api/auth/login/", {"username": "joaozinho", "password": "SenhaForte#2026"}
        ).data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        r = self.client.get("/api/auth/me/")
        self.assertEqual(r.data["papel"], "ALUNO")
        self.assertEqual(r.data["apelido"], "joaozinho")
