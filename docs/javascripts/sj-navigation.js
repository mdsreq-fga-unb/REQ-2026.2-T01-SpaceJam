(() => {
  const storageKey = "spacejam:sidebar-open";
  const sidebar = document.querySelector(".md-sidebar--primary");
  const toggle = document.querySelector(".sj-sidebar-toggle");

  if (sidebar && toggle) {
    sidebar.id = "sj-primary-nav";
    let remembered = "1";
    try {
      remembered = sessionStorage.getItem(storageKey) ?? "1";
    } catch (_) {
      // Private browsing can deny access to session storage; keep the sidebar open.
    }

    const setOpen = (open) => {
      document.documentElement.classList.toggle("sj-sidebar-closed", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Recolher navegação" : "Abrir navegação");
      try {
        sessionStorage.setItem(storageKey, open ? "1" : "0");
      } catch (_) {
        // The current page still responds even when persistence is unavailable.
      }
    };

    setOpen(remembered !== "0");
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const openMenu = document.querySelector(".sj-top-menu[open]");
    if (!openMenu) return;
    openMenu.open = false;
    openMenu.querySelector("summary")?.focus();
  });
})();
