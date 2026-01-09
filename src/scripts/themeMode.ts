(() => {
  const STORAGE_KEY = "themeMode";
  const MODES = ["light", "dark"] as const;
  type ThemeMode = (typeof MODES)[number];

  /**
   * Returns null when the user has no saved preference (follow system).
   */
  function readPreference(): ThemeMode | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Treat legacy "system" as unset.
      if (raw === "system") return null;
      return MODES.includes(raw as ThemeMode) ? (raw as ThemeMode) : null;
    } catch {
      return null;
    }
  }

  function systemPrefersDark(): boolean {
    return (
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false
    );
  }

  /** Apply the effective theme to the given <body>. */
  function applyToBody(body: HTMLElement): void {
    // Ensure we're working with a body element
    if (!(body instanceof HTMLBodyElement)) return;

    const pref = readPreference();
    const effectiveMode: ThemeMode = pref ?? (systemPrefersDark() ? "dark" : "light");
    body.classList.toggle("dark", effectiveMode === "dark");
    body.dataset.themeMode = effectiveMode;
  }

  applyToBody(document.body);

  // Astro client-side navigation swaps in a new document. Apply theme to the
  // incoming <body> *before* it renders to prevent flashes.
  interface AstroBeforeSwapEvent extends Event {
    newDocument?: Document;
  }

  window.addEventListener?.("astro:before-swap", (event: Event) => {
    const astroEvent = event as AstroBeforeSwapEvent;
    const newBody = astroEvent?.newDocument?.body;
    if (!newBody) return;

    applyToBody(newBody);
  });
})();
