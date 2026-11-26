from django.db import IntegrityError, transaction
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

    def test_ca08_treino_feito_com_exercicio_novo_volta_para_em_andamento(self):
        self.treino.status = Treino.Status.FEITO
        self.treino.save()
        r = self._put(self._payload(exercicios=[
            {"id": self.te1.id, "series": 3, "repeticoes": 12},
            {"id": self.te2.id, "series": 2, "duracao_segundos": 45},
            {"exercicio": self.ex3.id, "series": 2, "repeticoes": 10},
        ]))
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["status"], "EM_ANDAMENTO")

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