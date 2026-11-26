from datetime import timedelta

from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.contas import termos
from apps.contas.models import Usuario
from apps.exercicios.models import Exercicio

from .models import Planejamento, Treino, TreinoExercicio

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

    def test_ca02_treino_preserva_dados_da_data_da_prescricao(self):
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

    def test_ca03_consulta_nao_faz_uma_query_por_treino(self):
        for i in range(5):
            self._treino(self.vigente, f"Treino extra {i}", Treino.Status.EM_ANDAMENTO, 2)
        self.client.force_authenticate(user=self.treinador)
        with self.assertNumQueries(3):
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