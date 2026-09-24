import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SiteNavigationTest(unittest.TestCase):
    def build_site(self, output_dir):
        return subprocess.run(
            [
                sys.executable,
                "-m",
                "mkdocs",
                "build",
                "--strict",
                "--site-dir",
                output_dir,
            ],
            cwd=ROOT,
            check=True,
            capture_output=True,
            text=True,
        )

    def test_meetings_page_is_generated_and_linked_from_the_site_navigation(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            meetings_page = output / "reunioes" / "index.html"
            self.assertTrue(meetings_page.is_file())

            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertIn('href="reunioes/"', homepage)
            self.assertIn("Reuniões", homepage)

    def test_site_uses_lateral_navigation_and_loads_its_custom_theme(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")

            self.assertNotIn('class="md-tabs"', homepage)
            self.assertIn('class="md-sidebar md-sidebar--primary"', homepage)
            self.assertTrue((output / "stylesheets" / "extra.css").is_file())

    def test_desktop_sidebar_exposes_documents_and_its_control(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertNotIn('class="sj-desktop-nav', homepage)
            self.assertTrue('class="sj-sidebar-toggle"' in homepage, "Collapse button missing")
            self.assertTrue('aria-controls="sj-primary-nav"' in homepage, "Sidebar control missing")
            self.assertIn('href="cronograma/"', homepage)
            self.assertIn('href="requisitos/"', homepage)
            self.assertIn('href="reunioes/"', homepage)
            script_path = output / "javascripts" / "sj-navigation.js"
            self.assertTrue(script_path.is_file())
            script = script_path.read_text(encoding="utf-8")
            self.assertTrue('sidebar.id = "sj-primary-nav"' in script)

            internal_page = (output / "cronograma" / "index.html").read_text(encoding="utf-8")
            self.assertTrue('class="sj-sidebar-toggle"' in internal_page)
            self.assertTrue('aria-controls="sj-primary-nav"' in internal_page)

    def test_sidebar_control_has_visible_keyboard_focus(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            css = (Path(output_dir) / "stylesheets" / "extra.css").read_text(encoding="utf-8")
            self.assertRegex(
                css,
                r"\.sj-sidebar-toggle:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--sj-nav-focus\)",
            )

            def luminance(color):
                digits = color.lstrip("#")
                if len(digits) == 3:
                    digits = "".join(channel * 2 for channel in digits)
                channels = [int(digits[index:index + 2], 16) / 255 for index in (0, 2, 4)]
                linear = [channel / 12.92 if channel <= 0.04045 else ((channel + 0.055) / 1.055) ** 2.4 for channel in channels]
                return sum(weight * channel for weight, channel in zip((0.2126, 0.7152, 0.0722), linear))

            for scheme in (":root", '[data-md-color-scheme="slate"]'):
                block = re.search(re.escape(scheme) + r"\s*\{([^}]+)\}", css)
                self.assertIsNotNone(block)
                focus = re.search(r"--sj-nav-focus:\s*(#[0-9a-f]{3,6})", block.group(1))
                adjacent = re.search(r"--sj-nav-bg:\s*(#[0-9a-f]{3,6})", block.group(1))
                self.assertIsNotNone(focus)
                self.assertIsNotNone(adjacent)
                outline = luminance(focus.group(1))
                background = luminance(adjacent.group(1))
                contrast = (max(outline, background) + 0.05) / (min(outline, background) + 0.05)
                self.assertGreaterEqual(contrast, 3.0, scheme)

    def test_sidebar_toggle_is_hidden_without_javascript(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            css = (output / "stylesheets" / "extra.css").read_text(encoding="utf-8")
            self.assertIn('class="md-sidebar md-sidebar--primary"', homepage)
            self.assertIn('class="sj-sidebar-toggle"', homepage)
            self.assertIsNotNone(
                re.search(r"\.sj-sidebar-toggle\s*\{[^}]*display:\s*none;", css)
            )
            self.assertIsNotNone(
                re.search(r"\.sj-sidebar-toggle\.sj-sidebar-toggle--ready\s*\{[^}]*display:\s*flex;", css)
            )

    def test_sidebar_toggle_appears_after_navigation_initializes(self):
        if shutil.which("node") is None:
            self.skipTest("Node.js is needed to exercise the navigation script")

        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)

            script = r"""
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(process.argv[1], 'utf8');
function fixture(hasSidebar) {
  const classes = new Set();
  const attrs = { 'aria-expanded': 'true' };
  const listeners = {};
  const toggle = {
    classList: { add: name => classes.add(name), contains: name => classes.has(name) },
    setAttribute: (name, value) => { attrs[name] = value; },
    getAttribute: name => attrs[name],
    addEventListener: (name, listener) => { listeners[name] = listener; }
  };
  const sidebar = hasSidebar ? {} : null;
  const document = {
    querySelector: selector => selector === '.md-sidebar--primary' ? sidebar : selector === '.sj-sidebar-toggle' ? toggle : null,
    querySelectorAll: () => [],
    documentElement: { classList: { toggle: () => {} } },
    addEventListener: () => {}
  };
  const sessionStorage = { getItem: () => null, setItem: () => {} };
  const window = { matchMedia: () => ({ matches: true }) };
  return { classes, attrs, listeners, toggle, sidebar, document, sessionStorage, window };
}
const noScript = fixture(true);
if (noScript.classes.has('sj-sidebar-toggle--ready')) throw Error('toggle visible without JS');
const missingSidebar = fixture(false);
vm.runInNewContext(code, missingSidebar);
if (missingSidebar.classes.has('sj-sidebar-toggle--ready')) throw Error('toggle visible without sidebar');
const initialized = fixture(true);
vm.runInNewContext(code, initialized);
if (initialized.sidebar.id !== 'sj-primary-nav') throw Error('sidebar target missing');
if (!initialized.classes.has('sj-sidebar-toggle--ready')) throw Error('toggle remains hidden after initialization');
initialized.listeners.click();
if (initialized.attrs['aria-expanded'] !== 'false') throw Error('toggle no longer collapses sidebar');
"""
            result = subprocess.run(
                ["node", "-e", script, str(output / "javascripts" / "sj-navigation.js")],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_internal_design_notes_are_not_published(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            self.assertFalse((Path(output_dir) / "superpowers").exists())

    def test_sidebar_unit_groups_are_collapsible(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")
            self.assertIn('class="md-nav__toggle md-toggle', homepage)
            self.assertNotIn('"navigation.expand"', homepage)
            self.assertFalse(
                'md-nav__item--section md-nav__item--nested' in homepage,
                "Sidebar still renders fixed sections instead of collapsible groups",
            )

    def test_sidebar_unit_groups_start_open_without_losing_native_collapse(self):
        if shutil.which("node") is None:
            self.skipTest("Node.js is needed to exercise the navigation script")

        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            script_path = Path(output_dir) / "javascripts" / "sj-navigation.js"
            script = r"""
const fs = require('fs');
const vm = require('vm');
const code = fs.readFileSync(process.argv[1], 'utf8');
function fixture(desktop) {
  const groups = [0, 1].map(() => {
    const attrs = { 'aria-expanded': 'false' };
    const nav = { setAttribute: (name, value) => { attrs[name] = value; } };
    return {
      checked: false,
      parentElement: { querySelector: selector => selector === 'nav.md-nav' ? nav : null },
      attrs
    };
  });
  const document = {
    querySelector: () => null,
    querySelectorAll: selector => selector === '.md-sidebar--primary .md-nav__item--nested > .md-nav__toggle' ? groups : [],
    addEventListener: () => {}
  };
  const window = { matchMedia: () => ({ matches: desktop }) };
  vm.runInNewContext(code, { document, window });
  return groups;
}
const desktop = fixture(true);
if (!desktop.every(group => group.checked && group.attrs['aria-expanded'] === 'true'))
  throw Error('desktop groups did not open accessibly');
const mobile = fixture(false);
if (!mobile.every(group => !group.checked && group.attrs['aria-expanded'] === 'false'))
  throw Error('mobile groups must keep the root drawer visible');
"""
            result = subprocess.run(
                ["node", "-e", script, str(script_path)],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_desktop_uses_one_navigation_tree(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")
            self.assertNotIn('class="sj-desktop-nav-wrap"', homepage)
            self.assertEqual(homepage.count('class="md-nav md-nav--primary"'), 1)

    def test_dark_theme_is_default_and_light_theme_is_available(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")
            self.assertIn('data-md-color-scheme="slate"', homepage)
            self.assertRegex(homepage, r'<body[^>]+data-md-color-scheme="slate"')
            self.assertIn('data-md-color-scheme="default"', homepage)

    def test_internal_document_links_are_resolved_by_mkdocs(self):
        with tempfile.TemporaryDirectory() as output_dir:
            result = self.build_site(output_dir)

            self.assertNotIn("unrecognized relative link", result.stderr)

    def test_navigation_groups_documents_and_keeps_deliveries_separate(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")

            self.assertIn("Visão do Produto e Projeto", homepage)
            self.assertIn('href="requisitos/"', homepage)
            self.assertIn('href="entregas/"', homepage)
            self.assertNotIn("Unidade 1", homepage)
            self.assertNotIn("Unidade 2", homepage)
            self.assertFalse((output / "unidade-2" / "index.html").exists())
            self.assertTrue((ROOT / "docs" / "unidade-2.md").is_file())

    def test_deliveries_page_preserves_the_existing_presentation(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            page = (Path(output_dir) / "entregas" / "index.html").read_text(encoding="utf-8")
            self.assertIn("<h1", page)
            self.assertIn("Entregas", page)
            self.assertIn("Primeira entrega", page)
            self.assertIn("drive.google.com/file/d/1ySRDJSQ_FC6vnDdUjZx5q-eJDFyM_ZM1/preview", page)
            self.assertIn('href="../cenario_atual/"', page)

    def test_project_schedule_is_generated_and_linked_from_the_homepage(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            schedule_page = output / "cronograma" / "index.html"
            homepage = (output / "index.html").read_text(encoding="utf-8")

            self.assertTrue(schedule_page.is_file())
            self.assertIn('href="cronograma/"', homepage)
            self.assertIn("6. Cronograma e Entregas", homepage)
            self.assertIn(
                "Cronograma e Entregas",
                schedule_page.read_text(encoding="utf-8"),
            )

    def test_homepage_surfaces_every_available_unit_one_document(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")

            self.assertEqual(homepage.count('class="sj-reading-card"'), 8)
            self.assertIn('href="intervencao_social/"', homepage)

    def test_editorial_home_keeps_identity_people_and_all_reading_links(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertIn('class="sj-home"', homepage)
            self.assertIn('class="sj-home-court"', homepage)
            self.assertIn('class="sj-client-feature"', homepage)
            self.assertIn('class="sj-team-grid"', homepage)
            self.assertEqual(homepage.count('class="sj-reading-card"'), 8)
            self.assertIn('src="imagens/lucas-cordeiro.png"', homepage)
            self.assertIn("Avatar do GitHub de Guilherme", homepage)
            self.assertIn('href="requisitos/"', homepage)
            for name in ("anderson", "guilherme", "julia", "luiz", "paulo", "thiago"):
                self.assertIn(f'src="imagens/equipe/{name}.png"', homepage)
            self.assertTrue((output / "imagens" / "space-jam-logo.svg").is_file())

    def test_editorial_styles_are_built_for_internal_pages(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)
            css = (output / "stylesheets" / "extra.css").read_text(encoding="utf-8")
            self.assertIn(".md-typeset h1,", css)
            self.assertIn('font-family: Georgia, "Times New Roman", serif', css)
            self.assertRegex(
                css,
                r'(?s)\.md-typeset h1,\s*\.md-typeset h2\s*\{[^}]*font-family: Georgia, "Times New Roman", serif',
            )
            self.assertIn(".md-typeset__table", css)
            self.assertIn("overflow-x: auto", css)
            for page in ("cenario_atual", "interacao_equipe_cliente", "requisitos"):
                html = (output / page / "index.html").read_text(encoding="utf-8")
                self.assertIn('href="../stylesheets/extra.css"', html)

    def test_mobile_table_scroller_override_is_built(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            css = (Path(output_dir) / "stylesheets" / "extra.css").read_text(encoding="utf-8")
            mobile_rule = "@media screen and (max-width: 48rem) {"
            self.assertIn(mobile_rule, css)
            mobile_css = css.split(mobile_rule, 1)[1].split("@media", 1)[0]
            self.assertRegex(
                mobile_css,
                r"\.md-typeset \.md-typeset__scrollwrap\s*\{\s*margin-inline: 0;\s*\}",
            )

    def test_lessons_learned_page_is_generated_and_linked(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            lessons_page = output / "licoes-aprendidas" / "index.html"
            homepage = (output / "index.html").read_text(encoding="utf-8")

            self.assertTrue(lessons_page.is_file())
            self.assertIn('href="licoes-aprendidas/"', homepage)
            self.assertIn("11. Lições Aprendidas", homepage)
            self.assertIn(
                "11.1 Unidade 1",
                lessons_page.read_text(encoding="utf-8"),
            )

            lessons_content = lessons_page.read_text(encoding="utf-8")
            self.assertIn("Efeitos observados na primeira entrega", lessons_content)
            self.assertIn("Responsável", lessons_content)
            self.assertIn("Prazo", lessons_content)
            self.assertIn("Evidência de conclusão", lessons_content)

    def test_lessons_are_consolidated_without_archive_navigation(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            lessons = (output / "licoes-aprendidas" / "index.html").read_text(encoding="utf-8")
            legacy = (output / "licoes_aprendidas" / "index.html").read_text(encoding="utf-8")

            self.assertFalse('Lições Aprendidas (versão anterior)' in homepage)
            self.assertTrue("Disponibilidade da equipe" in lessons)
            self.assertTrue("Tomada de decisões" in lessons)
            self.assertTrue('href="../licoes-aprendidas/"' in legacy)

    def test_existing_revision_histories_are_collapsible_and_preserved(self):
        pages = (
            "engenharia_requisitos", "interacao_equipe_cliente", "intervencao_social",
            "licoes-aprendidas", "reunioes", "solucao", "cronograma",
        )
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            for page in pages:
                with self.subTest(page=page):
                    source = (ROOT / "docs" / f"{page}.md").read_text(encoding="utf-8")
                    html = (Path(output_dir) / page / "index.html").read_text(encoding="utf-8")
                    self.assertTrue('<details class="abstract"' in html, f"{page}: no accordion")
                    self.assertTrue("Histórico de revisão" in html, f"{page}: no label")
                    rows = [line for line in source.splitlines() if line.lstrip().startswith("| ") and "/2026 |" in line]
                    self.assertTrue(rows, f"{page}: revision rows missing")
                    details_html = html.split('<details class="abstract"', 1)[1].split("</details>", 1)[0]
                    self.assertEqual(details_html.count("<tr>"), len(rows) + 1, f"{page}: revision row count changed")
                    for row in rows:
                        cells = [cell.strip() for cell in row.strip().strip("|").split("|")]
                        for cell in cells:
                            self.assertTrue(cell in details_html, f"{page}: lost revision cell: {cell}")

    def test_homepage_restores_client_and_team_images(self):
        photos = ("anderson", "guilherme", "julia", "luiz", "paulo", "thiago")
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertTrue((output / "imagens" / "lucas-cordeiro.png").is_file())
            self.assertTrue('src="imagens/lucas-cordeiro.png"' in homepage)
            for person in photos:
                with self.subTest(person=person):
                    self.assertTrue((output / "imagens" / "equipe" / f"{person}.png").is_file())
                    self.assertTrue(f'src="imagens/equipe/{person}.png"' in homepage)
            self.assertTrue("Avatar do GitHub de Guilherme" in homepage)

    def test_document_pages_offer_editing_on_the_docs_branch(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            scenario_page = (
                Path(output_dir) / "cenario_atual" / "index.html"
            ).read_text(encoding="utf-8")

            self.assertIn(
                "github.com/mdsreq-fga-unb/REQ-2026.2-T01-SpaceJam/edit/docs/docs/cenario_atual.md",
                scenario_page,
            )

    def test_site_uses_the_vector_space_jam_brand_mark(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            logo = output / "imagens" / "space-jam-logo.svg"

            self.assertTrue(logo.is_file())
            self.assertIn('href="imagens/space-jam-logo.svg"', homepage)
            self.assertIn('src="imagens/space-jam-logo.svg"', homepage)

            logo_source = logo.read_text(encoding="utf-8")
            self.assertIn("<title>Space Jam</title>", logo_source)
            self.assertIn("viewBox=\"0 0 128 128\"", logo_source)


if __name__ == "__main__":
    unittest.main()
