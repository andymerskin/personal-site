<template>
  <button
    type="button"
    data-theme-toggle
    aria-label="Toggle theme"
    class="relative top-px inline-flex cursor-pointer items-center justify-center w-10 h-10 px-0 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none dark:focus-visible:ring-neutral-500"
  >
    <span
      data-icon="light"
      class="inline-flex animate-[shining-sun_1s_ease-in-out_alternate_infinite]"
      aria-hidden="true"
    >
      <i
        class="ri-sun-fill animate-[spin_30s_linear_infinite] text-2xl leading-none text-amber-500"
      ></i>
    </span>
    <span
      data-icon="dark"
      class="inline-flex animate-[rocking-moon_3s_ease-in-out_alternate_infinite]"
      aria-hidden="true"
    >
      <i class="ri-moon-fill text-2xl leading-none text-indigo-500"></i>
    </span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

declare global {
  interface Window {
    __themeToggleSetup?: boolean;
    __themeToggleAnimationTimes?: number[][];
  }
}

const STORAGE_KEY = "themeMode";

const getStored = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return undefined;
};

const getCurrentMode = () => {
  const doc = document.documentElement;
  const datasetMode = doc.dataset.themeMode;
  if (datasetMode === "dark" || datasetMode === "light") return datasetMode;
  const stored = getStored();
  if (stored) return stored;
  return doc.classList.contains("dark") ? "dark" : "light";
};

const apply = (mode: string) => {
  const doc = document.documentElement;
  const isDark = mode === "dark";
  doc.classList.toggle("dark", isDark);
  doc.dataset.themeMode = mode;
  // Update all buttons
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("data-theme-state", mode);
  });
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
};

const updateButtons = () => {
  const currentMode = getCurrentMode();
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("data-theme-state", currentMode);
  });
};

const handleClick = (e: Event) => {
  const btn = (e.target as HTMLElement).closest("[data-theme-toggle]");
  if (!btn) return;

  const current = btn.getAttribute("data-theme-state") || getCurrentMode();
  const next = current === "dark" ? "light" : "dark";
  apply(next);
};

const handleBeforeSwap = (event: Event) => {
  // Apply the current theme state to the incoming document before navigation
  const astroEvent = event as CustomEvent<{ newDocument?: Document }>;
  const newDocument = astroEvent?.detail?.newDocument;

  const elements = Array.from(
    document.querySelectorAll("[data-theme-toggle] [data-icon], [data-theme-toggle] i"),
  );

  window.__themeToggleAnimationTimes = elements.map((element) =>
    element.getAnimations().map((animation) =>
      typeof animation.currentTime === "number" ? animation.currentTime : 0,
    ),
  );

  if (!newDocument) return;

  const currentMode = getCurrentMode();
  const isDark = currentMode === "dark";
  const newDoc = newDocument.documentElement;

  newDoc.classList.toggle("dark", isDark);
  newDoc.dataset.themeMode = currentMode;
};

const handleAfterSwap = () => {
  // Preserve the current theme state after navigation
  const currentMode = getCurrentMode();
  apply(currentMode);
  updateButtons();

  const savedTimes = window.__themeToggleAnimationTimes;
  if (!savedTimes) return;

  const elements = Array.from(
    document.querySelectorAll("[data-theme-toggle] [data-icon], [data-theme-toggle] i"),
  );

  elements.forEach((element, elementIndex) => {
    const times = savedTimes[elementIndex];
    if (!times) return;
    element.getAnimations().forEach((animation, animationIndex) => {
      const time = times[animationIndex];
      if (typeof time === "number") {
        animation.currentTime = time;
      }
    });
  });
};

onMounted(() => {
  // Only set up once - use event delegation so it works even when DOM is swapped
  if (window.__themeToggleSetup) {
    // If already set up, just update this button
    updateButtons();
    return;
  }
  window.__themeToggleSetup = true;

  // Initialize theme state
  apply(getCurrentMode());

  // Use event delegation on document - works even when buttons are swapped
  // Set this up once, it will work for all buttons
  document.addEventListener("click", handleClick);

  // Handle Astro view transitions
  document.addEventListener("astro:before-swap", handleBeforeSwap);
  document.addEventListener("astro:after-swap", handleAfterSwap);
});

onUnmounted(() => {
  // Note: We don't remove the event listeners here because they're shared
  // across all instances and should persist. The setup flag prevents
  // multiple initializations.
});
</script>

<style>
[data-theme-toggle] [data-icon] {
  display: none;
}

html:not(.dark) [data-theme-toggle] [data-icon="light"] {
  display: inline-flex;
}

html.dark [data-theme-toggle] [data-icon="dark"] {
  display: inline-flex;
}
</style>