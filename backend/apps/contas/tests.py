from datetime import date, timedelta

from django.conf import settings
from django.test import override_settings
from rest_framework.test import APITestCase


# US63 (RN15): o cadastro só registra aceite com os documentos publicados.
DOCUMENTOS_CONFIGURADOS = override_settings(
    TERMOS_USO_URL="/termos-de-uso",
    POLITICA_PRIVACIDADE_URL="/politica-de-privacidade",
)


class CadastroMixin:
    """Payloads válidos de cadastro reutilizados pelas suítes do app."""

    def setUp(self):
        self.dados_treinador = {
            "codigo_ativacao": settings.COACH_ACTIVATION_CODE,
            "nome": "Carlos",
            "sobrenome": "Silva",
            "apelido": "coach_carlos",
            "email": "carlos@basquete.com",
            "telefone": "61999990000",
            "senha": "SenhaForte#2026",
            "aceite_termos": True,
        }

    def _criar_treinador(self):
        r = self.client.post("/api/auth/cadastro/treinador/", self.dados_treinador, format="json")
        return r.data

    def _payload_aluno(self, codigo_convite, maior_idade=True, consentimento=False):
        nasc = date.today() - timedelta(days=365 * 20 if maior_idade else 365 * 15)
        return {
            "codigo_treinador": codigo_convite,
            "nome": "Lucas",
            "sobrenome": "Oliveira",
            "apelido": "lucao10",
            "email": "lucas@aluno.com",
            "telefone": "61988887777",
            "data_nascimento": nasc.isoformat(),
            "altura": "1.88",
            "peso": "82.50",
            "envergadura": "1.95",
            "frequencia_semanal": 4,
            "objetivos": "Melhorar arremesso de 3 pontos",
            "senha": "SenhaAluno#2026",
            "aceite_termos": True,
            "consentimento_responsavel": consentimento,
        }


@DOCUMENTOS_CONFIGURADOS
class ContasUS01aUS05Tests(CadastroMixin, APITestCase):
    # --- US02: Cadastrar Treinador ---
    def test_us02_cadastrar_treinador_valido_e_bloquear_segundo_treinador(self):
        r = self.client.post("/api/auth/cadastro/treinador/", self.dados_treinador, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["papel"], "TREINADOR")
        self.assertTrue(r.data["codigo_convite"].startswith("TRN-"))

        # CA03 / RN01: Não permite cadastrar segundo treinador
        segundo = {**self.dados_treinador, "apelido": "outro_coach", "email": "outro@basquete.com"}
        r2 = self.client.post("/api/auth/cadastro/treinador/", segundo, format="json")
        self.assertEqual(r2.status_code, 400)

    def test_us02_codigo_ativacao_invalido(self):
        invalido = {**self.dados_treinador, "codigo_ativacao": "ERRADO"}
        r = self.client.post("/api/auth/cadastro/treinador/", invalido, format="json")
        self.assertEqual(r.status_code, 400)

    # --- US01: Cadastrar Aluno ---
    def test_us01_cadastrar_aluno_maior_de_idade_com_vinculo(self):
        treinador = self._criar_treinador()
        payload = self._payload_aluno(treinador["codigo_convite"], maior_idade=True)
        r = self.client.post("/api/auth/cadastro/aluno/", payload, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["papel"], "ALUNO")
        self.assertEqual(r.data["treinador"], treinador["id"])

    def test_us01_bloquear_menor_sem_consentimento_responsavel(self):
        treinador = self._criar_treinador()
        payload = self._payload_aluno(treinador["codigo_convite"], maior_idade=False, consentimento=False)
        r = self.client.post("/api/auth/cadastro/aluno/", payload, format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("consentimento_responsavel", r.data)

        # Com consentimento do responsável deve permitir
        payload["consentimento_responsavel"] = True
        r_ok = self.client.post("/api/auth/cadastro/aluno/", payload, format="json")
        self.assertEqual(r_ok.status_code, 201)

    # --- US04: Logar Aluno ---
    def test_us04_login_aluno_valido_e_invalido(self):
        treinador = self._criar_treinador()
        self.client.post("/api/auth/cadastro/aluno/", self._payload_aluno(treinador["codigo_convite"]), format="json")

        r_ok = self.client.post(
            "/api/auth/login/aluno/", {"apelido": "lucao10", "senha": "SenhaAluno#2026"}, format="json"
        )
        self.assertEqual(r_ok.status_code, 200)
        self.assertIn("access", r_ok.data)

        # CA02: Mensagem exata sem diferenciar apelido ou senha
        r_erro = self.client.post(
            "/api/auth/login/aluno/", {"apelido": "lucao10", "senha": "errada"}, format="json"
        )
        self.assertEqual(r_erro.status_code, 401)
        self.assertEqual(r_erro.data["detail"], "Apelido ou senha inválidos")

    # --- US05: Logar Treinador ---
    def test_us05_login_treinador_por_email_e_mensagem_erro(self):
        self._criar_treinador()

        r_ok = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "SenhaForte#2026"},
            format="json",
        )
        self.assertEqual(r_ok.status_code, 200)
        self.assertIn("access", r_ok.data)

        # CA02: Mensagem exata sem diferenciar e-mail ou senha
        r_erro = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "errada"},
            format="json",
        )
        self.assertEqual(r_erro.status_code, 401)
        self.assertEqual(r_erro.data["detail"], "E-mail ou senha inválidos")

    # --- US03: Deslogar da Conta ---
    def test_us03_logout_invalida_access_e_refresh_token(self):
        self._criar_treinador()
        login = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "SenhaForte#2026"},
            format="json",
        ).data

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")
        r_logout = self.client.post("/api/auth/logout/", {"refresh": login["refresh"]}, format="json")
        self.assertEqual(r_logout.status_code, 200)

        # CA01: O access token anterior deve receber 401 imediatamente
        r_me = self.client.get("/api/auth/me/")
        self.assertEqual(r_me.status_code, 401)

        # O refresh token também não pode mais renovar a sessão
        r_refresh = self.client.post("/api/auth/refresh/", {"refresh": login["refresh"]}, format="json")
        self.assertEqual(r_refresh.status_code, 401)

    def test_us03_logout_bloqueia_refresh_token_de_outro_usuario(self):
        treinador = self._criar_treinador()
        self.client.post("/api/auth/cadastro/aluno/", self._payload_aluno(treinador["codigo_convite"]), format="json")

        login_treinador = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "SenhaForte#2026"},
            format="json",
        ).data
        login_aluno = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": "lucao10", "senha": "SenhaAluno#2026"},
            format="json",
        ).data

        # Aluno tenta invalidar o refresh token do treinador
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_aluno['access']}")
        r_forbidden = self.client.post(
            "/api/auth/logout/", {"refresh": login_treinador["refresh"]}, format="json"
        )
        self.assertEqual(r_forbidden.status_code, 403)

    def test_us53_consultar_proprios_dados_aluno_e_bloquear_treinador(self):
        treinador = self._criar_treinador()
        payload_aluno = self._payload_aluno(treinador["codigo_convite"])
        self.client.post("/api/auth/cadastro/aluno/", payload_aluno, format="json")

        # Sem autenticação -> 401
        r_unauth = self.client.get("/api/contas/me/")
        self.assertEqual(r_unauth.status_code, 401)

        # Aluno autenticado -> 200 com dados cadastrais e sem senha
        login_aluno = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": payload_aluno["apelido"], "senha": payload_aluno["senha"]},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_aluno['access']}")

        r_ok = self.client.get("/api/contas/me/")
        self.assertEqual(r_ok.status_code, 200)
        self.assertEqual(r_ok.data["apelido"], payload_aluno["apelido"])
        self.assertIn("historico_lesoes", r_ok.data)
        self.assertNotIn("password", r_ok.data)
        self.assertNotIn("senha", r_ok.data)

        # Treinador autenticado na rota exclusiva do aluno -> 403
        login_treinador = self.client.post(
            "/api/auth/login/treinador/",
            {"email": treinador["email"], "senha": "SenhaForte#2026"},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_treinador['access']}")
        r_forbidden = self.client.get("/api/contas/me/")
        self.assertEqual(r_forbidden.status_code, 403)