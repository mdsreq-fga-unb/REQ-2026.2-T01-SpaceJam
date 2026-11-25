from django.contrib.auth import get_user_model
from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas import termos

from .models import ErroComumExercicio, Exercicio

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