<template>
  <button
    type="button"
    data-theme-toggle
    class="text-sm opacity-66 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:focus-visible:ring-slate-500 cursor-pointer"
    @click="cycle"
    aria-label="Toggle theme"
  >
    <i
      class="ri-computer-fill text-base leading-none"
      data-mode-icon="system"
      aria-hidden="true"
    />
    <i
      class="ri-sun-fill text-base leading-none"
      data-mode-icon="light"
      aria-hidden="true"
    />
    <i
      class="ri-moon-fill text-base leading-none"
      data-mode-icon="dark"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type Mode = "system" | "light" | "dark";

const STORAGE_KEY = "themeMode";
const EVENT_NAME = "themeModeChange";

function isMode(x: unknown): x is Mode {
  return x === "system" || x === "light" || x === "dark";
}

function readMode(): Mode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return isMode(raw) ? raw : "system";
  } catch {
    return "system";
  }
}

function writeMode(mode: Mode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function apply(mode: Mode) {
  const isDark = mode === "dark" || (mode === "system" && systemPrefersDark());
  document.body.classList.toggle("dark", isDark);
  document.body.dataset.themeMode = mode;
}

function dispatch(mode: Mode) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { mode } }));
}

const mode = ref<Mode>("system");

function setMode(next: Mode) {
  mode.value = next;
  writeMode(next);
  apply(next);
  dispatch(next);
}

function cycle() {
  const next: Mode =
    mode.value === "system"
      ? "light"
      : mode.value === "light"
      ? "dark"
      : "system";
  setMode(next);
}

let mql: MediaQueryList | undefined;
const onSystemChange = () => {
  if (mode.value === "system") apply("system");
};

const onExternalModeChange = (evt: Event) => {
  const e = evt as CustomEvent<{ mode?: unknown }>;
  const next = e.detail?.mode;
  if (isMode(next)) {
    mode.value = next;
    apply(next);
  }
};

onMounted(() => {
  mql = window.matchMedia?.("(prefers-color-scheme: dark)");
  if (mql) {
    if (mql.addEventListener) mql.addEventListener("change", onSystemChange);
    else mql.addListener?.(onSystemChange);
  }

  window.addEventListener(EVENT_NAME, onExternalModeChange as EventListener);
});

onBeforeUnmount(() => {
  if (mql) {
    if (mql.removeEventListener)
      mql.removeEventListener("change", onSystemChange);
    else mql.removeListener?.(onSystemChange);
  }
  window.removeEventListener(EVENT_NAME, onExternalModeChange as EventListener);
});
</script>
