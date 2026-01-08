(() => {
  const STORAGE_KEY = "themeMode";
  const MODES = /** @type {const} */ (["system", "light", "dark"]);

  /** @returns {"system" | "light" | "dark"} */
  function readMode() {
    const raw = localStorage.getItem(STORAGE_KEY);
    // @ts-ignore - keep tiny and robust in inline script
    return MODES.includes(raw) ? raw : "system";
  }

  function systemPrefersDark() {
    return (
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
    );
  }

  /** Apply the effective theme to the current <body>. */
  function apply() {
    const mode = readMode();
    const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
    document.body.classList.toggle("dark", isDark);
    document.body.dataset.themeMode = mode;
  }

  apply();

  // Astro client-side navigation swaps in a new document. Apply theme to the
  // incoming <body> *before* it renders to prevent flashes.
  window.addEventListener?.("astro:before-swap", (event) => {
    // `newDocument` exists on Astro's before-swap event.
    // @ts-ignore - inline script, keep it simple
    const newBody = event?.newDocument?.body;
    if (!newBody) return;

    const mode = readMode();
    const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
    newBody.classList.toggle("dark", isDark);
    newBody.dataset.themeMode = mode;
  });
})();


