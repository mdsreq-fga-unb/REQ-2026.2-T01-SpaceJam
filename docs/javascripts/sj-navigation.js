(() => {
  const storageKey = "spacejam:sidebar-open";
  const sidebar = document.querySelector(".md-sidebar--primary");
  const toggle = document.querySelector(".sj-sidebar-toggle");

  const desktopLayout = window.matchMedia("(min-width: 76.25em)");
  // As consultas complementares pertencem ao catálogo, sem outro nível no menu.
  if (document.querySelector('.sj-context-return')) {
    const catalogPath = new URL('../requisitos/', location.href).pathname;
    const catalogLink = [...document.querySelectorAll('.md-sidebar--primary a.md-nav__link')]
      .find((link) => new URL(link.href).pathname === catalogPath);
    catalogLink?.classList.add('md-nav__link--active');
    catalogLink?.setAttribute('aria-current', 'location');
  }
  const syncUnitGroups = () => {
    document.querySelectorAll(".md-sidebar--primary .md-nav__item--nested > .md-nav__toggle")
      .forEach((group) => {
        const item = group.parentElement;
        const label = item.querySelector(":scope > label.md-nav__link");
        const navigation = item.querySelector(":scope > nav.md-nav");
        group.checked = Boolean(item.querySelector("a.md-nav__link--active"));
        if (!label || !navigation) return;

        navigation.id = navigation.id || group.id + "-items";
        label.setAttribute("role", "button");
        label.setAttribute("tabindex", "0");
        label.setAttribute("aria-controls", navigation.id);
        label.setAttribute("aria-expanded", String(group.checked));
        if (label.dataset.sjKeyboardReady) return;

        label.dataset.sjKeyboardReady = "true";
        group.addEventListener("change", () => {
          label.setAttribute("aria-expanded", String(group.checked));
        });
        label.addEventListener("keydown", (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          event.stopPropagation();
          group.checked = !group.checked;
          group.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
  };
  syncUnitGroups();
  desktopLayout.addEventListener?.("change", syncUnitGroups);

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
    toggle.classList.add("sj-sidebar-toggle--ready");
  }

})();
