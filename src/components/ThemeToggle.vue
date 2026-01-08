<template>
  <button
    type="button"
    data-theme-toggle
    class="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500 cursor-pointer"
    @click="cycle"
    aria-label="Toggle theme"
  >
    <i
      class="ri-sun-fill text-2xl leading-none text-amber-500 animate-[spin_30s_linear_infinite]"
      data-mode-icon="light"
      aria-hidden="true"
    />
    <i
      class="ri-moon-fill text-2xl leading-none text-indigo-500 animate-[rocking-moon_3s_ease-in-out_alternate_infinite]"
      data-mode-icon="dark"
      aria-hidden="true"
    />
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

type Mode = "light" | "dark";

const STORAGE_KEY = "themeMode";
const EVENT_NAME = "themeModeChange";

function isMode(x: unknown): x is Mode {
  return x === "light" || x === "dark";
}

function readPreference(): Mode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Legacy: treat "system" as unset (follow system preference).
    if (raw === "system") return null;
    return isMode(raw) ? raw : null;
  } catch {
    return null;
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
  document.body.classList.toggle("dark", mode === "dark");
  document.body.dataset.themeMode = mode;
}

function dispatch(mode: Mode) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { mode } }));
}

const mode = ref<Mode>("light");
const hasPreference = ref(false);

function setMode(next: Mode) {
  mode.value = next;
  hasPreference.value = true;
  writeMode(next);
  apply(next);
  dispatch(next);
}

function cycle() {
  const next: Mode = mode.value === "light" ? "dark" : "light";
  setMode(next);
}

let mql: MediaQueryList | undefined;
const onSystemChange = () => {
  // Only follow system changes when the user hasn't set a preference.
  if (hasPreference.value) return;
  const next: Mode = systemPrefersDark() ? "dark" : "light";
  mode.value = next;
  apply(next);
};

const onExternalModeChange = (evt: Event) => {
  const e = evt as CustomEvent<{ mode?: unknown }>;
  const next = e.detail?.mode;
  if (isMode(next)) {
    mode.value = next;
    hasPreference.value = true;
    apply(next);
  }
};

onMounted(() => {
  const pref = readPreference();
  hasPreference.value = pref !== null;
  mode.value =
    pref ??
    ((document.body?.dataset?.themeMode === "dark" ? "dark" : "light") as Mode);
  apply(mode.value);

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
