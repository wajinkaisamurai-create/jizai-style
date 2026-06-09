(() => {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (!toggle || !menu) return;

  const links = Array.from(menu.querySelectorAll("a"));
  const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const parentMap = {
    "sokudo-group.html": "sokudo.html",
    "sokudo-private.html": "sokudo.html",
    "passcode-members.html": "passcode.html",
  };
  const activePage = parentMap[currentPage] || currentPage;

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0].split("?")[0].toLowerCase();
    const inlineActive = (link.getAttribute("style") || "").includes("--accent");
    if ((href && href === activePage) || inlineActive) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });

  const syncState = () => {
    const open = menu.classList.contains("open");
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  };

  new MutationObserver(syncState).observe(menu, {
    attributes: true,
    attributeFilter: ["class"],
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.classList.contains("open")) return;
    toggle.classList.remove("open");
    menu.classList.remove("open");
    syncState();
  });

  syncState();
})();
