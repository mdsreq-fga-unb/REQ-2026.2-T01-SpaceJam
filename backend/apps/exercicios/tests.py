import copy
import json
from unittest import skip

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas import termos

from .models import ErroComumExercicio, Exercicio
from .services import snapshot_exercicio

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

class ConsultarExercicioTests(APITestCase):
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


class ErroComumExercicioModelTests(TestCase):
    """US37 / RF2420 — Itens de erro comum + orientação corretiva de um exercício."""

    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        cls.exercicio = Exercicio.objects.create(
            nome="Drible com deslocamento",
            objetivo="Conduzir a bola em movimento",
            fundamento="DRIBLE",
            criado_por=cls.treinador,
        )

    def test_exercicio_pode_ter_varios_erros_em_ordem_de_criacao(self):
        primeiro = ErroComumExercicio.objects.create(
            exercicio=self.exercicio,
            erro="Olhar somente para a bola.",
            orientacao_corretiva="Mantenha o olhar à frente durante o deslocamento.",
        )
        segundo = ErroComumExercicio.objects.create(
            exercicio=self.exercicio,
            erro="Bater a bola com a palma da mão.",
            orientacao_corretiva="Use a ponta dos dedos para controlar a bola.",
        )

        self.assertEqual(
            list(self.exercicio.erros_orientacoes.all()), [primeiro, segundo]
        )

    def test_exercicio_sem_erros_continua_valido(self):
        # RN22: erros comuns e orientações são opcionais no exercício.
        self.exercicio.full_clean()
        self.assertFalse(self.exercicio.erros_orientacoes.exists())


class ErrosOrientacoesNaConsultaTests(APITestCase):
    """US37 / RF2420 — Itens de erro + orientação exibidos na consulta do exercício."""

    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        cls.exercicio = Exercicio.objects.create(
            nome="Drible com deslocamento",
            objetivo="Conduzir a bola em movimento",
            fundamento="DRIBLE",
            erros_comuns="Texto antigo de erros comuns.",
            criado_por=cls.treinador,
        )
        cls.url = reverse("exercicio-detail", args=[cls.exercicio.pk])

    def setUp(self):
        self.client.force_authenticate(self.treinador)

    def criar_item(self, exercicio=None, erro="Olhar somente para a bola.",
                   orientacao="Mantenha o olhar à frente durante o deslocamento."):
        return ErroComumExercicio.objects.create(
            exercicio=exercicio or self.exercicio,
            erro=erro,
            orientacao_corretiva=orientacao,
        )

    def test_detalhe_traz_lista_de_erros_e_orientacoes(self):
        # RNF11: o item cadastrado aparece na consulta imediatamente.
        primeiro = self.criar_item()
        segundo = self.criar_item(
            erro="Bater a bola com a palma da mão.",
            orientacao="Use a ponta dos dedos para controlar a bola.",
        )

        resposta = self.client.get(self.url)

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        itens = resposta.data["erros_orientacoes"]
        self.assertEqual([item["id"] for item in itens], [primeiro.pk, segundo.pk])
        self.assertEqual(itens[0]["erro"], "Olhar somente para a bola.")
        self.assertEqual(
            itens[0]["orientacao_corretiva"],
            "Mantenha o olhar à frente durante o deslocamento.",
        )
        self.assertEqual(
            set(itens[0]),
            {"id", "erro", "orientacao_corretiva", "criado_em", "atualizado_em"},
        )

    def test_exercicio_sem_itens_retorna_lista_vazia(self):
        # RN22 / US38 CA02: sem itens, a consulta funciona e devolve lista vazia.
        resposta = self.client.get(self.url)

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["erros_orientacoes"], [])

    def test_put_do_exercicio_preserva_itens_e_campo_legado(self):
        # Não regressão da US39: o PUT do exercício ignora a lista (somente leitura).
        item = self.criar_item()

        resposta = self.client.put(
            self.url,
            {
                "nome": "Drible com deslocamento",
                "objetivo": "Conduzir a bola em movimento",
                "fundamento": "DRIBLE",
                "erros_comuns": "Texto antigo atualizado.",
                "erros_orientacoes": [],
            },
            format="json",
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(
            list(self.exercicio.erros_orientacoes.values_list("pk", flat=True)),
            [item.pk],
        )
        self.exercicio.refresh_from_db()
        self.assertEqual(self.exercicio.erros_comuns, "Texto antigo atualizado.")
        self.assertEqual(len(resposta.data["erros_orientacoes"]), 1)

    def test_lista_da_biblioteca_nao_consulta_itens_por_exercicio(self):
        # RNF11: a lista traz os itens sem uma consulta extra por exercício.
        for indice in range(3):
            exercicio = Exercicio.objects.create(
                nome=f"Exercício {indice}",
                objetivo="Objetivo",
                fundamento="PASSE",
                criado_por=self.treinador,
            )
            self.criar_item(exercicio=exercicio)

        with self.assertNumQueries(2):
            resposta = self.client.get(reverse("exercicio-list"))

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resposta.data), 4)
        self.assertTrue(all("erros_orientacoes" in item for item in resposta.data))


class ErrosOrientacoesApiBase(APITestCase):
    """Base dos testes da API de erros comuns + orientações (US37 / RF2420).

    As rotas usam ROTA_PROTEGIDA (US63): treinador e aluno precisam ter aceitado
    os termos vigentes, para que o 403 do aluno venha do perfil (CA04) e não dos termos.
    """

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
        termos.registrar_aceite(cls.treinador)
        termos.registrar_aceite(cls.aluno)
        cls.exercicio = Exercicio.objects.create(
            nome="Drible com deslocamento",
            objetivo="Conduzir a bola em movimento",
            fundamento="DRIBLE",
            criado_por=cls.treinador,
        )
        cls.outro_exercicio = Exercicio.objects.create(
            nome="Passe de peito",
            objetivo="Melhorar a precisão do passe",
            fundamento="PASSE",
            criado_por=cls.treinador,
        )
        cls.dados = {
            "erro": "Olhar somente para a bola.",
            "orientacao_corretiva": "Mantenha o olhar à frente durante o deslocamento.",
        }

    def url_lista(self, exercicio_pk=None):
        return reverse(
            "exercicio-erro-comum-list", args=[exercicio_pk or self.exercicio.pk]
        )

    def criar_item(self, exercicio=None, **campos):
        return ErroComumExercicio.objects.create(
            exercicio=exercicio or self.exercicio,
            erro=campos.get("erro", self.dados["erro"]),
            orientacao_corretiva=campos.get(
                "orientacao_corretiva", self.dados["orientacao_corretiva"]
            ),
        )


class ListarECadastrarErrosOrientacoesTests(ErrosOrientacoesApiBase):
    """Listar e cadastrar itens. A criação pertence à US36; entra aqui porque a
    US37 precisa de itens para editar (CA01) e remover (CA02)."""

    def test_treinador_lista_somente_os_itens_do_exercicio_em_ordem(self):
        primeiro = self.criar_item()
        segundo = self.criar_item(erro="Bater a bola com a palma da mão.")
        self.criar_item(exercicio=self.outro_exercicio, erro="Erro de outro exercício.")
        self.client.force_authenticate(self.treinador)

        resposta = self.client.get(self.url_lista())

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual([item["id"] for item in resposta.data], [primeiro.pk, segundo.pk])

    def test_treinador_cadastra_item_e_ele_aparece_no_detalhe(self):
        self.client.force_authenticate(self.treinador)

        resposta = self.client.post(self.url_lista(), self.dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resposta.data["erro"], self.dados["erro"])
        self.assertEqual(
            resposta.data["orientacao_corretiva"], self.dados["orientacao_corretiva"]
        )
        detalhe = self.client.get(reverse("exercicio-detail", args=[self.exercicio.pk]))
        self.assertEqual(
            [item["id"] for item in detalhe.data["erros_orientacoes"]],
            [resposta.data["id"]],
        )

    def test_item_com_erro_ou_orientacao_vazios_e_recusado(self):
        # RN22 (dentro do item) / RNF14: os dois campos são obrigatórios.
        self.client.force_authenticate(self.treinador)
        for campo in ["erro", "orientacao_corretiva"]:
            for valor in ["", "   "]:
                with self.subTest(campo=campo, valor=repr(valor)):
                    resposta = self.client.post(
                        self.url_lista(), {**self.dados, campo: valor}, format="json"
                    )
                    self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                    self.assertIn(campo, resposta.data)
            with self.subTest(campo=campo, valor="ausente"):
                incompleto = {k: v for k, v in self.dados.items() if k != campo}
                resposta = self.client.post(self.url_lista(), incompleto, format="json")
                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn(campo, resposta.data)
        self.assertFalse(ErroComumExercicio.objects.exists())

    def test_item_com_texto_acima_do_limite_e_recusado(self):
        self.client.force_authenticate(self.treinador)
        for campo in ["erro", "orientacao_corretiva"]:
            with self.subTest(campo=campo):
                resposta = self.client.post(
                    self.url_lista(), {**self.dados, campo: "x" * 1001}, format="json"
                )
                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn(campo, resposta.data)
        self.assertFalse(ErroComumExercicio.objects.exists())

        no_limite = self.client.post(
            self.url_lista(),
            {"erro": "x" * 1000, "orientacao_corretiva": "y" * 1000},
            format="json",
        )
        self.assertEqual(no_limite.status_code, status.HTTP_201_CREATED)

    def test_textos_sao_salvos_sem_espacos_nas_pontas(self):
        self.client.force_authenticate(self.treinador)

        resposta = self.client.post(
            self.url_lista(),
            {"erro": "  Olhar para a bola.  ", "orientacao_corretiva": "\tOlhar à frente.\n"},
            format="json",
        )

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        item = ErroComumExercicio.objects.get()
        self.assertEqual(item.erro, "Olhar para a bola.")
        self.assertEqual(item.orientacao_corretiva, "Olhar à frente.")

    def test_aluno_recebe_403_ao_listar_e_cadastrar(self):
        # CA04 / RN14 / RNF08: o 403 vem do perfil (aluno com termos aceitos).
        self.criar_item()
        self.client.force_authenticate(self.aluno)

        listar = self.client.get(self.url_lista())
        cadastrar = self.client.post(self.url_lista(), self.dados, format="json")

        for resposta in (listar, cadastrar):
            self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
            self.assertNotEqual(resposta.data.get("code"), "TERMOS_PENDENTES")
        self.assertEqual(ErroComumExercicio.objects.count(), 1)

    def test_sem_login_recebe_401(self):
        listar = self.client.get(self.url_lista())
        cadastrar = self.client.post(self.url_lista(), self.dados, format="json")

        self.assertEqual(listar.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(cadastrar.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(ErroComumExercicio.objects.exists())

    def test_treinador_com_termos_pendentes_recebe_403(self):
        # US63 (RN15, RNF16): rota de negócio exige o aceite dos termos vigentes.
        sem_aceite = Usuario.objects.create_user(
            username="coach2",
            email="coach2@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        self.client.force_authenticate(sem_aceite)

        resposta = self.client.post(self.url_lista(), self.dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(resposta.data["code"], "TERMOS_PENDENTES")
        self.assertFalse(ErroComumExercicio.objects.exists())

    def test_exercicio_inexistente_retorna_404(self):
        self.client.force_authenticate(self.treinador)

        listar = self.client.get(self.url_lista(exercicio_pk=9999))
        cadastrar = self.client.post(
            self.url_lista(exercicio_pk=9999), self.dados, format="json"
        )

        self.assertEqual(listar.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(cadastrar.status_code, status.HTTP_404_NOT_FOUND)
        self.assertFalse(ErroComumExercicio.objects.exists())

    def test_cadastrar_item_nao_altera_o_exercicio_pai(self):
        # Decisão do plano: o item não grava no exercício (atualizado_em intacto)
        # e o campo antigo erros_comuns (US39) continua como estava.
        Exercicio.objects.filter(pk=self.exercicio.pk).update(
            erros_comuns="Texto antigo de erros comuns."
        )
        antes = Exercicio.objects.get(pk=self.exercicio.pk)
        self.client.force_authenticate(self.treinador)

        resposta = self.client.post(self.url_lista(), self.dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        depois = Exercicio.objects.get(pk=self.exercicio.pk)
        self.assertEqual(depois.atualizado_em, antes.atualizado_em)
        self.assertEqual(depois.erros_comuns, "Texto antigo de erros comuns.")

    def test_exercicio_do_corpo_e_ignorado(self):
        # O item sempre pertence ao exercício da URL.
        self.client.force_authenticate(self.treinador)

        resposta = self.client.post(
            self.url_lista(),
            {**self.dados, "exercicio": self.outro_exercicio.pk},
            format="json",
        )

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ErroComumExercicio.objects.get().exercicio, self.exercicio)
        self.assertFalse(self.outro_exercicio.erros_orientacoes.exists())


class EditarErroOrientacaoTests(ErrosOrientacoesApiBase):
    """US37 CA01 — Editar um erro comum e sua orientação corretiva."""

    def setUp(self):
        self.item = self.criar_item()
        self.novos_dados = {
            "erro": "Olhar para a bola durante o drible em deslocamento.",
            "orientacao_corretiva": "Manter a cabeça erguida e usar a visão periférica.",
        }

    def url_item(self, item=None, exercicio_pk=None):
        item = item or self.item
        return reverse(
            "exercicio-erro-comum-detail",
            args=[exercicio_pk or item.exercicio_id, item.pk],
        )

    def assert_item_intacto(self):
        self.item.refresh_from_db()
        self.assertEqual(self.item.erro, self.dados["erro"])
        self.assertEqual(
            self.item.orientacao_corretiva, self.dados["orientacao_corretiva"]
        )

    def test_treinador_consulta_um_item(self):
        self.client.force_authenticate(self.treinador)

        resposta = self.client.get(self.url_item())

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["id"], self.item.pk)
        self.assertEqual(resposta.data["erro"], self.dados["erro"])

    def test_ca01_edicao_substitui_o_texto_anterior_na_consulta(self):
        # CA01 / RN14: as novas orientações substituem as anteriores na biblioteca.
        atualizado_antes = self.item.atualizado_em
        self.client.force_authenticate(self.treinador)

        resposta = self.client.put(self.url_item(), self.novos_dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["erro"], self.novos_dados["erro"])
        consulta = self.client.get(
            reverse("exercicio-detail", args=[self.exercicio.pk])
        )
        itens = consulta.data["erros_orientacoes"]
        self.assertEqual(len(itens), 1)
        self.assertEqual(itens[0]["id"], self.item.pk)
        self.assertEqual(itens[0]["erro"], self.novos_dados["erro"])
        self.assertEqual(
            itens[0]["orientacao_corretiva"], self.novos_dados["orientacao_corretiva"]
        )
        self.assertNotIn(
            self.dados["orientacao_corretiva"],
            [item["orientacao_corretiva"] for item in itens],
        )
        self.item.refresh_from_db()
        self.assertGreater(self.item.atualizado_em, atualizado_antes)

    def test_patch_altera_so_o_campo_enviado(self):
        self.client.force_authenticate(self.treinador)

        resposta = self.client.patch(
            self.url_item(),
            {"orientacao_corretiva": self.novos_dados["orientacao_corretiva"]},
            format="json",
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.item.refresh_from_db()
        self.assertEqual(self.item.erro, self.dados["erro"])
        self.assertEqual(
            self.item.orientacao_corretiva, self.novos_dados["orientacao_corretiva"]
        )

    def test_edicao_com_campo_vazio_bloqueia_e_mantem_dados(self):
        # RN22 (dentro do item) / RNF14: vazio, só espaços, acima do limite ou,
        # no PUT, campo ausente são recusados sem alterar o item.
        self.client.force_authenticate(self.treinador)
        for campo in ["erro", "orientacao_corretiva"]:
            for valor in ["", "   ", "x" * 1001]:
                for metodo in ["put", "patch"]:
                    with self.subTest(campo=campo, valor=valor[:5], metodo=metodo):
                        corpo = (
                            {**self.novos_dados, campo: valor}
                            if metodo == "put"
                            else {campo: valor}
                        )
                        resposta = getattr(self.client, metodo)(
                            self.url_item(), corpo, format="json"
                        )
                        self.assertEqual(
                            resposta.status_code, status.HTTP_400_BAD_REQUEST
                        )
                        self.assertIn(campo, resposta.data)
                        self.assert_item_intacto()
            with self.subTest(campo=campo, valor="ausente no PUT"):
                incompleto = {k: v for k, v in self.novos_dados.items() if k != campo}
                resposta = self.client.put(self.url_item(), incompleto, format="json")
                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn(campo, resposta.data)
                self.assert_item_intacto()

    def test_item_de_outro_exercicio_retorna_404(self):
        # A URL não permite acessar o item pelo exercício errado.
        self.client.force_authenticate(self.treinador)
        url_errada = self.url_item(exercicio_pk=self.outro_exercicio.pk)

        consultar = self.client.get(url_errada)
        editar = self.client.put(url_errada, self.novos_dados, format="json")
        editar_parcial = self.client.patch(url_errada, self.novos_dados, format="json")

        for resposta in (consultar, editar, editar_parcial):
            self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)
        self.assert_item_intacto()

    def test_item_inexistente_retorna_404(self):
        self.client.force_authenticate(self.treinador)
        url = reverse("exercicio-erro-comum-detail", args=[self.exercicio.pk, 9999])

        self.assertEqual(self.client.get(url).status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            self.client.put(url, self.novos_dados, format="json").status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_aluno_recebe_403_ao_editar(self):
        # CA04 / RN14 / RNF08: o 403 vem do perfil (aluno com termos aceitos).
        self.client.force_authenticate(self.aluno)

        consultar = self.client.get(self.url_item())
        editar = self.client.put(self.url_item(), self.novos_dados, format="json")
        editar_parcial = self.client.patch(
            self.url_item(), {"erro": "Alterado pelo aluno"}, format="json"
        )

        for resposta in (consultar, editar, editar_parcial):
            self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
            self.assertNotEqual(resposta.data.get("code"), "TERMOS_PENDENTES")
        self.assert_item_intacto()

    def test_sem_login_recebe_401_ao_editar(self):
        resposta = self.client.put(self.url_item(), self.novos_dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assert_item_intacto()

    def test_exercicio_e_id_do_corpo_sao_ignorados_na_edicao(self):
        # O item continua no exercício da URL e com o mesmo id.
        self.client.force_authenticate(self.treinador)

        resposta = self.client.put(
            self.url_item(),
            {**self.novos_dados, "exercicio": self.outro_exercicio.pk, "id": 9999},
            format="json",
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["id"], self.item.pk)
        self.item.refresh_from_db()
        self.assertEqual(self.item.exercicio, self.exercicio)
        self.assertFalse(self.outro_exercicio.erros_orientacoes.exists())

    def test_editar_item_nao_altera_o_exercicio_pai(self):
        antes = Exercicio.objects.get(pk=self.exercicio.pk)
        self.client.force_authenticate(self.treinador)

        resposta = self.client.put(self.url_item(), self.novos_dados, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        depois = Exercicio.objects.get(pk=self.exercicio.pk)
        self.assertEqual(depois.atualizado_em, antes.atualizado_em)
        self.assertEqual(depois.erros_comuns, antes.erros_comuns)


class RemoverErroOrientacaoTests(ErrosOrientacoesApiBase):
    """US37 CA02 — Remover um erro comum do exercício.

    Telas "Remover orientação" e "Remover orientação?": a remoção é definitiva
    e tira o item deste exercício (não há catálogo compartilhado).
    """

    def setUp(self):
        self.item = self.criar_item()
        self.outro_item = self.criar_item(
            erro="Bater a bola com a palma da mão.",
            orientacao_corretiva="Use a ponta dos dedos para controlar a bola.",
        )
        self.item_de_outro_exercicio = self.criar_item(
            exercicio=self.outro_exercicio, erro="Passe sem olhar o companheiro."
        )

    def url_item(self, item=None, exercicio_pk=None):
        item = item or self.item
        return reverse(
            "exercicio-erro-comum-detail",
            args=[exercicio_pk or item.exercicio_id, item.pk],
        )

    def ids_na_consulta(self, exercicio=None):
        consulta = self.client.get(
            reverse("exercicio-detail", args=[(exercicio or self.exercicio).pk])
        )
        return [item["id"] for item in consulta.data["erros_orientacoes"]]

    def test_ca02_item_removido_some_da_consulta(self):
        # CA02 / RN14: o erro removido deixa de aparecer na consulta do exercício.
        self.client.force_authenticate(self.treinador)

        resposta = self.client.delete(self.url_item())

        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ErroComumExercicio.objects.filter(pk=self.item.pk).exists())
        self.assertNotIn(self.item.pk, self.ids_na_consulta())
        lista = self.client.get(self.url_lista())
        self.assertNotIn(self.item.pk, [item["id"] for item in lista.data])

    def test_remocao_preserva_os_demais_itens(self):
        self.client.force_authenticate(self.treinador)

        self.client.delete(self.url_item())

        self.assertEqual(self.ids_na_consulta(), [self.outro_item.pk])
        self.assertEqual(
            self.ids_na_consulta(self.outro_exercicio),
            [self.item_de_outro_exercicio.pk],
        )
        self.outro_item.refresh_from_db()
        self.assertEqual(self.outro_item.erro, "Bater a bola com a palma da mão.")

    def test_remover_o_ultimo_item_mantem_o_exercicio_valido(self):
        # RN22: erros e orientações são opcionais; sem itens, o exercício segue válido.
        self.client.force_authenticate(self.treinador)

        self.client.delete(self.url_item())
        self.client.delete(self.url_item(self.outro_item))

        consulta = self.client.get(reverse("exercicio-detail", args=[self.exercicio.pk]))
        self.assertEqual(consulta.status_code, status.HTTP_200_OK)
        self.assertEqual(consulta.data["erros_orientacoes"], [])
        self.assertTrue(Exercicio.objects.filter(pk=self.exercicio.pk).exists())

    def test_remover_item_inexistente_retorna_404(self):
        self.client.force_authenticate(self.treinador)
        url_inexistente = reverse(
            "exercicio-erro-comum-detail", args=[self.exercicio.pk, 9999]
        )

        self.assertEqual(
            self.client.delete(url_inexistente).status_code, status.HTTP_404_NOT_FOUND
        )
        self.assertEqual(
            self.client.delete(self.url_item()).status_code, status.HTTP_204_NO_CONTENT
        )
        # Remover de novo o mesmo item: ele não existe mais.
        self.assertEqual(
            self.client.delete(self.url_item()).status_code, status.HTTP_404_NOT_FOUND
        )

    def test_remover_item_de_outro_exercicio_retorna_404(self):
        self.client.force_authenticate(self.treinador)

        resposta = self.client.delete(
            self.url_item(exercicio_pk=self.outro_exercicio.pk)
        )

        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(ErroComumExercicio.objects.filter(pk=self.item.pk).exists())

    def test_aluno_recebe_403_ao_remover(self):
        # CA04 / RN14 / RNF08: o 403 vem do perfil (aluno com termos aceitos).
        self.client.force_authenticate(self.aluno)

        resposta = self.client.delete(self.url_item())

        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(resposta.data.get("code"), "TERMOS_PENDENTES")
        self.assertTrue(ErroComumExercicio.objects.filter(pk=self.item.pk).exists())

    def test_sem_login_recebe_401_ao_remover(self):
        resposta = self.client.delete(self.url_item())

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(ErroComumExercicio.objects.filter(pk=self.item.pk).exists())

    def test_remover_item_nao_altera_o_exercicio_pai(self):
        antes = Exercicio.objects.get(pk=self.exercicio.pk)
        self.client.force_authenticate(self.treinador)

        resposta = self.client.delete(self.url_item())

        self.assertEqual(resposta.status_code, status.HTTP_204_NO_CONTENT)
        depois = Exercicio.objects.get(pk=self.exercicio.pk)
        self.assertEqual(depois.atualizado_em, antes.atualizado_em)
        self.assertEqual(depois.erros_comuns, antes.erros_comuns)


class SnapshotExercicioTests(TestCase):
    """RN23 / US37 CA03 — Cópia dos dados do exercício para a prescrição.

    `snapshot_exercicio` é o contrato que o RF2307 (prescrição de treino) deve usar:
    copiar os dados vigentes no momento da prescrição, nunca referenciar o exercício
    ou o item. Assim, editar ou remover itens na biblioteca não altera treinos já
    prescritos, e a nova versão vale só para novas prescrições.
    """

    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach",
            email="coach@exemplo.com",
            password="senha-forte-123",
            papel="TREINADOR",
        )
        cls.exercicio = Exercicio.objects.create(
            nome="Drible com deslocamento",
            objetivo="Conduzir a bola em movimento",
            fundamento="DRIBLE",
            orientacoes="Manter o corpo baixo.",
            erros_comuns="Texto antigo de erros comuns.",
            video_base="https://www.youtube.com/watch?v=exemplo",
            criado_por=cls.treinador,
        )
        cls.item = ErroComumExercicio.objects.create(
            exercicio=cls.exercicio,
            erro="Olhar somente para a bola.",
            orientacao_corretiva="Mantenha o olhar à frente durante o deslocamento.",
        )
        cls.outro_item = ErroComumExercicio.objects.create(
            exercicio=cls.exercicio,
            erro="Bater a bola com a palma da mão.",
            orientacao_corretiva="Use a ponta dos dedos para controlar a bola.",
        )

    def test_snapshot_contem_todos_os_dados_do_exercicio(self):
        self.assertEqual(
            snapshot_exercicio(self.exercicio),
            {
                "nome": "Drible com deslocamento",
                "objetivo": "Conduzir a bola em movimento",
                "fundamento": "DRIBLE",
                "fundamento_nome": "Drible",
                "orientacoes": "Manter o corpo baixo.",
                "erros_comuns": "Texto antigo de erros comuns.",
                "video_base": "https://www.youtube.com/watch?v=exemplo",
                "erros_orientacoes": [
                    {
                        "erro": "Olhar somente para a bola.",
                        "orientacao_corretiva": "Mantenha o olhar à frente durante o deslocamento.",
                    },
                    {
                        "erro": "Bater a bola com a palma da mão.",
                        "orientacao_corretiva": "Use a ponta dos dedos para controlar a bola.",
                    },
                ],
            },
        )

    def test_snapshot_tem_dados_puros_sem_ids(self):
        # Sem ids: o treino não pode depender do exercício nem dos itens da biblioteca.
        snapshot = snapshot_exercicio(self.exercicio)

        self.assertNotIn("id", snapshot)
        self.assertTrue(all("id" not in item for item in snapshot["erros_orientacoes"]))
        # Serializável em JSON, pronto para ser gravado junto do treino.
        self.assertEqual(json.loads(json.dumps(snapshot)), snapshot)

    def test_snapshot_de_exercicio_sem_itens_tem_lista_vazia(self):
        # RN22: erros e orientações são opcionais.
        sem_itens = Exercicio.objects.create(
            nome="Passe de peito",
            objetivo="Melhorar a precisão do passe",
            fundamento="PASSE",
            criado_por=self.treinador,
        )

        snapshot = snapshot_exercicio(sem_itens)

        self.assertEqual(snapshot["erros_orientacoes"], [])
        self.assertEqual(snapshot["erros_comuns"], "")

    def test_snapshot_nao_muda_apos_editar_ou_remover_item(self):
        # RN23: a cópia feita na prescrição não acompanha edições posteriores.
        snapshot_da_prescricao = snapshot_exercicio(self.exercicio)
        copia_original = copy.deepcopy(snapshot_da_prescricao)

        self.item.erro = "Erro editado na biblioteca."
        self.item.orientacao_corretiva = "Orientação editada na biblioteca."
        self.item.save()
        self.outro_item.delete()
        Exercicio.objects.filter(pk=self.exercicio.pk).update(nome="Nome editado")

        self.assertEqual(snapshot_da_prescricao, copia_original)
        # A nova versão vale para novas prescrições.
        nova = snapshot_exercicio(Exercicio.objects.get(pk=self.exercicio.pk))
        self.assertEqual(nova["nome"], "Nome editado")
        self.assertEqual(
            nova["erros_orientacoes"],
            [
                {
                    "erro": "Erro editado na biblioteca.",
                    "orientacao_corretiva": "Orientação editada na biblioteca.",
                }
            ],
        )

    def test_snapshot_usa_os_itens_ja_carregados(self):
        # Com prefetch, copiar vários exercícios não faz uma consulta por exercício.
        exercicio = Exercicio.objects.prefetch_related("erros_orientacoes").get(
            pk=self.exercicio.pk
        )

        with self.assertNumQueries(0):
            snapshot = snapshot_exercicio(exercicio)

        self.assertEqual(len(snapshot["erros_orientacoes"]), 2)

    @skip("Depende do RF2307 — prescrição de treino")
    def test_ca03_treino_prescrito_mantem_orientacoes(self):
        """CA03 integrado. Roteiro para quando o RF2307 existir:

        1. Treinador prescreve um treino com este exercício. A prescrição grava
           `snapshot_exercicio(exercicio)` junto do item do treino.
        2. Treinador edita um item (PUT .../erros-comuns/<id>/) e remove outro
           (DELETE .../erros-comuns/<id>/) na biblioteca.
        3. A consulta do treino já prescrito (aluno e treinador) mostra os erros e
           orientações da data da prescrição (iguais ao snapshot do passo 1).
        4. A consulta do exercício na biblioteca mostra a versão nova.
        5. Um novo treino prescrito depois da edição recebe a versão nova.
        """
        self.fail("Implementar quando o RF2307 (prescrição de treino) existir.")