from datetime import timedelta
from io import StringIO
from unittest import mock

import httpx
from django.conf import settings
from django.core import signing
from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.db import IntegrityError, transaction
from django.test import SimpleTestCase, TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.contas.models import Usuario
from apps.contas.termos import versao_vigente
from apps.treinos.models import Planejamento, Treino, TreinoExercicio

from . import midia, storage
from .models import FeedbackTreinador, VideoExecucao
from .views import SALT_COMPROVANTE

MB = 1024 * 1024


# --- Montagem de MP4/MOV de teste (só a estrutura de caixas, sem vídeo de verdade) ---


def caixa(tipo: bytes, corpo: bytes = b"", *, grande=False) -> bytes:
    if grande:  # tamanho em 64 bits (largesize)
        return (1).to_bytes(4, "big") + tipo + (16 + len(corpo)).to_bytes(8, "big") + corpo
    return (8 + len(corpo)).to_bytes(4, "big") + tipo + corpo


def mvhd(escala: int, duracao: int, versao: int = 0) -> bytes:
    if versao == 1:
        corpo = bytes([1, 0, 0, 0]) + bytes(16) + escala.to_bytes(4, "big") + duracao.to_bytes(8, "big")
    else:
        corpo = bytes(4) + bytes(8) + escala.to_bytes(4, "big") + duracao.to_bytes(4, "big")
    return caixa(b"mvhd", corpo + bytes(80))


def video_mp4(segundos: float, *, moov_no_fim=False, versao=0, marca=b"isom") -> bytes:
    ftyp = caixa(b"ftyp", marca + bytes(4) + marca)
    moov = caixa(b"moov", mvhd(1000, round(segundos * 1000), versao) + caixa(b"trak", bytes(40)))
    mdat = caixa(b"mdat", bytes(2000))
    return ftyp + (mdat + moov if moov_no_fim else moov + mdat)


def ler_bytes(dados: bytes):
    """Leitor em memória, que conta quantos bytes foram pedidos."""
    pedidos = []

    def leitor(inicio, tamanho):
        pedidos.append(tamanho)
        return dados[inicio:inicio + tamanho]

    return leitor, pedidos


class MidiaDuracaoTests(SimpleTestCase):
    """RNF13 / RNF06 — Duração lida no cabeçalho do próprio arquivo."""

    def duracao(self, dados):
        leitor, _ = ler_bytes(dados)
        return midia.ler_duracao(leitor, len(dados))

    def test_le_duracao_de_mp4_e_mov(self):
        self.assertAlmostEqual(self.duracao(video_mp4(42.5)), 42.5)
        self.assertAlmostEqual(self.duracao(video_mp4(59.97, marca=b"qt  ")), 59.97)

    def test_le_moov_depois_do_video_sem_baixar_o_mdat(self):
        dados = video_mp4(30, moov_no_fim=True)
        leitor, pedidos = ler_bytes(dados)

        self.assertAlmostEqual(midia.ler_duracao(leitor, len(dados)), 30)
        self.assertLess(sum(pedidos), 400)  # o mdat (2000 bytes) nunca é lido

    def test_mvhd_versao_1_e_caixa_de_64_bits(self):
        dados = caixa(b"ftyp", b"isom" + bytes(4)) + caixa(b"mdat", bytes(100), grande=True)
        dados += caixa(b"moov", mvhd(600, 600 * 61, versao=1))

        self.assertAlmostEqual(self.duracao(dados), 61)

    def test_mp4_fragmentado_usa_a_duracao_do_mehd(self):
        mehd = caixa(b"mehd", bytes(4) + (45_000).to_bytes(4, "big"))
        moov = caixa(b"moov", mvhd(1000, 0) + caixa(b"mvex", mehd))
        dados = caixa(b"ftyp", b"iso6" + bytes(4)) + moov

        self.assertAlmostEqual(self.duracao(dados), 45)

    def test_recusa_arquivos_que_nao_sao_mp4_mov(self):
        casos = {
            "avi renomeado": b"RIFF" + bytes(4) + b"AVI LIST" + bytes(200),
            "sem moov": caixa(b"ftyp", b"isom" + bytes(4)) + caixa(b"mdat", bytes(100)),
            "truncado": video_mp4(10, moov_no_fim=True)[:-50],
            "sem duração": caixa(b"ftyp", b"isom" + bytes(4)) + caixa(b"moov", mvhd(1000, 0)),
            "escala zero": caixa(b"ftyp", b"isom" + bytes(4)) + caixa(b"moov", mvhd(0, 1000)),
            "lixo": bytes(64),
        }
        for nome, dados in casos.items():
            with self.subTest(caso=nome), self.assertRaises(midia.ArquivoIlegivel):
                self.duracao(dados)


class StorageLerDuracaoTests(SimpleTestCase):
    """RNF13 — Leitura por trechos (Range) do arquivo no Storage."""

    def cliente_falso(self, dados, *, aceita_range=True, status_erro=None):
        chamadas = []

        def responder(request):
            chamadas.append(request.headers.get("Range"))
            if status_erro:
                return httpx.Response(status_erro)
            if not aceita_range:
                return httpx.Response(200, content=dados)
            inicio, fim = map(int, request.headers["Range"].removeprefix("bytes=").split("-"))
            return httpx.Response(206, content=dados[inicio:fim + 1])

        cliente_real = httpx.Client
        fabrica = lambda **kw: cliente_real(transport=httpx.MockTransport(responder), **kw)  # noqa: E731
        return fabrica, chamadas

    def ler(self, dados, **opcoes):
        fabrica, chamadas = self.cliente_falso(dados, **opcoes)
        with mock.patch.object(storage, "gerar_url_leitura", return_value="https://storage.test/v"), \
                mock.patch.object(storage.httpx, "Client", side_effect=fabrica):
            return storage.ler_duracao("dev/x.mp4", len(dados)), chamadas

    def test_le_so_os_trechos_necessarios(self):
        duracao, chamadas = self.ler(video_mp4(42, moov_no_fim=True))

        self.assertAlmostEqual(duracao, 42)
        self.assertTrue(all(c.startswith("bytes=") for c in chamadas))

    def test_storage_sem_range_baixa_uma_vez_so(self):
        duracao, chamadas = self.ler(video_mp4(20), aceita_range=False)

        self.assertAlmostEqual(duracao, 20)
        self.assertEqual(len(chamadas), 1)

    def test_erro_do_storage_vira_erro_de_armazenamento(self):
        with self.assertRaises(storage.ErroArmazenamento):
            self.ler(video_mp4(20), status_erro=500)


class BaseVideo:
    """Usuários, treino e exercício de apoio."""

    def criar_cenario(self):
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
        self.planejamento = Planejamento.objects.create(
            aluno=self.aluno, treinador=self.treinador, nome="Finalização"
        )
        self.treino = Treino.objects.create(planejamento=self.planejamento, nome="Treino A")
        self.item = TreinoExercicio.objects.create(
            treino=self.treino, ordem=1, nome="Bandeja", objetivo="Finalização",
            fundamento="ARREMESSO", series=3, repeticoes=10,
        )

    def criar_video(self, caminho="dev/aluno_1/item_1/antigo.mp4", item=None, tentativa=1, aluno=None):
        return VideoExecucao.objects.create(
            item_treino=item or self.item, aluno=aluno or self.aluno, caminho_storage=caminho,
            formato="video/mp4", tamanho_bytes=10 * MB, duracao_segundos=30, tentativa=tentativa,
        )

    def avaliar(self, video, texto="Cotovelo alinhado, boa finalização."):
        return FeedbackTreinador.objects.create(video=video, treinador=self.treinador, texto=texto)


class VideoExecucaoModelTests(BaseVideo, TestCase):
    """US42 (RF3501) — Regras guardadas pelo próprio banco para o vídeo de execução."""

    def setUp(self):
        self.criar_cenario()

    def test_video_fica_vinculado_ao_exercicio_do_treino(self):
        video = self.criar_video()

        self.assertEqual(self.item.videos.get(), video)
        self.assertEqual(self.aluno.videos_execucao.get(), video)
        self.assertFalse(video.foi_substituido)
        self.assertFalse(video.foi_avaliado)

    def test_rn09_um_unico_video_por_tentativa(self):
        self.criar_video()

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.criar_video(caminho="dev/aluno_1/item_1/outro.mp4")

    def test_rn09_nova_tentativa_guarda_a_anterior(self):
        self.criar_video(caminho="dev/a/1.mp4")
        self.criar_video(caminho="dev/a/2.mp4", tentativa=2)

        self.assertEqual(self.item.videos.count(), 2)

    def test_caminho_no_storage_e_unico(self):
        self.criar_video()
        outro_item = TreinoExercicio.objects.create(
            treino=self.treino, ordem=2, nome="Arremesso livre", objetivo="Precisão",
            fundamento="ARREMESSO", series=2, repeticoes=5,
        )

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.criar_video(item=outro_item)

    def test_tamanho_duracao_e_tentativa_precisam_ser_positivos(self):
        for campo in ("tamanho_bytes", "duracao_segundos", "tentativa"):
            with self.subTest(campo=campo), self.assertRaises(IntegrityError), transaction.atomic():
                video = VideoExecucao(
                    item_treino=self.item, aluno=self.aluno, caminho_storage=f"dev/{campo}.mp4",
                    formato="video/mp4", tamanho_bytes=MB, duracao_segundos=10, tentativa=1,
                )
                setattr(video, campo, 0)
                video.save()

    def test_rn10_feedback_do_treinador_marca_o_video_como_avaliado(self):
        video = self.criar_video()
        self.avaliar(video)

        video = VideoExecucao.objects.select_related("feedback_treinador").get()
        self.assertTrue(video.foi_avaliado)
        self.assertEqual(video.feedback.treinador, self.treinador)

    def test_rn10_um_feedback_por_video(self):
        video = self.criar_video()
        self.avaliar(video)

        with self.assertRaises(IntegrityError), transaction.atomic():
            self.avaliar(video, "Outro")

    def test_feedback_exige_texto_e_treinador_da_carteira(self):
        video = self.criar_video()
        casos = {
            "texto": FeedbackTreinador(video=video, treinador=self.treinador, texto="   "),
            "treinador": FeedbackTreinador(video=video, treinador=self.outro_treinador, texto="Ok"),
        }
        for campo, feedback in casos.items():
            with self.subTest(campo=campo), self.assertRaises(ValidationError) as erro:
                feedback.full_clean()
            self.assertIn(campo, erro.exception.message_dict)

    @mock.patch("apps.videos.storage.remover")
    def test_excluir_exercicio_do_treino_remove_videos_e_feedbacks(self, _remover):
        self.avaliar(self.criar_video())

        self.item.delete()

        self.assertFalse(VideoExecucao.objects.exists())
        self.assertFalse(FeedbackTreinador.objects.exists())


@mock.patch("apps.videos.storage.remover")
@mock.patch("apps.videos.storage.gerar_url_leitura", return_value="https://storage.test/ler?token=x")
@mock.patch("apps.videos.storage.obter_info")
@mock.patch("apps.videos.storage.gerar_url_upload", return_value="https://storage.test/enviar?token=x")
class VideoExecucaoApiTests(BaseVideo, APITestCase):
    """US42 (RF3501) — Rotas de envio, confirmação e consulta do vídeo de execução.

    O Storage é simulado: os testes verificam as regras do Django, não o Supabase.
    Ordem dos mocks nos testes: upload, info, leitura, remover. A duração real do
    arquivo (`storage.ler_duracao`) fica em `self.duracao_real` (42,4 s por padrão).
    """

    def setUp(self):
        self.criar_cenario()
        patcher = mock.patch("apps.videos.storage.ler_duracao", return_value=42.4)
        self.duracao_real = patcher.start()
        self.addCleanup(patcher.stop)
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
        dados = {"item": self.item.id, "aluno": self.aluno.id, "caminho": "dev/aluno_1/item_1/novo.mp4"}
        dados.update(campos)
        return signing.dumps(dados, salt=SALT_COMPROVANTE)

    def confirmar(self, comprovante=None, usuario=None):
        self.client.force_authenticate(user=usuario or self.aluno)
        return self.client.post(
            self.url_video, {"comprovante": comprovante or self.comprovante()}, format="json"
        )

    def info(self, tamanho=20 * MB, tipo="video/mp4"):
        return {"size": tamanho, "content_type": tipo}

    def devolver_exercicio(self):
        self.item.status = TreinoExercicio.Status.CORRIGIR
        self.item.save(update_fields=["status"])

    # --- Passo 1: pedir o link de envio ---

    def test_aluno_recebe_link_de_envio_e_comprovante(self, upload, *_):
        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["urlUpload"], "https://storage.test/enviar?token=x")
        self.assertEqual(resposta.data["tipoConteudo"], "video/mp4")
        self.assertEqual(resposta.data["modo"], "NOVO")
        self.assertFalse(resposta.data["substituiVideo"])
        caminho = upload.call_args.args[0]
        self.assertRegex(
            caminho,
            rf"^{settings.SUPABASE_PREFIXO}/aluno_{self.aluno.id}/item_{self.item.id}/[0-9a-f]{{32}}\.mp4$",
        )
        envio = signing.loads(resposta.data["comprovante"], salt=SALT_COMPROVANTE)
        self.assertEqual(envio["caminho"], caminho)

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
                self.assertEqual(resposta.data["code"], "ARQUIVO_INVALIDO")
                self.assertIn(campo, resposta.data["campos"])
                self.assertEqual(resposta.data["detail"], resposta.data["campos"][campo][0])
        upload.assert_not_called()

    def test_limite_de_tamanho_e_50_mb(self, *_):
        self.assertEqual(settings.VIDEO_MAX_BYTES, 50 * MB)

        resposta = self.solicitar(tamanhoBytes=50 * MB + 1)

        self.assertIn("50 MB", resposta.data["detail"])

    def test_ca01_aceita_video_no_limite(self, *_):
        resposta = self.solicitar(
            tamanhoBytes=settings.VIDEO_MAX_BYTES, duracaoSegundos=settings.VIDEO_MAX_SEGUNDOS
        )

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)

    def test_ca05_avisa_que_o_envio_substitui_o_video_atual(self, *_):
        self.criar_video()

        resposta = self.solicitar()

        self.assertEqual(resposta.data["modo"], "SUBSTITUICAO")
        self.assertTrue(resposta.data["substituiVideo"])

    def test_rn10_video_avaliado_nao_pode_ser_substituido(self, upload, *_):
        self.avaliar(self.criar_video())

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(resposta.data["code"], "VIDEO_AVALIADO")
        upload.assert_not_called()

    def test_rn09_rn06_exercicio_devolvido_abre_nova_tentativa(self, *_):
        self.avaliar(self.criar_video())
        self.devolver_exercicio()

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["modo"], "NOVA_TENTATIVA")
        self.assertFalse(resposta.data["substituiVideo"])

    def test_rn06_treino_devolvido_tambem_abre_nova_tentativa(self, *_):
        self.avaliar(self.criar_video())
        self.treino.status = Treino.Status.CORRIGIR_REFAZER
        self.treino.save(update_fields=["status"])

        self.assertEqual(self.solicitar().data["modo"], "NOVA_TENTATIVA")

    def test_rn06_exercicio_validado_nao_recebe_video(self, upload, *_):
        self.item.status = TreinoExercicio.Status.CONCLUIDO
        self.item.save(update_fields=["status"])

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(resposta.data["code"], "EXERCICIO_CONCLUIDO")
        upload.assert_not_called()

    def test_ca04_so_o_aluno_dono_do_treino_pode_enviar(self, upload, *_):
        for usuario in (self.outro_aluno, self.treinador):
            with self.subTest(usuario=usuario.username):
                resposta = self.solicitar(usuario=usuario)

                self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
                self.assertEqual(resposta.data["code"], "SEM_PERMISSAO")
        upload.assert_not_called()

    def test_sem_login_recebe_401_com_codigo(self, *_):
        resposta = self.client.post(self.url_upload, self.arquivo, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(resposta.data["code"], "NAO_AUTENTICADO")

    def test_rn15_aluno_com_termos_pendentes_recebe_403(self, *_):
        self.aluno.versao_termos_aceita = ""
        self.aluno.save(update_fields=["versao_termos_aceita"])

        for resposta in (self.solicitar(), self.client.get(reverse("meus-videos"))):
            with self.subTest(rota=resposta.wsgi_request.path):
                self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
                self.assertEqual(resposta.data["code"], "TERMOS_PENDENTES")

    def test_treino_concluido_nao_recebe_video(self, upload, *_):
        self.treino.status = Treino.Status.CONCLUIDO
        self.treino.save(update_fields=["status"])

        resposta = self.solicitar()

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(resposta.data["code"], "TREINO_CONCLUIDO")
        upload.assert_not_called()

    def test_exercicio_inexistente_recebe_404_com_codigo(self, *_):
        self.client.force_authenticate(user=self.aluno)
        url = reverse("video-execucao-upload-url", kwargs={"item_id": 999999})

        resposta = self.client.post(url, self.arquivo, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(resposta.data["code"], "NAO_ENCONTRADO")

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
        self.assertEqual(resposta.data["modo"], "NOVO")
        video = VideoExecucao.objects.get()
        self.assertEqual(video.item_treino, self.item)
        self.assertEqual(video.tentativa, 1)
        self.assertEqual(video.aluno, self.aluno)  # dono vem do treino (RN03)
        self.assertEqual(video.caminho_storage, "dev/aluno_1/item_1/novo.mp4")
        self.assertEqual(video.tamanho_bytes, 18 * MB)  # tamanho real, não o informado
        self.assertEqual(video.formato, "video/quicktime")
        self.assertEqual(video.duracao_segundos, 43)  # 42,4 s lidos no arquivo, para cima
        self.assertEqual(resposta.data["exercicioId"], self.item.id)
        self.assertEqual(resposta.data["status"], "AGUARDANDO_AVALIACAO")
        self.duracao_real.assert_called_once_with("dev/aluno_1/item_1/novo.mp4", 18 * MB)

    def test_confirmacao_sem_comprovante_e_recusada_com_codigo(self, _u, info, *_):
        self.client.force_authenticate(user=self.aluno)

        resposta = self.client.post(self.url_video, {}, format="json")

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resposta.data["code"], "COMPROVANTE_INVALIDO")

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

    def test_rnf13_duracao_real_acima_de_60s_e_recusada_mesmo_se_o_app_mentir(self, _u, info, _l, remover):
        info.return_value = self.info()
        self.duracao_real.return_value = 61.2

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resposta.data["code"], "ARQUIVO_INVALIDO")
        self.assertIn("60 segundos", resposta.data["detail"])
        remover.assert_called_once_with("dev/aluno_1/item_1/novo.mp4")
        self.assertFalse(VideoExecucao.objects.exists())

    def test_rnf13_aceita_duracao_real_no_limite(self, _u, info, *_):
        info.return_value = self.info()
        self.duracao_real.return_value = 59.97

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VideoExecucao.objects.get().duracao_segundos, 60)

    def test_rnf06_arquivo_que_nao_e_mp4_mov_e_recusado(self, _u, info, _l, remover):
        info.return_value = self.info()
        self.duracao_real.side_effect = midia.ArquivoIlegivel("não é MP4")

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(resposta.data["code"], "ARQUIVO_INVALIDO")
        remover.assert_called_once_with("dev/aluno_1/item_1/novo.mp4")

    def test_falha_ao_ler_a_duracao_responde_503_sem_apagar(self, _u, info, _l, remover):
        info.return_value = self.info()
        self.duracao_real.side_effect = storage.ErroArmazenamento("fora do ar")

        resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        remover.assert_not_called()  # o app pode tentar confirmar de novo com o mesmo comprovante

    def test_ca05_novo_envio_substitui_o_video_e_apaga_o_antigo(self, _u, info, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/antigo.mp4")
        info.return_value = self.info()

        with self.captureOnCommitCallbacks(execute=True):
            resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        self.assertEqual(resposta.data["modo"], "SUBSTITUICAO")
        video = VideoExecucao.objects.get()
        self.assertEqual(video.caminho_storage, "dev/aluno_1/item_1/novo.mp4")
        self.assertEqual(video.tentativa, 1)
        self.assertTrue(video.foi_substituido)
        self.assertTrue(resposta.data["substituido"])
        remover.assert_called_once_with("dev/aluno_1/item_1/antigo.mp4")

    def test_rn10_treinador_avalia_durante_o_envio_e_a_troca_e_recusada(self, _u, info, _l, remover):
        antigo = self.criar_video(caminho="dev/aluno_1/item_1/antigo.mp4")
        comprovante = self.comprovante()  # pedido antes da avaliação
        self.avaliar(antigo)
        info.return_value = self.info()

        with self.captureOnCommitCallbacks(execute=True):
            resposta = self.confirmar(comprovante)

        self.assertEqual(resposta.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(resposta.data["code"], "VIDEO_AVALIADO")
        remover.assert_called_once_with("dev/aluno_1/item_1/novo.mp4")  # só o novo sai
        self.assertEqual(VideoExecucao.objects.get().caminho_storage, "dev/aluno_1/item_1/antigo.mp4")

    def test_rn09_nova_tentativa_mantem_o_video_avaliado_no_historico(self, _u, info, _l, remover):
        antigo = self.criar_video(caminho="dev/aluno_1/item_1/antigo.mp4")
        self.avaliar(antigo)
        self.devolver_exercicio()
        info.return_value = self.info()

        with self.captureOnCommitCallbacks(execute=True):
            resposta = self.confirmar()

        self.assertEqual(resposta.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resposta.data["modo"], "NOVA_TENTATIVA")
        self.assertEqual(resposta.data["tentativa"], 2)
        self.assertEqual(self.item.videos.count(), 2)
        antigo.refresh_from_db()
        self.assertTrue(antigo.foi_avaliado)
        remover.assert_not_called()

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

    def test_consulta_traz_o_video_atual_ou_a_tentativa_pedida(self, _u, _i, leitura, _r):
        primeiro = self.criar_video(caminho="dev/a/1.mp4")
        self.avaliar(primeiro)
        self.criar_video(caminho="dev/a/2.mp4", tentativa=2)
        self.client.force_authenticate(user=self.aluno)

        atual = self.client.get(self.url_video)
        anterior = self.client.get(self.url_video, {"tentativa": 1})

        self.assertEqual(atual.data["tentativa"], 2)
        self.assertEqual(atual.data["status"], "AGUARDANDO_AVALIACAO")
        self.assertEqual(anterior.data["tentativa"], 1)
        self.assertEqual(anterior.data["status"], "AVALIADO")
        self.assertEqual(anterior.data["feedbackTreinador"]["texto"], "Cotovelo alinhado, boa finalização.")

    def test_exercicio_sem_video_responde_404(self, *_):
        self.client.force_authenticate(user=self.aluno)

        for parametros in ({}, {"tentativa": 7}, {"tentativa": "x"}):
            with self.subTest(parametros=parametros):
                resposta = self.client.get(self.url_video, parametros)

                self.assertEqual(resposta.status_code, status.HTTP_404_NOT_FOUND)
                self.assertEqual(resposta.data["code"], "VIDEO_NAO_ENCONTRADO")

    # --- Detalhe do treino e faxina do Storage ---

    def detalhe_exercicio(self):
        self.client.force_authenticate(user=self.aluno)
        resposta = self.client.get(reverse("treino-detalhe", kwargs={"treino_id": self.treino.id}))
        return resposta.data["exercicios"][0]

    def test_detalhe_do_treino_informa_o_video_sem_gerar_link(self, _u, _i, leitura, _r):
        self.criar_video()

        exercicio = self.detalhe_exercicio()

        self.assertEqual(exercicio["videoExecucao"]["duracaoSegundos"], 30)
        self.assertNotIn("urlVisualizacao", exercicio["videoExecucao"])
        leitura.assert_not_called()

    def test_detalhe_do_treino_sem_video_traz_null_e_oferece_envio(self, *_):
        exercicio = self.detalhe_exercicio()

        self.assertIsNone(exercicio["videoExecucao"])
        self.assertEqual(exercicio["envioVideo"], {"permitido": True, "modo": "NOVO", "motivo": None})

    def test_ca05_detalhe_do_treino_diz_o_que_a_tela_pode_oferecer(self, *_):
        video = self.criar_video()
        self.assertEqual(self.detalhe_exercicio()["envioVideo"]["modo"], "SUBSTITUICAO")

        self.avaliar(video)
        self.assertEqual(
            self.detalhe_exercicio()["envioVideo"],
            {"permitido": False, "modo": None, "motivo": "VIDEO_AVALIADO"},
        )

        self.devolver_exercicio()
        self.assertEqual(self.detalhe_exercicio()["envioVideo"]["modo"], "NOVA_TENTATIVA")

    def test_detalhe_do_treino_mostra_a_ultima_tentativa(self, *_):
        self.avaliar(self.criar_video(caminho="dev/a/1.mp4"))
        self.criar_video(caminho="dev/a/2.mp4", tentativa=2)

        self.assertEqual(self.detalhe_exercicio()["videoExecucao"]["tentativa"], 2)

    def test_rn05_apagar_o_exercicio_apaga_o_arquivo_do_storage(self, _u, _i, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/x.mp4")

        with self.captureOnCommitCallbacks(execute=True):
            self.item.delete()

        remover.assert_called_once_with("dev/aluno_1/item_1/x.mp4")

    def test_rn05_excluir_a_conta_do_aluno_apaga_todas_as_tentativas_do_storage(self, _u, _i, _l, remover):
        self.criar_video(caminho="dev/aluno_1/item_1/y.mp4")
        self.criar_video(caminho="dev/aluno_1/item_1/z.mp4", tentativa=2)

        with self.captureOnCommitCallbacks(execute=True):
            self.aluno.delete()

        self.assertEqual(
            sorted(c.args[0] for c in remover.call_args_list),
            ["dev/aluno_1/item_1/y.mp4", "dev/aluno_1/item_1/z.mp4"],
        )

    def test_falha_do_storage_na_faxina_nao_impede_a_exclusao(self, _u, _i, _l, remover):
        remover.side_effect = storage.ErroArmazenamento("fora do ar")
        self.criar_video()

        # assertLogs por fora: a faxina roda quando o captureOnCommitCallbacks termina.
        with self.assertLogs("apps.videos.signals", "ERROR"), self.captureOnCommitCallbacks(execute=True):
            self.item.delete()

        self.assertFalse(VideoExecucao.objects.exists())


class MeusVideosApiTests(BaseVideo, APITestCase):
    """US42 — "Meus vídeos": o aluno acompanha e controla os próprios envios."""

    def setUp(self):
        self.criar_cenario()
        self.url = reverse("meus-videos")
        self.treino_b = Treino.objects.create(planejamento=self.planejamento, nome="Treino B")
        self.item_b = TreinoExercicio.objects.create(
            treino=self.treino_b, ordem=1, nome="Arremesso em suspensão", objetivo="Precisão",
            fundamento="ARREMESSO", series=3, repeticoes=8,
        )

    def listar(self, usuario=None, **params):
        self.client.force_authenticate(user=usuario or self.aluno)
        return self.client.get(self.url, params)

    def test_lista_os_videos_com_status_treino_e_acoes(self):
        self.criar_video(caminho="dev/a/1.mp4")
        avaliado = self.criar_video(caminho="dev/b/1.mp4", item=self.item_b)
        self.avaliar(avaliado)

        resposta = self.listar()

        self.assertEqual(resposta.status_code, status.HTTP_200_OK)
        por_exercicio = {v["exercicioNome"]: v for v in resposta.data}
        bandeja = por_exercicio["Bandeja"]
        self.assertEqual(bandeja["treinoNome"], "Treino A")
        self.assertEqual(bandeja["status"], "AGUARDANDO_AVALIACAO")
        self.assertTrue(bandeja["atual"])
        self.assertEqual(bandeja["envio"], {"permitido": True, "modo": "SUBSTITUICAO", "motivo": None})
        suspensao = por_exercicio["Arremesso em suspensão"]
        self.assertEqual(suspensao["status"], "AVALIADO")
        self.assertEqual(suspensao["feedbackTreinador"]["texto"], "Cotovelo alinhado, boa finalização.")
        self.assertEqual(suspensao["envio"]["motivo"], "VIDEO_AVALIADO")

    def test_tentativas_anteriores_aparecem_como_historico(self):
        self.avaliar(self.criar_video(caminho="dev/a/1.mp4"))
        self.criar_video(caminho="dev/a/2.mp4", tentativa=2)

        resposta = self.listar()

        por_tentativa = {v["tentativa"]: v for v in resposta.data}
        self.assertTrue(por_tentativa[2]["atual"])
        self.assertIsNotNone(por_tentativa[2]["envio"])
        self.assertFalse(por_tentativa[1]["atual"])
        self.assertIsNone(por_tentativa[1]["envio"])

    def test_filtra_por_treino(self):
        self.criar_video(caminho="dev/a/1.mp4")
        self.criar_video(caminho="dev/b/1.mp4", item=self.item_b)

        resposta = self.listar(treino=self.treino_b.id)

        self.assertEqual([v["treinoId"] for v in resposta.data], [self.treino_b.id])
        self.assertEqual(self.listar(treino="x").data, [])

    def test_rn03_aluno_ve_so_os_proprios_videos(self):
        self.criar_video(caminho="dev/a/1.mp4")
        planejamento = Planejamento.objects.create(
            aluno=self.outro_aluno, treinador=self.treinador, nome="Outro"
        )
        treino = Treino.objects.create(planejamento=planejamento, nome="Treino C")
        item = TreinoExercicio.objects.create(
            treino=treino, ordem=1, nome="Passe", objetivo="Passe", fundamento="PASSE",
            series=1, repeticoes=1,
        )
        self.criar_video(caminho="dev/c/1.mp4", item=item, aluno=self.outro_aluno)

        self.assertEqual(len(self.listar().data), 1)
        self.assertEqual(len(self.listar(usuario=self.outro_aluno).data), 1)

    def test_sem_videos_responde_lista_vazia(self):
        self.assertEqual(self.listar().data, [])

    def test_treinador_nao_usa_meus_videos(self):
        resposta = self.listar(usuario=self.treinador)

        self.assertEqual(resposta.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(resposta.data["code"], "SEM_PERMISSAO")

    def test_lista_sem_uma_consulta_por_video(self):
        for numero in range(5):
            item = TreinoExercicio.objects.create(
                treino=self.treino, ordem=10 + numero, nome=f"Ex {numero}", objetivo="x",
                fundamento="DRIBLE", series=1, repeticoes=1,
            )
            self.avaliar(self.criar_video(caminho=f"dev/n/{numero}.mp4", item=item))
        self.client.force_authenticate(user=self.aluno)

        with self.assertNumQueries(1):
            self.client.get(self.url)


class LimparVideosOrfaosTests(BaseVideo, TestCase):
    """RNF15 — Envios que nunca foram confirmados não ficam guardados no Storage."""

    def setUp(self):
        self.criar_cenario()
        self.criar_video(caminho="dev/aluno_1/item_1/confirmado.mp4")
        antigo = timezone.now() - timedelta(hours=3)
        recente = timezone.now() - timedelta(minutes=5)
        self.arquivos = [
            ("dev/aluno_1/item_1/confirmado.mp4", antigo),
            ("dev/aluno_1/item_1/orfao.mp4", antigo),
            ("dev/aluno_1/item_1/enviando-agora.mp4", recente),
        ]

    def rodar(self, *args):
        saida = StringIO()
        with mock.patch("apps.videos.storage.listar_arquivos", return_value=self.arquivos), \
                mock.patch("apps.videos.storage.remover") as remover:
            call_command("limpar_videos_orfaos", *args, stdout=saida)
        return remover, saida.getvalue()

    def test_apaga_so_os_nao_confirmados_com_mais_de_2_horas(self):
        remover, _ = self.rodar()

        remover.assert_called_once_with("dev/aluno_1/item_1/orfao.mp4")

    def test_simulacao_nao_apaga(self):
        remover, saida = self.rodar("--simular")

        remover.assert_not_called()
        self.assertIn("orfao.mp4", saida)
