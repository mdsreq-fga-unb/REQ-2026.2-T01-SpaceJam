from django.db import IntegrityError, transaction
from rest_framework.test import APITestCase

from apps.contas.models import Usuario

from .models import Planejamento

URL = "/api/treinos/planejamentos/"


class CadastrarPlanejamentoUS18Tests(APITestCase):
    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach", email="coach@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", email="bia@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", last_name="Costa",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.aluno_sem_vinculo = Usuario.objects.create_user(
            username="solto", email="solto@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO,
        )

    def _post(self, payload, usuario=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.post(URL, payload, format="json")

    # Cria planejamento vigente e sem treinos
    def test_ca02_cria_planejamento_vigente(self):
        r = self._post({"aluno": self.aluno.id, "nome": "Controle de bola"})
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["status"], "VIGENTE")
        self.assertEqual(r.data["aluno"], self.aluno.id)
        self.assertEqual(r.data["aluno_nome"], "Beatriz Costa")
        self.assertIsNone(r.data["planejamento_anterior"])
        p = Planejamento.objects.get(pk=r.data["id"])
        self.assertEqual(p.treinador, self.treinador)

    # Campos obrigatórios
    def test_ca02_bloqueia_sem_aluno_e_sem_nome(self):
        r = self._post({})
        self.assertEqual(r.status_code, 400)
        self.assertIn("aluno", r.data)
        self.assertIn("nome", r.data)
        self.assertEqual(Planejamento.objects.count(), 0)

    def test_ca02_bloqueia_nome_so_com_espacos(self):
        r = self._post({"aluno": self.aluno.id, "nome": "   "})
        self.assertEqual(r.status_code, 400)
        self.assertIn("nome", r.data)

    def test_ca02_bloqueia_aluno_inexistente(self):
        r = self._post({"aluno": 999999, "nome": "Controle de bola"})
        self.assertEqual(r.status_code, 400)
        self.assertIn("aluno", r.data)

    # Só aceita alunos da carteira
    def test_ca01_bloqueia_aluno_fora_da_carteira(self):
        r = self._post({"aluno": self.aluno_sem_vinculo.id, "nome": "Controle de bola"})
        self.assertEqual(r.status_code, 400)
        self.assertIn("aluno", r.data)
        self.assertEqual(Planejamento.objects.count(), 0)

    def test_ca01_bloqueia_treinador_como_aluno(self):
        r = self._post({"aluno": self.treinador.id, "nome": "Controle de bola"})
        self.assertEqual(r.status_code, 400)

    # CA04/RNF08 — acesso restrito
    def test_ca04_aluno_recebe_403(self):
        r = self._post({"aluno": self.aluno.id, "nome": "Controle de bola"}, usuario=self.aluno)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(Planejamento.objects.count(), 0)

    def test_ca04_sem_login_recebe_401(self):
        r = self.client.post(URL, {"aluno": self.aluno.id, "nome": "X"}, format="json")
        self.assertEqual(r.status_code, 401)

    # Novo planejamento manda o vigente anterior para o histórico
    def test_ca05_novo_planejamento_encerra_o_anterior(self):
        r1 = self._post({"aluno": self.aluno.id, "nome": "Controle de bola"})
        r2 = self._post({"aluno": self.aluno.id, "nome": "Arremesso"})
        self.assertEqual(r2.status_code, 201)
        self.assertEqual(r2.data["planejamento_anterior"], r1.data["id"])

        anterior = Planejamento.objects.get(pk=r1.data["id"])
        self.assertEqual(anterior.status, Planejamento.Status.HISTORICO)
        self.assertIsNotNone(anterior.encerrado_em)
        vigentes = Planejamento.objects.filter(aluno=self.aluno, status=Planejamento.Status.VIGENTE)
        self.assertEqual(list(vigentes.values_list("id", flat=True)), [r2.data["id"]])

    def test_rn27_banco_impede_dois_vigentes(self):
        Planejamento.objects.create(aluno=self.aluno, treinador=self.treinador, nome="A")
        with self.assertRaises(IntegrityError), transaction.atomic():
            Planejamento.objects.create(aluno=self.aluno, treinador=self.treinador, nome="B")

    def test_metodo_get_nao_permitido(self):
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.get(URL).status_code, 405)