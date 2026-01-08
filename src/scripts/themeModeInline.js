(() => {
  const STORAGE_KEY = "themeMode";
  const MODES = /** @type {const} */ (["light", "dark"]);

  /**
   * @returns {"light" | "dark" | null}
   * Returns null when the user has no saved preference (follow system).
   */
  function readPreference() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Treat legacy "system" as unset.
      if (raw === "system") return null;
      // @ts-ignore - keep tiny and robust in inline script
      return MODES.includes(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  function systemPrefersDark() {
    return (
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
    );
  }

  /** Apply the effective theme to the given <body>. */
  function applyToBody(body) {
    const pref = readPreference();
    const effectiveMode = pref ?? (systemPrefersDark() ? "dark" : "light");
    body.classList.toggle("dark", effectiveMode === "dark");
    body.dataset.themeMode = effectiveMode;
  }

  applyToBody(document.body);

  // Astro client-side navigation swaps in a new document. Apply theme to the
  // incoming <body> *before* it renders to prevent flashes.
  window.addEventListener?.("astro:before-swap", (event) => {
    // `newDocument` exists on Astro's before-swap event.
    // @ts-ignore - inline script, keep it simple
    const newBody = event?.newDocument?.body;
    if (!newBody) return;

    applyToBody(newBody);
  });
})();


