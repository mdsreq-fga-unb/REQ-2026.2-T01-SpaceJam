"""Check that readers can reach the DoR/DoD document from the project site."""

import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DorDodPageTest(unittest.TestCase):
    def test_dor_dod_is_generated_and_reachable_from_project_navigation(self):
        with tempfile.TemporaryDirectory() as output_dir:
            result = subprocess.run(
                [sys.executable, "-m", "mkdocs", "build", "--strict",
                 "--site-dir", output_dir],
                cwd=ROOT,
                capture_output=True,
                text=True,
            )
            self.assertEqual(result.returncode, 0, result.stderr)
            output = Path(output_dir)
            page_path = output / "dor_dod" / "index.html"
            self.assertTrue(page_path.is_file(), "DoR/DoD page was not published")
            homepage = (output / "index.html").read_text(encoding="utf-8")
            self.assertIn('href="dor_dod/"', homepage)
            requirements_page = (output / "engenharia_requisitos" / "index.html").read_text(
                encoding="utf-8"
            )
            self.assertIn('href="../dor_dod/"', requirements_page)
            page = page_path.read_text(encoding="utf-8")
            article = re.search(r"<article\b[^>]*>(.*?)</article>", page, re.DOTALL)
            self.assertIsNotNone(article, "DoR/DoD content was not rendered")
            self.assertIn('href="../engenharia_requisitos/"', article.group(1))
            self.assertIn('href="../mvp/"', article.group(1))


if __name__ == "__main__":
    unittest.main()
