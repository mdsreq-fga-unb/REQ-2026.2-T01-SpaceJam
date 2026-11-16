import importlib.util
from pathlib import Path
import tempfile
import unittest

HOOK=Path(__file__).resolve().parents[1]/'hooks/catalog_context.py'

class CatalogContextTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        if HOOK.exists():
            spec=importlib.util.spec_from_file_location('catalog_context',HOOK)
            cls.api=importlib.util.module_from_spec(spec);spec.loader.exec_module(cls.api)
        else:cls.api=None

    def test_criterion_change_propagates_without_editing_functional_record(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        catalog='<details class="sj-requirement" id="rf01102"><summary><span class="sj-requirement-name">Logar usuário</span></summary><p><a href="../criterios_aceitacao/#ca-us02">US02</a></p></details>'
        with tempfile.TemporaryDirectory(dir=HOOK.parent.parent/'tests') as directory:
            root=Path(directory);(root/'requisitos.md').write_text(catalog,encoding='utf-8')
            criteria='## US02 — Entrar {#ca-us02}\n\n<div id="ca-us02-01" class="sj-criterion"><p>Resultado original</p></div>\n'
            (root/'criterios_aceitacao.md').write_text(criteria,encoding='utf-8')
            first=self.api.render_catalog(catalog,root)
            self.assertIn('Resultado original',first)
            self.assertEqual(first.count('Resultado original'),1,'Uma ficha deve apresentar cada grupo uma só vez')
            self.assertNotIn('id="ca-us02-01"',first,'IDs canônicos não devem ser duplicados nas fichas')
            (root/'criterios_aceitacao.md').write_text(criteria.replace('original','revisado'),encoding='utf-8')
            self.assertIn('Resultado revisado',self.api.render_catalog(catalog,root))
            self.assertEqual((root/'requisitos.md').read_text(encoding='utf-8'),catalog)

    def test_shared_criterion_keeps_its_canonical_address(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        criteria='## US09 e US10 — Dificuldade {#ca-us09-us10}\n\n<div id="ca-us09-us10-01" class="sj-criterion"><p>Escala de 1 a 5</p></div>\n'
        catalog=''.join('<details class="sj-requirement" id="'+code+'"><summary><span class="sj-requirement-name">Avaliar</span></summary><a href="../criterios_aceitacao/#ca-us09-us10">US09 / US10</a></details>' for code in ['rf01208','rf01210'])
        with tempfile.TemporaryDirectory(dir=HOOK.parent.parent/'tests') as directory:
            root=Path(directory);(root/'criterios_aceitacao.md').write_text(criteria,encoding='utf-8')
            result=self.api.render_catalog(catalog,root)
            self.assertEqual(result.count('Escala de 1 a 5'),2)
            self.assertEqual(result.count('href="../criterios_aceitacao/#ca-us09-us10"'),2)
            self.assertNotIn('id="ca-us09-us10-01"',result)

    def test_missing_criterion_fails_instead_of_silently_dropping_content(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        with tempfile.TemporaryDirectory(dir=HOOK.parent.parent/'tests') as directory:
            root=Path(directory);(root/'criterios_aceitacao.md').write_text('',encoding='utf-8')
            with self.assertRaises(ValueError):
                self.api.render_catalog('<a href="../criterios_aceitacao/#ca-missing">Critério</a>',root)

if __name__=='__main__':unittest.main()
