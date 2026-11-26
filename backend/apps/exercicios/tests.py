from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Exercicio
from apps.contas import termos

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
        termos.registrar_aceite(cls.treinador)
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

class ConsultarExercicioTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        termos.registrar_aceite(cls.treinador)
        cls.aluno = Usuario.objects.create_user(
            username="aluno1",
            email="aluno1@exemplo.com",
            password="senha-forte-123",
            papel="ALUNO",
            treinador=cls.treinador,
        )
        cls.completo = Exercicio.objects.create(
            nome="Passe de peito",
            objetivo="Melhorar a precisão do passe",
            fundamento="PASSE",
            orientacoes="Cotovelos fechados e passo à frente.",
            criado_por=cls.treinador,
        )
        cls.minimo = Exercicio.objects.create(
            nome="Arremesso livre",
            objetivo="Aumentar o aproveitamento",
            fundamento="ARREMESSO",
            criado_por=cls.treinador,
        )
        cls.url_lista = reverse("exercicio-list")

    def url_detalhe(self, pk):
        return reverse("exercicio-detail", args=[pk])

    def itens(self, resposta):
        dados = resposta.data
        return dados["results"] if isinstance(dados, dict) else dados

    def test_detalhe_mostra_os_dados_do_exercicio(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.get(self.url_detalhe(self.completo.pk))
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["nome"], "Passe de peito")
        self.assertEqual(resposta.data["objetivo"], "Melhorar a precisão do passe")
        self.assertEqual(resposta.data["fundamento"], "PASSE")
        self.assertEqual(resposta.data["fundamento_nome"], "Passe")
        self.assertEqual(
            resposta.data["orientacoes"], "Cotovelos fechados e passo à frente."
        )
        self.assertIn("erros_comuns", resposta.data)
        self.assertIn("video_base", resposta.data)

    def test_campos_nao_preenchidos_vem_vazios_sem_erro(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.get(self.url_detalhe(self.minimo.pk))
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["orientacoes"], "")
        self.assertEqual(resposta.data["erros_comuns"], "")
        self.assertEqual(resposta.data["video_base"], "")

    def test_exercicio_inexistente_retorna_404(self):
        self.client.force_authenticate(self.treinador)
        for pk in [999999, "abc"]:
            with self.subTest(pk=pk):
                resposta = self.client.get(self.url_detalhe(pk))
                self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)

    def test_aluno_recebe_403_na_lista_e_no_detalhe(self):
        self.client.force_authenticate(self.aluno)
        for url in [self.url_lista, self.url_detalhe(self.completo.pk)]:
            with self.subTest(url=url):
                resposta = self.client.get(url)
                self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)

    def test_sem_login_recebe_401(self):
        for url in [self.url_lista, self.url_detalhe(self.completo.pk)]:
            with self.subTest(url=url):
                resposta = self.client.get(url)
                self.assertEqual(
                    resposta.status_code, status.HTTP_401_UNAUTHORIZED
                )

    def test_lista_traz_a_biblioteca_em_ordem_de_nome(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.get(self.url_lista)
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            [item["nome"] for item in self.itens(resposta)],
            ["Arremesso livre", "Passe de peito"],
        )

    def test_cadastro_aparece_na_consulta_imediatamente(self):
        self.client.force_authenticate(self.treinador)
        criado = self.client.post(
            self.url_lista,
            {
                "nome": "Corta-luz",
                "objetivo": "Liberar o companheiro",
                "fundamento": "DEFESA",
            },
        )
        self.assertEqual(criado.status_code, status.HTTP_201_CREATED)
        detalhe = self.client.get(self.url_detalhe(criado.data["id"]))
        self.assertEqual(detalhe.status_code, status.HTTP_200_OK)
        self.assertEqual(detalhe.data["nome"], "Corta-luz")
        lista = self.client.get(self.url_lista)
        self.assertIn("Corta-luz", [item["nome"] for item in self.itens(lista)])

    def test_exclusao_nao_esta_disponivel(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.delete(self.url_detalhe(self.completo.pk))
        self.assertEqual(
            resposta.status_code, status.HTTP_405_METHOD_NOT_ALLOWED
        )
        self.assertTrue(Exercicio.objects.filter(pk=self.completo.pk).exists())


class EditarExercicioTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        termos.registrar_aceite(cls.treinador)
        cls.aluno = Usuario.objects.create_user(
            username="aluno1",
            email="aluno1@exemplo.com",
            password="senha-forte-123",
            papel="ALUNO",
            treinador=cls.treinador,
        )
        cls.exercicio = Exercicio.objects.create(
            nome="Passe de peito",
            objetivo="Melhorar a precisão do passe",
            fundamento="PASSE",
            orientacoes="Cotovelos fechados e passo à frente.",
            criado_por=cls.treinador,
        )
        cls.outro = Exercicio.objects.create(
            nome="Arremesso livre",
            objetivo="Aumentar o aproveitamento",
            fundamento="ARREMESSO",
            criado_por=cls.treinador,
        )
        cls.url = reverse("exercicio-detail", args=[cls.exercicio.pk])

    def assert_exercicio_intacto(self):
        self.exercicio.refresh_from_db()
        self.assertEqual(self.exercicio.nome, "Passe de peito")
        self.assertEqual(self.exercicio.objetivo, "Melhorar a precisão do passe")
        self.assertEqual(self.exercicio.fundamento, "PASSE")
        self.assertEqual(
            self.exercicio.orientacoes, "Cotovelos fechados e passo à frente."
        )

    def test_treinador_edita_e_a_biblioteca_mostra_a_nova_versao(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.patch(
            self.url, {"nome": "Passe de peito em dupla", "fundamento": "DRIBLE"}
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        consulta = self.client.get(self.url)
        self.assertEqual(consulta.data["nome"], "Passe de peito em dupla")
        self.assertEqual(consulta.data["fundamento_nome"], "Drible")
        self.assertEqual(consulta.data["objetivo"], "Melhorar a precisão do passe")

    def test_edicao_completa_com_put(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.put(
            self.url,
            {
                "nome": "Passe picado",
                "objetivo": "Passar sob marcação",
                "fundamento": "PASSE",
                "orientacoes": "Quicar a dois terços da distância.",
            },
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.exercicio.refresh_from_db()
        self.assertEqual(self.exercicio.nome, "Passe picado")
        self.assertEqual(
            self.exercicio.orientacoes, "Quicar a dois terços da distância."
        )

    def test_edicao_altera_somente_o_exercicio_editado(self):
        self.client.force_authenticate(self.treinador)
        self.client.patch(self.url, {"nome": "Passe de peito em dupla"})
        self.outro.refresh_from_db()
        self.assertEqual(self.outro.nome, "Arremesso livre")
        self.assertEqual(Exercicio.objects.count(), 2)

    def test_apagar_campo_obrigatorio_bloqueia_e_mantem_os_dados(self):
        self.client.force_authenticate(self.treinador)
        for campo in ["nome", "objetivo", "fundamento"]:
            for valor in ["", "   "]:
                with self.subTest(campo=campo, valor=valor):
                    resposta = self.client.patch(self.url, {campo: valor})
                    self.assertEqual(
                        resposta.status_code, status.HTTP_400_BAD_REQUEST
                    )
                    self.assertIn(campo, resposta.data)
                    self.assert_exercicio_intacto()

    def test_put_sem_campo_obrigatorio_bloqueia_e_mantem_os_dados(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.put(
            self.url, {"nome": "Passe picado", "fundamento": "PASSE"}
        )
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("objetivo", resposta.data)
        self.assert_exercicio_intacto()

    def test_fundamento_fora_da_lista_e_recusado(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.patch(self.url, {"fundamento": "Enterrada"})
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("fundamento", resposta.data)
        self.assert_exercicio_intacto()

    def test_orientacoes_pode_ser_apagada(self):
        self.client.force_authenticate(self.treinador)
        resposta = self.client.patch(self.url, {"orientacoes": ""})
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.exercicio.refresh_from_db()
        self.assertEqual(self.exercicio.orientacoes, "")

    def test_autoria_e_data_de_criacao_nao_mudam(self):
        self.client.force_authenticate(self.treinador)
        criado_em = self.exercicio.criado_em
        resposta = self.client.patch(
            self.url, {"nome": "Passe picado", "criado_por": self.aluno.pk}
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.exercicio.refresh_from_db()
        self.assertEqual(self.exercicio.criado_por, self.treinador)
        self.assertEqual(self.exercicio.criado_em, criado_em)
        self.assertGreaterEqual(self.exercicio.atualizado_em, criado_em)

    def test_aluno_recebe_403(self):
        self.client.force_authenticate(self.aluno)
        for metodo in [self.client.patch, self.client.put]:
            with self.subTest(metodo=metodo.__name__):
                resposta = metodo(self.url, {"nome": "Invadido"})
                self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
                self.assert_exercicio_intacto()

    def test_sem_login_recebe_401(self):
        resposta = self.client.patch(self.url, {"nome": "Invadido"})
        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assert_exercicio_intacto()

    def test_exercicio_inexistente_retorna_404(self):
        self.client.force_authenticate(self.treinador)
        url = reverse("exercicio-detail", args=[999999])
        resposta = self.client.patch(url, {"nome": "Fantasma"})
        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)

class ErrosComunsEVideoBaseTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        termos.registrar_aceite(cls.treinador)
        cls.url_lista = reverse("exercicio-list")
        cls.dados = {
            "nome": "Bandeja pela direita",
            "objetivo": "Melhorar a finalização em movimento",
            "fundamento": "ARREMESSO",
            "orientacoes": "Dois passos e quebra de punho.",
            "erros_comuns": "Não olhar para a cesta.",
            "video_base": "https://www.youtube.com/watch?v=exemplo",
        }

    def setUp(self):
        self.client.force_authenticate(self.treinador)

    def test_cadastro_grava_e_consulta_devolve_os_opcionais(self):
        criado = self.client.post(self.url_lista, self.dados)
        self.assertEqual(criado.status_code, status.HTTP_201_CREATED)
        detalhe = self.client.get(
            reverse("exercicio-detail", args=[criado.data["id"]])
        )
        self.assertEqual(detalhe.data["erros_comuns"], "Não olhar para a cesta.")
        self.assertEqual(
            detalhe.data["video_base"], "https://www.youtube.com/watch?v=exemplo"
        )

    def test_link_de_video_invalido_e_recusado(self):
        resposta = self.client.post(
            self.url_lista, {**self.dados, "video_base": "link-invalido"}
        )
        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("video_base", resposta.data)
        self.assertFalse(Exercicio.objects.exists())

    def test_edicao_altera_e_apaga_os_opcionais(self):
        criado = self.client.post(self.url_lista, self.dados)
        url = reverse("exercicio-detail", args=[criado.data["id"]])
        resposta = self.client.put(
            url, {**self.dados, "erros_comuns": "Pisar na linha.", "video_base": ""}
        )
        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        exercicio = Exercicio.objects.get()
        self.assertEqual(exercicio.erros_comuns, "Pisar na linha.")
        self.assertEqual(exercicio.video_base, "")

    def test_objetivo_longo_e_aceito(self):
        resposta = self.client.post(
            self.url_lista, {**self.dados, "objetivo": "x" * 600}
        )
        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)