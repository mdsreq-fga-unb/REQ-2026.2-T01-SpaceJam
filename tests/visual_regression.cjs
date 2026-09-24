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
