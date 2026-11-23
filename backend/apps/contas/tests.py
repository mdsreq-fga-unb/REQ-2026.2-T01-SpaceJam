from datetime import date, timedelta

from django.conf import settings
from rest_framework.test import APITestCase

from .models import Usuario


class ContasUS01aUS05Tests(APITestCase):
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


# --- US52: Consultar Alunos Acompanhados ---
class ContasUS52Tests(APITestCase):
    def criar_treinador(self, username, email):
        return Usuario.objects.create_user(
            username=username,
            email=email,
            password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )

    def criar_aluno(self, username, email, treinador):
        return Usuario.objects.create_user(
            username=username,
            email=email,
            password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO,
            treinador=treinador,
            first_name="Aluno",
            last_name=username,
            telefone="61999990000",
        )

    def test_us52_treinador_visualiza_somente_seus_alunos(self):
        treinador1 = self.criar_treinador("coach1", "coach1@email.com")
        treinador2 = self.criar_treinador("coach2", "coach2@email.com")

        aluno1 = self.criar_aluno("aluno1", "aluno1@email.com", treinador1)
        aluno2 = self.criar_aluno("aluno2", "aluno2@email.com", treinador1)
        aluno_outro = self.criar_aluno("aluno3", "aluno3@email.com", treinador2)

        # CA01 / RN03: O treinador deve visualizar somente os alunos vinculados a ele.
        self.client.force_authenticate(user=treinador1)
        r = self.client.get("/api/alunos-acompanhados/")

        self.assertEqual(r.status_code, 200)

        ids_retornados = {aluno["id"] for aluno in r.data["alunos"]}

        self.assertEqual(ids_retornados, {aluno1.id, aluno2.id})
        self.assertNotIn(aluno_outro.id, ids_retornados)

    def test_us52_treinador_sem_alunos_recebe_lista_vazia_e_codigo_convite(self):
        treinador = self.criar_treinador("coach_vazio", "vazio@email.com")

        # CA03: Quando não houver alunos, deve retornar lista vazia e código de convite.
        self.client.force_authenticate(user=treinador)
        r = self.client.get("/api/alunos-acompanhados/")

        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["alunos"], [])
        self.assertEqual(r.data["codigo_convite"], treinador.codigo_convite)

    def test_us52_aluno_nao_pode_consultar_alunos_acompanhados(self):
        treinador = self.criar_treinador("coach3", "coach3@email.com")
        aluno = self.criar_aluno("aluno4", "aluno4@email.com", treinador)

        # CA04 / RNF08: O aluno não possui permissão para acessar a carteira do treinador.
        self.client.force_authenticate(user=aluno)
        r = self.client.get("/api/alunos-acompanhados/")

        self.assertEqual(r.status_code, 403)

    def test_us52_usuario_nao_autenticado_nao_pode_consultar_alunos(self):
        # CA04: Usuários não autenticados não podem acessar a carteira de alunos.
        r = self.client.get("/api/alunos-acompanhados/")

        self.assertEqual(r.status_code, 401)
