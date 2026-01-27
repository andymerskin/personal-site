<template>
  <button
    type="button"
    aria-label="Back to top"
    :class="[
      'fixed bottom-6 right-4 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 shadow-sm transition duration-200 ease-out dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900',
      isVisible
        ? 'opacity-100 pointer-events-auto translate-y-0'
        : 'opacity-0 pointer-events-none translate-y-2',
    ]"
    @click="handleClick"
  >
    <span class="sr-only">Back to top</span>
    <i class="ri-arrow-up-line text-2xl" aria-hidden="true"></i>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const THRESHOLD = 600;
const isVisible = ref(false);
let ticking = false;
let prefersReducedMotion = false;

const updateVisibility = () => {
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

const handleClick = () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });
};

onMounted(() => {
  prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  updateVisibility();
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("astro:page-load", updateVisibility);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("astro:page-load", updateVisibility);
});
</script>
