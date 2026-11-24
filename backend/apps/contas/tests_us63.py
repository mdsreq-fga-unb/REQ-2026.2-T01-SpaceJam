"""US63 (RF4812) — Aceite dos Termos de Uso e da Política de Privacidade (RN15, RNF16, RNF05)."""
from time import perf_counter

from django.test import SimpleTestCase, TestCase, override_settings
from django.urls import URLResolver, get_resolver
from rest_framework.permissions import IsAuthenticated
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from . import termos
from .models import HistoricoAceiteTermos, HistoricoImutavelError, Usuario
from .permissions import TermosVigentesAceitos
from .tests import DOCUMENTOS_CONFIGURADOS, CadastroMixin

VERSAO_1_0 = override_settings(TERMOS_VERSAO_ATUAL="1.0")
SEM_DOCUMENTOS = override_settings(TERMOS_USO_URL="", POLITICA_PRIVACIDADE_URL="")

URL_ACEITE = "/api/auth/aceitar-termos/"
URL_PROTEGIDA = "/api/contas/me/"


class TermosMixin:
    def _criar_usuario(self, apelido="aluno_us63", papel=Usuario.Papel.ALUNO, aceitar=False):
        """Sem `aceitar`, simula conta antiga/seed criada sem nenhum aceite."""
        usuario = Usuario.objects.create_user(username=apelido, password="Senha@123", papel=papel)
        if aceitar:
            termos.registrar_aceite(usuario)
        return usuario

    def _autenticar(self, usuario):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {AccessToken.for_user(usuario)}")

    def _aceitar(self, **corpo):
        return self.client.post(URL_ACEITE, {"aceite_termos": True, **corpo}, format="json")

    def _historico(self, usuario):
        return list(
            HistoricoAceiteTermos.objects.filter(usuario=usuario)
            .order_by("data_hora")
            .values_list("versao", "origem")
        )


@VERSAO_1_0
@DOCUMENTOS_CONFIGURADOS
class CadastroAceiteTests(CadastroMixin, TermosMixin, APITestCase):
    """CA01 / RF4812 — o cadastro exige e registra o aceite."""

    def test_ca01_cadastros_registram_historico_de_cadastro(self):
        treinador = self._criar_treinador()
        aluno = self.client.post(
            "/api/auth/cadastro/aluno/", self._payload_aluno(treinador["codigo_convite"]), format="json"
        ).data

        for dados in (treinador, aluno):
            with self.subTest(papel=dados["papel"]):
                usuario = Usuario.objects.get(pk=dados["id"])
                registro = usuario.aceites_termos.get()
                self.assertEqual(self._historico(usuario), [("1.0", "CADASTRO")])
                self.assertEqual(registro.data_hora, usuario.data_aceite_termos)
                self.assertFalse(dados["termos_pendentes"])

    def _assert_aceite_obrigatorio(self, rota, payload):
        sem_aceite = {k: v for k, v in payload.items() if k != "aceite_termos"}
        for corpo in (sem_aceite, {**payload, "aceite_termos": False}):
            with self.subTest(rota=rota, aceite=corpo.get("aceite_termos", "ausente")):
                r = self.client.post(f"/api/auth/cadastro/{rota}/", corpo, format="json")
                self.assertEqual(r.status_code, 400)
                self.assertEqual(r.data["code"], "ACEITE_OBRIGATORIO")

    def test_ca01_cadastro_sem_aceite_400(self):
        self._assert_aceite_obrigatorio("treinador", self.dados_treinador)
        self._assert_aceite_obrigatorio("aluno", self._payload_aluno(self._criar_treinador()["codigo_convite"]))
        self.assertEqual(Usuario.objects.count(), 1)  # só o treinador criado para testar o aluno

    @SEM_DOCUMENTOS
    def test_ca01_cadastro_sem_documentos_503(self):
        convite = self._criar_usuario("coach", papel=Usuario.Papel.TREINADOR).codigo_convite
        for rota, payload in (("treinador", self.dados_treinador), ("aluno", self._payload_aluno(convite))):
            with self.subTest(rota=rota):
                r = self.client.post(f"/api/auth/cadastro/{rota}/", payload, format="json")
                self.assertEqual(r.status_code, 503)
                self.assertEqual(r.data["code"], "TERMOS_INDISPONIVEIS")
        self.assertEqual(Usuario.objects.count(), 1)
        self.assertFalse(HistoricoAceiteTermos.objects.exists())


@VERSAO_1_0
@DOCUMENTOS_CONFIGURADOS
class AceitarTermosTests(TermosMixin, APITestCase):
    """CA01 / CA03 / RN15 — aceite posterior, idempotência e nova versão."""

    def setUp(self):
        self.usuario = self._criar_usuario()
        self._autenticar(self.usuario)

    def test_ca01_aceite_invalido_400(self):
        for corpo in ({}, {"aceite_termos": False}, {"aceite_termos": ["true"]}):
            with self.subTest(corpo=corpo):
                r = self.client.post(URL_ACEITE, corpo, format="json")
                self.assertEqual(r.status_code, 400)
                self.assertEqual(r.data["code"], "ACEITE_OBRIGATORIO")
        self.assertEqual(self._historico(self.usuario), [])

    @SEM_DOCUMENTOS
    def test_ca01_aceite_sem_documentos_503(self):
        r = self._aceitar()
        self.assertEqual(r.status_code, 503)
        self.assertEqual(r.data["code"], "TERMOS_INDISPONIVEIS")
        self.assertEqual(self._historico(self.usuario), [])

    def test_ca01_aceite_201_em_ate_500ms_e_repeticao_200_sem_duplicar(self):
        inicio = perf_counter()
        r = self._aceitar(versao="1.0")
        self.assertLess(perf_counter() - inicio, 0.5)  # RNF16
        self.assertEqual(r.status_code, 201)
        self.assertFalse(r.data["termos_pendentes"])

        self.assertEqual(self._aceitar().status_code, 200)
        self.assertEqual(self._historico(self.usuario), [("1.0", "ACEITE")])

    def test_ca03_nova_versao_exige_novo_aceite_e_preserva_historico(self):
        self.assertEqual(self._aceitar().status_code, 201)

        with override_settings(TERMOS_VERSAO_ATUAL="1.1"):
            me = self.client.get("/api/auth/me/").data
            self.assertTrue(me["termos_pendentes"])
            self.assertEqual((me["versao_termos_aceita"], me["versao_termos_vigente"]), ("1.0", "1.1"))

            r = self._aceitar(versao="1.0")
            self.assertEqual(r.status_code, 409)
            self.assertEqual((r.data["code"], r.data["versao_atual"]), ("TERMOS_VERSAO_DIVERGENTE", "1.1"))

            self.assertEqual(self._aceitar(versao="1.1").status_code, 201)

        self.assertEqual(self._historico(self.usuario), [("1.0", "ACEITE"), ("1.1", "ACEITE")])


@VERSAO_1_0
@DOCUMENTOS_CONFIGURADOS
class BloqueioGlobalTests(TermosMixin, APITestCase):
    """CA02 / RN15 / RNF16 — 403 TERMOS_PENDENTES nas rotas protegidas e allowlist liberada."""

    def test_ca02_sem_token_401(self):
        self.assertEqual(self.client.get(URL_PROTEGIDA).status_code, 401)

    def test_ca02_termos_pendentes_403_sem_queries_extras(self):
        self._autenticar(self._criar_usuario())
        with self.assertNumQueries(1):  # apenas o SELECT do usuário feito pela autenticação JWT
            r = self.client.get(URL_PROTEGIDA)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(
            r.data,
            {
                "detail": termos.TermosPendentes.default_detail,
                "code": "TERMOS_PENDENTES",
                "versao_atual": "1.0",
            },
        )

    def test_ca02_termos_pendentes_precede_regra_de_papel(self):
        treinador = self._criar_usuario("coach", papel=Usuario.Papel.TREINADOR)
        self._autenticar(treinador)
        self.assertEqual(self.client.get(URL_PROTEGIDA).data["code"], "TERMOS_PENDENTES")

        termos.registrar_aceite(treinador)
        r = self.client.get(URL_PROTEGIDA)
        self.assertEqual(r.status_code, 403)
        self.assertNotIn("code", r.data)  # agora vale a regra de papel da US53

    def test_ca02_allowlist_liberada_com_termos_pendentes(self):
        usuario = self._criar_usuario()
        self._autenticar(usuario)
        refresh = str(RefreshToken.for_user(usuario))

        self.assertEqual(self.client.get("/api/health/").status_code, 200)
        self.assertEqual(self.client.get("/api/auth/termos/vigentes/").status_code, 200)
        self.assertTrue(self.client.get("/api/auth/me/").data["termos_pendentes"])
        renovado = self.client.post("/api/auth/refresh/", {"refresh": refresh}, format="json")
        self.assertEqual(renovado.status_code, 200)
        # ROTATE_REFRESH_TOKENS: o refresh antigo foi para a blacklist; o logout usa o novo.
        logout = self.client.post("/api/auth/logout/", {"refresh": renovado.data["refresh"]}, format="json")
        self.assertEqual(logout.status_code, 200)

    def test_ca02_desbloqueio_imediato_apos_aceite(self):
        self._autenticar(self._criar_usuario())
        self.assertEqual(self.client.get(URL_PROTEGIDA).status_code, 403)
        self.assertEqual(self._aceitar().status_code, 201)
        self.assertEqual(self.client.get(URL_PROTEGIDA).status_code, 200)


class AuditoriaRotasTests(SimpleTestCase):
    """RNF16 — 100% das rotas da API fora da allowlist exigem o aceite vigente."""

    ISENTAS = {
        "health", "cadastro-aluno", "cadastro-treinador", "login", "login-aluno", "login-treinador",
        "refresh", "termos-vigentes", "me", "logout", "aceitar-termos",
    }

    def _rotas_api(self, padroes=None, prefixo=""):
        for padrao in get_resolver().url_patterns if padroes is None else padroes:
            rota = prefixo + str(padrao.pattern)
            if isinstance(padrao, URLResolver):
                yield from self._rotas_api(padrao.url_patterns, rota)
            elif rota.startswith("api/"):
                yield rota, padrao

    def test_rnf16_toda_rota_fora_da_allowlist_exige_aceite(self):
        isentas_encontradas, protegidas = set(), []
        for rota, padrao in self._rotas_api():
            with self.subTest(rota=rota):
                view = getattr(padrao.callback, "cls", None)
                self.assertIsNotNone(view, "Toda rota da API deve ser uma view DRF.")
                if padrao.name in self.ISENTAS:
                    isentas_encontradas.add(padrao.name)
                    self.assertNotIn(TermosVigentesAceitos, view.permission_classes)
                else:
                    protegidas.append(rota)
                    self.assertIn(IsAuthenticated, view.permission_classes)
                    self.assertIn(TermosVigentesAceitos, view.permission_classes)

        self.assertEqual(isentas_encontradas, self.ISENTAS, "Allowlist com rota inexistente.")
        self.assertTrue(protegidas, "Nenhuma rota protegida encontrada: a auditoria não verificou nada.")


@VERSAO_1_0
class HistoricoAceiteTests(TermosMixin, TestCase):
    """RNF16 (imutável, data/hora, desempenho) e RNF05 (exclusão do titular)."""

    def test_rnf16_registrar_aceite_em_2_queries_com_mesmo_data_hora(self):
        usuario = self._criar_usuario()
        with self.assertNumQueries(2):
            registro = termos.registrar_aceite(usuario)
        usuario.refresh_from_db()
        self.assertEqual((usuario.versao_termos_aceita, usuario.data_aceite_termos), ("1.0", registro.data_hora))

    def test_rnf16_historico_nao_aceita_update_nem_delete(self):
        registro = termos.registrar_aceite(self._criar_usuario())
        registro.versao = "9.9"
        tentativas = {
            "instancia.save": registro.save,
            "instancia.delete": registro.delete,
            "queryset.update": lambda: HistoricoAceiteTermos.objects.update(versao="9.9"),
            "queryset.delete": lambda: HistoricoAceiteTermos.objects.all().delete(),
        }
        for nome, tentativa in tentativas.items():
            with self.subTest(nome), self.assertRaises(HistoricoImutavelError):
                tentativa()
        self.assertEqual(HistoricoAceiteTermos.objects.get().versao, "1.0")

    def test_rnf05_exclusao_do_titular_apaga_historico(self):
        usuario = self._criar_usuario(aceitar=True)
        with override_settings(TERMOS_VERSAO_ATUAL="1.1"):
            termos.registrar_aceite(usuario)
        mantido = self._criar_usuario("outro", aceitar=True)

        usuario_id = usuario.pk  # delete() zera o pk da instância
        usuario.delete()

        self.assertFalse(HistoricoAceiteTermos.objects.filter(usuario_id=usuario_id).exists())
        self.assertEqual(self._historico(mantido), [("1.0", "ACEITE")])
