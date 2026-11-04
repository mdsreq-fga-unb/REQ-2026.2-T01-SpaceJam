(() => {
  document.querySelectorAll(".md-typeset table:not([class])").forEach((table) => {
    const headings = [...table.querySelectorAll("thead th")].map((heading) =>
      heading.textContent.trim()
    );
    if (headings.length < 3) return;
    const normalizedHeadings = headings.map((heading) => heading
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase());
    const useRecords = ["fase do rad", "parte interessada", "oe principal"]
      .includes(normalizedHeadings[0]);
    const useCycles = normalizedHeadings[0] === "ciclo" && normalizedHeadings[1] === "periodo";
    if (useCycles) {
      const list = document.createElement("div");
      list.className = "sj-cycle-list";
      table.querySelectorAll("tbody tr").forEach((row) => {
        const cells = [...row.cells];
        const details = document.createElement("details");
        details.className = "sj-cycle";
        const summary = document.createElement("summary");
        ["sj-cycle-code", "sj-cycle-period", "sj-cycle-title"].forEach((name, index) => {
          const span = document.createElement("span");
          span.className = name;
          span.append(...cells[index].childNodes);
          summary.append(span);
        });
        const body = document.createElement("dl");
        cells.slice(3).forEach((cell, index) => {
          const pair = document.createElement("div");
          const term = document.createElement("dt");
          term.textContent = headings[index + 3];
          const value = document.createElement("dd");
          value.append(...cell.childNodes);
          pair.append(term, value);
          body.append(pair);
        });
        details.append(summary, body);
        list.append(details);
      });
      const wrapper = table.closest(".md-typeset__scrollwrap");
      (wrapper || table).replaceWith(list);
      return;
    }
    table.classList.add(useRecords ? "sj-data-cards" : "sj-readable-table");
    if (useRecords) table.classList.add("sj-records");
    const region = document.createElement("div");
    const previous = table.previousElementSibling;
    region.className = "sj-table-scroll";
    region.setAttribute("role", "region");
    region.setAttribute("aria-label", previous?.matches("h2, h3, h4")
      ? "Tabela: " + previous.textContent.replace(/¶/g, "").trim()
      : "Tabela de dados");
    table.before(region);
    region.append(table);
    let currentGroup = "";
    table.querySelectorAll("tbody tr").forEach((row) => {
      const groupCell = row.cells[0];
      if (groupCell?.textContent.trim()) {
        currentGroup = groupCell.textContent.trim();
      } else if (useRecords && groupCell && currentGroup) {
        groupCell.textContent = currentGroup;
      }

      [...row.cells].forEach((cell, index) => {
        cell.dataset.label = headings[index] || "";
        if (/^(id\b|codigo\b)/.test(normalizedHeadings[index])) {
          cell.classList.add("sj-code-cell");
        }
        const content = document.createElement("span");
        content.className = "sj-cell-content";
        content.append(...cell.childNodes);
        cell.append(content);
      });
    });
    if (!useRecords) {
      const hint = document.createElement("p");
      hint.className = "sj-table-hint";
      hint.textContent = "Deslize a tabela para consultar todas as colunas.";
      hint.hidden = true;
      region.after(hint);
      const updateOverflow = () => {
        const overflows = region.clientWidth > 0 && region.scrollWidth > region.clientWidth + 1;
        hint.hidden = !overflows;
        if (overflows) region.tabIndex = 0;
        else region.removeAttribute("tabindex");
      };
      new ResizeObserver(updateOverflow).observe(region);
      updateOverflow();
    }
  });
})();
