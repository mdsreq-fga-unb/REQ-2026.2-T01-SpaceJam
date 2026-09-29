# Space Jam Pages Main Content Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trazer todo o conteúdo publicado na `main` para o Pages roxo local, sem mudar seu visual, seu agrupamento de menu ou publicar o resultado.

**Architecture:** A branch `codex/pages-desktop-20260922` é a base. `origin/main` no commit `6bd710769474b5b7c02c364de2c9e643408de46e` é a fonte de conteúdo. Integrar seletivamente texto e novas páginas; manter a home, a apresentação de Entregas, os históricos recolhíveis e os assets do Pages local. A página vazia `unidade-2.md` e o arquivo antigo de Lições Aprendidas não voltam à navegação.

**Tech Stack:** MkDocs Material, Markdown, Python `unittest`, JavaScript de navegação existente.

**Spec:** `docs/superpowers/specs/2026-09-29-space-jam-pages-main-content-sync-design.md`

## Global Constraints

- Não modificar `docs/stylesheets/extra.css`, `docs/javascripts/sj-navigation.js`, `docs/javascripts/sj-tables.js`, `overrides/main.html`, logo, fotos ou imagens.
- Não criar “Unidade 1”, “Unidade 2” ou “Arquivo” no menu. Manter “Visão do Produto e Projeto”, “Entregas” e “Reuniões”.
- Preservar o conteúdo atual da `main` sem corrigir avaliação, cálculo, matriz, MoSCoW ou outras inconsistências acadêmicas nesta tarefa.
- Manter `docs/unidade-2.md` excluído; sua única informação na `main` é um aviso de espaço reservado.
- `docs/requisitos.md` é idêntico entre a branch local e `origin/main` nesta referência; não alterá-lo sem diferença verificada.
- Não fazer push, PR, merge na `main`, edição de issues nem publicação do Pages. O usuário deve conferir o resultado local antes disso.
- Usar `apply_patch` para edições locais; manter as mudanças estritamente nos arquivos indicados. Executar comandos shell com prefixo `rtk`.

## File Map

- `docs/engenharia_requisitos.md`, `docs/estrategia.md`, `docs/solucao.md`, `docs/intervencao_social.md`, `docs/licoes-aprendidas.md`: conteúdo acadêmico desatualizado a sincronizar com a `main`.
- `docs/cronograma.md`, `docs/interacao_equipe_cliente.md`, `docs/reunioes.md`: conferir fidelidade; as diferenças existentes são apenas o invólucro recolhível do histórico.
- `docs/mvp.md`: nova página de priorização, ausente no local.
- `mkdocs.yml`: adicionar somente “Priorização e MVP” à navegação local; preservar a configuração visual e as exclusões.
- `docs/index.md`, `docs/entregas.md`: preservar a apresentação local; verificar todas as afirmações e todos os destinos contra a `main`.
- `docs/requisitos.md`, `docs/cenario_atual.md`: comparar integralmente e manter sem edição se iguais.
- `docs/licoes_aprendidas.md`: manter como encaminhamento legado sem link no menu; não restaurar a seção “Arquivo”.
- `tests/test_site_navigation.py`: adicionar regressões para conteúdo novo, menu local e preservação da apresentação.

---

### Task 1: Regressões para o conteúdo e o menu esperados

**Files:**
- Modify: `tests/test_site_navigation.py`

**Interfaces:**
- Consumes: `SiteNavigationTest.build_site(output_dir)` existente.
- Produces: testes que exigem `mvp/index.html`, conteúdo principal atualizado e menu sem agrupamentos obsoletos.

- [ ] **Step 1: Escrever teste de navegação e conteúdo novo.** Adicionar um método à classe `SiteNavigationTest`:

```python
def test_prioritization_is_reachable_without_old_unit_or_archive_groups(self):
    with tempfile.TemporaryDirectory() as output_dir:
        self.build_site(output_dir)
        output = Path(output_dir)
        homepage = (output / "index.html").read_text(encoding="utf-8")
        self.assertTrue((output / "mvp" / "index.html").is_file())
        self.assertIn('href="mvp/"', homepage)
        self.assertIn("Priorização e MVP", homepage)
        self.assertNotIn("Unidade 1", homepage)
        self.assertNotIn("Unidade 2", homepage)
        self.assertNotIn("Lições Aprendidas (versão anterior)", homepage)
        self.assertFalse((output / "unidade-2" / "index.html").exists())
```

- [ ] **Step 2: Acrescentar marcadores de conteúdo da `main` às páginas acadêmicas.** Adicionar à classe `SiteNavigationTest`:

```python
def test_current_main_content_appears_in_academic_pages(self):
    expected = {
        "engenharia_requisitos": "5.2 Mapeamento ER x Processo",
        "estrategia": "Híbrida",
        "solucao": "CP8",
        "licoes-aprendidas": "Dificuldades enfrentadas e como foram superadas",
        "mvp": "Mínimo Produto Viável",
    }
    with tempfile.TemporaryDirectory() as output_dir:
        self.build_site(output_dir)
        for slug, marker in expected.items():
            with self.subTest(slug=slug):
                page = (Path(output_dir) / slug / "index.html").read_text(encoding="utf-8")
                self.assertIn(marker, page)
```

No teste existente `test_lessons_learned_page_is_generated_and_linked`, substituir `"Efeitos observados na primeira entrega"` por `"Dificuldades enfrentadas e como foram superadas"`. No teste `test_lessons_are_consolidated_without_archive_navigation`, substituir as checagens de `"Disponibilidade da equipe"` e `"Tomada de decisões"` pela afirmação `"A alocação tardia de tarefas"`, mantendo a checagem do encaminhamento legado.
- [ ] **Step 3: Confirmar que os testes novos falham antes da integração.** Executar `rtk proxy python -m unittest discover -s tests -p test_site_navigation.py` e confirmar falha por ausência de `mvp` e pelo conteúdo antigo; os 26 testes preexistentes passaram antes das edições.
- [ ] **Step 4: Conferir o diff do teste.** Executar `rtk git diff --check` e limitar a mudança ao teste. Não alterar CSS/JS para satisfazer o teste.

### Task 2: Atualizar todas as páginas acadêmicas divergentes

**Files:**
- Modify: `docs/engenharia_requisitos.md`
- Modify: `docs/estrategia.md`
- Modify: `docs/solucao.md`
- Modify: `docs/intervencao_social.md`
- Modify: `docs/licoes-aprendidas.md`
- Inspect, edit only if content differs: `docs/cronograma.md`, `docs/interacao_equipe_cliente.md`, `docs/reunioes.md`, `docs/cenario_atual.md`, `docs/requisitos.md`

**Interfaces:**
- Consumes: conteúdo de `origin/main:docs/<nome>.md` em `6bd7107` e o teste da Task 1.
- Produces: corpo, tabelas, referências e histórico textual atuais da `main`, com o invólucro local `??? abstract "Histórico de revisão"` quando ele já existe.

- [ ] **Step 1: Conferir arquivo a arquivo.** Para cada arquivo listado, usar `rtk proxy git diff --unified=3 origin/main HEAD -- docs/<nome>.md` e `rtk git show origin/main:docs/<nome>.md`; registrar quais diferenças são de conteúdo e quais são apenas o histórico recolhível.
- [ ] **Step 2: Atualizar os cinco documentos divergentes com `apply_patch`.** Usar literalmente o texto, tabelas, números, nomes, datas e afirmações de `origin/main`. Não adaptar nem corrigir conclusões acadêmicas. Manter somente a diferença de apresentação do histórico recolhível, transpondo todas as linhas da tabela da `main` para dentro do invólucro local, na mesma ordem.
- [ ] **Step 3: Validar os arquivos já equivalentes.** Conferir `docs/cenario_atual.md` e `docs/requisitos.md` com `rtk proxy git diff --exit-code origin/main -- docs/cenario_atual.md docs/requisitos.md`; confirmar que `cronograma.md`, `interacao_equipe_cliente.md` e `reunioes.md` só diferem no histórico recolhível e que todas as linhas continuam presentes.
- [ ] **Step 4: Executar os testes de navegação novamente.** `rtk proxy python -m unittest discover -s tests -p test_site_navigation.py`; os marcadores de conteúdo acadêmico devem passar, enquanto o teste de `mvp` ainda pode falhar até a Task 3.
- [ ] **Step 5: Revisar o diff sem tocar nos assets visuais.** `rtk git diff --check` e `rtk git diff --name-only`; os arquivos CSS, JS, override, imagens e home não podem aparecer.

### Task 3: Incorporar Priorização e MVP ao menu local

**Files:**
- Create: `docs/mvp.md`
- Modify: `mkdocs.yml`
- Inspect, edit only if content or links are stale: `docs/index.md`, `docs/entregas.md`

**Interfaces:**
- Consumes: `origin/main:docs/mvp.md` em `6bd7107`, navegação local existente e testes da Task 1.
- Produces: rota `mvp/` visível no menu “Visão do Produto e Projeto”, sem agrupamento “Unidade 2”.

- [ ] **Step 1: Incluir o arquivo completo `mvp.md`.** Transferir com `apply_patch` o conteúdo de `rtk git show origin/main:docs/mvp.md`, preservando tabelas, iframes, links, códigos RF/RNF, médias e valores exatamente como estão na `main`.
- [ ] **Step 2: Incluir a entrada no menu.** Em `mkdocs.yml`, inserir `- "9. Priorização e MVP": mvp.md` logo após `"8. Requisitos de Software"` no grupo `Visão do Produto e Projeto`; preservar todas as demais opções, inclusive `exclude_docs` para `unidade-2.md`.
- [ ] **Step 3: Auditar home e Entregas sem redesenhar.** Comparar cada afirmação, destino interno e referência multimídia de `docs/index.md` e `docs/entregas.md` com o conteúdo da `main`. A home já preserva as afirmações da `main` dentro da marcação roxa. A apresentação de Entregas contém o mesmo vídeo e conteúdo adicional; manter ambos se nenhuma informação da `main` estiver ausente. Editar apenas eventual texto ou link desatualizado, sem mudar tags, classes, fotos, cartões ou composição.
- [ ] **Step 4: Executar a suíte.** `rtk proxy python -m unittest discover -s tests -p test_site_navigation.py`; esperar todos os testes passando. Se uma página nova exigir CSS/JS, parar e consultar o usuário antes de qualquer mudança visual.
- [ ] **Step 5: Conferir a navegação de saída.** Executar `rtk proxy python -m mkdocs build --strict` e verificar a existência de `site/mvp/index.html`, `site/requisitos/index.html`, `site/entregas/index.html` e ausência de `site/unidade-2/index.html`.

### Task 4: Auditoria final de todo o Pages local

**Files:**
- Inspect: `docs/**/*.md`, `mkdocs.yml`, `tests/test_site_navigation.py`, `site/**`

**Interfaces:**
- Consumes: site gerado e árvore de `origin/main`.
- Produces: relatório ao usuário das páginas sincronizadas, exceções intencionais e pendências para revisão visual; nenhum push ou PR.

- [ ] **Step 1: Comparar todo o inventário.** Listar os Markdown da `main` com `rtk git ls-tree -r --name-only origin/main docs` e os locais com `rtk proxy rg --files docs`. Para cada diferença restante em `rtk git diff --name-status origin/main -- docs`, classificá-la como visual aprovado, histórico recolhível, home/Entregas, placeholder excluído, redirecionamento legado ou conteúdo pendente. Nenhuma diferença acadêmica pendente deve ficar sem explicação.
- [ ] **Step 2: Verificar textos, tabelas e rotas.** Inspecionar o HTML gerado para links internos, imagens, iframes e tabelas de requisitos e MVP; `rtk proxy python -m mkdocs build --strict` deve terminar sem warnings. Comparar `docs/requisitos.md` byte a byte com `origin/main` via `rtk proxy git diff --exit-code origin/main -- docs/requisitos.md`.
- [ ] **Step 3: Comprovar o visual intocado.** `rtk git diff --exit-code d9dc2d1 -- docs/stylesheets/extra.css docs/javascripts/sj-navigation.js docs/javascripts/sj-tables.js overrides/main.html docs/imagens` deve terminar com código 0. Verificar `rtk git diff --check` e a suíte completa.
- [ ] **Step 4: Pedir revisão humana do Pages local.** Não usar outro navegador, servidor ou protocolo para contornar eventual bloqueio de inspeção automatizada por `file://`. Mostrar ao usuário o resultado por método permitido e pedir conferência antes de considerar publicação.
