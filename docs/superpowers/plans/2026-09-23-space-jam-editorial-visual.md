# Space Jam Editorial Visual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar a direção editorial aprovada ao Pages local do Space Jam, com logo original, cliente e equipe na home, motivo sutil de espaço/quadra e páginas internas mais legíveis.

**Architecture:** Manter MkDocs Material e a navegação desktop existentes. Reorganizar o HTML da home e substituir suas regras visuais na folha CSS já usada pelo site; aplicar somente ajustes globais de tipografia e leitura às páginas internas. Não introduzir biblioteca ou serviço novo.

**Tech Stack:** MkDocs 1.6.1, Material 9.7.6, Markdown com `md_in_html`, CSS, `unittest` Python e navegador desktop.

**Spec:** `docs/superpowers/specs/2026-09-23-space-jam-editorial-visual-design.md`

## Global Constraints

- Branch e worktree locais: `codex/pages-desktop-20260922`, partindo de `6da2785`. Não fazer push, PR, merge ou publicação.
- Preservar `mkdocs.yml` como fonte da navegação, os templates `overrides/`, `docs/javascripts/sj-navigation.js`, busca, troca de tema e links canônicos; não migrar de gerador.
- Preservar o arquivo e o desenho de `docs/imagens/space-jam-logo.svg`, os sete arquivos de pessoas em `docs/imagens/` e os nomes/links já mapeados em `docs/index.md`. `guilherme.png` é um avatar gráfico, não uma fotografia.
- Manter a paleta roxa e os tokens `--sj-*` de `docs/stylesheets/extra.css`; não forçar modo escuro. O motivo espaço/quadra é decorativo e não depende de imagem externa ou JavaScript.
- Texto de páginas alheias, requisitos, tabelas, datas, autores e decisões não muda. Só `docs/index.md` e, se houver correção editorial concreta, `docs/interacao_equipe_cliente.md` podem ter texto ajustado. Não atribuir responsáveis sem decisão da equipe.
- Requisitos não ganha redesign próprio: apenas recebe os estilos globais, pois seu conteúdo será atualizado depois.
- Desktop primeiro em 1366×768 e 1920×1080; mobile permanece navegável e sem overflow horizontal da página.

---

## File structure

- `docs/index.md`: única fonte da composição da home, com seções semânticas e classes `sj-home`, `sj-home-hero`, `sj-home-court`, `sj-client-feature` e `sj-team-grid`. Manter os oito `sj-reading-card` e todos os links da home atual.
- `docs/stylesheets/extra.css`: continua sendo a folha única do site; substituir nela as regras antigas da home por regras agrupadas sob `.sj-home`, sem criar uma segunda cascata concorrente. Ajustar seus seletores globais de títulos, texto, tabelas e foco sem trocar tokens de cor.
- `tests/test_site_navigation.py`: estender os testes de build já existentes para proteger a estrutura nova, as imagens e os oito atalhos; manter os 16 testes anteriores.
- `mkdocs.yml`, `overrides/` e `docs/javascripts/sj-navigation.js`: somente leitura neste plano. Mudar algum deles exige justificar um defeito reproduzido e reavaliar o escopo antes de editar.

### Task 1: Home editorial com identidade e pessoas reais

**Files:** Modify `docs/index.md`, `docs/stylesheets/extra.css`, `tests/test_site_navigation.py`.

**Interfaces:** Consome os assets `docs/imagens/space-jam-logo.svg`, `docs/imagens/lucas-cordeiro.png`, `docs/imagens/equipe/{anderson,guilherme,julia,luiz,paulo,thiago}.png` e os oito links `sj-reading-card` existentes. Produz seções `.sj-home-hero`, `.sj-home-court`, `.sj-client-feature` e `.sj-team-grid` no HTML publicado; a navegação Material e os URLs dos documentos permanecem inalterados.

- [ ] **Step 1: Escrever teste estrutural que falha com a home atual.** Em `SiteNavigationTest`, acrescentar o método abaixo sem alterar os testes existentes:

```python
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
```

- [ ] **Step 2: Verificar vermelho.** Rodar `rtk proxy python -m unittest tests.test_site_navigation.SiteNavigationTest.test_editorial_home_keeps_identity_people_and_all_reading_links -v`; esperar falha na ausência de `sj-home`.

- [ ] **Step 3: Reorganizar a home, conservando dados e destinos.** Usar a prévia `C:/Users/lu1zi/Documents/ChatGPT/requisitos/.superpowers/brainstorm/984-1790179934/content/home-editorial-espaco-v2.html` somente como referência visual. Envolver as seções de `docs/index.md` em `<div class="sj-home">`; conservar os textos factuais de problema, oportunidade, pessoas e os oito cartões de documentação. Usar o bloco do cliente com a fotografia original e os quatro itens já existentes sobre sua perspectiva de uso, evitando repetir o parágrafo do hero. Manter os seis nomes, URLs do GitHub, caminhos de imagem e textos alternativos fiéis. O cabeçalho Material já usa o logo original; não recriar nem substituir esse asset.

```html
<div class="sj-home">
  <section class="sj-home-hero" aria-labelledby="sj-home-title">
    <div class="sj-home-hero__copy">
      <p class="sj-kicker">Projeto acadêmico · Requisitos de Software · 2026.2</p>
      <h1 id="sj-home-title">Space Jam</h1>
      <p class="sj-home-hero__lead">Apoio ao acompanhamento individual de atletas de basquete.</p>
      <p>Uma plataforma web concebida para reunir informações que hoje ficam distribuídas entre diferentes ferramentas e apoiar a rotina do treinador Lucas Cordeiro e de seus atletas.</p>
      <div class="sj-hero__actions">
        <a class="sj-button sj-button--primary" href="cenario_atual/">Entender o cenário</a>
        <a class="sj-button sj-button--secondary" href="solucao/">Conhecer a solução</a>
      </div>
    </div>
    <div class="sj-home-court" aria-hidden="true"></div>
  </section>
  <section class="sj-client-feature" aria-labelledby="sj-client-title">
    <div>
      <p class="sj-kicker">Lucas Cordeiro · Treinador e cliente</p>
      <h2 id="sj-client-title">O projeto começa na quadra</h2>
      <ul>
        <li>Prescrição de treinos e rotinas</li>
        <li>Registro de testes físicos</li>
        <li>Acompanhamento da evolução</li>
        <li>Feedback privado e individual</li>
      </ul>
    </div>
    <img src="imagens/lucas-cordeiro.png" alt="Lucas Cordeiro orientando um treino de basquete" loading="lazy">
  </section>
</div>
```

Entre o hero e o cliente, conservar as três informações já existentes de problema, oportunidade e pessoas. Depois do cliente, manter a lista dos seis integrantes sob `.sj-team-grid` com os nomes, links, caminhos de imagens e textos alternativos atuais; manter também os oito links `sj-reading-card` com descrições e destinos atuais. Esses blocos já estão completos em `docs/index.md`: mover suas marcações para a nova composição sem inventar conteúdo.

- [ ] **Step 4: Substituir as regras antigas da home por CSS isolado.** Em `docs/stylesheets/extra.css`, remover apenas as regras home-specific não mais usadas (`.sj-hero`, `.sj-card`, `.sj-role-card` e derivadas) depois de conferir que nenhuma página interna as utiliza. Criar as novas regras usando os tokens existentes; manter o header, sidebar e top-nav funcionais. O gráfico é CSS puro e ignora eventos de ponteiro:

```css
.sj-home-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(15rem, .75fr);
  align-items: center;
  gap: clamp(1.4rem, 3vw, 2.5rem);
  border-block: 1px solid var(--sj-border);
}
.sj-home-court {
  position: relative;
  min-height: 14rem;
  pointer-events: none;
  border: 1px solid var(--sj-purple-600);
  border-radius: 8rem 8rem .8rem .8rem;
  background: linear-gradient(145deg, #32145a, #4a1f78);
}
@media screen and (max-width: 60em) {
  .sj-home-hero { grid-template-columns: 1fr; }
}
```

Completar círculos de quadra, órbita e pontos de luz com pseudoelementos/elementos decorativos `aria-hidden`, sem adicionar cor fora da paleta atual ou animação. `sj-client-feature` deve ser uma grade de texto e foto que empilha em largura reduzida; fotos da equipe mantêm proporção e nome legível mesmo se não carregarem.

- [ ] **Step 5: Verificar verde e regressões.** Rodar o teste novo, depois `rtk proxy python -m unittest discover -s tests -v`. Esperar todos os testes passando, inclusive os antigos sobre oito cartões, sete imagens, navegação e logo. Conferir manualmente o HTML gerado: os oito links apontam a páginas existentes e nenhum texto acadêmico de outro arquivo foi editado.

- [ ] **Step 6: Revisão visual e commit local.** Abrir a home compilada em 1366×768 e 1920×1080 nos temas claro/escuro; verificar que logo, foto de Lucas e seis cartões aparecem sem corte indevido. Conferir largura móvel somente para navegação e empilhamento. Rodar `rtk git diff --check` e `rtk git diff -- docs/index.md docs/stylesheets/extra.css tests/test_site_navigation.py`, depois fazer commit apenas desses três arquivos, por exemplo `feat(docs): aplica home editorial Space Jam`. Não enviar ao remoto.

### Task 2: Ritmo editorial e legibilidade nas páginas internas

**Files:** Modify `docs/stylesheets/extra.css`, `tests/test_site_navigation.py`. Não modificar Markdown de páginas internas neste plano, incluindo Requisitos e página 7, salvo se Luiz pedir uma correção concreta separada.

**Interfaces:** Consome a estrutura Material `.md-typeset`, `.md-content__inner`, `.md-typeset__table` e os tokens `--sj-*` já presentes; produz estilo global de títulos, parágrafos, tabelas, links e foco. Não altera árvore de navegação, URLs, textos nem o JavaScript.

- [ ] **Step 1: Escrever teste que falha para as novas regras editoriais sem acoplar conteúdo acadêmico.** Acrescentar ao mesmo `SiteNavigationTest`:

```python
def test_editorial_styles_are_built_for_internal_pages(self):
    with tempfile.TemporaryDirectory() as output_dir:
        self.build_site(output_dir)
        output = Path(output_dir)
        css = (output / "stylesheets" / "extra.css").read_text(encoding="utf-8")
        self.assertIn(".md-typeset h1,", css)
        self.assertIn('font-family: Georgia, "Times New Roman", serif', css)
        self.assertIn(".md-typeset__table", css)
        self.assertIn("overflow-x: auto", css)
        for page in ("cenario_atual", "interacao_equipe_cliente", "requisitos"):
            html = (output / page / "index.html").read_text(encoding="utf-8")
            self.assertIn('href="../stylesheets/extra.css"', html)
```

- [ ] **Step 2: Verificar vermelho.** Rodar `rtk proxy python -m unittest tests.test_site_navigation.SiteNavigationTest.test_editorial_styles_are_built_for_internal_pages -v`; esperar falha na ausência da declaração serifada.

- [ ] **Step 3: Ajustar estilos globais de forma contida.** Em `extra.css`, ajustar somente os seletores necessários: `.md-typeset h1, .md-typeset h2` para serifada editorial com tamanhos `clamp(...)` e quebras adequadas; corpo e subtítulos continuam Inter. Conservar `.md-typeset__table { overflow-x: auto; }`, impedir `overflow` no documento inteiro e manter células com altura/linha confortável. Usar `var(--sj-text)`, `var(--sj-muted)`, `var(--sj-border)`, `var(--sj-surface)` e demais tokens já existentes para ambos os temas. Não aplicar o gráfico de quadra a páginas internas.

```css
.md-typeset h1,
.md-typeset h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 700;
  letter-spacing: -0.035em;
  overflow-wrap: break-word;
}
.md-typeset__table {
  max-width: 100%;
  overflow-x: auto;
  border: 1px solid var(--sj-border);
}
```

Não substituir a tabela de Requisitos por cartões nem modificar suas linhas: o padrão global deve continuar válido após a atualização futura daquela página.

- [ ] **Step 4: Verificar verde e conteúdo protegido.** Rodar `rtk proxy python -m unittest discover -s tests -v`. Rodar `rtk git diff --name-only 6da2785 -- docs` e confirmar que, além da especificação/plano/testes/CSS, somente `docs/index.md` foi alterado no conteúdo publicado; nenhuma página Markdown de colega aparece no diff. Se aparecer, interromper e investigar antes de continuar.

- [ ] **Step 5: Revisão visual transversal.** Abrir home, página 7, Cenário Atual, Solução, Cronograma, Requisitos e uma página com histórico recolhível em 1366×768 e 1920×1080. Conferir títulos longos, sidebar aberta/fechada, top-nav, busca, foco por teclado, claro/escuro, tabela sem corte e painel de histórico. Em largura móvel, confirmar que o menu nativo ainda alcança as páginas e que não há rolagem horizontal global.

- [ ] **Step 6: Build final e commit local.** Primeiro verificar que `tmp/pages-editorial-check-20260923` não existe; se existir, escolher um diretório temporário novo dentro da worktree sem remover o anterior. Rodar `rtk proxy python -m mkdocs build --strict --site-dir tmp/pages-editorial-check-20260923`, `rtk git diff --check` e revisar `rtk git diff`. Fazer commit apenas de `docs/stylesheets/extra.css` e `tests/test_site_navigation.py` com mensagem `style(docs): melhora leitura editorial das páginas internas`. Conferir `rtk git status --short --branch` e `rtk git log -2 --oneline`; não fazer push.

## Acceptance handoff

Mostrar ao usuário a prévia local compilada, registrar os testes e o build realmente executados, os dois commits locais e qualquer diferença deliberada em relação ao estudo visual. Deixar explícito que o Pages público não mudou e aguardar autorização separada para eventual integração/publicação.
