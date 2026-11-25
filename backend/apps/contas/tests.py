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

    def test_us01_bloquear_cadastro_de_menor_de_idade(self):
        """RN16 / Termos v1.0: menores de 18 anos são recusados, mesmo com a marcação de consentimento."""
        treinador = self._criar_treinador()
        for consentimento in (False, True):
            payload = self._payload_aluno(treinador["codigo_convite"], maior_idade=False, consentimento=consentimento)
            r = self.client.post("/api/auth/cadastro/aluno/", payload, format="json")
            self.assertEqual(r.status_code, 400)
            self.assertIn("data_nascimento", r.data)
            self.assertIn("maiores de 18 anos", str(r.data["data_nascimento"]))
        # Nenhuma conta foi criada: o login do aluno recusado falha.
        r_login = self.client.post(
            "/api/auth/login/aluno/", {"apelido": "lucao10", "senha": payload["senha"]}, format="json"
        )
        self.assertEqual(r_login.status_code, 401)

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

    def test_us61_consultar_perfil_aluno_acompanhado_e_casos_borda(self):
        treinador = self._criar_treinador()
        payload_aluno = self._payload_aluno(treinador["codigo_convite"])
        resp_aluno = self.client.post(
            "/api/auth/cadastro/aluno/", payload_aluno, format="json"
        )
        self.assertEqual(resp_aluno.status_code, 201)
        aluno_id = resp_aluno.data["id"]

        # Sem autenticação -> 401
        self.client.credentials()
        r_unauth = self.client.get(f"/api/contas/alunos/{aluno_id}/")
        self.assertEqual(r_unauth.status_code, 401)

        # Aluno tentando acessar a rota do treinador -> 403
        login_aluno = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": payload_aluno["apelido"], "senha": payload_aluno["senha"]},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_aluno['access']}")
        r_aluno = self.client.get(f"/api/contas/alunos/{aluno_id}/")
        self.assertEqual(r_aluno.status_code, 403)

        # Simula perfil sem objetivos preenchidos para validar o fallback "Não informado"
        aluno_obj = Usuario.objects.get(id=aluno_id)
        aluno_obj.perfil_aluno.objetivos = ""
        aluno_obj.perfil_aluno.save(update_fields=["objetivos"])

        # Treinador da carteira consultando aluno -> 200 sem senha
        login_treinador = self.client.post(
            "/api/auth/login/treinador/",
            {"email": treinador["email"], "senha": "SenhaForte#2026"},
            format="json",
        ).data
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_treinador['access']}"
        )
        r_ok = self.client.get(f"/api/contas/alunos/{aluno_id}/")
        self.assertEqual(r_ok.status_code, 200)
        self.assertEqual(r_ok.data["id"], aluno_id)
        self.assertEqual(r_ok.data["objetivos"], "Não informado")
        self.assertIn("historico_lesoes", r_ok.data)
        self.assertNotIn("password", r_ok.data)
        self.assertNotIn("senha", r_ok.data)

        # ID inexistente -> 404
        r_404 = self.client.get("/api/contas/alunos/999999/")
        self.assertEqual(r_404.status_code, 404)

    def test_us61_treinador_nao_acessa_aluno_de_outra_carteira(self):
        treinador = self._criar_treinador()
        resp_aluno = self.client.post(
            "/api/auth/cadastro/aluno/",
            self._payload_aluno(treinador["codigo_convite"]),
            format="json",
        )
        aluno_id = resp_aluno.data["id"]

        outro_treinador = Usuario.objects.create_user(
            username="coach_outro_us61",
            email="outro_coach_us61@basquete.com",
            password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
            first_name="Marcos",
            last_name="Lima",
        )
        login_outro = self.client.post(
            "/api/auth/login/treinador/",
            {"email": outro_treinador.email, "senha": "SenhaForte#2026"},
            format="json",
        ).data
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_outro['access']}"
        )

        r_forbidden = self.client.get(f"/api/contas/alunos/{aluno_id}/")
        self.assertEqual(r_forbidden.status_code, 403)
        
    def test_us08_trocar_senha_fluxos_e_bloqueios(self):
        self._criar_treinador()
        endpoint = "/api/auth/trocar-senha/"

        # Sem autenticação -> 401
        self.client.credentials()
        r_unauth = self.client.post(
            endpoint,
            {
                "senha_atual": "SenhaForte#2026",
                "nova_senha": "NovaSenha#2026",
                "confirmacao_senha": "NovaSenha#2026",
            },
            format="json",
        )
        self.assertEqual(r_unauth.status_code, 401)

        # Autentica treinador
        login = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "SenhaForte#2026"},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login['access']}")

        # Nova senha igual à atual -> 400
        r_igual = self.client.post(
            endpoint,
            {
                "senha_atual": "SenhaForte#2026",
                "nova_senha": "SenhaForte#2026",
                "confirmacao_senha": "SenhaForte#2026",
            },
            format="json",
        )
        self.assertEqual(r_igual.status_code, 400)

        # Senha atual incorreta -> 400
        r_atual_errada = self.client.post(
            endpoint,
            {
                "senha_atual": "SenhaErrada#2026",
                "nova_senha": "NovaSenha#2026",
                "confirmacao_senha": "NovaSenha#2026",
            },
            format="json",
        )
        self.assertEqual(r_atual_errada.status_code, 400)

        # Troca válida (6+ caracteres) -> 200
        r_ok = self.client.post(
            endpoint,
            {
                "senha_atual": "SenhaForte#2026",
                "nova_senha": "Nova#1",
                "confirmacao_senha": "Nova#1",
            },
            format="json",
        )
        self.assertEqual(r_ok.status_code, 200)

        # Refresh token antigo deve ser invalidado após a troca -> 401
        r_refresh = self.client.post(
            "/api/auth/refresh/",
            {"refresh": login["refresh"]},
            format="json",
        )
        self.assertEqual(r_refresh.status_code, 401)

        # Login com senha antiga deve falhar e com nova senha deve funcionar
        r_login_antiga = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "SenhaForte#2026"},
            format="json",
        )
        self.assertEqual(r_login_antiga.status_code, 401)

        r_login_nova = self.client.post(
            "/api/auth/login/treinador/",
            {"email": "carlos@basquete.com", "senha": "Nova#1"},
            format="json",
        )
        self.assertEqual(r_login_nova.status_code, 200)

    def test_us07_editar_perfil_aluno_fluxos_e_bloqueios(self):
        treinador = self._criar_treinador()
        payload_aluno = self._payload_aluno(treinador["codigo_convite"])
        resp_aluno = self.client.post(
            "/api/auth/cadastro/aluno/", payload_aluno, format="json"
        )
        self.assertEqual(resp_aluno.status_code, 201)
        aluno_id = resp_aluno.data["id"]

        endpoint = "/api/contas/me/editar/"

        # Sem autenticação -> 401
        self.client.credentials()
        r_unauth = self.client.patch(endpoint, {"nome": "Lucas Novo"}, format="json")
        self.assertEqual(r_unauth.status_code, 401)

        # Treinador tentando editar dados básicos do aluno -> 403
        login_treinador = self.client.post(
            "/api/auth/login/treinador/",
            {"email": treinador["email"], "senha": "SenhaForte#2026"},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_treinador['access']}")
        r_treinador = self.client.patch(
            f"/api/contas/alunos/{aluno_id}/editar/",
            {"nome": "Alterado Pelo Coach"},
            format="json",
        )
        self.assertEqual(r_treinador.status_code, 403)

        # Autentica aluno
        login_aluno = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": payload_aluno["apelido"], "senha": payload_aluno["senha"]},
            format="json",
        ).data
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_aluno['access']}")

        # Tentativa de editar perfil de outro aluno -> 403
        r_outro_id = self.client.patch(
            f"/api/contas/alunos/{aluno_id + 999}/editar/",
            {"nome": "Outro ID"},
            format="json",
        )
        self.assertEqual(r_outro_id.status_code, 403)

        # Edição válida + tentativa de alterar campo protegido (frequencia_semanal)
        r_ok = self.client.patch(
            endpoint,
            {
                "nome": "Lucas Gabriel",
                "sobrenome": "Oliveira Costa",
                "apelido": "lucao_novo",
                "email": "lucas.novo@aluno.com",
                "altura": "1.90",
                "peso": "84.00",
                "envergadura": "1.98",
                "objetivos": "Melhorar infiltração e finalização",
                "frequencia_semanal": 7,
            },
            format="json",
        )
        self.assertEqual(r_ok.status_code, 200)
        self.assertEqual(r_ok.data["first_name"], "Lucas Gabriel")
        self.assertEqual(r_ok.data["last_name"], "Oliveira Costa")
        self.assertEqual(r_ok.data["apelido"], "lucao_novo")
        self.assertEqual(r_ok.data["email"], "lucas.novo@aluno.com")
        self.assertEqual(r_ok.data["perfil_aluno"]["altura"], "1.90")
        self.assertEqual(r_ok.data["perfil_aluno"]["peso"], "84.00")
        self.assertEqual(r_ok.data["perfil_aluno"]["envergadura"], "1.98")
        self.assertEqual(
            r_ok.data["perfil_aluno"]["objetivos"],
            "Melhorar infiltração e finalização",
        )
        # Campo protegido permanece intacto (4 do cadastro original)
        self.assertEqual(r_ok.data["perfil_aluno"]["frequencia_semanal"], 4)

        # Novo apelido passa a valer no login e o antigo é recusado
        r_login_antigo = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": "lucao10", "senha": payload_aluno["senha"]},
            format="json",
        )
        self.assertEqual(r_login_antigo.status_code, 401)

        r_login_novo = self.client.post(
            "/api/auth/login/aluno/",
            {"apelido": "lucao_novo", "senha": payload_aluno["senha"]},
            format="json",
        )
        self.assertEqual(r_login_novo.status_code, 200)
