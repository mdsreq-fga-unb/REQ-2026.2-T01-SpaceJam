from copy import deepcopy
from pathlib import Path
from types import SimpleNamespace
import importlib.util
import json
import re
import unittest

import yaml

ROOT = Path(__file__).resolve().parents[1]
HOOK = ROOT / 'hooks/requirement_status.py'
if HOOK.exists():
    spec = importlib.util.spec_from_file_location('requirement_status', HOOK)
    api = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(api)
else:
    api = None

CARD = ('<details class="sj-requirement" id="rf1103"><summary>'
        '<span class="sj-requirement-id">RF1103</span>'
        '<span class="sj-requirement-tags"><span class="sj-tag">Must Have</span></span>'
        '</summary><div><p>O aluno encerra a sessão.</p></div></details>')


class RequirementStatusTests(unittest.TestCase):
    def setUp(self):
        self.assertIsNotNone(api, 'Hook de status ainda não recuperado')

    def record(self, status='validado', **changes):
        item = {'status': status, 'sha256_ficha': api.card_hash(CARD),
                'evidencia': {'tipo': 'equipe', 'data': '2026-11-16',
                             'origem': 'https://miro.com/app/board/uXjVHrFoSVo=/',
                             'registro': 'Confirmação interna registrada.'}}
        item.update(changes)
        return {'requisitos': {'RF1103': item}}

    def test_team_validation_requires_evidence_and_matching_version(self):
        result = api.render_statuses(CARD, self.record())
        self.assertIn('>Validado pela equipe</span>', result)
        self.assertIn('<span class="sj-tag">Must Have</span>', result)
        self.assertNotIn('Validação do cliente registrada', result)
        with self.assertRaises(ValueError):
            api.render_statuses(CARD, self.record(evidencia=None))
        with self.assertRaises(ValueError):
            api.render_statuses(CARD, self.record(evidencia={'tipo': 'cliente'}))

    def test_changed_card_loses_only_its_validation(self):
        other = CARD.replace('rf1103', 'rf1212')
        data = self.record()
        data['requisitos']['RF1212'] = deepcopy(data['requisitos']['RF1103'])
        data['requisitos']['RF1212']['sha256_ficha'] = api.card_hash(other)
        result = api.render_statuses(CARD.replace('encerra', 'revoga') + other, data)
        self.assertEqual(result.count('>Validado pela equipe</span>'), 1)
        self.assertEqual(result.count('>A validar</span>'), 1)

    def test_refinement_remains_pending_and_unregistered_items_are_not_validated(self):
        record = self.record(status='refinar', evidencia=None, sha256_ficha='old')
        self.assertIn('>Em refinamento</span>', api.render_statuses(CARD, record))
        self.assertIn('>A validar</span>', api.render_statuses(CARD, {'requisitos': {}}))

    def test_unknown_status_is_rejected(self):
        for status in ['cliente', 'implementado', 'aprovado']:
            with self.subTest(status=status), self.assertRaises(ValueError):
                api.render_statuses(CARD, self.record(status=status))

    def test_current_catalog_uses_recorded_states_and_preserves_all_cards(self):
        source = (ROOT / 'docs/requisitos.md').read_text(encoding='utf-8')
        data = json.loads((ROOT / 'docs/arquivos/status-requisitos-2026-11-16.json').read_text(encoding='utf-8'))
        result = api.render_statuses(source, data)
        self.assertEqual(len(api.CARDS.findall(source)), 65)
        for status, count in [('validado', 9), ('refinar', 30), ('validar', 26)]:
            self.assertEqual(result.count('class="sj-badge sj-status-' + status + '"'), count)
        cleaned = re.sub(r'<span class="sj-badge sj-status-[^"]+" title="[^"]+">[^<]+</span>', '', result)
        self.assertEqual(cleaned, source)
        for match in api.CARDS.finditer(source):
            self.assertEqual(data['requisitos'][match[1].upper()]['sha256_ficha'], api.card_hash(match[0]))

    def test_legend_appears_once_and_other_documents_are_unchanged(self):
        source = (ROOT / 'docs/requisitos.md').read_text(encoding='utf-8')
        page = SimpleNamespace(file=SimpleNamespace(src_uri='requisitos.md'))
        result = api.on_page_markdown(source, page, {'docs_dir': ROOT / 'docs'})
        self.assertEqual(result.count('class="sj-status-legend"'), 1)
        self.assertNotIn('sj-status-source', result)
        self.assertNotIn('validacao_requisitos/', result)
        page.file.src_uri = 'dor_dod.md'
        self.assertEqual(api.on_page_markdown(source, page, {}), source)

    def test_configuration_runs_status_before_context_expansion(self):
        config = yaml.safe_load((ROOT / 'mkdocs.yml').read_text(encoding='utf-8'))
        self.assertLess(config['hooks'].index('hooks/requirement_status.py'),
                        config['hooks'].index('hooks/catalog_context.py'))
        self.assertIn('stylesheets/status-requisitos.css', config['extra_css'])


if __name__ == '__main__':
    unittest.main()
