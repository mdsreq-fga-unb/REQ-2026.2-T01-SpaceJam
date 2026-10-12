"""Check which branches are allowed to publish the project site."""

import fnmatch
import re
import unittest
from pathlib import Path

import yaml


ROOT = Path(__file__).resolve().parents[1]


class PagesPublicationTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.workflow = yaml.load(
            (ROOT / ".github/workflows/deploy.yml").read_text(encoding="utf-8"),
            Loader=yaml.BaseLoader,
        )

    def test_only_docs_pushes_start_publication(self):
        push = self.workflow["on"]["push"]
        includes = push.get("branches", ["*"])
        excludes = push.get("branches-ignore", [])
        for branch, expected in (
            ("main", False),
            ("docs", True),
            ("correcao-publicacao-pages", False),
        ):
            with self.subTest(branch=branch):
                permitted = any(fnmatch.fnmatchcase(branch, p) for p in includes)
                permitted &= not any(fnmatch.fnmatchcase(branch, p) for p in excludes)
                self.assertEqual(permitted, expected)

    def test_manual_publication_rejects_non_docs_refs(self):
        self.assertIn("workflow_dispatch", self.workflow["on"])
        condition = self.workflow["jobs"]["deploy"].get("if", "")
        guard = re.fullmatch(r"github\.ref\s*==\s*'([^']+)'", condition)
        self.assertIsNotNone(guard, "Manual runs need an explicit branch guard")
        for ref, expected in (
            ("refs/heads/main", False),
            ("refs/heads/docs", True),
            ("refs/heads/correcao-publicacao-pages", False),
            ("refs/tags/v1", False),
        ):
            with self.subTest(ref=ref):
                self.assertEqual(ref == guard.group(1), expected)

    def test_publications_do_not_overlap_or_cancel_in_progress(self):
        concurrency = self.workflow.get("concurrency", {})
        self.assertTrue(concurrency.get("group"), "Publication needs a shared queue")
        self.assertNotIn("github.ref", concurrency["group"])
        self.assertEqual(concurrency.get("cancel-in-progress"), "false")


if __name__ == "__main__":
    unittest.main()
