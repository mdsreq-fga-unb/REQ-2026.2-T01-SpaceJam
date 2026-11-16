from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Exercicio

Usuario = get_user_model()


class CadastrarExercicioTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        cls.aluno = Usuario.objects.create_user(
            username="aluno1",
            email="aluno1@exemplo.com",
            password="senha-forte-123",
            papel="ALUNO",
            treinador=cls.treinador,
        )
        cls.url = reverse("exercicio-list")
        cls.dados = {
            "nome": "Bandeja pela direita",
            "objetivo": "Melhorar a finalização em movimento",
            "fundamento": "ARREMESSO",
        }

    def test_treinador_cadastra_so_com_obrigatorios(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.post(self.url, self.dados)
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        exercicio = Exercicio.objects.get()
        self.assertEqual(exercicio.criado_por, self.treinador)
        self.assertEqual(exercicio.orientacoes, "")
        self.assertEqual(resposta.data["fundamento_nome"], "Arremesso")

    def test_treinador_cadastra_com_orientacoes(self):
        self.client.force_authenticate(self.treinador)
        dados = {**self.dados, "orientacoes": "Dois passos e quebra de punho."}
        resposta = self.client.post(self.url, dados)
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exercicio.objects.get().orientacoes, dados["orientacoes"])

    def test_campo_obrigatorio_ausente_ou_vazio_bloqueia(self):
        self.client.force_authenticate(self.treinador)
        for campo in ["nome", "objetivo", "fundamento"]:
            for valor in [None, "", "   "]:
                with self.subTest(campo=campo, valor=valor):
                    dados = dict(self.dados)
                    if valor is None:
                        dados.pop(campo)
                    else:
                        dados[campo] = valor
                    resposta = self.client.post(self.url, dados)
                    self.assertEqual(
                        resposta.status_code, status.HTTP_400_BAD_REQUEST
                    )
                    self.assertIn(campo, resposta.data)
        self.assertFalse(Exercicio.objects.exists())

    def test_fundamento_fora_da_lista_e_recusado(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.post(self.url, {**self.dados, "fundamento": "Enterrada"})
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("fundamento", resposta.data)

    def test_criado_por_nao_pode_ser_forjado(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.post(
            self.url, {**self.dados, "criado_por": self.aluno.pk}
        )
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exercicio.objects.get().criado_por, self.treinador)

    def test_aluno_recebe_403(self):
        self.client.force_authenticate(self.aluno)
        resposta = self.client.post(self.url, self.dados)
        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(Exercicio.objects.exists())

    def test_sem_login_recebe_401(self):
        resposta = self.client.post(self.url, self.dados)
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_lista_de_fundamentos(self):
        url = reverse("exercicio-fundamentos")
        self.client.force_authenticate(self.treinador)
        resposta = self.client.get(url)
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["nome"] for item in resposta.data],
            [
                "Arremesso",
                "Drible",
                "Passe",
                "Defesa",
                "Rebote",
                "Condicionamento físico",
            ],
        )
        self.client.force_authenticate(self.aluno)
        self.assertEqual(self.client.get(url).status_code, status.HTTP_403_FORBIDDEN)