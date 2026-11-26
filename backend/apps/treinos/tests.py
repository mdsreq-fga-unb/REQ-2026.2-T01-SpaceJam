from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas.models import Usuario
from apps.contas.termos import versao_vigente

from .models import FeedbackAluno, ItemTreino, Treino


class TreinoStatusConclusaoTests(APITestCase):
    def setUp(self):
        agora = timezone.now()
        versao = versao_vigente()

        self.treinador = Usuario.objects.create_user(
            username="lucas",
            email="lucas@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.TREINADOR,
            first_name="Lucas",
            last_name="Cordeiro",
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="outro_treinador",
            email="outro@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.TREINADOR,
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz",
            email="beatriz@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.ALUNO,
            first_name="Beatriz",
            treinador=self.treinador,
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="carlos",
            email="carlos@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.ALUNO,
            treinador=self.treinador,
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )

        self.treino = Treino.objects.create(
            aluno=self.aluno,
            treinador=self.treinador,
            nome="Controle de bola",
            titulo="Treino A",
            objetivo="Ganhar controle de bola em movimento.",
        )
        ItemTreino.objects.create(
            treino=self.treino,
            ordem=1,
            nome="Drible alternado",
            parametros="3 séries · 30 segundos",
        )

    # --- US23: Consultar status de treino ---

    def test_us23_ca01_estado_inicial_em_andamento_para_treinador_e_aluno(self):
        url = reverse("treino-status", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.treinador)
        resp_treinador = self.client.get(url)
        self.assertEqual(resp_treinador.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_treinador.data["status"], Treino.Status.EM_ANDAMENTO)
        self.assertEqual(resp_treinador.data["statusSlug"], "em-andamento")

        self.client.force_authenticate(user=self.aluno)
        resp_aluno = self.client.get(url)
        self.assertEqual(resp_aluno.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_aluno.data["status"], Treino.Status.EM_ANDAMENTO)

    def test_us23_ca03_bloqueia_outro_aluno_e_treinador_fora_da_carteira(self):
        url = reverse("treino-status", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.outro_aluno)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.outro_treinador)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_403_FORBIDDEN)

    def test_us23_ca04_retorna_401_sem_auth_e_404_inexistente(self):
        url = reverse("treino-status", kwargs={"treino_id": self.treino.id})
        self.assertEqual(self.client.get(url).status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.treinador)
        url_inexistente = reverse("treino-status", kwargs={"treino_id": 999999})
        self.assertEqual(self.client.get(url_inexistente).status_code, status.HTTP_404_NOT_FOUND)

    # --- US29: Registrar status do treino (Aluno) ---

    def test_us29_ca01_e_ca05_aluno_marca_feito_idempotente_e_pode_desfazer(self):
        url = reverse("treino-feito", kwargs={"treino_id": self.treino.id})
        self.client.force_authenticate(user=self.aluno)

        # Marca como FEITO
        resp1 = self.client.patch(url, {"status": "FEITO"}, format="json")
        self.assertEqual(resp1.status_code, status.HTTP_200_OK)
        self.assertEqual(resp1.data["status"], Treino.Status.FEITO)
        self.assertIsNotNone(resp1.data["realizadoEm"])
        primeiro_realizado = resp1.data["realizadoEm"]

        # Repetir marcação mantém realizado_em (idempotência)
        resp2 = self.client.patch(url, {"status": "FEITO"}, format="json")
        self.assertEqual(resp2.status_code, status.HTTP_200_OK)
        self.assertEqual(resp2.data["realizadoEm"], primeiro_realizado)

        # Desfazer retorna para EM_ANDAMENTO e limpa realizado_em
        resp_desfazer = self.client.patch(url, {"status": "EM_ANDAMENTO"}, format="json")
        self.assertEqual(resp_desfazer.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_desfazer.data["status"], Treino.Status.EM_ANDAMENTO)
        self.assertIsNone(resp_desfazer.data["realizadoEm"])

    def test_us29_ca02_bloqueia_alteracao_quando_treino_concluido(self):
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])

        url = reverse("treino-feito", kwargs={"treino_id": self.treino.id})
        self.client.force_authenticate(user=self.aluno)
        resp = self.client.patch(url, {"status": "FEITO"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_409_CONFLICT)

    def test_us29_ca03_e_ca04_bloqueia_outro_aluno_e_treinador(self):
        url = reverse("treino-feito", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.outro_aluno)
        self.assertEqual(self.client.patch(url, {"status": "FEITO"}, format="json").status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.patch(url, {"status": "FEITO"}, format="json").status_code, status.HTTP_403_FORBIDDEN)

    # --- US15: Registrar conclusão ou devolução do treino (Treinador) ---

    def test_us15_ca01_e_ca06_treinador_conclui_treino_irreversivelmente(self):
        url = reverse("treino-concluir", kwargs={"treino_id": self.treino.id})
        self.client.force_authenticate(user=self.treinador)

        # Conclusão presencial direta a partir de EM_ANDAMENTO (CA03)
        resp = self.client.patch(url, {"status": "CONCLUIDO"}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["status"], Treino.Status.CONCLUIDO)
        self.assertEqual(resp.data["statusSlug"], "concluido")

        # Tentativa posterior de alterar treino já CONCLUIDO retorna 409 (CA06)
        resp_repetido = self.client.patch(url, {"status": "CORRIGIR_REFAZER"}, format="json")
        self.assertEqual(resp_repetido.status_code, status.HTTP_409_CONFLICT)

    def test_us15_ca02_treinador_devolve_para_corrigir_e_aluno_remarca_feito(self):
        url_concluir = reverse("treino-concluir", kwargs={"treino_id": self.treino.id})
        url_feito = reverse("treino-feito", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.treinador)
        resp_devolver = self.client.patch(url_concluir, {"status": "CORRIGIR_REFAZER"}, format="json")
        self.assertEqual(resp_devolver.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_devolver.data["status"], Treino.Status.CORRIGIR_REFAZER)

        # Aluno pode marcar como FEITO novamente após devolução
        self.client.force_authenticate(user=self.aluno)
        resp_refeito = self.client.patch(url_feito, {"status": "FEITO"}, format="json")
        self.assertEqual(resp_refeito.status_code, status.HTTP_200_OK)
        self.assertEqual(resp_refeito.data["status"], Treino.Status.FEITO)

    def test_us15_ca04_bloqueia_aluno_e_treinador_fora_da_carteira(self):
        url = reverse("treino-concluir", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.aluno)
        self.assertEqual(
            self.client.patch(url, {"status": "CONCLUIDO"}, format="json").status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.client.force_authenticate(user=self.outro_treinador)
        self.assertEqual(
            self.client.patch(url, {"status": "CONCLUIDO"}, format="json").status_code,
            status.HTTP_403_FORBIDDEN,
        )
    def test_us23_treinador_anterior_perde_acesso_apos_troca_de_carteira(self):
        # Aluno migra para outro_treinador
        self.aluno.treinador = self.outro_treinador
        self.aluno.save(update_fields=["treinador"])

        url_status = reverse("treino-status", kwargs={"treino_id": self.treino.id})
        url_detalhe = reverse("treino-detalhe", kwargs={"treino_id": self.treino.id})
        url_concluir = reverse("treino-concluir", kwargs={"treino_id": self.treino.id})

        # Treinador antigo não pode mais consultar nem concluir (403)
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.get(url_status).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.client.get(url_detalhe).status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(
            self.client.patch(url_concluir, {"status": "CONCLUIDO"}, format="json").status_code,
            status.HTTP_403_FORBIDDEN,
        )

        # Novo treinador da carteira passa a ter acesso (200)
        self.client.force_authenticate(user=self.outro_treinador)
        self.assertEqual(self.client.get(url_status).status_code, status.HTTP_200_OK)

    def test_us15_e_us29_recusam_requisicao_sem_campo_status(self):
        url_concluir = reverse("treino-concluir", kwargs={"treino_id": self.treino.id})
        url_feito = reverse("treino-feito", kwargs={"treino_id": self.treino.id})

        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.patch(url_concluir, {}, format="json").status_code, status.HTTP_400_BAD_REQUEST)

        self.client.force_authenticate(user=self.aluno)
        self.assertEqual(self.client.patch(url_feito, {}, format="json").status_code, status.HTTP_400_BAD_REQUEST)
class TreinoFeedbackAlunoTests(APITestCase):
    def setUp(self):
        agora = timezone.now()
        versao = versao_vigente()

        self.treinador = Usuario.objects.create_user(
            username="lucas",
            email="lucas@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.TREINADOR,
            first_name="Lucas",
            last_name="Cordeiro",
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz",
            email="beatriz@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.ALUNO,
            first_name="Beatriz",
            treinador=self.treinador,
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="carlos",
            email="carlos@spacejam.com",
            password="Password123",
            papel=Usuario.Papel.ALUNO,
            treinador=self.treinador,
            versao_termos_aceita=versao,
            data_aceite_termos=agora,
        )
        self.treino = Treino.objects.create(
            aluno=self.aluno,
            treinador=self.treinador,
            nome="Controle de bola",
        )
        self.item = ItemTreino.objects.create(
            treino=self.treino,
            ordem=1,
            nome="Drible alternado",
            parametros="3 séries · 30 segundos",
        )
        self.url = reverse("item-treino-feedback-aluno", kwargs={"item_id": self.item.id})

    # --- US49: Registrar feedback do aluno ---

    def test_us49_ca01_aluno_registra_feedback_valido_e_valida_limites(self):
        self.client.force_authenticate(user=self.aluno)

        # Vazio / só espaços / > 1000 caracteres -> 400
        self.assertEqual(self.client.post(self.url, {"texto": ""}, format="json").status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.client.post(self.url, {"texto": "   "}, format="json").status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.client.post(self.url, {"texto": "a" * 1001}, format="json").status_code, status.HTTP_400_BAD_REQUEST)

        # Registro válido (até 1.000 caracteres) -> 201
        resp = self.client.post(
            self.url,
            {"texto": "Senti leve desconforto no ombro na última série."},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["autorId"], self.aluno.id)
        self.assertFalse(resp.data["editado"])
        self.assertIsNotNone(resp.data["criadoEm"])
        self.assertIsNone(resp.data["editadoEm"])

        # Treinador visualiza no detalhe do treino
        self.client.force_authenticate(user=self.treinador)
        detalhe = self.client.get(reverse("treino-detalhe", kwargs={"treino_id": self.treino.id}))
        self.assertEqual(detalhe.status_code, status.HTTP_200_OK)
        self.assertEqual(
            detalhe.data["exercicios"][0]["feedback"]["texto"],
            "Senti leve desconforto no ombro na última série.",
        )

    def test_us49_ca02_bloqueia_segundo_registro_no_mesmo_exercicio_com_409(self):
        self.client.force_authenticate(user=self.aluno)
        self.client.post(self.url, {"texto": "Primeiro relato."}, format="json")

        resp_dup = self.client.post(self.url, {"texto": "Segundo relato."}, format="json")
        self.assertEqual(resp_dup.status_code, status.HTTP_409_CONFLICT)

    def test_us49_ca03_e_ca04_bloqueia_outro_aluno_e_treinador_com_403(self):
        self.client.force_authenticate(user=self.outro_aluno)
        self.assertEqual(
            self.client.post(self.url, {"texto": "Tentativa indevida"}, format="json").status_code,
            status.HTTP_403_FORBIDDEN,
        )

        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(
            self.client.post(self.url, {"texto": "Treinador escrevendo"}, format="json").status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_us49_ca05_e_ca06_bloqueia_apos_conclusao_409_e_retorna_401_404(self):
        # 401 sem autenticação
        self.assertEqual(self.client.post(self.url, {"texto": "Sem token"}, format="json").status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.aluno)
        # 404 item inexistente
        url_inexistente = reverse("item-treino-feedback-aluno", kwargs={"item_id": 999999})
        self.assertEqual(self.client.post(url_inexistente, {"texto": "Inexistente"}, format="json").status_code, status.HTTP_404_NOT_FOUND)

        # 409 treino concluído
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])
        self.assertEqual(self.client.post(self.url, {"texto": "Tardio"}, format="json").status_code, status.HTTP_409_CONFLICT)

    # --- US50: Editar feedback do aluno ---

    def test_us50_ca01_aluno_edita_feedback_na_vigencia_inclusive_corrigir_refazer(self):
        FeedbackAluno.objects.create(
            item_treino=self.item,
            aluno=self.aluno,
            texto="Relato inicial.",
        )
        self.treino.status = Treino.Status.CORRIGIR_REFAZER
        self.treino.save(update_fields=["status"])

        self.client.force_authenticate(user=self.aluno)
        resp = self.client.patch(
            self.url,
            {"texto": "Relato atualizado após refazer o exercício."},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["texto"], "Relato atualizado após refazer o exercício.")
        self.assertTrue(resp.data["editado"])
        self.assertIsNotNone(resp.data["editadoEm"])

    def test_us50_ca02_a_ca06_bloqueia_concluido_409_autoria_403_validacao_400_delete_405_e_404(self):
        self.client.force_authenticate(user=self.aluno)

        # Sem feedback prévio -> 404
        self.assertEqual(self.client.patch(self.url, {"texto": "Nada"}, format="json").status_code, status.HTTP_404_NOT_FOUND)

        FeedbackAluno.objects.create(
            item_treino=self.item,
            aluno=self.aluno,
            texto="Texto original.",
        )

        # Validação vazio / > 1000 -> 400
        self.assertEqual(self.client.patch(self.url, {"texto": "   "}, format="json").status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(self.client.patch(self.url, {"texto": "x" * 1001}, format="json").status_code, status.HTTP_400_BAD_REQUEST)

        # DELETE não permitido -> 405
        self.assertEqual(self.client.delete(self.url).status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

        # Outro aluno ou treinador -> 403
        self.client.force_authenticate(user=self.outro_aluno)
        self.assertEqual(self.client.patch(self.url, {"texto": "Outro aluno"}, format="json").status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.patch(self.url, {"texto": "Treinador"}, format="json").status_code, status.HTTP_403_FORBIDDEN)

        # Treino concluído -> 409
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])
        self.client.force_authenticate(user=self.aluno)
        self.assertEqual(self.client.patch(self.url, {"texto": "Pós conclusão"}, format="json").status_code, status.HTTP_409_CONFLICT)