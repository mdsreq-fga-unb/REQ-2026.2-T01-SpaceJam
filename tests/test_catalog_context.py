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

    def test_structured_rnf_card_renders_labelled_blocks(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        body=('**Categoria:** Usabilidade\n\n**MVP:** Obrigatório\n\n'
              '**Descrição:** Texto local.\n\n'
              '**Origem e perfis:**\n\n- OE3 - CP5\n- Aluno\n\n'
              '**Regras de negócio associadas:**\n- [RN09 · Limite](regras_negocio.md#rn09)\n- [RN10 · Imutabilidade](regras_negocio.md#rn10)\n\n'
              '**Verificação e validação:**\n- **Verificação (Métrica):** 0 bytes.\n\n'
              '**Checklist estruturado:**\n- [ ] Item um\n- [x] Item dois\n')
        fields=self.api.rnf_record(body)
        self.assertIsNotNone(fields)
        result=self.api.render_rnf_record('RNF16 · Feedback','rnf16',fields)
        self.assertIn('class="sj-requirement sj-rnf"',result)
        self.assertIn('id="rnf16"',result)
        self.assertIn('<span class="sj-tag sj-tag-mvp">MVP: Obrigatório</span>',result)
        self.assertIn('<ul class="sj-rnf-perfis"><li>OE3 - CP5</li><li>Aluno</li></ul>',result)
        self.assertIn('<p class="sj-record-label">Regras de negócio associadas</p>',result)
        self.assertIn('<a href="../regras_negocio/#rn09">RN09 · Limite</a>',result)
        self.assertIn('<a href="../regras_negocio/#rn10">RN10 · Imutabilidade</a>',result)
        self.assertNotIn('RF3501',result)
        self.assertIn('<ul class="sj-rnf-checklist"><li>Item um</li><li>Item dois</li></ul>',result)

    def test_structured_rnf_card_renders_project_decision_block(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        body=('**Descrição:** Texto local.\n\n'
              '**Regras de negócio associadas:**\n- [RN09 · Limite](regras_negocio.md#rn09)\n\n'
              '**Decisão de projeto (Justificativa técnica):**\n'
              '- **Teto de 60 s:** padrão `1080p` a `30 fps`.\n')
        fields=self.api.rnf_record(body)
        self.assertIsNotNone(fields)
        self.assertIn('RN09',fields['Regras de negócio associadas'])
        self.assertNotIn('Decisão',fields['Regras de negócio associadas'])
        result=self.api.render_rnf_record('RNF14 · Limites','rnf14',fields)
        self.assertIn('<p class="sj-record-label">Decisão de projeto (Justificativa técnica)</p>',result)
        self.assertIn('<strong>Teto de 60 s:</strong>',result)
        self.assertIn('<code>1080p</code>',result)

    def test_structured_rnf_card_includes_global_related_footer(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        catalog='<details class="sj-requirement" id="rf3501"><summary><span class="sj-requirement-name">Enviar vídeo</span></summary><a href="../requisitos_nao_funcionais/#rnf16">RNF16</a></details>'
        fields=self.api.rnf_record('**Descrição:** x\n')
        result=self.api.render_rnf_record('RNF16 · Feedback','rnf16',fields,catalog,'requisitos_nao_funcionais')
        self.assertIn('sj-related-requirements',result)
        self.assertIn('Requisitos relacionados · 1',result)
        self.assertIn('href="../requisitos/#rf3501"',result)

    def test_legacy_rnf_without_description_stays_unstructured(self):
        self.assertIsNotNone(self.api,'Consulta contextual ainda não implementada')
        legacy='**Categoria registrada:** Usabilidade. **Escopo:** CP5.\n\n**Tratamento registrado para o MVP:** Associados a RFs do MVP.'
        self.assertIsNone(self.api.rnf_record(legacy))

if __name__=='__main__':unittest.main()
