# Space Jam Pages Desktop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar ao Pages do Space Jam navegação desktop aberta e recolhível, menus superiores e revisão visual consistente, preservando conteúdo e identidade.

**Architecture:** Manter MkDocs Material como base. Um template de extensão renderiza a barra superior a partir da navegação existente; CSS dispõe o painel lateral e o conteúdo; JavaScript pequeno guarda apenas a preferência aberta/fechada na sessão. Ajustes editoriais ficam nas páginas Markdown e fotos autorizadas entram como assets locais.

**Tech Stack:** MkDocs 1.6.1, Material 9.7.6, Jinja2, CSS, JavaScript sem dependências, `unittest` Python.

**Spec:** `docs/superpowers/specs/2026-09-22-space-jam-pages-desktop-design.md`

## Global Constraints

- Base: `main` em `2e85a7d`, mais os commits locais da especificação e deste plano. Executar em uma worktree isolada a partir do commit do plano, nunca sobre a cópia com conteúdo pendente; não fazer push, PR, merge ou publicação.
- Preservar o logotipo, a paleta, a tipografia e o conteúdo acadêmico. As cinco edições locais preexistentes em `docs/cronograma.md`, `docs/engenharia_requisitos.md`, `docs/estrategia.md`, `docs/interacao_equipe_cliente.md` e `docs/solucao.md` ficam intactas na cópia de origem; não devem ser incorporadas ou sobrescritas silenciosamente.
- Desktop primeiro: validar em 1366×768 e 1920×1080; mobile deve continuar navegável.
- Painel lateral começa aberto na primeira visita da sessão, pode ser recolhido pelo ☰ e não se sobrepõe ao conteúdo no desktop.
- Não usar assets, código, CSS nem identidade do Crianex. Não buscar fotos na internet; só integrar fotos entregues/autorizadas pelo usuário.

---

## File structure

- `mkdocs.yml`: ativar extensão local do tema, script e navegação sem expansão forçada.
- `overrides/main.html`: incluir barra desktop após o cabeçalho nativo.
- `overrides/partials/sj-desktop-nav.html`: produzir links/menus acessíveis a partir de `nav.items`.
- `docs/javascripts/sj-navigation.js`: alternância do painel, persistência de sessão e fechamento dos menus com Escape.
- `docs/stylesheets/extra.css`: layout desktop, foco, menus e correções visuais globais; não editar tokens de cor.
- `docs/licoes-aprendidas.md` e `docs/licoes_aprendidas.md`: consolidação canônica e ponte da URL antiga.
- Oito páginas Markdown com histórico existente: trocar somente a apresentação do bloco pela extensão `pymdownx.details`.
- `docs/index.md` e `docs/cenario_atual.md`: fotos autorizadas associadas a nomes, quando os arquivos chegarem.
- `tests/test_site_navigation.py`: testes de compilação, links, conteúdo e assets.

### Task 1: Navegação desktop e painel recolhível

**Files:** Modify `mkdocs.yml`, `docs/stylesheets/extra.css`, `tests/test_site_navigation.py`; create `overrides/main.html`, `overrides/partials/sj-desktop-nav.html`, `docs/javascripts/sj-navigation.js`.

**Interfaces:** Consumes `nav.items`, `nav.homepage.url`, o painel `.md-sidebar--primary` e a classe Material `.md-main__inner`. Produces `nav.sj-desktop-nav`, botão `.sj-sidebar-toggle`, estado `html.sj-sidebar-closed` e `sessionStorage["spacejam:sidebar-open"]`.

- [ ] **Step 1: Write failing structural tests.** Add a `unittest` method that compiles the site and checks the homepage output:

```python
def test_desktop_bar_and_collapse_control_are_generated(self):
    with tempfile.TemporaryDirectory() as output_dir:
        self.build_site(output_dir)
        output = Path(output_dir)
        homepage = (output / "index.html").read_text(encoding="utf-8")
        self.assertIn('class="sj-desktop-nav', homepage)
        self.assertIn('class="sj-sidebar-toggle"', homepage)
        self.assertIn('aria-controls="sj-primary-nav"', homepage)
        for label in ("Início", "Unidade 1", "Unidade 2", "Cronograma", "Reuniões"):
            self.assertIn(label, homepage)
        self.assertTrue((output / "javascripts" / "sj-navigation.js").is_file())
```

- [ ] **Step 2: Verify red.** Run `rtk proxy python -m unittest tests.test_site_navigation.SiteNavigationTest.test_desktop_bar_and_collapse_control_are_generated -v`; expect an assertion failure for `sj-desktop-nav`.
- [ ] **Step 3: Implement the template and configuration.** Extend `base.html` without copying the Material header; append the Space Jam bar to the `header` block and keep existing search/theme/repository controls:

```jinja2
{# overrides/main.html #}
{% extends "base.html" %}
{% block header %}
  {{ super() }}
  {% include "partials/sj-desktop-nav.html" %}
{% endblock %}
```

Render the partial from the existing `nav.items` without duplicating a second page tree:

```jinja2
{# overrides/partials/sj-desktop-nav.html #}
<nav class="sj-desktop-nav md-grid" aria-label="Navegação principal">
  <button type="button" class="sj-sidebar-toggle" aria-controls="sj-primary-nav" aria-expanded="true" aria-label="Recolher navegação">☰</button>
  {% for label in ["Início", "Unidade 1", "Unidade 2", "Cronograma", "Reuniões"] %}
    {% if label == "Cronograma" %}
      <a href="{{ 'cronograma/' | url }}"{% if page.url == 'cronograma/' %} aria-current="page"{% endif %}>Cronograma</a>
    {% else %}
      {% for item in nav.items %}
        {% if item.title == label %}
          {% if item.children %}
            <details class="sj-top-menu">
              <summary>{{ item.title }}</summary>
              <div class="sj-top-menu__items">
                {% for child in item.children %}
                  <a href="{{ child.url | url }}"{% if child.active %} aria-current="page"{% endif %}>{{ child.title }}</a>
                {% endfor %}
              </div>
            </details>
          {% else %}
            <a href="{{ item.url | url }}"{% if item.active %} aria-current="page"{% endif %}>{{ item.title }}</a>
          {% endif %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</nav>
```

In `mkdocs.yml`, set `theme.custom_dir: overrides`, remove `navigation.expand` and add `extra_javascript: [javascripts/sj-navigation.js]`. Keep all palette/font/logo values unchanged. Check the generated markup because Jinja `nav` semantics are supplied by MkDocs, not by this partial.

- [ ] **Step 4: Implement sidebar behavior.** In `sj-navigation.js`, on desktop locate `.md-sidebar--primary`, assign `id="sj-primary-nav"`, initialize from `sessionStorage` (default open), toggle `sj-sidebar-closed` and `aria-expanded` on button clicks; on Escape close any open top `<details>` and restore focus to its `<summary>`. Do not intercept the Material mobile drawer.

```javascript
(() => {
  const storageKey = "spacejam:sidebar-open";
  const sidebar = document.querySelector(".md-sidebar--primary");
  const toggle = document.querySelector(".sj-sidebar-toggle");
  if (sidebar && toggle) {
    sidebar.id = "sj-primary-nav";
    let remembered = "1";
    try { remembered = sessionStorage.getItem(storageKey) ?? "1"; } catch (_) { /* default open */ }
    const setOpen = (open) => {
      document.documentElement.classList.toggle("sj-sidebar-closed", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Recolher navegação" : "Abrir navegação");
      try { sessionStorage.setItem(storageKey, open ? "1" : "0"); } catch (_) { /* session-only fallback */ }
    };
    setOpen(remembered !== "0");
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  }
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openMenu = document.querySelector(".sj-top-menu[open]");
    if (!openMenu) return;
    openMenu.open = false;
    openMenu.querySelector("summary")?.focus();
  });
})();
```

- [ ] **Step 5: Apply CSS only for desktop layout.** Above Material's desktop breakpoint (76.25em), show the bar, reserve a fixed sidebar width, let `.md-content` grow, and hide the primary sidebar only under `html.sj-sidebar-closed`. Below it, hide the custom bar and leave Material mobile navigation untouched. Add `:focus-visible` styling using existing `--sj-*` tokens; no new palette values.

```css
@media screen and (min-width: 76.25em) {
  .sj-desktop-nav { display: flex; align-items: center; }
  .md-main__inner { max-width: 90rem; }
  .md-sidebar--primary { flex: 0 0 15.5rem; width: 15.5rem; }
  .md-content { flex: 1 1 auto; min-width: 0; }
  html.sj-sidebar-closed .md-sidebar--primary { display: none; }
}
@media screen and (max-width: 76.24em) {
  .sj-desktop-nav { display: none; }
}
.no-js .sj-sidebar-toggle { display: none; }
.sj-desktop-nav :is(a, button, summary):focus-visible {
  outline: 3px solid var(--sj-purple-600);
  outline-offset: 3px;
}
.sj-top-menu { position: relative; }
.sj-top-menu__items { position: absolute; z-index: 30; min-width: 14rem; }
```

- [ ] **Step 6: Verify green and interactively test.** Run all `unittest` tests and `rtk proxy python -m mkdocs build --strict --site-dir tmp/pages-desktop-design-site` after confirming that output directory does not exist. In browser verify default open, collapse/reopen, state after navigation, dropdowns, keyboard/Escape, active link, light/dark and search at 1366×768 and 1920×1080. Fix any layout fault before moving on.
- [ ] **Step 7: Commit only Task 1 files locally.** Use a conventional commit message, with no push.

### Task 2: Consolidar Lições Aprendidas

**Files:** Modify `mkdocs.yml`, `docs/licoes-aprendidas.md`, `docs/licoes_aprendidas.md`, `tests/test_site_navigation.py`.

**Interfaces:** Produces canonical URL `licoes-aprendidas/`; old `licoes_aprendidas/` URL remains a short pointer. No new navigation section.

- [ ] **Step 1: Add a failing test.** Assert the homepage no longer contains `Lições Aprendidas (versão anterior)`, while the canonical page contains `mapa de calor`, `tomada de decisões` and `colaboração` in context, and the old URL points readers to `licoes-aprendidas/`.
- [ ] **Step 2: Verify red.** Run that test; expect failure on the archive nav entry.
- [ ] **Step 3: Migrate unique content.** Integrate the older page's four distinct observations — decisão adiada, participação nos canais, mapa de calor de disponibilidade e colaboração por consenso — into the existing Unidade 1 narrative and actions without duplicating text. Replace the legacy page body with a short link to the canonical page. Remove the `Arquivo` group from `mkdocs.yml`; do not delete the old file or rewrite its Git history.
- [ ] **Step 4: Verify green.** Run full tests and strict build; inspect both rendered lesson URLs and check canonical navigation.
- [ ] **Step 5: Commit only Task 2 files locally.** No push.

### Task 3: Históricos recolhíveis e tabelas legíveis

**Files:** Modify `docs/engenharia_requisitos.md`, `docs/interacao_equipe_cliente.md`, `docs/intervencao_social.md`, `docs/licoes-aprendidas.md`, `docs/reunioes.md`, `docs/solucao.md`, `docs/unidade-2.md`, `docs/cronograma.md`, `docs/stylesheets/extra.css`, `tests/test_site_navigation.py`.

**Interfaces:** Consumes `pymdownx.details` already enabled. Produces collapsed `<details>` blocks labeled `Histórico de revisão`; preserves original table rows.

- [ ] **Step 1: Add a failing test.** Build and assert that each of the eight corresponding output pages contains both `Histórico de revisão` and a `<details` block. Check the source/table row counts before editing so that no revision disappears.
- [ ] **Step 2: Verify red.** Run the new test; expect missing `<details` failures.
- [ ] **Step 3: Wrap existing revision tables.** Replace each history heading with `??? abstract "Histórico de revisão"` and indent its existing table by four spaces; keep every cell's text. Do not add counters or histories to other pages.

```markdown
??? abstract "Histórico de revisão"

    | Data | Versão | Descrição | Autor |
    | --- | --- | --- | --- |
    | 14/09/2026 | 0.2 | Detalhamento dos efeitos observados e das ações verificáveis de melhoria. | Luiz Henrique Pessato da Mota |
```

- [ ] **Step 4: Fix observed table layout globally.** Retain `.md-typeset__table { overflow-x: auto; }`, prevent the table wrapper from exceeding its column, remove clipping caused by competing width/border rules, and use existing surface/border tokens. Test Requisitos, Solução, Engenharia de Requisitos and Cronograma in desktop browser at both target sizes; table text must remain legible and the page must not gain a global horizontal scrollbar.
- [ ] **Step 5: Verify green.** Run the suite and strict build; compare rendered table row counts and inspect light/dark and mobile reachability.
- [ ] **Step 6: Commit only Task 3 files locally.** No push.

### Task 4: Fotografias autorizadas da equipe e do cliente

**Files:** Modify `docs/index.md`, `docs/stylesheets/extra.css`, `tests/test_site_navigation.py`; add only user-supplied images under `docs/imagens/pessoas/`.

**Interfaces:** Consumes the seven image files already saved in local commit `fbf26ce`, under `C:/Users/lu1zi/Documents/ChatGPT/requisitos/repositorio-oficial/.worktrees/cronograma-rad-pages/docs/imagens/`. Produces named `<img>` elements with descriptive `alt` in the homepage team list and Lucas's existing role card. The user's photo of Lucas is also still available at `C:/Users/lu1zi/AppData/Local/Temp/codex-clipboard-3ab1d280-fdf5-4e73-be69-f1512fe45f78.png`; use the project copy unless verification shows it differs. The team-to-file mapping is established in that worktree's `docs/index.md`.

- [ ] **Step 1: Confirm the input mapping.** Compare the seven files with the existing local `docs/index.md` mapping. Do not infer identity from appearance or fetch new images from the web. `guilherme.png` is a GitHub identicon, so its `alt` must say “Avatar do GitHub de Guilherme Ferreira Mendes”, not “Foto”.
- [ ] **Step 2: Add failing tests for the actual mapping.** For each supplied asset, assert the generated homepage contains the expected name, image path and nonempty `alt`; assert the generated asset exists. Check Lucas's existing role card as well as the team list.
- [ ] **Step 3: Verify red.** Run the new tests before copying images; expect missing image references/assets.
- [ ] **Step 4: Add the authorized image files and markup.** Keep the existing team names and role descriptions. Use image dimensions/object-fit that do not distort faces; add credit/legend if required by the supplied material. Never replace a missing image with an invented portrait.
- [ ] **Step 5: Verify green.** Run the suite, strict build and browser visual check of all photos at both desktop target sizes; confirm identity mapping and no distortion.
- [ ] **Step 6: Commit only Task 4 files locally.** No push.

## Final review

- [ ] Inspect `git diff` against the starting commit and the five pre-existing content edits; ensure no palette/logo changes.
- [ ] Run all tests and a strict build again; visually inspect every navigation group and all pages with tables/revision histories.
- [ ] Confirm remote branches remain untouched and report what is complete versus pending photo inputs.
