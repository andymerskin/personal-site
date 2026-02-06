<template>
  <nav
    aria-label="Primary"
    :class="[
      'fixed top-16 w-56 z-40 hidden lg:block',
      'transition-opacity duration-150 ease-out',
      isVisible
        ? 'duration-300 ease-out opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none',
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
        <ThemeToggle />
      </div>
      <ul class="flex flex-col gap-y-2">
        <li v-for="item in navItems" :key="item.href">
          <a
            :href="normalizePathname(item.href)"
            :class="[
              'inline-flex items-center py-1 hover:opacity-100',
              currentPath && isActiveNavItem(currentPath, item)
                ? 'font-bold underline decoration-amber-500 decoration-2 underline-offset-4'
                : 'font-medium opacity-66',
            ]"
            :aria-current="
              currentPath && isActiveNavItem(currentPath, item) ? 'page' : undefined
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
import { onMounted, onUnmounted, ref } from "vue";
import {
  isActiveNavItem,
  NAV_ITEMS,
  normalizePathname,
} from "../config/navigation";
import { SITE_NAME } from "../config/pageMetadata";
import ThemeToggle from "./ThemeToggle.vue";

const THRESHOLD = 1080;
const isVisible = ref(false);
let ticking = false;
let prefersReducedMotion = false;
let reducedMotion = ref(false);

const navItems = NAV_ITEMS;
const siteName = SITE_NAME;
// Initialize currentPath - will be updated on mount to avoid hydration mismatch
const currentPath = ref("");

const updateVisibility = () => {
  if (typeof window === "undefined") return;
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
  document.addEventListener("astro:page-load", handlePageLoad);
});

onUnmounted(() => {
  if (typeof window === "undefined") return;
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("astro:page-load", handlePageLoad);
});
</script>
