<template>
  <ul ref="gridRef" class="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
    <li v-for="entry in entries" :key="entry.id" class="work-card">
      <a
        :href="`/work/${entry.id}/`"
        class="group block focus:outline-none"
        :aria-label="entry.title"
      >
        <div
          class="bg-shade-primary/2 inset-ring-shade-primary/5 group-hover:inset-ring-shade-primary/10 group-focus:inset-ring-shade-primary/10 aspect-3/2 w-full overflow-hidden rounded-lg inset-ring-1 group-hover:ring-2 group-hover:inset-ring-2 group-hover:ring-neutral-800 group-hover:ring-offset-2 group-focus:ring-2 group-focus:inset-ring-2 group-focus:ring-neutral-800 group-focus:ring-offset-2 dark:bg-white dark:inset-ring-0 dark:group-hover:ring-2 dark:group-hover:inset-ring-2 dark:group-hover:inset-ring-neutral-800"
          :class="entry.classes"
        >
          <div class="flex h-full w-full items-center justify-center p-6">
            <img
              :src="entry.logoAttrs.src"
              :srcset="entry.logoAttrs.srcset"
              :sizes="entry.logoAttrs.sizes"
              :width="entry.logoAttrs.width"
              :height="entry.logoAttrs.height"
              alt=""
              class="max-h-[80%] max-w-[85%] object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="mt-3">
          <div class="text-center text-lg leading-tight font-bold">
            <span
              class="decoration-amber-500 decoration-2 group-hover:underline group-hover:underline-offset-4 group-focus:underline group-focus:underline-offset-4"
            >
              {{ entry.title }}
            </span>
          </div>
          <div
            class="mt-1 text-center text-sm text-neutral-600 dark:text-neutral-400"
          >
            {{ entry.type }}
          </div>
          <div
            class="text-center text-xs text-neutral-600 dark:text-neutral-400"
          >
            {{ entry.year }}
          </div>
        </div>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { prefersReducedMotion } from "../utils/prefersReducedMotion";

interface WorkGridEntry {
  id: string;
  title: string;
  type: string;
  year: string;
  classes?: string;
  logoAttrs: {
    src: string;
    srcset?: string;
    sizes?: string;
    width: number;
    height: number;
  };
}

const props = defineProps<{
  entries: WorkGridEntry[];
}>();

const gridRef = ref<HTMLElement | null>(null);
let gsapLib: (typeof import("gsap"))["gsap"] | null = null;

const loadGsap = async () => {
  if (gsapLib) return gsapLib;
  const { gsap } = await import("gsap");
  gsapLib = gsap;
  return gsapLib;
};

const animateCards = async () => {
  await nextTick();

  const cards = gridRef.value?.querySelectorAll(".work-card") ?? [];
  if (cards.length === 0) return;

  const gsap = await loadGsap();

  if (prefersReducedMotion()) {
    // Skip animation, show cards immediately
    gsap.set(cards, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    cards,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.05,
    },
  );
};

onMounted(() => {
  if (props.entries.length > 0) {
    animateCards();
  }
});

onUnmounted(() => {
  if (gridRef.value && gsapLib) {
    const cards = gridRef.value.querySelectorAll(".work-card");
    gsapLib.killTweensOf(cards);
  }
});
</script>

<style scoped>
.work-card {
  opacity: 0;
  transform: translateY(20px);
}
</style>
