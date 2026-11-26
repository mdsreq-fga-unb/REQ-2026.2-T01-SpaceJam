from datetime import date, timedelta

from django.conf import settings
from django.test import override_settings
from rest_framework.test import APITestCase
from apps.contas.models import Usuario
from apps.contas.termos import registrar_aceite
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken
from . import termos
from .models import Lesao, PerfilAluno


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
        self.assertEqual(r_ok.data["data_nascimento"], payload_aluno["data_nascimento"])
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
        self.assertEqual(r_ok.data["data_nascimento"], payload_aluno["data_nascimento"])
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
        registrar_aceite(outro_treinador)
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
        self.assertNotEqual(r_forbidden.data.get("code"), "TERMOS_PENDENTES")
        
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

        # A API deve rejeitar o access e o refresh da sessão anterior.
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)
        self.client.credentials()
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
                "telefone": "+55 (61) 95555-0101",
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
        self.assertEqual(r_ok.data["telefone"], "+55 (61) 95555-0101")
        self.assertEqual(self.client.get("/api/contas/me/").data["telefone"], "+55 (61) 95555-0101")
        self.assertEqual(r_ok.data["perfil_aluno"]["altura"], "1.90")
        self.assertEqual(r_ok.data["perfil_aluno"]["peso"], "84.00")
        self.assertEqual(r_ok.data["perfil_aluno"]["envergadura"], "1.98")
        self.assertEqual(
            r_ok.data["perfil_aluno"]["objetivos"],
            "Melhorar infiltração e finalização",
        )
        # Campo protegido permanece intacto (4 do cadastro original)
        self.assertEqual(r_ok.data["perfil_aluno"]["frequencia_semanal"], 4)

        r_invalido = self.client.patch(endpoint, {"telefone": "ramal"}, format="json")
        self.assertEqual(r_invalido.status_code, 400)
        self.assertIn("telefone", r_invalido.data)
        self.assertEqual(self.client.get("/api/contas/me/").data["telefone"], "+55 (61) 95555-0101")

        r_limpo = self.client.patch(endpoint, {"telefone": ""}, format="json")
        self.assertEqual(r_limpo.status_code, 200)
        self.assertEqual(self.client.get("/api/contas/me/").data["telefone"], "")

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

    def test_us10_recuperar_senha_fluxos_e_bloqueios(self):
        from urllib.parse import parse_qs, urlparse
        from django.core import mail
        from django.test.utils import override_settings

        treinador = self._criar_treinador()
        endpoint_solicitar = "/api/auth/recuperar-senha/"
        endpoint_redefinir = "/api/auth/redefinir-senha/"

        with override_settings(
            EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
            FRONTEND_URL="https://spacejam.example.test",
            PASSWORD_RESET_TIMEOUT_SECONDS=3600,
        ):
            mail.outbox.clear()

            # CA02: E-mail não cadastrado retorna resposta genérica sem enviar e-mail
            r_inexistente = self.client.post(
                endpoint_solicitar,
                {"email": "naoexiste@basquete.com"},
                format="json",
            )
            self.assertEqual(r_inexistente.status_code, 200)
            self.assertEqual(len(mail.outbox), 0)

            # CA01: E-mail cadastrado envia link com token
            r_ok = self.client.post(
                endpoint_solicitar,
                {"email": treinador["email"]},
                format="json",
            )
            self.assertEqual(r_ok.status_code, 200)
            self.assertEqual(r_ok.data["detail"], r_inexistente.data["detail"])
            self.assertEqual(len(mail.outbox), 1)

            corpo_email = mail.outbox[0].body
            link = next(
                (linha.strip() for linha in corpo_email.splitlines() if "redefinir-senha?token=" in linha),
                None,
            )
            self.assertIsNotNone(link)
            token = parse_qs(urlparse(link).query)["token"][0]

            # CA04: Token adulterado
            r_adulterado = self.client.post(
                endpoint_redefinir,
                {
                    "token": f"{token}x",
                    "nova_senha": "NovaSenha#2026",
                    "confirmacao_senha": "NovaSenha#2026",
                },
                format="json",
            )
            self.assertEqual(r_adulterado.status_code, 400)

            # CA05: Nova senha curta (< 6 caracteres)
            r_curta = self.client.post(
                endpoint_redefinir,
                {
                    "token": token,
                    "nova_senha": "123",
                    "confirmacao_senha": "123",
                },
                format="json",
            )
            self.assertEqual(r_curta.status_code, 400)

            # CA06: Novo pedido invalida o token anterior
            self.client.post(
                endpoint_solicitar,
                {"email": treinador["email"]},
                format="json",
            )
            r_revogado = self.client.post(
                endpoint_redefinir,
                {
                    "token": token,
                    "nova_senha": "NovaSenha#2026",
                    "confirmacao_senha": "NovaSenha#2026",
                },
                format="json",
            )
            self.assertEqual(r_revogado.status_code, 400)

            # Pega o segundo link (mais recente) e conclui a redefinição (CA07)
            link_recente = next(
                (
                    linha.strip()
                    for linha in mail.outbox[-1].body.splitlines()
                    if "redefinir-senha?token=" in linha
                ),
                None,
            )
            token_recente = parse_qs(urlparse(link_recente).query)["token"][0]

            r_redefinido = self.client.post(
                endpoint_redefinir,
                {
                    "token": token_recente,
                    "nova_senha": "NovaSenha#2026",
                    "confirmacao_senha": "NovaSenha#2026",
                },
                format="json",
            )
            self.assertEqual(r_redefinido.status_code, 200)

            # CA03: Reutilizar o mesmo token já usado deve falhar
            r_reuso = self.client.post(
                endpoint_redefinir,
                {
                    "token": token_recente,
                    "nova_senha": "OutraSenha#2026",
                    "confirmacao_senha": "OutraSenha#2026",
                },
                format="json",
            )
            self.assertEqual(r_reuso.status_code, 400)

            # Login com senha antiga falha e com a nova senha funciona
            r_login_antigo = self.client.post(
                "/api/auth/login/treinador/",
                {"email": treinador["email"], "senha": "SenhaForte#2026"},
                format="json",
            )
            self.assertEqual(r_login_antigo.status_code, 401)

            r_login_novo = self.client.post(
                "/api/auth/login/treinador/",
                {"email": treinador["email"], "senha": "NovaSenha#2026"},
                format="json",
            )
            self.assertEqual(r_login_novo.status_code, 200)


# --- US52: Consultar Alunos Acompanhados ---
class ContasUS52Tests(APITestCase):
    def criar_treinador(self, username, email):
        return Usuario.objects.create_user(
            username=username,
            email=email,
            password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
            versao_termos_aceita=settings.TERMOS_VERSAO_ATUAL,
        )

    def criar_aluno(self, username, email, treinador):
        return Usuario.objects.create_user(
            username=username,
            email=email,
            password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO,
            versao_termos_aceita=settings.TERMOS_VERSAO_ATUAL,
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

    def test_us52_abre_perfil_da_us61_com_o_id_da_lista(self):
        treinador = self.criar_treinador("coach_perfil", "coach_perfil@example.test")
        aluno = self.criar_aluno("aluno_perfil", "aluno_perfil@example.test", treinador)
        self.client.force_authenticate(user=treinador)

        lista = self.client.get("/api/alunos-acompanhados/")
        self.assertEqual(lista.status_code, 200)
        self.assertEqual(len(lista.data["alunos"]), 1)
        aluno_id = lista.data["alunos"][0]["id"]
        self.assertEqual(aluno_id, aluno.id)

        perfil = self.client.get(f"/api/contas/alunos/{aluno_id}/")
        self.assertEqual(perfil.status_code, 200)
        self.assertEqual(perfil.data["id"], aluno.id)


def url_lesoes(aluno_id):
    return f"/api/contas/alunos/{aluno_id}/lesoes/"

class LesaoMixin:
    def setUp(self):
        self.treinador = self._criar_usuario("coach_us11", Usuario.Papel.TREINADOR)
        self.aluno = self._criar_aluno("aluno_us11", self.treinador)

    def _criar_usuario(self, apelido, papel, treinador=None):
        usuario = Usuario.objects.create_user(
            username=apelido, password="Senha@123", papel=papel, treinador=treinador
        )
        termos.registrar_aceite(usuario)  # US63: rotas protegidas exigem os termos vigentes
        return usuario

    def _criar_aluno(self, apelido, treinador):
        aluno = self._criar_usuario(apelido, Usuario.Papel.ALUNO, treinador)
        PerfilAluno.objects.create(
            usuario=aluno,
            altura="1.80",
            peso="75.00",
            envergadura="1.85",
            frequencia_semanal=3,
            objetivos="Melhorar arremesso",
        )
        return aluno

    def _autenticar(self, usuario):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(usuario)}")

    def _registrar(self, descricao, aluno=None):
        aluno = aluno or self.aluno
        return self.client.post(url_lesoes(aluno.id), {"descricao": descricao}, format="json")

class RegistrarLesaoTests(LesaoMixin, APITestCase):
    # Registro com sucesso
    def test_ca01_treinador_registra_lesao_de_aluno_da_carteira(self):
        self._autenticar(self.treinador)
        r = self._registrar("Entorse no tornozelo direito.")

        self.assertEqual(r.status_code, 201)
        self.assertEqual(set(r.data), {"id", "descricao", "criado_em"})
        self.assertEqual(r.data["descricao"], "Entorse no tornozelo direito.")
        self.assertIsNotNone(r.data["criado_em"])
        self.assertEqual(Lesao.objects.filter(aluno=self.aluno).count(), 1)

    def test_ca01_lesao_aparece_no_perfil_consultado_pelo_treinador(self):
        self._autenticar(self.treinador)
        self._registrar("Entorse no tornozelo direito.")

        r = self.client.get(f"/api/contas/alunos/{self.aluno.id}/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(r.data["historico_lesoes"]), 1)
        self.assertEqual(r.data["historico_lesoes"][0]["descricao"], "Entorse no tornozelo direito.")
        self.assertNotIn("aluno", r.data["historico_lesoes"][0])

    def test_ca01_descricao_salva_sem_espacos_nas_pontas(self):
        self._autenticar(self.treinador)
        r = self._registrar("   Dor no joelho esquerdo.   ")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(Lesao.objects.get().descricao, "Dor no joelho esquerdo.")

    # Descrição obrigatória
    def test_ca02_descricao_vazia_so_espacos_ou_ausente_retorna_400(self):
        self._autenticar(self.treinador)
        for corpo in ({"descricao": ""}, {"descricao": "    "}, {"descricao": None}, {}):
            with self.subTest(corpo=corpo):
                r = self.client.post(url_lesoes(self.aluno.id), corpo, format="json")
                self.assertEqual(r.status_code, 400)
                self.assertIn("descricao", r.data)
        self.assertEqual(Lesao.objects.count(), 0)

    # Limite de 300 caracteres
    def test_ca03_limite_de_300_caracteres(self):
        self._autenticar(self.treinador)

        r_limite = self._registrar("a" * 300)
        self.assertEqual(r_limite.status_code, 201)

        r_acima = self._registrar("a" * 301)
        self.assertEqual(r_acima.status_code, 400)
        self.assertIn("descricao", r_acima.data)
        self.assertEqual(Lesao.objects.count(), 1)

    def test_ca03_limite_conta_o_texto_sem_espacos_nas_pontas(self):
        self._autenticar(self.treinador)
        r = self._registrar("  " + "a" * 300 + "  ")
        self.assertEqual(r.status_code, 201)

    # Histórico acumulado, do mais recente para o mais antigo
    def test_ca04_nova_lesao_nao_substitui_as_anteriores_e_ordem_e_decrescente(self):
        self._autenticar(self.treinador)
        self._registrar("Primeira lesão.")
        self._registrar("Segunda lesão.")
        # Força datas distintas para não depender do relógio do teste
        primeira = Lesao.objects.get(descricao="Primeira lesão.")
        Lesao.objects.filter(pk=primeira.pk).update(criado_em=timezone.now() - timedelta(days=1))

        r = self.client.get(f"/api/contas/alunos/{self.aluno.id}/")
        descricoes = [lesao["descricao"] for lesao in r.data["historico_lesoes"]]
        self.assertEqual(descricoes, ["Segunda lesão.", "Primeira lesão."])

    # Acesso restrito
    def test_ca06_sem_autenticacao_retorna_401(self):
        r = self._registrar("Entorse.")
        self.assertEqual(r.status_code, 401)
        self.assertEqual(Lesao.objects.count(), 0)

    def test_ca06_aluno_autenticado_recebe_403(self):
        self._autenticar(self.aluno)
        r = self._registrar("Entorse.")
        self.assertEqual(r.status_code, 403)
        self.assertEqual(Lesao.objects.count(), 0)

    def test_ca06_aluno_inexistente_retorna_404(self):
        self._autenticar(self.treinador)
        r = self.client.post(url_lesoes(999999), {"descricao": "Entorse."}, format="json")
        self.assertEqual(r.status_code, 404)

    def test_ca06_id_de_treinador_nao_e_aluno_retorna_404(self):
        self._autenticar(self.treinador)
        r = self._registrar("Entorse.", aluno=self.treinador)
        self.assertEqual(r.status_code, 404)

    def test_rn03_aluno_fora_da_carteira_retorna_403(self):
        aluno_sem_vinculo = self._criar_aluno("aluno_sem_vinculo", treinador=None)
        self._autenticar(self.treinador)
        r = self._registrar("Entorse.", aluno=aluno_sem_vinculo)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(Lesao.objects.count(), 0)

    def test_rn04_metodos_de_edicao_e_exclusao_nao_existem_no_mvp(self):
        self._autenticar(self.treinador)
        for metodo in (self.client.get, self.client.put, self.client.patch, self.client.delete):
            with self.subTest(metodo=metodo.__name__):
                self.assertEqual(metodo(url_lesoes(self.aluno.id)).status_code, 405)

    # Aluno consulta o próprio histórico em modo somente leitura
    def test_rn26_aluno_ve_suas_lesoes_nos_proprios_dados(self):
        Lesao.objects.create(aluno=self.aluno, descricao="Entorse no tornozelo.")
        self._autenticar(self.aluno)
        r = self.client.get("/api/contas/me/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual([l["descricao"] for l in r.data["historico_lesoes"]], ["Entorse no tornozelo."])

    # Lesões são removidas junto com a conta do aluno
    def test_rn05_exclusao_do_aluno_remove_as_lesoes(self):
        Lesao.objects.create(aluno=self.aluno, descricao="Entorse no tornozelo.")
        self.aluno.delete()
        self.assertEqual(Lesao.objects.count(), 0)
