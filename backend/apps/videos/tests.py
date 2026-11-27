from unittest import mock

from django.conf import settings
from django.core import signing
from django.db import IntegrityError, transaction
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas.models import Usuario
from apps.contas.termos import versao_vigente
from apps.treinos.models import Planejamento, Treino, TreinoExercicio

from . import storage
from .models import VideoExecucao
from .views import SALT_COMPROVANTE

MB = 1024 * 1024


class VideoExecucaoModelTests(TestCase):
    """US42 (RF3501) — Regras guardadas pelo próprio banco para o vídeo de execução."""

    def setUp(self):
        self.treinador = Usuario.objects.create_user(
            username="treinador.video", password="Password123", papel=Usuario.Papel.TREINADOR
        )
        self.aluno = Usuario.objects.create_user(
            username="aluno.video", password="Password123", papel=Usuario.Papel.ALUNO,
            treinador=self.treinador,
        )
        planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Arremesso"
        )
        self.treino = Treino.objects.create(planejamento=planejamento, nome="Treino A")
        self.item = TreinoExercicio.objects.create(
            treino=self.treino, ordem=1, nome="Bandeja", objetivo="Finalização",
            fundamento="ARREMESSO", series=3, repeticoes=10,
        )

    def criar_video(self, **campos):
        dados = {
            "item_treino": self.item,
            "aluno": self.aluno,
            "caminho_storage": "dev/aluno_1/item_1/abc.mp4",
            "formato": VideoExecucao.Formato.MP4,
            "tamanho_bytes": 10 * MB,
            "duracao_segundos": 30,
        }
        dados.update(campos)
        return VideoExecucao.objects.create(**dados)

    def test_video_fica_vinculado_ao_exercicio_do_treino(self):
        video = self.criar_video()

        self.assertEqual(self.item.video_execucao, video)
        self.assertEqual(self.aluno.videos_execucao.get(), video)
        self.assertFalse(video.foi_substituido)

    def test_ca05_exercicio_aceita_um_unico_video(self):
        self.criar_video()

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.criar_video(caminho_storage="dev/aluno_1/item_1/outro.mp4")

    def test_caminho_no_storage_e_unico(self):
        self.criar_video()
        outro_item = TreinoExercicio.objects.create(
            treino=self.treino, ordem=2, nome="Arremesso livre", objetivo="Precisão",
            fundamento="ARREMESSO", series=2, repeticoes=5,
        )

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.criar_video(item_treino=outro_item)

    def test_tamanho_e_duracao_precisam_ser_positivos(self):
        for campo in ("tamanho_bytes", "duracao_segundos"):
            with self.subTest(campo=campo), self.assertRaises(IntegrityError), transaction.atomic():
                self.criar_video(**{campo: 0})

    @mock.patch("apps.videos.storage.remover")
    def test_excluir_exercicio_do_treino_remove_o_registro_do_video(self, _remover):
        self.criar_video()

        self.item.delete()

        self.assertFalse(VideoExecucao.objects.exists())


@mock.patch("apps.videos.storage.remover")
@mock.patch("apps.videos.storage.gerar_url_leitura", return_value="https://storage.test/ler?token=x")
@mock.patch("apps.videos.storage.obter_info")
@mock.patch("apps.videos.storage.gerar_url_upload", return_value="https://storage.test/enviar?token=x")
class VideoExecucaoApiTests(APITestCase):
    """US42 (RF3501) — Rotas de envio, confirmação e consulta do vídeo de execução.

    O Storage é simulado: os testes verificam as regras do Django, não o Supabase.
    Ordem dos mocks nos testes: upload, info, leitura, remover.
    """

    def setUp(self):
        agora = timezone.now()
        termos = {"versao_termos_aceita": versao_vigente(), "data_aceite_termos": agora}
        self.treinador = Usuario.objects.create_user(
            username="treinador", password="Password123", papel=Usuario.Papel.TREINADOR, **termos
        )
        self.outro_treinador = Usuario.objects.create_user(
            username="outro.treinador", password="Password123", papel=Usuario.Papel.TREINADOR,
            **termos,
        )
        self.aluno = Usuario.objects.create_user(
            username="beatriz", password="Password123", papel=Usuario.Papel.ALUNO,
            treinador=self.treinador, **termos,
        )
        self.outro_aluno = Usuario.objects.create_user(
            username="carlos", password="Password123", papel=Usuario.Papel.ALUNO,
            treinador=self.treinador, **termos,
        )
        planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Finalização"
        )
        self.treino = Treino.objects.create(planejamento=planejamento, nome="Treino A")
        self.item = TreinoExercicio.objects.create(
            treino=self.treino, ordem=1, nome="Bandeja", objetivo="Finalização",
            fundamento="ARREMESSO", series=3, repeticoes=10,
        )
        self.url_upload = reverse("video-execucao-upload-url", kwargs={"item_id": self.item.id})
        self.url_video = reverse("video-execucao", kwargs={"item_id": self.item.id})
        self.arquivo = {
            "nomeArquivo": "bandeja.mp4", "tipo": "video/mp4",
            "tamanhoBytes": 20 * MB, "duracaoSegundos": 42.3,
        }

    # --- Apoio ---

    def solicitar(self, usuario=None, **campos):
        self.client.force_authenticate(user=usuario or self.aluno)
        return self.client.post(self.url_upload, {**self.arquivo, **campos}, format="json")

    def comprovante(self, **campos):
        dados = {"item": self.item.id, "aluno": self.aluno.id,
                 "caminho": "dev/aluno_1/item_1/novo.mp4", "duracao": 43}
        dados.update(campos)
        return signing.dumps(dados, salt=SALT_COMPROVANTE)

    def confirmar(self, comprovante=None, usuario=None):
        self.client.force_authenticate(user=usuario or self.aluno)
        return self.client.post(
            self.url_video, {"comprovante": comprovante or self.comprovante()}, format="json"
        )

    def info(self, tamanho=20 * MB, tipo="video/mp4"):
        return {"size": tamanho, "content_type": tipo}

    def criar_video(self, caminho="dev/aluno_1/item_1/antigo.mp4"):
        return VideoExecucao.objects.create(
            item_treino=self.item, aluno=self.aluno, caminho_storage=caminho,
            formato="video/mp4", tamanho_bytes=10 * MB, duracao_segundos=30,
        )

    # --- Passo 1: pedir o link de envio ---

    def test_aluno_recebe_link_de_envio_e_comprovante(self, upload, *_):
        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["urlUpload"], "https://storage.test/enviar?token=x")
        self.assertEqual(resposta.data["tipoConteudo"], "video/mp4")
        self.assertFalse(resposta.data["substituiVideo"])
        caminho = upload.call_args.args[0]
        self.assertRegex(
            caminho,
            rf"^{settings.SUPABASE_PREFIXO}/aluno_{self.aluno.id}/item_{self.item.id}/[0-9a-f]{{32}}\.mp4$",
        )
        envio = signing.loads(resposta.data["comprovante"], salt=SALT_COMPROVANTE)
        self.assertEqual(envio["caminho"], caminho)
        self.assertEqual(envio["duracao"], 43)  # 42.3 s arredonda para cima

    def test_mov_sem_tipo_informado_usa_quicktime(self, upload, *_):
        resposta = self.solicitar(nomeArquivo="IMG_0001.MOV", tipo="")

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["tipoConteudo"], "video/quicktime")
        self.assertTrue(upload.call_args.args[0].endswith(".mov"))

    def test_ca01_bloqueia_formato_tamanho_e_duracao_invalidos(self, upload, *_):
        casos = {
            "nomeArquivo": {"nomeArquivo": "treino.avi"},
            "tipo": {"tipo": "image/png"},
            "tamanhoBytes": {"tamanhoBytes": settings.VIDEO_MAX_BYTES + 1},
            "duracaoSegundos": {"duracaoSegundos": settings.VIDEO_MAX_SEGUNDOS + 0.5},
        }
        for campo, valores in casos.items():
            with self.subTest(campo=campo):
                resposta = self.solicitar(**valores)

                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertIn(campo, resposta.data)
        upload.assert_not_called()

    def test_ca01_aceita_video_no_limite(self, *_):
        resposta = self.solicitar(
            tamanhoBytes=settings.VIDEO_MAX_BYTES, duracaoSegundos=settings.VIDEO_MAX_SEGUNDOS
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)

    def test_ca05_avisa_que_o_envio_substitui_o_video_atual(self, *_):
        self.criar_video()

        resposta = self.solicitar()

        self.assertTrue(resposta.data["substituiVideo"])

    def test_ca04_so_o_aluno_dono_do_treino_pode_enviar(self, upload, *_):
        for usuario, esperado in (
            (self.outro_aluno, status.HTTP_403_FORBIDDEN),
            (self.treinador, status.HTTP_403_FORBIDDEN),
        ):
            with self.subTest(usuario=usuario.username):
                self.assertEqual(self.solicitar(usuario=usuario).status_code, esperado)
        upload.assert_not_called()

    def test_sem_login_recebe_401(self, *_):
        resposta = self.client.post(self.url_upload, self.arquivo, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_aluno_com_termos_pendentes_recebe_403(self, *_):
        self.aluno.versao_termos_aceita = ""
        self.aluno.save(update_fields=["versao_termos_aceita"])

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(resposta.data["code"], "TERMOS_PENDENTES")

    def test_treino_concluido_nao_recebe_video(self, upload, *_):
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(resposta.data["code"], "TREINO_CONCLUIDO")
        upload.assert_not_called()

    def test_exercicio_inexistente_recebe_404(self, *_):
        self.client.force_authenticate(user=self.aluno)
        url = reverse("video-execucao-upload-url", kwargs={"item_id": 999999})

        resposta = self.client.post(url, self.arquivo, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)

    def test_storage_fora_do_ar_responde_503(self, upload, *_):
        upload.side_effect = storage.ErroArmazenamento("fora do ar")

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(resposta.data["code"], "ARMAZENAMENTO_INDISPONIVEL")

    # --- Passo 3: confirmar o envio ---

    def test_ca04_confirmacao_cria_o_video_com_os_dados_reais_do_storage(self, _upload, info, *_):
        info.return_value = self.info(tamanho=18 * MB, tipo="video/quicktime")

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        video = VideoExecucao.objects.get()
        self.assertEqual(video.item_treino, self.item)
        self.assertEqual(video.aluno, self.aluno)  # dono vem do treino (RN03)
        self.assertEqual(video.caminho_storage, "dev/aluno_1/item_1/novo.mp4")
        self.assertEqual(video.tamanho_bytes, 18 * MB)  # tamanho real, não o informado
        self.assertEqual(video.formato, "video/quicktime")
        self.assertEqual(video.duracao_segundos, 43)
        self.assertEqual(resposta.data["exercicioId"], self.item.id)

    def test_comprovante_adulterado_de_outro_item_ou_de_outro_aluno_e_recusado(self, _u, info, *_):
        casos = {
            "adulterado": self.comprovante() + "x",
            "outro item": self.comprovante(item=self.item.id + 1),
            "outro aluno": self.comprovante(aluno=self.outro_aluno.id),
        }
        for nome, comprovante in casos.items():
            with self.subTest(caso=nome):
                resposta = self.confirmar(comprovante)

                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(resposta.data["code"], "COMPROVANTE_INVALIDO")
        info.assert_not_called()
        self.assertFalse(VideoExecucao.objects.exists())

    def test_comprovante_vencido_e_recusado(self, _u, info, *_):
        duas_horas_e_um_minuto_atras = timezone.now().timestamp() - storage.VALIDADE_UPLOAD_SEGUNDOS - 60
        with mock.patch("django.core.signing.time.time", return_value=duas_horas_e_um_minuto_atras):
            comprovante = self.comprovante()

        resposta = self.confirmar(comprovante)

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resposta.data["code"], "COMPROVANTE_INVALIDO")

    def test_confirmar_sem_o_arquivo_no_storage_e_recusado(self, _u, info, *_):
        info.return_value = None

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resposta.data["code"], "ARQUIVO_NAO_ENCONTRADO")
        self.assertFalse(VideoExecucao.objects.exists())

    def test_rnf13_arquivo_real_fora_dos_limites_e_apagado_e_recusado(self, _u, info, _l, remover):
        for arquivo in (
            self.info(tamanho=settings.VIDEO_MAX_BYTES + 1),
            self.info(tipo="image/png"),
        ):
            with self.subTest(arquivo=arquivo):
                remover.reset_mock()
                info.return_value = arquivo

                resposta = self.confirmar()

                self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
                self.assertEqual(resposta.data["code"], "ARQUIVO_INVALIDO")
                remover.assert_called_once_with("dev/aluno_1/item_1/novo.mp4")
        self.assertFalse(VideoExecucao.objects.exists())

    def test_ca05_novo_envio_substitui_o_video_e_apaga_o_antigo(self, _u, info, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/antigo.mp4")
        info.return_value = self.info()

        with self.captureOnCommitCallbacks(execute=True):
            resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        video = VideoExecucao.objects.get()
        self.assertEqual(video.caminho_storage, "dev/aluno_1/item_1/novo.mp4")
        self.assertTrue(video.foi_substituido)
        self.assertTrue(resposta.data["substituido"])
        remover.assert_called_once_with("dev/aluno_1/item_1/antigo.mp4")

    def test_confirmar_duas_vezes_o_mesmo_envio_nao_duplica_nem_apaga(self, _u, info, _l, remover):
        info.return_value = self.info()
        comprovante = self.comprovante()
        self.confirmar(comprovante)

        with self.captureOnCommitCallbacks(execute=True):
            resposta = self.confirmar(comprovante)

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(VideoExecucao.objects.count(), 1)
        remover.assert_not_called()

    def test_confirmar_em_treino_concluido_apaga_o_arquivo_e_recusa(self, _u, info, _l, remover):
        info.return_value = self.info()
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        remover.assert_called_once_with("dev/aluno_1/item_1/novo.mp4")
        self.assertFalse(VideoExecucao.objects.exists())

    def test_treinador_nao_confirma_envio(self, _u, info, *_):
        resposta = self.confirmar(usuario=self.treinador)

        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        info.assert_not_called()

    # --- Passo 4: assistir ---

    def test_ca04_aluno_dono_e_treinador_da_carteira_assistem(self, _u, _i, leitura, _r):
        video = self.criar_video()
        for usuario in (self.aluno, self.treinador):
            with self.subTest(usuario=usuario.username):
                self.client.force_authenticate(user=usuario)

                resposta = self.client.get(self.url_video)

                self.assertEqual(resposta.status_code, status.HTTP_200_OK)
                self.assertEqual(resposta.data["urlVisualizacao"], "https://storage.test/ler?token=x")
                self.assertEqual(resposta.data["validadeSegundos"], storage.VALIDADE_LEITURA_SEGUNDOS)
        leitura.assert_called_with(video.caminho_storage)

    def test_ca04_outro_aluno_e_outro_treinador_recebem_403(self, _u, _i, leitura, _r):
        self.criar_video()
        for usuario in (self.outro_aluno, self.outro_treinador):
            with self.subTest(usuario=usuario.username):
                self.client.force_authenticate(user=usuario)

                resposta = self.client.get(self.url_video)

                self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        leitura.assert_not_called()

    def test_exercicio_sem_video_responde_404(self, *_):
        self.client.force_authenticate(user=self.aluno)

        resposta = self.client.get(self.url_video)

        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(resposta.data["code"], "VIDEO_NAO_ENCONTRADO")

    # --- Detalhe do treino e faxina do Storage ---

    def test_detalhe_do_treino_informa_o_video_sem_gerar_link(self, _u, _i, leitura, _r):
        self.criar_video()
        self.client.force_authenticate(user=self.aluno)

        resposta = self.client.get(reverse("treino-detalhe", kwargs={"treino_id": self.treino.id}))

        exercicio = resposta.data["exercicios"][0]
        self.assertEqual(exercicio["videoExecucao"]["duracaoSegundos"], 30)
        self.assertNotIn("urlVisualizacao", exercicio["videoExecucao"])
        leitura.assert_not_called()

    def test_detalhe_do_treino_sem_video_traz_null(self, *_):
        self.client.force_authenticate(user=self.aluno)

        resposta = self.client.get(reverse("treino-detalhe", kwargs={"treino_id": self.treino.id}))

        self.assertIsNone(resposta.data["exercicios"][0]["videoExecucao"])

    def test_rn05_apagar_o_exercicio_apaga_o_arquivo_do_storage(self, _u, _i, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/x.mp4")

        with self.captureOnCommitCallbacks(execute=True):
            self.item.delete()

        remover.assert_called_once_with("dev/aluno_1/item_1/x.mp4")

    def test_rn05_excluir_a_conta_do_aluno_apaga_o_arquivo_do_storage(self, _u, _i, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/y.mp4")

        with self.captureOnCommitCallbacks(execute=True):
            self.aluno.delete()

        remover.assert_called_once_with("dev/aluno_1/item_1/y.mp4")

    def test_falha_do_storage_na_faxina_nao_impede_a_exclusao(self, _u, _i, _l, remover):
        remover.side_effect = storage.ErroArmazenamento("fora do ar")
        self.criar_video()

        # assertLogs por fora: a faxina roda quando o captureOnCommitCallbacks termina.
        with self.assertLogs("apps.videos.signals", "ERROR"), self.captureOnCommitCallbacks(execute=True):
            self.item.delete()

        self.assertFalse(VideoExecucao.objects.exists())
