<template>
  <nav
    v-if="isXlBreakpoint"
    aria-label="Primary"
    :class="[
      'fixed top-16 w-56 z-40',
      'opacity-0 scale-95 origin-top pointer-events-none',
      'transition-[transform,opacity] duration-150 ease-out',
      isVisible && 'duration-300 opacity-100 scale-100 pointer-events-auto',
    ]"
    :style="[
      reducedMotion ? { transition: 'none' } : {},
      { left: 'max(16px, calc((100vw - 1024px) / 2 + 16px))' },
    ]"
  >
    <div class="flex flex-col gap-y-4">
      <div class="flex items-center">
        <a
          href="/"
          class="decoration-amber-500 decoration-2 hover:underline"
        >
          <h1 class="text-xl font-bold">{{ siteName }}</h1>
        </a>
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
      </div>
      <ul class="flex flex-col gap-y-2">
        <li v-for="item in navItems" :key="item.href">
          <a
            :href="normalizePathname(item.href)"
            :class="[
              'inline-flex items-center py-1 hover:opacity-100',
              isActiveNavItem(currentPath, item)
                ? 'font-bold underline decoration-amber-500 decoration-2 underline-offset-4'
                : 'font-medium opacity-66',
            ]"
            :aria-current="
              isActiveNavItem(currentPath, item) ? 'page' : undefined
            "
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import {
  isActiveNavItem,
  NAV_ITEMS,
  normalizePathname,
  type NavItem,
} from "../config/navigation";
import { SITE_NAME } from "../config/pageMetadata";

const THRESHOLD = 1080;
const isVisible = ref(false);
const isXlBreakpoint = ref(false);
let ticking = false;
let prefersReducedMotion = false;
let reducedMotion = ref(false);

const navItems = NAV_ITEMS;
const siteName = SITE_NAME;
const currentPath = ref(
  typeof window !== "undefined"
    ? normalizePathname(window.location.pathname)
    : "",
);

const updateVisibility = () => {
  if (typeof window === "undefined") return;
  const isXl = window.innerWidth >= 1280;
  isXlBreakpoint.value = isXl;
  if (!isXl) {
    isVisible.value = false;
    return;
  }
  isVisible.value = window.scrollY > THRESHOLD;
};

const handleScroll = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    ticking = false;
    updateVisibility();
  });
};

const handleResize = () => {
  updateVisibility();
};

const updatePath = () => {
  if (typeof window !== "undefined") {
    currentPath.value = normalizePathname(window.location.pathname);
  }
};

const handlePageLoad = () => {
  updatePath();
  updateVisibility();
};

onMounted(() => {
  if (typeof window === "undefined") return;
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  reducedMotion.value = prefersReducedMotion;

  updatePath(); // Initialize path on mount
  updateVisibility();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });
  document.addEventListener("astro:page-load", handlePageLoad);
});

onUnmounted(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
  document.removeEventListener("astro:page-load", handlePageLoad);
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
