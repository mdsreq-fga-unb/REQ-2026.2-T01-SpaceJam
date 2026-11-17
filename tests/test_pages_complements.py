import importlib.util
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('catalog_context', ROOT / 'hooks/catalog_context.py')
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)


class ClassificationPresentationTests(unittest.TestCase):
    def test_classification_colors_preserve_existing_text_and_mvp(self):
        for category, color in [('Usabilidade', 'usabilidade'),
                                ('Segurança (Privacidade / LGPD)', 'seguranca'),
                                ('Confiabilidade / Segurança', 'confiabilidade'),
                                ('Requisitos de Implementação', 'implementacao')]:
            with self.subTest(category=category):
                fields = {'Categoria': category, 'MVP': 'Obrigatório', 'Descrição': 'Texto mantido.'}
                result = api.render_rnf_record('RNF01 · Nome mantido', 'rnf01', fields)
                self.assertIn('sj-classification sj-class-' + color, result)
                self.assertIn('>' + category + '</span>', result)
                self.assertIn('MVP: Obrigatório</span>', result)
                self.assertIn('Texto mantido.', result)
                self.assertIn('id="rnf01"', result)

    def test_unknown_classification_keeps_its_text(self):
        result = api.render_rnf_record('RNF01 · Nome', 'rnf01', {'Categoria': 'Nova categoria', 'Descrição': 'Texto'})
        self.assertIn('sj-class-neutra', result)
        self.assertIn('>Nova categoria</span>', result)

    def test_all_current_classifications_keep_their_canonical_ids(self):
        source = (ROOT / 'docs/requisitos_nao_funcionais.md').read_text(encoding='utf-8')
        rendered = api.render_reference(source, '', '')
        expected = re.findall(r'^\*\*Categoria:\*\* (.+)$', source, re.M)
        self.assertEqual(len(expected), 17)
        self.assertEqual(rendered.count('sj-classification'), 17)
        for category in expected:
            self.assertIn('>' + category + '</span>', rendered)
        for key in re.findall(r'^## RNF\d+ .*?\{#(rnf\d+)\}', source, re.M):
            self.assertEqual(rendered.count('id="' + key + '"'), 1)


if __name__ == '__main__':
    unittest.main()
