from django.db import IntegrityError, transaction
from django.test import TestCase

from apps.contas.models import Usuario
from apps.treinos.models import Planejamento, Treino, TreinoExercicio

from .models import VideoExecucao


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
            "tamanho_bytes": 10 * 1024 * 1024,
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

    def test_excluir_exercicio_do_treino_remove_o_registro_do_video(self):
        self.criar_video()

        self.item.delete()

        self.assertFalse(VideoExecucao.objects.exists())
