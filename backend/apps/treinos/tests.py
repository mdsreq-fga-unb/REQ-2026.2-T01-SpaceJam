from django.db import IntegrityError, connection, transaction
from rest_framework.test import APITestCase

from apps.contas import termos
from apps.contas.authentication import SessaoRefreshToken
from apps.contas.models import Usuario
from apps.exercicios.models import ErroComumExercicio, Exercicio
from datetime import timedelta

from django.test.utils import CaptureQueriesContext
from django.utils import timezone

from .models import FeedbackAluno, Planejamento, Treino, TreinoExercicio
from .serializers import TreinoExercicioSerializer

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
        for usuario in (self.treinador, self.aluno, self.aluno_sem_vinculo):
            termos.registrar_aceite(usuario)

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

    # Acesso restrito
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

class CriarTreinoUS24Tests(APITestCase):
    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach", email="coach@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="coach2", email="coach2@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", email="bia@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.aluno_de_outro = Usuario.objects.create_user(
            username="carlos", email="carlos@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.outro_treinador,
        )
        for usuario in (self.treinador, self.outro_treinador, self.aluno, self.aluno_de_outro):
            termos.registrar_aceite(usuario)
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Controle de bola"
        )
        self.ex1 = Exercicio.objects.create(
            nome="Drible entre cones", objetivo="Controle de bola", fundamento="DRIBLE",
            orientacoes="Cabeça erguida", erros_comuns="Olhar para a bola",
            video_base="https://exemplo.com/v1", criado_por=self.treinador,
        )
        self.ex2 = Exercicio.objects.create(
            nome="Prancha", objetivo="Core", fundamento="CONDICIONAMENTO_FISICO",
            criado_por=self.treinador,
        )

    def _url(self, planejamento=None):
        return f"/api/treinos/planejamentos/{(planejamento or self.planejamento).id}/treinos/"

    def _payload(self, **extra):
        base = {
            "nome": "Treino A",
            "exercicios": [
                {"exercicio": self.ex1.id, "series": 3, "repeticoes": 12},
                {"exercicio": self.ex2.id, "series": 2, "duracao_segundos": 45},
            ],
        }
        base.update(extra)
        return base

    def _post(self, payload, usuario=None, planejamento=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.post(self._url(planejamento), payload, format="json")

    # Treino estruturado, na ordem escolhida
    def test_ca01_cria_treino_estruturado_na_ordem_selecionada(self):
        r = self._post(self._payload())
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["status"], "EM_ANDAMENTO")
        self.assertEqual(r.data["planejamento"], self.planejamento.id)
        itens = r.data["exercicios"]
        self.assertEqual([i["ordem"] for i in itens], [1, 2])
        self.assertEqual([i["nome"] for i in itens], ["Drible entre cones", "Prancha"])
        self.assertEqual(itens[0]["series"], 3)
        self.assertEqual(itens[0]["repeticoes"], 12)
        self.assertIsNone(itens[0]["duracao_segundos"])
        self.assertEqual(itens[1]["duracao_segundos"], 45)
        self.assertTrue(all(i["status"] == "A_FAZER" for i in itens))

    def test_ca01_ordem_segue_a_lista_enviada(self):
        payload = self._payload()
        payload["exercicios"].reverse()
        r = self._post(payload)
        self.assertEqual(r.status_code, 201)
        self.assertEqual([i["nome"] for i in r.data["exercicios"]], ["Prancha", "Drible entre cones"])

    def test_ca01_mesmo_exercicio_pode_repetir_no_treino(self):
        payload = self._payload(exercicios=[
            {"exercicio": self.ex1.id, "series": 3, "repeticoes": 10},
            {"exercicio": self.ex1.id, "series": 2, "repeticoes": 8},
        ])
        r = self._post(payload)
        self.assertEqual(r.status_code, 201)
        self.assertEqual(len(r.data["exercicios"]), 2)

    def test_us35_ca03_prescricao_copia_titulo_e_descricao_do_video_base(self):
        # US35 CA03 / RN23: título e descrição do vídeo-base vão para o treino na prescrição
        # e não mudam se a biblioteca for editada depois.
        self.ex1.video_titulo = "Drible entre cones"
        self.ex1.video_descricao = "Alterne as mãos a cada cone."
        self.ex1.save(update_fields=["video_titulo", "video_descricao"])

        r = self._post(self._payload())

        self.assertEqual(r.status_code, 201)
        self.ex1.video_titulo = "Título alterado"
        self.ex1.save(update_fields=["video_titulo"])
        item = TreinoExercicio.objects.get(treino_id=r.data["id"], ordem=1)
        self.assertEqual(item.video_titulo, "Drible entre cones")
        self.assertEqual(item.video_descricao, "Alterne as mãos a cada cone.")
        sem_textos = TreinoExercicio.objects.get(treino_id=r.data["id"], ordem=2)
        self.assertEqual((sem_textos.video_titulo, sem_textos.video_descricao), ("", ""))

    def test_ca02_treino_preserva_dados_da_data_da_prescricao(self):
        orientacao = ErroComumExercicio.objects.create(
            exercicio=self.ex1, erro="Olhar para baixo", orientacao_corretiva="Olhe à frente."
        )
        r = self._post(self._payload())
        self.assertEqual(r.status_code, 201)
        self.ex1.nome = "Nome alterado"
        self.ex1.objetivo = "Outro objetivo"
        self.ex1.erros_comuns = "Outros erros"
        self.ex1.video_base = "https://exemplo.com/novo"
        self.ex1.save()
        item = TreinoExercicio.objects.get(treino_id=r.data["id"], ordem=1)
        self.assertEqual(item.nome, "Drible entre cones")
        self.assertEqual(item.objetivo, "Controle de bola")
        self.assertEqual(item.fundamento, "DRIBLE")
        self.assertEqual(item.orientacoes, "Cabeça erguida")
        self.assertEqual(item.erros_comuns, "Olhar para a bola")
        self.assertEqual(item.video_base, "https://exemplo.com/v1")

        orientacao.orientacao_corretiva = "Nova orientação"
        orientacao.save(update_fields=["orientacao_corretiva"])
        orientacao.delete()
        item.refresh_from_db()
        pares = [{"erro": "Olhar para baixo", "orientacao_corretiva": "Olhe à frente."}]
        self.assertEqual(item.erros_orientacoes, pares)
        self.assertEqual(r.data["exercicios"][0]["erros_orientacoes"], pares)

    def test_ca02_excluir_exercicio_da_biblioteca_preserva_o_prescrito(self):
        r = self._post(self._payload())
        self.ex1.delete()
        item = TreinoExercicio.objects.get(treino_id=r.data["id"], ordem=1)
        self.assertEqual(item.nome, "Drible entre cones")
        self.assertIsNone(item.exercicio_origem)

    # Campos obrigatórios
    def test_ca03_bloqueia_sem_nome_e_sem_exercicios(self):
        r = self._post({})
        self.assertEqual(r.status_code, 400)
        self.assertIn("nome", r.data)
        self.assertIn("exercicios", r.data)
        self.assertEqual(Treino.objects.count(), 0)

    def test_ca03_bloqueia_nome_so_com_espacos(self):
        r = self._post(self._payload(nome="   "))
        self.assertEqual(r.status_code, 400)
        self.assertIn("nome", r.data)

    def test_ca03_bloqueia_lista_vazia(self):
        r = self._post(self._payload(exercicios=[]))
        self.assertEqual(r.status_code, 400)
        self.assertIn("exercicios", r.data)

    def test_ca03_bloqueia_exercicio_inexistente(self):
        r = self._post(self._payload(exercicios=[
            {"exercicio": 999999, "series": 3, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 400)
        self.assertEqual(Treino.objects.count(), 0)

    # Parâmetros de execução
    def test_ca04_series_obrigatorias_e_minimo_1(self):
        for item in (
            {"exercicio": self.ex1.id, "repeticoes": 10},
            {"exercicio": self.ex1.id, "series": 0, "repeticoes": 10},
        ):
            r = self._post(self._payload(exercicios=[item]))
            self.assertEqual(r.status_code, 400)
            self.assertIn("series", r.data["exercicios"][0])
        self.assertEqual(Treino.objects.count(), 0)

    def test_ca04_exige_repeticoes_ou_duracao_e_nunca_os_dois(self):
        casos = [
            {"exercicio": self.ex1.id, "series": 3},
            {"exercicio": self.ex1.id, "series": 3, "repeticoes": 10, "duracao_segundos": 30},
            {"exercicio": self.ex1.id, "series": 3, "repeticoes": 0},
            {"exercicio": self.ex1.id, "series": 3, "duracao_segundos": 0},
        ]
        for item in casos:
            r = self._post(self._payload(exercicios=[item]))
            self.assertEqual(r.status_code, 400, item)
        self.assertEqual(Treino.objects.count(), 0)

    def test_ca04_rejeita_valores_acima_do_limite_dos_campos(self):
        dados_validos = {"exercicio": self.ex1.id, "series": 3, "repeticoes": 10}
        casos = (
            ("series", {**dados_validos, "series": 32_768}),
            ("repeticoes", {**dados_validos, "repeticoes": 32_768}),
            ("duracao_segundos", {**dados_validos, "repeticoes": None, "duracao_segundos": 2_147_483_648}),
        )
        for campo, dados in casos:
            with self.subTest(campo=campo):
                serializer = TreinoExercicioSerializer(data=dados)
                self.assertFalse(serializer.is_valid())
                self.assertIn(campo, serializer.errors)

    def test_ca04_erro_em_um_item_nao_cria_treino_parcial(self):
        r = self._post(self._payload(exercicios=[
            {"exercicio": self.ex1.id, "series": 3, "repeticoes": 10},
            {"exercicio": self.ex2.id, "series": 0, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 400)
        self.assertEqual(Treino.objects.count(), 0)
        self.assertEqual(TreinoExercicio.objects.count(), 0)

    # Estados iniciais
    def test_ca05_estados_iniciais(self):
        r = self._post(self._payload())
        treino = Treino.objects.get(pk=r.data["id"])
        self.assertEqual(treino.status, Treino.Status.EM_ANDAMENTO)
        self.assertFalse(
            treino.exercicios.exclude(status=TreinoExercicio.Status.A_FAZER).exists()
        )

    def test_ca05_cliente_nao_consegue_forcar_status(self):
        payload = self._payload(status="CONCLUIDO")
        payload["exercicios"][0]["status"] = "CONCLUIDO"
        r = self._post(payload)
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["status"], "EM_ANDAMENTO")
        self.assertEqual(r.data["exercicios"][0]["status"], "A_FAZER")

    # Planejamento vigente
    def test_ca06_bloqueia_planejamento_historico(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.save()
        r = self._post(self._payload())
        self.assertEqual(r.status_code, 400)
        self.assertIn("planejamento", r.data)
        self.assertEqual(Treino.objects.count(), 0)

    # Filtro de carteira
    def test_ca07_planejamento_de_aluno_de_outro_treinador_da_404(self):
        outro = Planejamento.objects.create(
            aluno=self.aluno_de_outro, treinador=self.outro_treinador, nome="Alheio"
        )
        r = self._post(self._payload(), planejamento=outro)
        self.assertEqual(r.status_code, 404)
        self.assertEqual(Treino.objects.count(), 0)

    def test_ca07_planejamento_inexistente_da_404(self):
        self.client.force_authenticate(user=self.treinador)
        r = self.client.post("/api/treinos/planejamentos/999999/treinos/", self._payload(), format="json")
        self.assertEqual(r.status_code, 404)

    # Acesso restrito
    def test_ca08_aluno_recebe_403(self):
        r = self._post(self._payload(), usuario=self.aluno)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(Treino.objects.count(), 0)

    def test_ca08_sem_login_recebe_401(self):
        r = self.client.post(self._url(), self._payload(), format="json")
        self.assertEqual(r.status_code, 401)

    def test_metodo_get_nao_permitido(self):
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.get(self._url()).status_code, 405)

    # Integridade no banco
    def test_banco_impede_repeticoes_e_duracao_juntas(self):
        treino = Treino.objects.create(planejamento=self.planejamento, nome="T")
        with self.assertRaises(IntegrityError), transaction.atomic():
            TreinoExercicio.objects.create(
                treino=treino, ordem=1, nome="x", objetivo="y", fundamento="DRIBLE",
                series=1, repeticoes=5, duracao_segundos=30,
            )

    def test_banco_impede_exercicio_sem_meta(self):
        treino = Treino.objects.create(planejamento=self.planejamento, nome="T")
        with self.assertRaises(IntegrityError), transaction.atomic():
            TreinoExercicio.objects.create(
                treino=treino, ordem=1, nome="Drible", objetivo="Controle",
                fundamento="DRIBLE", series=1,
            )

    def test_banco_impede_ordem_duplicada(self):
        treino = Treino.objects.create(planejamento=self.planejamento, nome="T")
        kw = dict(treino=treino, ordem=1, nome="x", objetivo="y", fundamento="DRIBLE", series=1, repeticoes=5)
        TreinoExercicio.objects.create(**kw)
        with self.assertRaises(IntegrityError), transaction.atomic():
            TreinoExercicio.objects.create(**kw)

class ConsultarPlanejamentoUS27Tests(APITestCase):
    URL_CARTEIRA = "/api/treinos/alunos/"

    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach27", email="coach27@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.beatriz = Usuario.objects.create_user(
            username="beatriz27", email="bia27@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", last_name="Costa",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.andre = Usuario.objects.create_user(
            username="andre27", email="andre27@aluno.com", password="SenhaAluno#2026",
            first_name="André", last_name="Lima",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.sem_vinculo = Usuario.objects.create_user(
            username="solto27", email="solto27@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO,
        )
        for usuario in (self.treinador, self.beatriz, self.andre, self.sem_vinculo):
            termos.registrar_aceite(usuario)

        self.anterior = Planejamento.objects.create(
            aluno=self.beatriz, treinador=self.treinador, nome="Fundamentos",
            status=Planejamento.Status.HISTORICO,
        )
        self.vigente = Planejamento.objects.create(
            aluno=self.beatriz, treinador=self.treinador, nome="Controle de bola",
        )
        self.exercicio = Exercicio.objects.create(
            criado_por=self.treinador, nome="Drible alternado",
            objetivo="Controle", fundamento="DRIBLE",
        )
        self.treino_a = self._treino(self.vigente, "Treino A", Treino.Status.FEITO, 3)
        self.treino_b = self._treino(self.vigente, "Treino B", Treino.Status.EM_ANDAMENTO, 2)
        self._treino(self.anterior, "Treino antigo", Treino.Status.CONCLUIDO, 1)

    def _treino(self, planejamento, nome, status, qtd_exercicios):
        treino = Treino.objects.create(planejamento=planejamento, nome=nome, status=status)
        for ordem in range(1, qtd_exercicios + 1):
            TreinoExercicio.objects.create(
                treino=treino, exercicio_origem=self.exercicio, ordem=ordem,
                nome="Drible alternado", objetivo="Controle", fundamento="Drible",
                series=3, repeticoes=10,
            )
        return treino

    def _get(self, url, usuario=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.get(url)

    def _url(self, aluno_id):
        return f"/api/treinos/alunos/{aluno_id}/planejamento-vigente/"

    # Lista da carteira
    def test_ca02_lista_carteira_com_planejamento_vigente(self):
        r = self._get(self.URL_CARTEIRA)
        self.assertEqual(r.status_code, 200)
        por_id = {a["id"]: a for a in r.data}
        self.assertEqual(set(por_id), {self.beatriz.id, self.andre.id})
        self.assertEqual(por_id[self.beatriz.id]["nome"], "Beatriz Costa")
        self.assertEqual(
            por_id[self.beatriz.id]["planejamento_vigente"],
            {"id": self.vigente.id, "nome": "Controle de bola"},
        )
        self.assertIsNone(por_id[self.andre.id]["planejamento_vigente"])

    def test_ca02_carteira_nao_inclui_alunos_inativos(self):
        self.andre.is_active = False
        self.andre.save()
        r = self._get(self.URL_CARTEIRA)
        self.assertEqual([a["id"] for a in r.data], [self.beatriz.id])

    # Planejamento vigente com treinos
    def test_ca03_exibe_planejamento_vigente_com_treinos(self):
        r = self._get(self._url(self.beatriz.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["aluno"], {"id": self.beatriz.id, "nome": "Beatriz Costa"})
        planejamento = r.data["planejamento"]
        self.assertEqual(planejamento["id"], self.vigente.id)
        self.assertEqual(planejamento["nome"], "Controle de bola")
        self.assertEqual(
            [
                (t["nome"], t["status"], t["status_display"], t["total_exercicios"])
                for t in planejamento["treinos"]
            ],
            [
                ("Treino A", "FEITO", "Feito", 3),
                ("Treino B", "EM_ANDAMENTO", "Em andamento", 2),
            ],
        )

    def test_ca02_exibe_exercicios_e_parametros_do_treino(self):
        item = self.treino_a.exercicios.get(ordem=2)
        item.repeticoes = None
        item.duracao_segundos = 45
        item.save(update_fields=["repeticoes", "duracao_segundos"])

        resposta = self._get(self._url(self.beatriz.id))
        self.assertEqual(resposta.status_code, 200)
        exercicios = resposta.data["planejamento"]["treinos"][0]["exercicios"]
        self.assertEqual([e["ordem"] for e in exercicios], [1, 2, 3])
        self.assertEqual(exercicios[0]["nome"], "Drible alternado")
        self.assertEqual(exercicios[0]["series"], 3)
        self.assertEqual(exercicios[0]["repeticoes"], 10)
        self.assertEqual(exercicios[1]["duracao_segundos"], 45)

    def test_ca03_consulta_nao_faz_uma_query_por_treino(self):
        for i in range(5):
            self._treino(self.vigente, f"Treino extra {i}", Treino.Status.EM_ANDAMENTO, 2)
        self.client.force_authenticate(user=self.treinador)
        with self.assertNumQueries(4):
            self.client.get(self._url(self.beatriz.id))

    # Vigente sem treinos
    def test_ca04_planejamento_vigente_sem_treinos(self):
        Planejamento.objects.create(aluno=self.andre, treinador=self.treinador, nome="Arremesso")
        r = self._get(self._url(self.andre.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["planejamento"]["nome"], "Arremesso")
        self.assertEqual(r.data["planejamento"]["treinos"], [])

    # Sem planejamento vigente
    def test_ca05_sem_planejamento_vigente_retorna_null(self):
        r = self._get(self._url(self.andre.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["aluno"]["nome"], "André Lima")
        self.assertIsNone(r.data["planejamento"])

    # Somente o vigente
    def test_ca06_planejamento_historico_nao_aparece(self):
        r = self._get(self._url(self.beatriz.id))
        nomes = [t["nome"] for t in r.data["planejamento"]["treinos"]]
        self.assertNotIn("Treino antigo", nomes)
        self.assertNotEqual(r.data["planejamento"]["id"], self.anterior.id)

    def test_ca06_aluno_so_com_historico_aparece_sem_vigente(self):
        self.vigente.status = Planejamento.Status.HISTORICO
        self.vigente.save()
        r = self._get(self._url(self.beatriz.id))
        self.assertIsNone(r.data["planejamento"])

    # Acesso restrito
    def test_ca07_aluno_recebe_403(self):
        for url in (self.URL_CARTEIRA, self._url(self.beatriz.id)):
            self.assertEqual(self._get(url, usuario=self.beatriz).status_code, 403)

    def test_ca07_sem_login_recebe_401(self):
        for url in (self.URL_CARTEIRA, self._url(self.beatriz.id)):
            self.assertEqual(self.client.get(url).status_code, 401)

    def test_ca07_aluno_inexistente_recebe_404(self):
        self.assertEqual(self._get(self._url(999999)).status_code, 404)

    def test_ca07_aluno_fora_da_carteira_recebe_404_sem_vazar(self):
        Planejamento.objects.create(
            aluno=self.sem_vinculo, treinador=self.treinador, nome="Oculto"
        )
        r = self._get(self._url(self.sem_vinculo.id))
        self.assertEqual(r.status_code, 404)
        self.assertNotIn("Oculto", str(r.data))

    def test_ca07_id_de_treinador_recebe_404(self):
        self.assertEqual(self._get(self._url(self.treinador.id)).status_code, 404)

    def test_metodos_de_escrita_nao_permitidos(self):
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.post(self._url(self.beatriz.id), {}).status_code, 405)
        self.assertEqual(self.client.delete(self.URL_CARTEIRA).status_code, 405)


class ConsultarMeuPlanejamentoUS60Tests(APITestCase):
    URL = "/api/treinos/meu-planejamento/"

    @classmethod
    def setUpTestData(cls):
        cls.treinador = Usuario.objects.create_user(
            username="coach60", email="coach60@example.com", papel=Usuario.Papel.TREINADOR,
        )
        cls.aluno = Usuario.objects.create_user(
            username="bia60", email="bia60@example.com", papel=Usuario.Papel.ALUNO,
            treinador=cls.treinador,
        )
        cls.outro = Usuario.objects.create_user(
            username="andre60", email="andre60@example.com", papel=Usuario.Papel.ALUNO,
            treinador=cls.treinador,
        )
        for usuario in (cls.treinador, cls.aluno, cls.outro):
            termos.registrar_aceite(usuario)

        cls.vigente = Planejamento.objects.create(
            aluno=cls.aluno, treinador=cls.treinador, nome="Controle de bola",
        )
        cls.historico = Planejamento.objects.create(
            aluno=cls.aluno, treinador=cls.treinador, nome="Primeiro planejamento",
            status=Planejamento.Status.HISTORICO,
        )
        cls.planejamento_alheio = Planejamento.objects.create(
            aluno=cls.outro, treinador=cls.treinador, nome="Planejamento do André",
        )

    def _autenticar(self, usuario):
        token = SessaoRefreshToken.for_user(usuario).access_token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_requer_autenticacao(self):
        self.assertEqual(self.client.get(self.URL).status_code, 401)

    def test_requer_papel_de_aluno(self):
        self._autenticar(self.treinador)
        self.assertEqual(self.client.get(self.URL).status_code, 403)

    def test_requer_aceite_dos_termos(self):
        aluno = Usuario.objects.create_user(
            username="pendente60", email="pendente60@example.com", papel=Usuario.Papel.ALUNO,
        )
        self._autenticar(aluno)
        resposta = self.client.get(self.URL)
        self.assertEqual(resposta.status_code, 403)
        self.assertEqual(resposta.data["code"], "TERMOS_PENDENTES")

    def test_consulta_somente_o_vigente_do_aluno_autenticado(self):
        Treino.objects.create(planejamento=self.historico, nome="Treino antigo")
        Treino.objects.create(planejamento=self.planejamento_alheio, nome="Treino de outro aluno")
        Treino.objects.create(planejamento=self.vigente, nome="Treino A", status=Treino.Status.FEITO)
        Treino.objects.create(planejamento=self.vigente, nome="Treino B")

        self._autenticar(self.aluno)
        resposta = self.client.get(self.URL, {"aluno_id": self.outro.pk})

        self.assertEqual(resposta.status_code, 200)
        planejamento = resposta.data["planejamento"]
        self.assertEqual(planejamento["nome"], "Controle de bola")
        self.assertEqual(
            [(treino["nome"], treino["status"], treino["status_display"]) for treino in planejamento["treinos"]],
            [("Treino A", "FEITO", "Feito"), ("Treino B", "EM_ANDAMENTO", "Em andamento")],
        )

    def test_retorna_null_quando_aluno_so_tem_historico(self):
        self.vigente.delete()
        self._autenticar(self.aluno)
        resposta = self.client.get(self.URL)
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.data, {"planejamento": None})

    def test_retorna_planejamento_vigente_sem_treinos(self):
        self._autenticar(self.aluno)
        resposta = self.client.get(self.URL)
        self.assertEqual(resposta.status_code, 200)
        self.assertEqual(resposta.data["planejamento"]["nome"], "Controle de bola")
        self.assertEqual(resposta.data["planejamento"]["treinos"], [])

    def test_exibe_o_snapshot_dos_exercicios_na_ordem_prescrita(self):
        drible = Exercicio.objects.create(
            nome="Drible entre cones", objetivo="Controle de bola", fundamento="DRIBLE",
            orientacoes="Cabeça erguida", erros_comuns="Olhar para a bola",
            video_base="https://example.com/drible", criado_por=self.treinador,
        )
        ErroComumExercicio.objects.create(
            exercicio=drible, erro="Perder o equilíbrio", orientacao_corretiva="Flexione os joelhos.",
        )
        prancha = Exercicio.objects.create(
            nome="Prancha", objetivo="Estabilidade", fundamento="CONDICIONAMENTO_FISICO",
            criado_por=self.treinador,
        )
        self._autenticar(self.treinador)
        criado = self.client.post(
            f"/api/treinos/planejamentos/{self.vigente.pk}/treinos/",
            {
                "nome": "Treino A",
                "exercicios": [
                    {"exercicio": prancha.pk, "series": 2, "duracao_segundos": 45},
                    {"exercicio": drible.pk, "series": 3, "repeticoes": 12},
                ],
            },
            format="json",
        )
        self.assertEqual(criado.status_code, 201)
        drible.delete()

        self._autenticar(self.aluno)
        resposta = self.client.get(self.URL)
        self.assertEqual(resposta.status_code, 200)
        treino = resposta.data["planejamento"]["treinos"][0]
        self.assertEqual(treino["total_exercicios"], 2)
        itens = treino["exercicios"]
        self.assertEqual([(item["ordem"], item["nome"]) for item in itens], [(1, "Prancha"), (2, "Drible entre cones")])
        self.assertEqual((itens[0]["series"], itens[0]["repeticoes"], itens[0]["duracao_segundos"]), (2, None, 45))
        self.assertEqual((itens[1]["series"], itens[1]["repeticoes"], itens[1]["duracao_segundos"]), (3, 12, None))
        self.assertIsNone(itens[1]["exercicio"])
        self.assertEqual(itens[1]["orientacoes"], "Cabeça erguida")
        self.assertEqual(itens[1]["erros_comuns"], "Olhar para a bola")
        self.assertEqual(itens[1]["erros_orientacoes"], [
            {"erro": "Perder o equilíbrio", "orientacao_corretiva": "Flexione os joelhos."},
        ])
        self.assertEqual(itens[1]["video_base"], "https://example.com/drible")

    def test_bloqueia_escrita(self):
        self._autenticar(self.aluno)
        self.assertEqual(self.client.post(self.URL, {}, format="json").status_code, 405)
class EditarTreinoUS25Tests(APITestCase):
    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach", email="coach@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="coach2", email="coach2@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", email="bia@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.aluno_de_outro = Usuario.objects.create_user(
            username="carlos", email="carlos@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.outro_treinador,
        )
        for usuario in (self.treinador, self.outro_treinador, self.aluno, self.aluno_de_outro):
            termos.registrar_aceite(usuario)
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Controle de bola"
        )
        self.ex1 = Exercicio.objects.create(
            nome="Drible entre cones", objetivo="Controle de bola", fundamento="DRIBLE",
            orientacoes="Cabeça erguida", erros_comuns="Olhar para a bola",
            video_base="https://exemplo.com/v1", criado_por=self.treinador,
        )
        self.ex2 = Exercicio.objects.create(
            nome="Prancha", objetivo="Core", fundamento="CONDICIONAMENTO_FISICO",
            criado_por=self.treinador,
        )
        self.ex3 = Exercicio.objects.create(
            nome="Bandeja", objetivo="Finalização", fundamento="ARREMESSO",
            orientacoes="Passada longa", criado_por=self.treinador,
        )
        self.treino = Treino.objects.create(planejamento=self.planejamento, nome="Treino A")
        self.te1 = self._item(self.treino, 1, self.ex1, series=3, repeticoes=12)
        self.te2 = self._item(self.treino, 2, self.ex2, series=2, duracao_segundos=45)

    def _item(self, treino, ordem, ex, **params):
        return TreinoExercicio.objects.create(
            treino=treino, ordem=ordem, exercicio_origem=ex, nome=ex.nome, objetivo=ex.objetivo,
            fundamento=ex.fundamento, orientacoes=ex.orientacoes, erros_comuns=ex.erros_comuns,
            video_base=ex.video_base, **params,
        )

    def _url(self, treino=None):
        return f"/api/treinos/treinos/{(treino or self.treino).id}/"

    def _payload(self, **extra):
        base = {
            "nome": "Treino A",
            "exercicios": [
                {"id": self.te1.id, "series": 3, "repeticoes": 12},
                {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
            ],
        }
        base.update(extra)
        return base

    def _put(self, payload, usuario=None, treino=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.put(self._url(treino), payload, format="json")

    def _estado(self):
        self.treino.refresh_from_db()
        itens = list(self.treino.exercicios.values_list("id", "ordem", "series", "repeticoes", "duracao_segundos", "status"))
        return self.treino.nome, self.treino.status, itens

    # Ajuste — nome e parâmetros de exercícios "A fazer"
    def test_ca01_altera_nome_e_parametros(self):
        r = self._put({
            "nome": "Treino A - revisado",
            "exercicios": [
                {"id": self.te1.id, "series": 4, "duracao_segundos": 30},
                {"id": self.te2.id, "series": 3, "repeticoes": 15},
            ],
        })
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["nome"], "Treino A - revisado")
        a, b = r.data["exercicios"]
        self.assertEqual((a["id"], a["ordem"], a["series"], a["repeticoes"], a["duracao_segundos"]),
                         (self.te1.id, 1, 4, None, 30))
        self.assertEqual((b["id"], b["ordem"], b["series"], b["repeticoes"], b["duracao_segundos"]),
                         (self.te2.id, 2, 3, 15, None))
        self.assertTrue(all(i["status"] == "A_FAZER" for i in r.data["exercicios"]))

    def test_ca01_ordem_dos_existentes_nao_muda(self):
        payload = self._payload()
        payload["exercicios"].reverse()
        r = self._put(payload)
        self.assertEqual(r.status_code, 200)
        self.assertEqual([i["id"] for i in r.data["exercicios"]], [self.te1.id, self.te2.id])

    # Validação: nada é salvo
    def test_ca02_bloqueia_nome_vazio_ou_so_espacos(self):
        antes = self._estado()
        for nome in ("", "   "):
            r = self._put(self._payload(nome=nome))
            self.assertEqual(r.status_code, 400)
            self.assertIn("nome", r.data)
        self.assertEqual(self._estado(), antes)

    def test_ca02_bloqueia_sem_exercicios(self):
        antes = self._estado()
        for exercicios in ([], None):
            r = self._put(self._payload(exercicios=exercicios))
            self.assertEqual(r.status_code, 400)
            self.assertIn("exercicios", r.data)
        self.assertEqual(self._estado(), antes)

    def test_ca02_bloqueia_parametros_invalidos(self):
        antes = self._estado()
        casos = [
            {"id": self.te1.id, "repeticoes": 10},
            {"id": self.te1.id, "series": 0, "repeticoes": 10},
            {"id": self.te1.id, "series": 3},
            {"id": self.te1.id, "series": 3, "repeticoes": 10, "duracao_segundos": 30},
            {"id": self.te1.id, "series": 3, "repeticoes": 0},
            {"id": self.te1.id, "series": 3, "duracao_segundos": -5},
        ]
        for item in casos:
            r = self._put(self._payload(exercicios=[item]))
            self.assertEqual(r.status_code, 400, item)
        self.assertEqual(self._estado(), antes)

    def test_ca02_item_precisa_de_id_ou_exercicio_nunca_os_dois(self):
        antes = self._estado()
        for item in (
            {"series": 3, "repeticoes": 10},
            {"id": self.te1.id, "exercicio": self.ex3.id, "series": 3, "repeticoes": 10},
        ):
            r = self._put(self._payload(exercicios=[item]))
            self.assertEqual(r.status_code, 400, item)
        self.assertEqual(self._estado(), antes)

    def test_ca02_bloqueia_id_de_outro_treino_e_id_repetido(self):
        outro = Treino.objects.create(planejamento=self.planejamento, nome="Treino B")
        alheio = self._item(outro, 1, self.ex3, series=1, repeticoes=5)
        antes = self._estado()
        r = self._put(self._payload(exercicios=[{"id": alheio.id, "series": 1, "repeticoes": 5}]))
        self.assertEqual(r.status_code, 400)
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 1, "repeticoes": 5},
            {"id": self.te1.id, "series": 2, "repeticoes": 5},
        ]))
        self.assertEqual(r.status_code, 400)
        self.assertEqual(self._estado(), antes)

    def test_ca02_bloqueia_exercicio_inexistente_na_biblioteca(self):
        antes = self._estado()
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
            {"exercicio": 999999, "series": 1, "repeticoes": 5},
        ]))
        self.assertEqual(r.status_code, 400)
        self.assertEqual(self._estado(), antes)

    # Cancelamento — comportamento de interface: sem requisição, nada é salvo.

    # Acesso restrito
    def test_ca04_aluno_recebe_403(self):
        antes = self._estado()
        r = self._put(self._payload(nome="Invasão"), usuario=self.aluno)
        self.assertEqual(r.status_code, 403)
        self.assertEqual(self._estado(), antes)

    def test_ca04_sem_login_recebe_401(self):
        r = self.client.put(self._url(), self._payload(), format="json")
        self.assertEqual(r.status_code, 401)

    def test_ca04_treino_de_outra_carteira_e_inexistente_dao_404(self):
        outro_plan = Planejamento.objects.create(
            aluno=self.aluno_de_outro, treinador=self.outro_treinador, nome="Alheio"
        )
        outro_treino = Treino.objects.create(planejamento=outro_plan, nome="Treino X")
        self.assertEqual(self._put(self._payload(), treino=outro_treino).status_code, 404)
        self.client.force_authenticate(user=self.treinador)
        r = self.client.put("/api/treinos/treinos/999999/", self._payload(), format="json")
        self.assertEqual(r.status_code, 404)

    def test_ca04_metodos_nao_permitidos(self):
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.get(self._url()).status_code, 405)
        self.assertEqual(self.client.delete(self._url()).status_code, 405)

    # Preservação do exercício prescrito
    def test_ca05_existente_mantem_dados_da_prescricao_e_novo_copia_na_inclusao(self):
        self.ex1.nome = "Nome alterado"
        self.ex1.erros_comuns = "Outros erros"
        self.ex1.save()
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 5, "repeticoes": 8},
            {"exercicio": self.ex3.id, "series": 2, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 200)
        self.te1.refresh_from_db()
        self.assertEqual(self.te1.nome, "Drible entre cones")
        self.assertEqual(self.te1.erros_comuns, "Olhar para a bola")
        novo = TreinoExercicio.objects.get(treino=self.treino, exercicio_origem=self.ex3)
        self.assertEqual((novo.nome, novo.orientacoes, novo.fundamento), ("Bandeja", "Passada longa", "ARREMESSO"))
        self.ex3.nome = "Outro nome"
        self.ex3.save()
        novo.refresh_from_db()
        self.assertEqual(novo.nome, "Bandeja")

    # Treino bloqueado
    def test_ca06_treino_concluido_e_somente_leitura(self):
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save()
        antes = self._estado()
        r = self._put(self._payload(nome="Mudou"))
        self.assertEqual(r.status_code, 409)
        self.assertEqual(r.data["code"], "EDICAO_BLOQUEADA")
        self.assertEqual(self._estado(), antes)

    def test_ca06_planejamento_historico_e_somente_leitura(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.save()
        antes = self._estado()
        r = self._put(self._payload(nome="Mudou"))
        self.assertEqual(r.status_code, 409)
        self.assertEqual(self._estado(), antes)

    # Exercício já executado
    def _marcar_feito(self, te):
        te.status = TreinoExercicio.Status.FEITO
        te.save()

    def test_ca07_nao_altera_parametros_de_exercicio_executado(self):
        for status in (TreinoExercicio.Status.FEITO, TreinoExercicio.Status.CONCLUIDO, TreinoExercicio.Status.CORRIGIR):
            self.te1.status = status
            self.te1.save()
            antes = self._estado()
            r = self._put(self._payload(exercicios=[
                {"id": self.te1.id, "series": 9, "repeticoes": 12},
                {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
            ]))
            self.assertEqual(r.status_code, 409, status)
            self.assertEqual(self._estado(), antes)

    def test_ca07_nao_remove_exercicio_executado(self):
        self._marcar_feito(self.te1)
        antes = self._estado()
        r = self._put(self._payload(exercicios=[{"id": self.te2.id, "series": 2, "duracao_segundos": 45}]))
        self.assertEqual(r.status_code, 409)
        self.assertEqual(self._estado(), antes)

    def test_ca07_executado_pode_vir_igual_e_os_a_fazer_seguem_editaveis(self):
        self._marcar_feito(self.te1)
        r = self._put(self._payload(
            nome="Treino A2",
            exercicios=[
                {"id": self.te1.id, "series": 3, "repeticoes": 12},
                {"id": self.te2.id, "series": 4, "duracao_segundos": 60},
            ],
        ))
        self.assertEqual(r.status_code, 200)
        self.te1.refresh_from_db()
        self.te2.refresh_from_db()
        self.assertEqual(self.te1.status, TreinoExercicio.Status.FEITO)
        self.assertEqual((self.te2.series, self.te2.duracao_segundos), (4, 60))

    def test_ca07_conflito_nao_grava_alteracoes_parciais(self):
        self._marcar_feito(self.te1)
        antes = self._estado()
        r = self._put(self._payload(
            nome="Parcial",
            exercicios=[
                {"id": self.te1.id, "series": 9, "repeticoes": 12},
                {"id": self.te2.id, "series": 7, "duracao_segundos": 99},
                {"exercicio": self.ex3.id, "series": 1, "repeticoes": 5},
            ],
        ))
        self.assertEqual(r.status_code, 409)
        self.assertEqual(self._estado(), antes)

    # Incluir e remover
    def test_ca08_inclui_no_fim_com_estado_a_fazer(self):
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
            {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
            {"exercicio": self.ex3.id, "series": 2, "repeticoes": 10},
            {"exercicio": self.ex1.id, "series": 1, "duracao_segundos": 20},
        ]))
        self.assertEqual(r.status_code, 200)
        itens = r.data["exercicios"]
        self.assertEqual([i["ordem"] for i in itens], [1, 2, 3, 4])
        self.assertEqual([i["nome"] for i in itens][2:], ["Bandeja", "Drible entre cones"])
        self.assertTrue(all(i["status"] == "A_FAZER" for i in itens))

    def test_ca08_remove_exercicio_a_fazer_e_fecha_a_ordem(self):
        te3 = self._item(self.treino, 3, self.ex3, series=2, repeticoes=10)
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
            {"id": te3.id, "series": 2, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual([(i["id"], i["ordem"]) for i in r.data["exercicios"]], [(self.te1.id, 1), (te3.id, 2)])
        self.assertFalse(TreinoExercicio.objects.filter(pk=self.te2.id).exists())

    def test_ca08_pode_trocar_todos_os_a_fazer_por_novos(self):
        r = self._put(self._payload(exercicios=[{"exercicio": self.ex3.id, "series": 2, "repeticoes": 10}]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual([i["nome"] for i in r.data["exercicios"]], ["Bandeja"])
        self.assertEqual(self.treino.exercicios.count(), 1)

    def test_preserva_exercicio_com_feedback(self):
        feedback = FeedbackAluno.objects.create(item_treino=self.te2, aluno=self.aluno, texto="Foi difícil.")

        resposta = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
        ]))

        self.assertEqual(resposta.status_code, 409)
        self.assertTrue(FeedbackAluno.objects.filter(pk=feedback.pk).exists())

    def test_ca08_treino_feito_com_exercicio_novo_volta_para_em_andamento(self):
        self.client.force_authenticate(user=self.aluno)
        resposta_status = self.client.patch(
            f"/api/treinos/{self.treino.id}/feito/", {"status": "FEITO"}, format="json",
        )
        self.assertEqual(resposta_status.status_code, 200)
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
            {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
            {"exercicio": self.ex3.id, "series": 2, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["status"], "EM_ANDAMENTO")
        self.assertEqual([item["status"] for item in r.data["exercicios"]], ["FEITO", "FEITO", "A_FAZER"])

    def test_protege_parametros_e_remocao_quando_aluno_marca_treino_como_feito(self):
        self.client.force_authenticate(user=self.aluno)
        resposta_status = self.client.patch(
            f"/api/treinos/{self.treino.id}/feito/", {"status": "FEITO"}, format="json",
        )
        self.assertEqual(resposta_status.status_code, 200)

        resposta_edicao = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 5, "repeticoes": 12},
            {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
        ]))
        resposta_remocao = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
        ]))

        self.assertEqual(resposta_edicao.status_code, 409)
        self.assertEqual(resposta_remocao.status_code, 409)
        self.te1.refresh_from_db()
        self.assertEqual(self.te1.series, 3)
        self.assertTrue(self.treino.exercicios.filter(pk=self.te2.pk).exists())

    def test_treino_feito_sem_exercicio_novo_continua_feito(self):
        self.treino.status = Treino.Status.FEITO
        self.treino.save()
        r = self._put(self._payload(nome="Só o nome"))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["status"], "FEITO")


class EditarPlanejamentoUS19Tests(APITestCase):
    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach19", email="coach19@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="coach19b", email="coach19b@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz19", email="bia19@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", last_name="Costa",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="andre19", email="andre19@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.aluno_de_fora = Usuario.objects.create_user(
            username="fora19", email="fora19@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.outro_treinador,
        )
        for usuario in (
            self.treinador, self.outro_treinador, self.aluno, self.outro_aluno, self.aluno_de_fora
        ):
            termos.registrar_aceite(usuario)

        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Controle de bola",
        )
        self.exercicio = Exercicio.objects.create(
            criado_por=self.treinador, nome="Drible alternado",
            objetivo="Controle", fundamento="DRIBLE",
        )
        self.treino_a = self._treino(self.planejamento, "Treino A")
        self.treino_b = self._treino(self.planejamento, "Treino B")
        self.treino_c = self._treino(self.planejamento, "Treino C")

    def _treino(self, planejamento, nome, status=Treino.Status.EM_ANDAMENTO, qtd=2):
        treino = Treino.objects.create(planejamento=planejamento, nome=nome, status=status)
        for ordem in range(1, qtd + 1):
            TreinoExercicio.objects.create(
                treino=treino, exercicio_origem=self.exercicio, ordem=ordem,
                nome="Drible alternado", objetivo="Controle", fundamento="Drible",
                series=3, repeticoes=10,
            )
        return treino

    def _url(self, planejamento_id=None):
        return f"/api/treinos/planejamentos/{planejamento_id or self.planejamento.id}/"

    def _url_treino(self, treino_id, planejamento_id=None):
        return f"{self._url(planejamento_id)}treinos/{treino_id}/"

    def _patch(self, payload, usuario=None, url=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.patch(url or self._url(), payload, format="json")

    def _delete(self, treino_id, usuario=None, planejamento_id=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.delete(self._url_treino(treino_id, planejamento_id))

    # Edição do nome
    def test_ca01_altera_nome_sem_mexer_em_aluno_treinos_e_estados(self):
        self.treino_b.status = Treino.Status.FEITO
        self.treino_b.save()
        r = self._patch({"nome": "  Arremesso de média distância  "})
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["nome"], "Arremesso de média distância")
        self.assertEqual(r.data["aluno"], self.aluno.id)
        self.assertEqual(r.data["status"], "VIGENTE")
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Arremesso de média distância")
        self.assertEqual(
            list(self.planejamento.treinos.values_list("nome", "status")),
            [("Treino A", "EM_ANDAMENTO"), ("Treino B", "FEITO"), ("Treino C", "EM_ANDAMENTO")],
        )

    # Validação
    def test_ca02_bloqueia_nome_vazio_so_espacos_ou_longo(self):
        for nome in ("", "   ", "x" * 256):
            r = self._patch({"nome": nome})
            self.assertEqual(r.status_code, 400, nome)
            self.assertIn("nome", r.data)
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Controle de bola")

    def test_ca02_aceita_nome_com_255_caracteres(self):
        self.assertEqual(self._patch({"nome": "x" * 255}).status_code, 200)

    # Cancelamento: sem requisição, nada muda
    def test_ca03_sem_requisicao_nada_muda(self):
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Controle de bola")
        self.assertEqual(self.planejamento.treinos.count(), 3)

    def test_salva_nome_e_remocoes_na_mesma_edicao(self):
        resposta = self._patch({"nome": "Novo plano", "treinos_removidos": [self.treino_a.id, self.treino_b.id]})

        self.assertEqual(resposta.status_code, 200)
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Novo plano")
        self.assertEqual(list(self.planejamento.treinos.values_list("id", flat=True)), [self.treino_c.id])

    def test_preserva_plano_e_feedback_quando_uma_das_remocoes_e_bloqueada(self):
        feedback = FeedbackAluno.objects.create(
            item_treino=self.treino_b.exercicios.first(), aluno=self.aluno, texto="Foi difícil.",
        )

        resposta = self._patch({"nome": "Novo plano", "treinos_removidos": [self.treino_a.id, self.treino_b.id]})

        self.assertEqual(resposta.status_code, 409)
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Controle de bola")
        self.assertEqual(self.planejamento.treinos.count(), 3)
        self.assertEqual(self._delete(self.treino_b.id).status_code, 409)
        self.assertTrue(FeedbackAluno.objects.filter(pk=feedback.pk).exists())

    # Remoção de treino
    def test_ca04_remove_treino_nao_executado(self):
        r = self._delete(self.treino_b.id)
        self.assertEqual(r.status_code, 204)
        self.assertFalse(Treino.objects.filter(pk=self.treino_b.id).exists())
        self.assertFalse(TreinoExercicio.objects.filter(treino_id=self.treino_b.id).exists())
        self.assertEqual(
            list(self.planejamento.treinos.values_list("nome", "status")),
            [("Treino A", "EM_ANDAMENTO"), ("Treino C", "EM_ANDAMENTO")],
        )

    def test_ca04_pode_remover_todos_os_treinos(self):
        for treino in (self.treino_a, self.treino_b, self.treino_c):
            self.assertEqual(self._delete(treino.id).status_code, 204)
        self.assertEqual(self.planejamento.treinos.count(), 0)
        self.planejamento.refresh_from_db()
        self.assertTrue(self.planejamento.is_vigente)

    # Treino executado
    def test_ca05_bloqueia_treino_feito_ou_concluido(self):
        for status in (Treino.Status.FEITO, Treino.Status.CONCLUIDO):
            treino = self._treino(self.planejamento, f"Treino {status}", status=status)
            r = self._delete(treino.id)
            self.assertEqual(r.status_code, 409)
            self.assertEqual(r.data["code"], "EDICAO_BLOQUEADA")
            self.assertTrue(Treino.objects.filter(pk=treino.id).exists())

    def test_ca05_bloqueia_treino_com_exercicio_fora_de_a_fazer(self):
        for status in (
            TreinoExercicio.Status.FEITO,
            TreinoExercicio.Status.CONCLUIDO,
            TreinoExercicio.Status.CORRIGIR,
        ):
            treino = self._treino(self.planejamento, f"Treino {status}")
            exercicio = treino.exercicios.first()
            exercicio.status = status
            exercicio.save()
            self.assertEqual(self._delete(treino.id).status_code, 409)
            self.assertEqual(treino.exercicios.count(), 2)

    # Planejamento no histórico
    def test_ca06_planejamento_historico_nao_edita_nome(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.save()
        r = self._patch({"nome": "Novo nome"})
        self.assertEqual(r.status_code, 409)
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.nome, "Controle de bola")

    def test_ca06_planejamento_historico_nao_remove_treino(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.save()
        self.assertEqual(self._delete(self.treino_a.id).status_code, 409)
        self.assertTrue(Treino.objects.filter(pk=self.treino_a.id).exists())

    def test_ca06_planejamento_encerrado_por_novo_planejamento_fica_bloqueado(self):
        self.client.force_authenticate(user=self.treinador)
        self.client.post(URL, {"aluno": self.aluno.id, "nome": "Novo ciclo"}, format="json")
        self.assertEqual(self._patch({"nome": "Tentativa"}).status_code, 409)

    # Aluno fixo
    def test_ca07_nao_troca_o_aluno(self):
        r = self._patch({"nome": "Controle de bola", "aluno": self.outro_aluno.id})
        self.assertEqual(r.status_code, 200)
        self.planejamento.refresh_from_db()
        self.assertEqual(self.planejamento.aluno, self.aluno)

    def test_ca07_ignora_status_enviado_pelo_cliente(self):
        self._patch({"nome": "Controle de bola", "status": "HISTORICO"})
        self.planejamento.refresh_from_db()
        self.assertTrue(self.planejamento.is_vigente)

    # Acesso restrito
    def test_ca08_aluno_recebe_403(self):
        self.assertEqual(self._patch({"nome": "X"}, usuario=self.aluno).status_code, 403)
        self.assertEqual(self._delete(self.treino_a.id, usuario=self.aluno).status_code, 403)

    def test_ca08_sem_login_recebe_401(self):
        self.assertEqual(self.client.patch(self._url(), {"nome": "X"}).status_code, 401)
        self.assertEqual(self.client.delete(self._url_treino(self.treino_a.id)).status_code, 401)

    def test_ca08_planejamento_de_outra_carteira_ou_inexistente_recebe_404(self):
        de_fora = Planejamento.objects.create(
            aluno=self.aluno_de_fora, treinador=self.outro_treinador, nome="Oculto",
        )
        treino_de_fora = self._treino(de_fora, "Treino oculto")
        self.assertEqual(self._patch({"nome": "X"}, url=self._url(de_fora.id)).status_code, 404)
        self.assertEqual(self._patch({"nome": "X"}, url=self._url(999999)).status_code, 404)
        self.assertEqual(
            self._delete(treino_de_fora.id, planejamento_id=de_fora.id).status_code, 404
        )
        de_fora.refresh_from_db()
        self.assertEqual(de_fora.nome, "Oculto")

    def test_ca08_treino_de_outro_planejamento_recebe_404(self):
        outro = Planejamento.objects.create(
            aluno=self.outro_aluno, treinador=self.treinador, nome="Outro",
        )
        treino_outro = self._treino(outro, "Treino X")
        self.assertEqual(self._delete(treino_outro.id).status_code, 404)
        self.assertEqual(self._delete(999999).status_code, 404)
        self.assertTrue(Treino.objects.filter(pk=treino_outro.id).exists())

    def test_metodos_nao_permitidos(self):
        self.client.force_authenticate(user=self.treinador)
        self.assertEqual(self.client.get(self._url()).status_code, 405)
        self.assertEqual(self.client.delete(self._url()).status_code, 405)
        self.assertEqual(self.client.patch(self._url_treino(self.treino_a.id), {}).status_code, 405)

class ConsultarHistoricoPlanejamentosUS21Tests(APITestCase):
    """US21 — Consultar histórico de planejamentos."""

    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach21", email="coach21@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.beatriz = Usuario.objects.create_user(
            username="beatriz21", email="bia21@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", last_name="Costa",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.andre = Usuario.objects.create_user(
            username="andre21", email="andre21@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.sem_vinculo = Usuario.objects.create_user(
            username="solto21", email="solto21@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO,
        )
        for usuario in (self.treinador, self.beatriz, self.andre, self.sem_vinculo):
            termos.registrar_aceite(usuario)

        self.exercicio = Exercicio.objects.create(
            criado_por=self.treinador, nome="Drible alternado",
            objetivo="Controle", fundamento="DRIBLE",
        )
        agora = timezone.now()
        self.mais_antigo = self._planejamento(
            "Base de arremesso", encerrado_em=agora - timedelta(days=30)
        )
        self.mais_recente = self._planejamento(
            "Fundamentos de drible", encerrado_em=agora - timedelta(days=7)
        )
        self.vigente = Planejamento.objects.create(
            aluno=self.beatriz, treinador=self.treinador, nome="Controle de bola",
        )
        self._treino(self.mais_recente, "Treino A", Treino.Status.CONCLUIDO, 3)
        self._treino(self.mais_recente, "Treino B", Treino.Status.FEITO, 2)
        self._treino(self.mais_antigo, "Treino antigo", Treino.Status.EM_ANDAMENTO, 1)
        self._treino(self.vigente, "Treino atual", Treino.Status.EM_ANDAMENTO, 1)

    def _planejamento(self, nome, encerrado_em, aluno=None):
        return Planejamento.objects.create(
            aluno=aluno or self.beatriz, treinador=self.treinador, nome=nome,
            status=Planejamento.Status.HISTORICO, encerrado_em=encerrado_em,
        )

    def _treino(self, planejamento, nome, status, qtd_exercicios):
        treino = Treino.objects.create(planejamento=planejamento, nome=nome, status=status)
        for ordem in range(1, qtd_exercicios + 1):
            TreinoExercicio.objects.create(
                treino=treino, exercicio_origem=self.exercicio, ordem=ordem,
                nome="Drible alternado", objetivo="Controle", fundamento="Drible",
                series=3, repeticoes=10,
            )
        return treino

    def _get(self, url, usuario=None):
        self.client.force_authenticate(user=usuario or self.treinador)
        return self.client.get(url)

    def _url_lista(self, aluno_id):
        return f"/api/treinos/alunos/{aluno_id}/planejamentos-historico/"

    def _url_detalhe(self, aluno_id, planejamento_id):
        return f"/api/treinos/alunos/{aluno_id}/planejamentos-historico/{planejamento_id}/"

    # Lista do histórico
    def test_ca01_lista_planejamentos_anteriores_com_nome_e_total_de_treinos(self):
        r = self._get(self._url_lista(self.beatriz.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["aluno"], {"id": self.beatriz.id, "nome": "Beatriz Costa"})
        self.assertEqual(
            [(p["nome"], p["total_treinos"]) for p in r.data["planejamentos"]],
            [("Fundamentos de drible", 2), ("Base de arremesso", 1)],
        )

    def test_ca01_ordem_do_encerrado_mais_recente_para_o_mais_antigo(self):
        r = self._get(self._url_lista(self.beatriz.id))
        ids = [p["id"] for p in r.data["planejamentos"]]
        self.assertEqual(ids, [self.mais_recente.id, self.mais_antigo.id])

    def test_ca01_planejamento_vigente_nao_aparece_na_lista(self):
        r = self._get(self._url_lista(self.beatriz.id))
        ids = [p["id"] for p in r.data["planejamentos"]]
        self.assertNotIn(self.vigente.id, ids)

    def test_ca01_planejamento_encerrado_pela_us18_entra_no_historico(self):
        # Fluxo real: criar um novo planejamento encerra o vigente (RN27)
        self.client.force_authenticate(user=self.treinador)
        r_novo = self.client.post(
            "/api/treinos/planejamentos/",
            {"aluno": self.beatriz.id, "nome": "Novo ciclo"}, format="json",
        )
        self.assertEqual(r_novo.status_code, 201)
        r = self.client.get(self._url_lista(self.beatriz.id))
        self.assertEqual(r.data["planejamentos"][0]["id"], self.vigente.id)

    # Sem histórico
    def test_ca02_aluno_sem_historico_recebe_lista_vazia(self):
        r = self._get(self._url_lista(self.andre.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["planejamentos"], [])

    # Detalhe do planejamento anterior
    def test_ca03_detalhe_mostra_treinos_com_nome_estado_e_total_de_exercicios(self):
        r = self._get(self._url_detalhe(self.beatriz.id, self.mais_recente.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["aluno"]["nome"], "Beatriz Costa")
        self.assertEqual(r.data["planejamento"]["nome"], "Fundamentos de drible")
        self.assertEqual(
            [
                (t["nome"], t["status"], t["status_display"], t["total_exercicios"])
                for t in r.data["planejamento"]["treinos"]
            ],
            [
                ("Treino A", "CONCLUIDO", "Concluído", 3),
                ("Treino B", "FEITO", "Feito", 2),
            ],
        )

    # Planejamento anterior sem treinos
    def test_ca04_planejamento_anterior_sem_treinos(self):
        vazio = self._planejamento("Sem treinos", encerrado_em=timezone.now())
        r = self._get(self._url_detalhe(self.beatriz.id, vazio.id))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["planejamento"]["treinos"], [])

    # Somente leitura
    def test_ca05_metodos_de_escrita_nao_permitidos(self):
        self.client.force_authenticate(user=self.treinador)
        for url in (
            self._url_lista(self.beatriz.id),
            self._url_detalhe(self.beatriz.id, self.mais_recente.id),
        ):
            for metodo in (self.client.post, self.client.put, self.client.patch, self.client.delete):
                with self.subTest(url=url, metodo=metodo.__name__):
                    self.assertEqual(metodo(url, {}).status_code, 405)

    # Somente planejamentos do histórico daquele aluno
    def test_ca06_planejamento_vigente_no_detalhe_recebe_404(self):
        r = self._get(self._url_detalhe(self.beatriz.id, self.vigente.id))
        self.assertEqual(r.status_code, 404)

    def test_ca06_planejamento_de_outro_aluno_recebe_404(self):
        do_andre = self._planejamento("Do André", encerrado_em=timezone.now(), aluno=self.andre)
        r = self._get(self._url_detalhe(self.beatriz.id, do_andre.id))
        self.assertEqual(r.status_code, 404)

    # Acesso restrito
    def test_ca07_aluno_recebe_403(self):
        for url in (
            self._url_lista(self.beatriz.id),
            self._url_detalhe(self.beatriz.id, self.mais_recente.id),
        ):
            self.assertEqual(self._get(url, usuario=self.beatriz).status_code, 403)

    def test_ca07_sem_login_recebe_401(self):
        for url in (
            self._url_lista(self.beatriz.id),
            self._url_detalhe(self.beatriz.id, self.mais_recente.id),
        ):
            self.assertEqual(self.client.get(url).status_code, 401)

    def test_ca07_aluno_ou_planejamento_inexistente_recebe_404(self):
        self.assertEqual(self._get(self._url_lista(999999)).status_code, 404)
        self.assertEqual(self._get(self._url_detalhe(self.beatriz.id, 999999)).status_code, 404)

    def test_ca07_id_de_treinador_recebe_404(self):
        self.assertEqual(self._get(self._url_lista(self.treinador.id)).status_code, 404)

    def test_ca07_aluno_fora_da_carteira_recebe_404_sem_vazar(self):
        oculto = self._planejamento("Oculto", encerrado_em=timezone.now(), aluno=self.sem_vinculo)
        r_lista = self._get(self._url_lista(self.sem_vinculo.id))
        r_detalhe = self._get(self._url_detalhe(self.sem_vinculo.id, oculto.id))
        self.assertEqual(r_lista.status_code, 404)
        self.assertEqual(r_detalhe.status_code, 404)
        self.assertNotIn("Oculto", str(r_lista.data) + str(r_detalhe.data))


class HistoricoTreinosAlunoUS28Tests(APITestCase):
    """US28 — Consultar histórico de treinos de aluno acompanhado."""

    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach", email="coach@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="outro_coach", email="outro@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", email="bia@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", last_name="Costa",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="carlos", email="carlos@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.aluno_de_outra_carteira = Usuario.objects.create_user(
            username="diana", email="diana@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.outro_treinador,
        )
        for usuario in (
            self.treinador, self.outro_treinador, self.aluno, self.outro_aluno,
            self.aluno_de_outra_carteira,
        ):
            termos.registrar_aceite(usuario)
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Controle de bola"
        )

    def _url(self, aluno=None):
        return f"/api/treinos/alunos/{(aluno or self.aluno).pk}/historico/"

    def _treino(self, nome, estado, planejamento=None):
        return Treino.objects.create(
            planejamento=planejamento or self.planejamento, nome=nome, status=estado
        )

    # Evolução Longitudinal
    def test_ca01_lista_so_treinos_concluidos_do_aluno_do_mais_recente_ao_mais_antigo(self):
        antigo = self._treino("Treino A", Treino.Status.CONCLUIDO)
        self._treino("Treino B", Treino.Status.EM_ANDAMENTO)
        self._treino("Treino C", Treino.Status.FEITO)
        self._treino("Treino D", Treino.Status.CORRIGIR_REFAZER)
        recente = self._treino("Treino E", Treino.Status.CONCLUIDO)
        planejamento_outro_aluno = Planejamento.objects.create(
            aluno=self.outro_aluno, treinador=self.treinador, nome="Outro aluno"
        )
        self._treino("Treino de outro aluno", Treino.Status.CONCLUIDO, planejamento_outro_aluno)

        self.client.force_authenticate(user=self.treinador)
        r = self.client.get(self._url())

        self.assertEqual(r.status_code, 200)
        self.assertEqual([item["id"] for item in r.data["results"]], [recente.id, antigo.id])
        self.assertEqual(r.data["count"], 2)
        self.assertEqual(r.data["aluno"], {"id": self.aluno.id, "nome": "Beatriz Costa"})

    def test_ca01_inclui_treinos_concluidos_de_planejamento_encerrado(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.encerrado_em = timezone.now()
        self.planejamento.save(update_fields=["status", "encerrado_em"])
        antigo = self._treino("Treino do ciclo anterior", Treino.Status.CONCLUIDO)
        vigente = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Ciclo atual"
        )
        atual = self._treino("Treino do ciclo atual", Treino.Status.CONCLUIDO, vigente)

        self.client.force_authenticate(user=self.treinador)
        r = self.client.get(self._url())

        self.assertEqual(r.status_code, 200)
        self.assertEqual([item["id"] for item in r.data["results"]], [atual.id, antigo.id])

    def test_ca01_item_traz_status_e_quantidade_de_exercicios(self):
        treino = self._treino("Treino A", Treino.Status.CONCLUIDO)
        for ordem in (1, 2):
            TreinoExercicio.objects.create(
                treino=treino, ordem=ordem, nome=f"Exercício {ordem}", objetivo="Controle",
                fundamento="DRIBLE", series=3, repeticoes=8,
            )
        treino.realizado_em = timezone.now()
        treino.save(update_fields=["realizado_em"])

        self.client.force_authenticate(user=self.treinador)
        item = self.client.get(self._url()).data["results"][0]

        self.assertEqual(item["nome"], "Treino A")
        self.assertEqual(item["alunoId"], self.aluno.id)
        self.assertEqual(item["statusSlug"], "concluido")
        self.assertEqual(item["statusLabel"], "Concluído")
        self.assertEqual(item["quantidadeExercicios"], 2)
        self.assertIsNotNone(item["realizadoEm"])

    def test_ca01_aluno_sem_treinos_concluidos_recebe_lista_vazia(self):
        self._treino("Treino A", Treino.Status.FEITO)

        self.client.force_authenticate(user=self.treinador)
        r = self.client.get(self._url())

        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 0)
        self.assertEqual(r.data["results"], [])

    # Exercício Alterado ou Excluído
    def test_ca03_treino_do_historico_mantem_dados_da_epoca_apos_editar_e_excluir_exercicio(self):
        origem = Exercicio.objects.create(
            nome="Drible alternado", objetivo="Controle de bola", fundamento="DRIBLE",
            criado_por=self.treinador,
        )
        treino = self._treino("Treino A", Treino.Status.CONCLUIDO)
        TreinoExercicio.objects.create(
            treino=treino, ordem=1, exercicio_origem=origem, nome=origem.nome,
            objetivo=origem.objetivo, fundamento=origem.fundamento, orientacoes="Olhar à frente",
            series=3, repeticoes=8,
        )
        origem.nome = "Nome novo na biblioteca"
        origem.save(update_fields=["nome"])
        origem.delete()

        self.client.force_authenticate(user=self.treinador)
        lista = self.client.get(self._url())
        detalhe = self.client.get(f"/api/treinos/{treino.id}/")

        self.assertEqual([item["id"] for item in lista.data["results"]], [treino.id])
        self.assertEqual(lista.data["results"][0]["quantidadeExercicios"], 1)
        self.assertEqual(detalhe.status_code, 200)
        exercicio = detalhe.data["exercicios"][0]
        self.assertEqual(exercicio["nome"], "Drible alternado")
        self.assertEqual(exercicio["orientacoes"], "Olhar à frente")

    # Desempenho
    def test_ca04_listagem_e_paginada_e_respeita_o_limite_de_tamanho(self):
        for numero in range(25):
            self._treino(f"Treino {numero}", Treino.Status.CONCLUIDO)

        self.client.force_authenticate(user=self.treinador)
        primeira = self.client.get(self._url())
        segunda = self.client.get(self._url(), {"page": 2})
        tudo = self.client.get(self._url(), {"tamanho": 1000})

        self.assertEqual(primeira.data["count"], 25)
        self.assertEqual(len(primeira.data["results"]), 20)
        self.assertIsNotNone(primeira.data["next"])
        self.assertEqual(len(segunda.data["results"]), 5)
        self.assertIsNone(segunda.data["next"])
        self.assertEqual(len(tudo.data["results"]), 25)

    def test_ca04_numero_de_consultas_nao_cresce_com_a_quantidade_de_treinos(self):
        self.client.force_authenticate(user=self.treinador)
        self._treino("Treino 0", Treino.Status.CONCLUIDO)
        with CaptureQueriesContext(connection) as com_um_treino:
            self.client.get(self._url())

        for numero in range(1, 10):
            self._treino(f"Treino {numero}", Treino.Status.CONCLUIDO)
        with CaptureQueriesContext(connection) as com_dez_treinos:
            r = self.client.get(self._url())

        self.assertEqual(len(r.data["results"]), 10)
        self.assertEqual(len(com_dez_treinos), len(com_um_treino))

    # Acesso Restrito
    def test_ca05_aluno_nao_acessa_historico_pela_api_do_treinador(self):
        self._treino("Treino A", Treino.Status.CONCLUIDO)

        for usuario in (self.aluno, self.outro_aluno):
            self.client.force_authenticate(user=usuario)
            r = self.client.get(self._url())
            self.assertEqual(r.status_code, 403)
            self.assertNotIn("results", r.data)

    def test_ca05_treinador_de_outra_carteira_recebe_403(self):
        self._treino("Treino A", Treino.Status.CONCLUIDO)

        self.client.force_authenticate(user=self.outro_treinador)
        r = self.client.get(self._url())

        self.assertEqual(r.status_code, 403)
        self.assertNotIn("results", r.data)

    def test_ca05_treinador_nao_acessa_aluno_de_outra_carteira(self):
        self.client.force_authenticate(user=self.treinador)

        self.assertEqual(self.client.get(self._url(self.aluno_de_outra_carteira)).status_code, 403)

    def test_ca05_sem_login_recebe_401(self):
        self.assertEqual(self.client.get(self._url()).status_code, 401)

    def test_aluno_inexistente_ou_que_nao_e_aluno_recebe_404(self):
        self.client.force_authenticate(user=self.treinador)

        self.assertEqual(self.client.get("/api/treinos/alunos/999999/historico/").status_code, 404)
        self.assertEqual(self.client.get(self._url(self.outro_treinador)).status_code, 404)

    # O campo novo do serializer compartilhado não pode quebrar o detalhe nem o status do treino.
    def test_quantidade_de_exercicios_nos_endpoints_de_detalhe_e_status(self):
        treino = self._treino("Treino A", Treino.Status.EM_ANDAMENTO)
        TreinoExercicio.objects.create(
            treino=treino, ordem=1, nome="Exercício 1", objetivo="Controle",
            fundamento="DRIBLE", series=3, repeticoes=8,
        )

        self.client.force_authenticate(user=self.treinador)
        detalhe = self.client.get(f"/api/treinos/{treino.id}/")
        status_treino = self.client.get(f"/api/treinos/{treino.id}/status/")

        self.assertEqual(detalhe.data["quantidadeExercicios"], 1)
        self.assertEqual(status_treino.data["quantidadeExercicios"], 1)


class MeuHistoricoTreinosUS58Tests(APITestCase):
    """US58 — Consultar próprio histórico de treinos."""

    URL = "/api/treinos/meu-historico/"

    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="coach", email="coach@basquete.com", password="SenhaForte#2026",
            papel=Usuario.Papel.TREINADOR,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", email="bia@aluno.com", password="SenhaAluno#2026",
            first_name="Beatriz", papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="carlos", email="carlos@aluno.com", password="SenhaAluno#2026",
            papel=Usuario.Papel.ALUNO, treinador=self.treinador,
        )
        for usuario in (self.treinador, self.aluno, self.outro_aluno):
            termos.registrar_aceite(usuario)
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Controle de bola"
        )
        self.planejamento_do_outro = Planejamento.objects.create(
            aluno=self.outro_aluno, treinador=self.treinador, nome="Arremesso"
        )

    def _treino(self, nome, estado, planejamento=None):
        return Treino.objects.create(
            planejamento=planejamento or self.planejamento, nome=nome, status=estado
        )

    # Histórico Individual
    def test_ca01_lista_treinos_em_qualquer_status_do_mais_recente_ao_mais_antigo(self):
        em_andamento = self._treino("Treino A", Treino.Status.EM_ANDAMENTO)
        feito = self._treino("Treino B", Treino.Status.FEITO)
        corrigir = self._treino("Treino C", Treino.Status.CORRIGIR_REFAZER)
        concluido = self._treino("Treino D", Treino.Status.CONCLUIDO)
        self._treino("Treino de outro aluno", Treino.Status.CONCLUIDO, self.planejamento_do_outro)

        self.client.force_authenticate(user=self.aluno)
        r = self.client.get(self.URL)

        self.assertEqual(r.status_code, 200)
        self.assertEqual(
            [item["id"] for item in r.data["results"]],
            [concluido.id, corrigir.id, feito.id, em_andamento.id],
        )
        self.assertEqual(r.data["count"], 4)
        self.assertEqual(
            [item["statusSlug"] for item in r.data["results"]],
            ["concluido", "corrigir-refazer", "feito", "em-andamento"],
        )

    def test_ca01_inclui_treinos_de_planejamento_encerrado_e_do_vigente(self):
        self.planejamento.status = Planejamento.Status.HISTORICO
        self.planejamento.encerrado_em = timezone.now()
        self.planejamento.save(update_fields=["status", "encerrado_em"])
        antigo = self._treino("Treino do ciclo anterior", Treino.Status.CONCLUIDO)
        vigente = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Ciclo atual"
        )
        atual = self._treino("Treino do ciclo atual", Treino.Status.EM_ANDAMENTO, vigente)

        self.client.force_authenticate(user=self.aluno)
        r = self.client.get(self.URL)

        self.assertEqual(r.status_code, 200)
        self.assertEqual([item["id"] for item in r.data["results"]], [atual.id, antigo.id])

    def test_ca01_item_traz_status_e_quantidade_de_exercicios(self):
        treino = self._treino("Treino A", Treino.Status.FEITO)
        TreinoExercicio.objects.create(
            treino=treino, ordem=1, nome="Exercício 1", objetivo="Controle",
            fundamento="DRIBLE", series=3, repeticoes=8,
        )
        treino.realizado_em = timezone.now()
        treino.save(update_fields=["realizado_em"])

        self.client.force_authenticate(user=self.aluno)
        item = self.client.get(self.URL).data["results"][0]

        self.assertEqual(item["nome"], "Treino A")
        self.assertEqual(item["alunoId"], self.aluno.id)
        self.assertEqual(item["statusSlug"], "feito")
        self.assertEqual(item["quantidadeExercicios"], 1)
        self.assertIsNotNone(item["realizadoEm"])

    def test_ca01_aluno_sem_treinos_recebe_lista_vazia(self):
        self.client.force_authenticate(user=self.aluno)
        r = self.client.get(self.URL)

        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 0)
        self.assertEqual(r.data["results"], [])

    # Detalhe do Treino
    def test_ca02_detalhe_do_treino_do_historico_mantem_dados_da_epoca(self):
        origem = Exercicio.objects.create(
            nome="Drible alternado", objetivo="Controle de bola", fundamento="DRIBLE",
            criado_por=self.treinador,
        )
        treino = self._treino("Treino A", Treino.Status.CONCLUIDO)
        TreinoExercicio.objects.create(
            treino=treino, ordem=1, exercicio_origem=origem, nome=origem.nome,
            objetivo=origem.objetivo, fundamento=origem.fundamento, orientacoes="Olhar à frente",
            series=3, repeticoes=8,
        )
        origem.nome = "Nome novo na biblioteca"
        origem.save(update_fields=["nome"])
        origem.delete()

        self.client.force_authenticate(user=self.aluno)
        lista = self.client.get(self.URL)
        detalhe = self.client.get(f"/api/treinos/{treino.id}/")

        self.assertEqual([item["id"] for item in lista.data["results"]], [treino.id])
        self.assertEqual(detalhe.status_code, 200)
        self.assertEqual(detalhe.data["statusSlug"], "concluido")
        self.assertEqual(detalhe.data["exercicios"][0]["nome"], "Drible alternado")

    # Isolamento
    def test_ca03_historico_de_outro_aluno_nao_aparece_nem_por_parametro(self):
        meu = self._treino("Meu treino", Treino.Status.CONCLUIDO)
        self._treino("Treino de outro aluno", Treino.Status.CONCLUIDO, self.planejamento_do_outro)

        self.client.force_authenticate(user=self.aluno)
        r = self.client.get(self.URL, {"aluno": self.outro_aluno.id, "aluno_id": self.outro_aluno.id})

        self.assertEqual(r.status_code, 200)
        self.assertEqual([item["id"] for item in r.data["results"]], [meu.id])

    def test_ca03_aluno_nao_abre_treino_nem_historico_de_outro_aluno_pela_api(self):
        treino_do_outro = self._treino(
            "Treino de outro aluno", Treino.Status.CONCLUIDO, self.planejamento_do_outro
        )

        self.client.force_authenticate(user=self.aluno)
        detalhe = self.client.get(f"/api/treinos/{treino_do_outro.id}/")
        historico_do_outro = self.client.get(
            f"/api/treinos/alunos/{self.outro_aluno.id}/historico/"
        )

        self.assertEqual(detalhe.status_code, 403)
        self.assertEqual(historico_do_outro.status_code, 403)

    def test_treinador_nao_usa_a_rota_do_aluno(self):
        self.client.force_authenticate(user=self.treinador)

        self.assertEqual(self.client.get(self.URL).status_code, 403)

    def test_sem_login_recebe_401(self):
        self.assertEqual(self.client.get(self.URL).status_code, 401)

    # Desempenho
    def test_ca04_listagem_e_paginada_e_respeita_o_limite_de_tamanho(self):
        for numero in range(25):
            self._treino(f"Treino {numero}", Treino.Status.CONCLUIDO)

        self.client.force_authenticate(user=self.aluno)
        primeira = self.client.get(self.URL)
        segunda = self.client.get(self.URL, {"page": 2})
        tudo = self.client.get(self.URL, {"tamanho": 1000})

        self.assertEqual(primeira.data["count"], 25)
        self.assertEqual(len(primeira.data["results"]), 20)
        self.assertIsNotNone(primeira.data["next"])
        self.assertEqual(len(segunda.data["results"]), 5)
        self.assertEqual(len(tudo.data["results"]), 25)

    def test_ca04_numero_de_consultas_nao_cresce_com_a_quantidade_de_treinos(self):
        self.client.force_authenticate(user=self.aluno)
        self._treino("Treino 0", Treino.Status.CONCLUIDO)
        with CaptureQueriesContext(connection) as com_um_treino:
            self.client.get(self.URL)

        for numero in range(1, 10):
            self._treino(f"Treino {numero}", Treino.Status.CONCLUIDO)
        with CaptureQueriesContext(connection) as com_dez_treinos:
            r = self.client.get(self.URL)

        self.assertEqual(len(r.data["results"]), 10)
        self.assertEqual(len(com_dez_treinos), len(com_um_treino))
