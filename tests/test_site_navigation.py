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

    def test_desktop_navigation_exposes_units_and_sidebar_control(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertTrue('class="sj-desktop-nav' in homepage, "Desktop bar missing")
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

    def test_internal_design_notes_are_not_published(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            self.assertFalse((Path(output_dir) / "superpowers").exists())

    def test_sidebar_unit_groups_are_collapsible(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")
            self.assertIn('class="md-nav__toggle md-toggle', homepage)
            self.assertFalse(
                'md-nav__item--section md-nav__item--nested' in homepage,
                "Sidebar still renders fixed sections instead of collapsible groups",
            )

    def test_top_navigation_has_full_width_background_wrapper(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)
            homepage = (Path(output_dir) / "index.html").read_text(encoding="utf-8")
            self.assertTrue('class="sj-desktop-nav-wrap"' in homepage)

    def test_internal_document_links_are_resolved_by_mkdocs(self):
        with tempfile.TemporaryDirectory() as output_dir:
            result = self.build_site(output_dir)

            self.assertNotIn("unrecognized relative link", result.stderr)

    def test_unit_two_has_a_reserved_navigation_section(self):
        with tempfile.TemporaryDirectory() as output_dir:
            self.build_site(output_dir)

            output = Path(output_dir)
            homepage = (output / "index.html").read_text(encoding="utf-8")

            self.assertTrue((output / "unidade-2" / "index.html").is_file())
            self.assertIn("Unidade 2", homepage)

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
            "licoes-aprendidas", "reunioes", "solucao", "unidade-2", "cronograma",
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
