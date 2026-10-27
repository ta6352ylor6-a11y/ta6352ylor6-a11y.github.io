(() => {
  const sidebar = document.querySelector("[data-sidebar]");
  const scrim = document.querySelector("[data-scrim]");
  const toggle = (open) => {
    sidebar.classList.toggle("open", open);
    scrim.classList.toggle("open", open);
  };
  document.querySelector("[data-menu]").addEventListener("click", () => toggle(!sidebar.classList.contains("open")));
  scrim.addEventListener("click", () => toggle(false));

  const inputs = [...document.querySelectorAll("[data-search-input]")];
  const items = [...document.querySelectorAll("[data-item]")];
  const empty = document.querySelector("[data-empty]");
  const filter = (raw) => {
    const q = raw.trim().toLowerCase();
    inputs.forEach((input) => { if (input.value !== raw) input.value = raw; });
    items.forEach((item) => { item.hidden = q !== "" && !item.dataset.search.includes(q); });
    let visible = 0;
    document.querySelectorAll("[data-section]").forEach((section) => {
      const shown = [...section.querySelectorAll("[data-item]")].some((item) => !item.hidden);
      section.hidden = !shown;
      if (shown) visible += 1;
    });
    if (empty) empty.hidden = visible > 0;
  };
  if (items.length) {
    inputs.forEach((input) => {
      input.addEventListener("input", () => filter(input.value));
      input.form.addEventListener("submit", (event) => { event.preventDefault(); filter(input.value); });
    });
    document.querySelectorAll("[data-keyword]").forEach((chip) => chip.addEventListener("click", () => filter(chip.dataset.keyword)));
    const q = new URLSearchParams(location.search).get("q");
    if (q) filter(q);
  }

  const subsites = document.querySelector("[data-subsites]");
  if (subsites) {
    fetch("https://ai.1bgp.com/sites.json", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : []))
      .then((list) => {
        if (!Array.isArray(list) || !list.length) return;
        const grid = subsites.querySelector("[data-subsite-grid]");
        for (const s of list) {
          const a = document.createElement("a");
          a.className = "card";
          a.href = s.url;
          const name = document.createElement("span");
          name.className = "card-name";
          name.textContent = s.title;
          const desc = document.createElement("span");
          desc.className = "card-desc";
          desc.textContent = s.description || s.url;
          const body = document.createElement("span");
          body.className = "card-body";
          body.append(name, desc);
          a.append(body);
          grid.append(a);
        }
        subsites.hidden = false;
      })
      .catch(() => {});
  }
})();
