<template>
  <nav
    aria-label="Primary"
    :class="[
      'fixed top-0 left-0 right-0 z-50 hidden md:block lg:hidden',
      'bg-white dark:bg-neutral-900',
      'shadow-lg dark:shadow-none',
      'transition-opacity duration-200',
      isVisible
        ? 'opacity-100 pointer-events-auto'
        : 'opacity-0 pointer-events-none',
    ]"
  >
    <div class="mx-auto max-w-5xl px-4 md:px-16 lg:px-4">
      <div class="flex flex-wrap items-center gap-x-10 gap-y-2 py-2">
        <div class="flex items-center">
          <a href="/" class="decoration-amber-500 decoration-2 hover:underline">
            <h1 class="text-xl font-bold">{{ siteName }}</h1>
          </a>
          <ThemeToggle />
        </div>
        <ul class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <li v-for="item in navItems" :key="item.href">
            <a
              :href="normalizePathname(item.href)"
              v-bind="getNavLinkAttributes(item)"
              :class="[
                'inline-flex items-center py-1 hover:opacity-100',
                currentPath && isActiveNavItem(currentPath, item)
                  ? 'font-bold underline decoration-amber-500 decoration-2 underline-offset-4'
                  : 'font-medium opacity-66',
              ]"
              :aria-current="
                currentPath && isActiveNavItem(currentPath, item)
                  ? 'page'
                  : undefined
              "
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  getNavLinkAttributes,
  isActiveNavItem,
  NAV_ITEMS,
  normalizePathname,
} from "../config/navigation";
import { SITE_NAME } from "../config/pageMetadata";
import ThemeToggle from "./ThemeToggle.vue";

const THRESHOLD = 240;
const isVisible = ref(false);
let ticking = false;

const navItems = NAV_ITEMS;
const siteName = SITE_NAME;
// Initialize currentPath - will be updated on mount to avoid hydration mismatch
const currentPath = ref("");

const updateVisibility = () => {
  if (typeof window === "undefined") return;
  // Only show at md-lg breakpoints (not xl)
  const isXl = window.innerWidth >= 1280;
  isVisible.value = !isXl && window.scrollY > THRESHOLD;
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
