// Optional browser regression suite. Run against a local MkDocs preview:
// npm run test:visual -- <preview-base-url> (from the tests directory).
const assert = require("node:assert/strict");
const path = require("node:path");

const baseUrl = process.argv[2];
const playwrightModule = process.argv[3] || "playwright";
if (!baseUrl) {
  console.error("Usage: node tests/visual_regression.cjs <preview-base-url> [playwright-module]");
  process.exit(2);
}

const { chromium } = require(playwrightModule);
const sharp = require(require.resolve("sharp", { paths: [path.dirname(require.resolve(playwrightModule))] }));
const failures = [];

async function check(name, action) {
  try {
    await action();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures.push(name);
    console.error(`FAIL ${name}: ${error.message}`);
  }
}

function route(name) {
  return new URL(name, baseUrl).href;
}

async function pixel(page, x, y) {
  const image = await page.screenshot({ clip: { x, y, width: 1, height: 1 } });
  return [...await sharp(image).removeAlpha().raw().toBuffer()];
}

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const open = async (name) => {
    await page.goto(route(name), { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(350);
  };

  try {
    await open("reunioes/");
    await check("sidebar groups vision documents and links directly to deliveries", async () => {
      const navigation = await page.evaluate(() => {
        const sidebar = document.querySelector(".md-sidebar--primary");
        return {
          groups: [...sidebar.querySelectorAll(".md-nav__item--nested > .md-nav__link")]
            .map((link) => link.textContent.trim()),
          links: [...sidebar.querySelectorAll("a.md-nav__link")]
            .map((link) => ({ text: link.textContent.trim(), href: link.getAttribute("href") })),
        };
      });
      assert.deepEqual(navigation.groups, ["Visão do Produto e Projeto"]);
      assert.ok(navigation.links.some((link) => link.text === "8. Requisitos de Software" &&
        link.href.includes("requisitos/")));
      assert.ok(navigation.links.some((link) => link.text === "Entregas" &&
        link.href.includes("entregas/")));
      assert.ok(navigation.links.every((link) => !/^Unidade [12]$/.test(link.text)));
    });
    await check("sidebar links do not overlap", async () => {
      const links = await page.evaluate(() => [...document.querySelectorAll(".md-sidebar--primary a.md-nav__link")]
        .filter((link) => ["8. Requisitos de Software", "Reuniões"].includes(link.textContent.trim()))
        .map((link) => ({ text: link.textContent.trim(), top: link.getBoundingClientRect().top,
          bottom: link.getBoundingClientRect().bottom })));
      const requirements = links.find((link) => link.text === "8. Requisitos de Software");
      const meetings = links.find((link) => link.text === "Reuniões");
      assert.ok(requirements && meetings, "both navigation links must exist");
      assert.ok(meetings.top >= requirements.bottom,
        `Reuniões starts at ${meetings.top}, before Requisitos ends at ${requirements.bottom}`);
    });

    await check("document pages share a centered editorial reading axis", async () => {
      for (const name of ["cenario_atual/", "solucao/", "intervencao_social/", "estrategia/",
        "engenharia_requisitos/", "cronograma/", "interacao_equipe_cliente/", "requisitos/",
        "licoes-aprendidas/", "reunioes/"]) {
        await open(name);
        const layout = await page.evaluate(() => {
          const article = document.querySelector(".md-content__inner");
          const box = (element) => {
            if (!element) return null;
            const rect = element.getBoundingClientRect();
            return { center: (rect.left + rect.right) / 2, width: rect.width,
              left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          };
          const paragraph = [...article.children].find((element) => element.tagName === "P" &&
            !element.querySelector("img"));
          const list = [...article.children].find((element) => ["UL", "OL"].includes(element.tagName));
          return { article: box(article), title: box(article.querySelector(":scope > h1")),
            titleAlign: getComputedStyle(article.querySelector(":scope > h1")).textAlign,
            section: box(article.querySelector(":scope > h2")),
            sectionAlign: article.querySelector(":scope > h2") &&
              getComputedStyle(article.querySelector(":scope > h2")).textAlign,
            paragraph: box(paragraph), list: box(list), edit: box(article.querySelector(":scope > .md-content__button")),
            overflow: document.documentElement.scrollWidth - innerWidth };
        });
        assert.equal(layout.titleAlign, "center", `${name}: ${JSON.stringify(layout)}`);
        assert.ok(Math.abs(layout.title.center - layout.article.center) <= 2,
          `${name}: ${JSON.stringify(layout)}`);
        if (layout.section) assert.equal(layout.sectionAlign, "center", `${name}: ${JSON.stringify(layout)}`);
        for (const block of [layout.paragraph, layout.list].filter(Boolean)) {
          assert.ok(Math.abs(block.center - layout.article.center) <= 2 &&
            block.width <= layout.article.width - 40, `${name}: ${JSON.stringify(layout)}`);
        }
        assert.ok(layout.edit.bottom <= layout.title.top || layout.edit.left >= layout.title.right ||
          layout.edit.top >= layout.title.bottom, `${name}: edit button overlaps title`);
        assert.equal(layout.overflow, 0, `${name}: page overflows`);
      }
    });

    await open("");
    await check("home section introductions center over their content grids", async () => {
      const layout = await page.evaluate(() => {
        const home = document.querySelector(".sj-home").getBoundingClientRect();
        const center = (rect) => (rect.left + rect.right) / 2;
        return { homeCenter: center(home), homeWidth: home.width,
          headings: [...document.querySelectorAll(".sj-home .sj-section-heading")].map((element) => {
            const rect = element.getBoundingClientRect();
            return { center: center(rect), width: rect.width,
              align: getComputedStyle(element).textAlign };
          }) };
      });
      assert.ok(layout.headings.length >= 3, JSON.stringify(layout));
      assert.ok(layout.headings.every((heading) => heading.align === "center" &&
        Math.abs(heading.center - layout.homeCenter) <= 2 &&
        heading.width <= layout.homeWidth - 40), JSON.stringify(layout));
    });

    await open("entregas/");
    await check("delivery hero, sections and action share a centered reading axis", async () => {
      const layout = await page.evaluate(() => {
        const box = (selector) => document.querySelector(selector).getBoundingClientRect();
        const center = (rect) => (rect.left + rect.right) / 2;
        const reading = box(".md-content__inner");
        const hero = box(".sj-delivery-hero");
        const heading = document.querySelector(".md-content__inner > h2");
        const paragraph = box(".md-content__inner > p");
        const action = box(".sj-delivery-watch");
        return { readingCenter: center(reading), readingWidth: reading.width,
          heroCenter: center(hero), headingAlign: getComputedStyle(heading).textAlign,
          paragraphCenter: center(paragraph), paragraphWidth: paragraph.width,
          actionCenter: center(action) };
      });
      assert.ok(Math.abs(layout.heroCenter - layout.readingCenter) <= 2, JSON.stringify(layout));
      assert.equal(layout.headingAlign, "center");
      assert.ok(Math.abs(layout.paragraphCenter - layout.readingCenter) <= 2, JSON.stringify(layout));
      assert.ok(layout.paragraphWidth <= layout.readingWidth - 40, JSON.stringify(layout));
      assert.ok(Math.abs(layout.actionCenter - layout.readingCenter) <= 2, JSON.stringify(layout));
    });
    await check("delivery overview uses aligned cards without leaving the page", async () => {
      const layout = await page.evaluate(() => {
        const cards = [...document.querySelectorAll(".sj-delivery-docs section")]
          .map((section) => section.getBoundingClientRect());
        const content = document.querySelector(".md-content").getBoundingClientRect();
        return { cards: cards.map(({ left, right, top, bottom }) => ({ left, right, top, bottom })),
          content: { left: content.left, right: content.right },
          pageOverflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.equal(layout.cards.length, 3);
      assert.equal(layout.pageOverflow, 0);
      assert.ok(layout.cards.every((card) => card.left >= layout.content.left &&
        card.right <= layout.content.right), JSON.stringify(layout));
      assert.ok(layout.cards.every((card) => Math.abs(card.top - layout.cards[0].top) < 2),
        `delivery cards are not aligned in one desktop row: ${JSON.stringify(layout.cards)}`);
      assert.ok(layout.cards[0].right + 8 <= layout.cards[1].left &&
        layout.cards[1].right + 8 <= layout.cards[2].left,
        `delivery cards overlap: ${JSON.stringify(layout.cards)}`);
    });
    await check("delivery video has a visible exit when its embed cannot load", async () => {
      const directLink = page.locator('.md-content a[href$="1ySRDJSQ_FC6vnDdUjZx5q-eJDFyM_ZM1/view"]').first();
      assert.ok(await directLink.isVisible());
      const preview = page.locator("details.sj-delivery-video-details");
      assert.equal(await preview.count(), 1);
      assert.equal(await preview.getAttribute("open"), null);
      const summaryLayout = await preview.locator("summary").evaluate((summary) => ({
        leadingIcon: getComputedStyle(summary, "::before").display,
        leftMargin: parseFloat(getComputedStyle(summary).marginLeft),
      }));
      assert.equal(summaryLayout.leadingIcon, "none");
      assert.ok(summaryLayout.leftMargin >= 0, JSON.stringify(summaryLayout));
      await preview.locator("summary").click();
      assert.ok(await preview.locator("iframe").isVisible());
    });
    await check("desktop footer stays clear of the sticky navigation", async () => {
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      const bounds = await page.evaluate(() => {
        const right = (selector) => document.querySelector(selector).getBoundingClientRect().right;
        const left = (selector) => document.querySelector(selector).getBoundingClientRect().left;
        return { sidebarRight: right(".md-sidebar--primary"),
          previousTitleLeft: left(".md-footer__link--prev .md-footer__title"),
          copyrightLeft: left(".md-footer-meta__inner .md-copyright") };
      });
      assert.ok(bounds.previousTitleLeft >= bounds.sidebarRight &&
        bounds.copyrightLeft >= bounds.sidebarRight, JSON.stringify(bounds));
    });
    await open("reunioes/");

    await check("hamburger stays in the upper-left corner without covering the brand", async () => {
      await page.locator(".sj-sidebar-toggle").click();
      const position = await page.evaluate(() => {
        const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
        const brand = document.querySelector(".md-header__button.md-logo").getBoundingClientRect();
        return { left: toggle.left, top: toggle.top, right: toggle.right,
          brandLeft: brand.left, brandTop: brand.top, brandBottom: brand.bottom };
      });
      assert.ok(position.left <= 24 && position.top <= 24, JSON.stringify(position));
      assert.ok(position.right + 8 <= position.brandLeft || position.top >= position.brandBottom,
        `hamburger covers brand: ${JSON.stringify(position)}`);
    });

    await check("light mode also lightens navigation and header", async () => {
      await page.locator('label[for="__palette_1"]').click({ force: true });
      await page.waitForTimeout(350);
      const colors = await page.evaluate(() => {
        const color = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor
          .match(/\d+/g).slice(0, 3).map(Number);
        return { scheme: document.body.dataset.mdColorScheme,
          sidebar: color(".md-sidebar--primary"), header: color(".md-header") };
      });
      assert.equal(colors.scheme, "default");
      assert.ok(colors.sidebar.every((channel) => channel >= 200), JSON.stringify(colors));
      assert.ok(colors.header.every((channel) => channel >= 200), JSON.stringify(colors));
    });

    await check("footer links remain readable in light mode", async () => {
      const footer = await page.evaluate(() => {
        const channels = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
        return { background: channels(getComputedStyle(document.querySelector(".md-footer")).backgroundColor),
          link: channels(getComputedStyle(document.querySelector(".md-footer__link")).color) };
      });
      assert.ok(footer.background.every((channel) => channel >= 200), JSON.stringify(footer));
      assert.ok(footer.link.every((channel) => channel <= 120), JSON.stringify(footer));
    });

    await check("light mode search field keeps a readable placeholder", async () => {
      const search = await page.evaluate(() => {
        const channels = (value) => value.match(/\d+/g).slice(0, 3).map(Number);
        const input = document.querySelector(".md-search__input");
        return { field: channels(getComputedStyle(input.parentElement).backgroundColor),
          placeholder: channels(getComputedStyle(input, "::placeholder").color) };
      });
      assert.ok(search.field.every((channel) => channel >= 220), JSON.stringify(search));
      assert.ok(search.placeholder.every((channel) => channel <= 130), JSON.stringify(search));
    });

    await page.locator(".sj-sidebar-toggle").click();
    await open("cronograma/");
    await check("wide tables become readable cards without horizontal scrolling", async () => {
      const geometry = await page.evaluate(() => {
        const article = document.querySelector(".md-content__inner").getBoundingClientRect();
        const table = document.querySelector("table.sj-data-cards");
        const box = table.getBoundingClientRect();
        return { articleLeft: article.left, articleRight: article.right,
          left: box.left, right: box.right, client: table.clientWidth,
          scroll: table.scrollWidth, tableWidth: box.width,
          cardCount: table.querySelectorAll("tbody tr").length,
          labeledCells: table.querySelectorAll("tbody td[data-label]").length,
          cellCount: table.querySelectorAll("tbody td").length,
          hasLink: Boolean(table.querySelector('tbody a[href*="cenario_atual"]')),
          pageWidth: document.documentElement.scrollWidth };
      });
      assert.ok(geometry.left >= geometry.articleLeft - 1 && geometry.right <= geometry.articleRight + 1,
        `cards protrude from article: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.scroll <= geometry.client + 1,
        `table still needs horizontal scrolling: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.tableWidth <= geometry.client + 1,
        `table is wider than its reading column: ${JSON.stringify(geometry)}`);
      assert.equal(geometry.labeledCells, geometry.cellCount,
        `card fields lost their labels: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.cardCount === 2 && geometry.hasLink,
        `cycle content or links disappeared: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.pageWidth <= 1366, `whole page scrolls horizontally: ${JSON.stringify(geometry)}`);
    });

    for (const routeName of ["cronograma/", "engenharia_requisitos/", "solucao/"]) {
      await open(routeName);
      await check(`all wide tables fit without scrolling on ${routeName}`, async () => {
        const tables = await page.evaluate(() => [...document.querySelectorAll("table.sj-data-cards")]
          .map((table) => ({ client: table.clientWidth, scroll: table.scrollWidth,
            labels: table.querySelectorAll("tbody td[data-label]").length,
            cells: table.querySelectorAll("tbody td").length })));
        assert.ok(tables.length, `${routeName} has no card tables`);
        assert.ok(tables.every((table) => table.scroll <= table.client + 1 &&
          table.labels === table.cells), JSON.stringify(tables));
      });
    }

    await open("engenharia_requisitos/");
    await check("cards repeat the group name when the source table leaves it blank", async () => {
      const groups = await page.evaluate(() => [...document.querySelectorAll(
        "table.sj-data-cards:first-of-type tbody tr"
      )].slice(0, 3).map((row) => row.cells[0].textContent.trim()));
      assert.deepEqual(groups, ["Planejamento da Release", "Planejamento da Release",
        "Planejamento da Release"]);
    });

    await check("table frame has no empty inset", async () => {
      const inset = await page.evaluate(() => {
        const wrapper = document.querySelector(".md-typeset__table");
        const table = wrapper.querySelector("table");
        return table.getBoundingClientRect().left - wrapper.getBoundingClientRect().left;
      });
      assert.ok(inset <= 2, `table starts ${inset}px inside its frame`);
    });

    await check("dark page backdrop is consistent across documents", async () => {
      await page.locator('label[for="__palette_0"]').click({ force: true });
      await page.waitForTimeout(150);
      const schedule = await pixel(page, 1350, 450);
      await open("reunioes/");
      const solution = await pixel(page, 1350, 450);
      const difference = schedule.map((value, index) => Math.abs(value - solution[index]));
      assert.ok(difference.every((channel) => channel <= 3),
        `background pixels differ: ${schedule} vs ${solution}`);
    });

    await check("tables do not widen the page when JavaScript is unavailable", async () => {
      const noScriptPage = await browser.newPage({
        viewport: { width: 800, height: 900 }, javaScriptEnabled: false,
      });
      try {
        await noScriptPage.goto(route("cronograma/"), { waitUntil: "domcontentloaded" });
        const widths = await noScriptPage.evaluate(() => ({
          page: document.documentElement.scrollWidth,
          viewport: innerWidth,
          table: document.querySelector(".md-typeset table").getBoundingClientRect().width,
        }));
        assert.ok(widths.page <= widths.viewport, JSON.stringify(widths));
      } finally {
        await noScriptPage.close();
      }
    });

    for (const width of [1220, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await open("solucao/");
      await check(`sidebar stays aligned with the corner button at ${width}px`, async () => {
        const position = await page.evaluate(() => {
          const sidebar = document.querySelector(".md-sidebar--primary").getBoundingClientRect();
          const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
          return { sidebarLeft: sidebar.left, sidebarRight: sidebar.right,
            toggleLeft: toggle.left, toggleRight: toggle.right };
        });
        assert.ok(Math.abs(position.sidebarLeft - position.toggleLeft) <= 24 &&
          position.toggleRight + 16 <= position.sidebarRight, JSON.stringify(position));
      });
      await check(`navigation and tables stay contained at ${width}px`, async () => {
        const layout = await page.evaluate(() => {
          const toggle = document.querySelector(".sj-sidebar-toggle").getBoundingClientRect();
          const brand = document.querySelector(".md-header__button.md-logo").getBoundingClientRect();
          const article = document.querySelector(".md-content__inner").getBoundingClientRect();
          const tables = [...document.querySelectorAll(".md-typeset__scrollwrap")]
            .map((wrapper) => wrapper.getBoundingClientRect());
          const links = [...document.querySelectorAll(".md-sidebar--primary a.md-nav__link")]
            .map((link) => link.getBoundingClientRect()).filter((rect) => rect.width && rect.height);
          const overlap = links.some((first, index) => links.slice(index + 1).some((second) =>
            Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 1 &&
            Math.min(first.right, second.right) - Math.max(first.left, second.left) > 1));
          return { width: innerWidth, page: document.documentElement.scrollWidth,
            toggleRight: toggle.right, brandLeft: brand.left, overlap,
            tablesContained: tables.every((table) => table.left >= article.left - 1 &&
              table.right <= article.right + 1) };
        });
        assert.ok(layout.page <= width && !layout.overlap && layout.tablesContained,
          JSON.stringify(layout));
        assert.ok(layout.toggleRight + 8 <= layout.brandLeft, JSON.stringify(layout));
      });
    }

    await check("document titles stay clear of the edit action at narrower widths", async () => {
      for (const width of [1220, 390]) {
        await page.setViewportSize({ width, height: 900 });
        for (const name of ["solucao/", "engenharia_requisitos/", "reunioes/"]) {
          await open(name);
          const bounds = await page.evaluate(() => {
            const title = document.querySelector(".md-content__inner > h1").getBoundingClientRect();
            const edit = document.querySelector(".md-content__inner > .md-content__button").getBoundingClientRect();
            return { title: { left: title.left, right: title.right, top: title.top, bottom: title.bottom },
              edit: { left: edit.left, right: edit.right, top: edit.top, bottom: edit.bottom },
              overflow: document.documentElement.scrollWidth - innerWidth };
          });
          assert.ok(bounds.title.right + 4 <= bounds.edit.left ||
            bounds.title.top >= bounds.edit.bottom || bounds.title.bottom <= bounds.edit.top,
          `${width}px ${name}: ${JSON.stringify(bounds)}`);
          assert.equal(bounds.overflow, 0, `${width}px ${name}: page overflows`);
        }
      }
    });

    await page.setViewportSize({ width: 800, height: 900 });
    await open("cronograma/");
    await check("mobile page stays within the viewport", async () => {
      const width = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(width <= 800, `mobile document is ${width}px wide`);
    });
  } finally {
    await browser.close();
  }

  if (failures.length) process.exitCode = 1;
})().catch((error) => { console.error(error); process.exitCode = 1; });
