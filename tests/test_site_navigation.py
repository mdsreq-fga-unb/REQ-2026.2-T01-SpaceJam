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


if __name__ == "__main__":
    unittest.main()
