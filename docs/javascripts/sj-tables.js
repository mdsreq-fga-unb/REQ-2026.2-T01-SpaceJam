(() => {
  document.querySelectorAll(".md-typeset table:not([class])").forEach((table) => {
    const headings = [...table.querySelectorAll("thead th")].map((heading) =>
      heading.textContent.trim()
    );
    if (headings.length < 5) return;

    table.classList.add("sj-data-cards");
    let currentGroup = "";
    table.querySelectorAll("tbody tr").forEach((row) => {
      const groupCell = row.cells[0];
      if (groupCell?.textContent.trim()) {
        currentGroup = groupCell.textContent.trim();
      } else if (groupCell && currentGroup) {
        groupCell.textContent = currentGroup;
      }

      [...row.cells].forEach((cell, index) => {
        cell.dataset.label = headings[index] || "";
      });
    });
  });
})();
