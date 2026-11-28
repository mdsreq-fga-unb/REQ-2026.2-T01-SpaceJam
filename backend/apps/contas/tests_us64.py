from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas.authentication import SessaoRefreshToken
from apps.contas.models import HistoricoAceiteTermos, PerfilAluno, Usuario
from apps.treinos.models import DificuldadeAluno, FeedbackAluno, Planejamento, Treino, TreinoExercicio


@override_settings(
    TERMOS_VERSAO_ATUAL="1.0",
    TERMOS_USO_URL="https://spacejam.local/termos",
    POLITICA_PRIVACIDADE_URL="https://spacejam.local/privacidade",
)
class ExclusaoDadosTitularUS64Tests(APITestCase):
    def setUp(self):
        self.url = reverse("auth-excluir-conta")
        self.url_login_aluno = reverse("login-aluno")
        self.url_me = reverse("me")

        self.treinador = Usuario.objects.create_user(
            username="treinador_us64",
            email="treinador64@spacejam.local",
            password="SenhaForte123",
            papel=Usuario.Papel.TREINADOR,
            versao_termos_aceita="1.0",
        )

        self.aluno = Usuario.objects.create_user(
            username="aluno_us64",
            email="aluno64@spacejam.local",
            password="SenhaForte123",
            papel=Usuario.Papel.ALUNO,
            treinador=self.treinador,
            versao_termos_aceita="1.0",
        )
        PerfilAluno.objects.create(usuario=self.aluno, altura=1.80, peso=78.5, envergadura=1.82, frequencia_semanal=3, objetivos="Melhorar arremesso e defesa.")
        self.historico_termos = HistoricoAceiteTermos.objects.create(
            usuario=self.aluno,
            versao="1.0",
            origem=HistoricoAceiteTermos.Origem.CADASTRO,
        )

        # Cria dados vinculados em apps.treinos para garantir remoção em cascata (RN05)
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno,
            treinador=self.treinador,
            nome="Ciclo Pré-Temporada",
        )
        self.treino = Treino.objects.create(planejamento=self.planejamento, nome="Treino A")
        self.item_treino = TreinoExercicio.objects.create(
            treino=self.treino,
            ordem=1,
            nome="Arremesso Livre",
            objetivo="Precisão",
            fundamento="Arremesso",
            series=3,
            repeticoes=15,
        )
        FeedbackAluno.objects.create(
            item_treino=self.item_treino,
            aluno=self.aluno,
            texto="Senti boa evolução na mecânica.",
        )
        DificuldadeAluno.objects.create(
            item_treino=self.item_treino,
            aluno=self.aluno,
            nota=3,
        )

    def _autenticar(self, usuario):
        refresh = SessaoRefreshToken.for_user(usuario)
        access = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        return access, str(refresh)

    def test_us64_ca01_exclusao_valida_remove_dados_anonimiza_termos_e_revoga_sessao(self):
        self._autenticar(self.aluno)
        aluno_id = self.aluno.id
        historico_id = self.historico_termos.id

        response = self.client.post(
            self.url,
            {"senha_atual": "SenhaForte123", "confirmacao": "EXCLUIR"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("protocolo", response.data)
        self.assertTrue(response.data["protocolo"].startswith("EXC-"))

        # Usuário, perfil e dados de treino removidos fisicamente
        self.assertFalse(Usuario.objects.filter(id=aluno_id).exists())
        self.assertFalse(PerfilAluno.objects.filter(usuario_id=aluno_id).exists())
        self.assertFalse(Planejamento.objects.filter(aluno_id=aluno_id).exists())
        self.assertFalse(FeedbackAluno.objects.filter(aluno_id=aluno_id).exists())
        self.assertFalse(DificuldadeAluno.objects.filter(aluno_id=aluno_id).exists())

        # Treinador permanece intacto
        self.assertTrue(Usuario.objects.filter(id=self.treinador.id).exists())

        # Histórico de aceite de termos preservado, porém anonimizado (RN05 + RN15)
        historico = HistoricoAceiteTermos.objects.get(id=historico_id)
        self.assertIsNone(historico.usuario_id)
        self.assertEqual(historico.versao, "1.0")

        # Token antigo imediatamente inválido para novas chamadas
        resp_me = self.client.get(self.url_me)
        self.assertEqual(resp_me.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_us64_ca04_login_com_credenciais_antigas_falha_apos_exclusao(self):
        self._autenticar(self.aluno)
        self.client.post(
            self.url,
            {"senha_atual": "SenhaForte123", "confirmado": True},
            format="json",
        )
        self.client.credentials()

        resp_login = self.client.post(
            self.url_login_aluno,
            {"apelido": "aluno_us64", "senha": "SenhaForte123"},
            format="json",
        )
        self.assertEqual(resp_login.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_us64_ca02_sem_autenticacao_retorna_401(self):
        response = self.client.post(
            self.url,
            {"senha_atual": "SenhaForte123", "confirmacao": "EXCLUIR"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(Usuario.objects.filter(id=self.aluno.id).exists())

    def test_us64_ca02_confirmacao_invalida_ou_senha_errada_recusa_exclusao(self):
        self._autenticar(self.aluno)

        # Sem confirmação explícita
        resp_sem_conf = self.client.post(
            self.url,
            {"senha_atual": "SenhaForte123", "confirmacao": "APAGAR"},
            format="json",
        )
        self.assertEqual(resp_sem_conf.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Usuario.objects.filter(id=self.aluno.id).exists())

        # Senha atual incorreta
        resp_senha_errada = self.client.post(
            self.url,
            {"senha_atual": "SenhaErrada999", "confirmacao": "EXCLUIR"},
            format="json",
        )
        self.assertEqual(resp_senha_errada.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(Usuario.objects.filter(id=self.aluno.id).exists())

    def test_us64_treinador_nao_pode_acessar_rota_exclusao_aluno_403(self):
        self._autenticar(self.treinador)
        response = self.client.post(
            self.url,
            {"senha_atual": "SenhaForte123", "confirmacao": "EXCLUIR"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Usuario.objects.filter(id=self.treinador.id).exists())