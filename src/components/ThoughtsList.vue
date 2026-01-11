<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-5xl font-bold tracking-tight">Thoughts</h1>
      <label
        class="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300"
      >
        <span>Tag</span>
        <select
          v-model="selectedTag"
          class="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 transition focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-neutral-200"
        >
          <option value="All">All</option>
          <option v-for="tag in availableTags" :key="tag" :value="tag">
            {{ tag }}
          </option>
        </select>
      </label>
    </div>

    <div class="flex flex-col gap-6">
      <article
        v-for="(thought, index) in displayedThoughts"
        :key="thought.id"
        class="thought flex gap-12"
        :class="{ 'animate-in': index >= lastAnimatedIndex }"
      >
        <div
          class="w-20 flex-none text-sm leading-6 whitespace-nowrap text-neutral-500 dark:text-neutral-400"
        >
          {{ formatDate(thought.data.date) }}
        </div>
        <p
          class="text-base leading-relaxed text-neutral-800 dark:text-neutral-200"
        >
          {{ thought.body }}
        </p>
      </article>

      <div ref="sentinel" class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { gsap } from "gsap";

interface Thought {
  id: string;
  data: {
    date: Date | string;
    tags: string[];
  };
  body?: string;
}

const props = defineProps<{
  thoughts: Thought[];
}>();

const selectedTag = ref("All");
const displayedThoughts = ref<Thought[]>([]);
const hasMore = ref(true);
const sentinel = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
const lastAnimatedIndex = ref(0);
const BATCH_SIZE = 20;

const availableTags = computed(() => {
  const tagSet = new Set<string>();
  props.thoughts.forEach((thought) => {
    thought.data.tags?.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
});

const filteredThoughts = computed(() => {
  if (selectedTag.value === "All") return props.thoughts;
  return props.thoughts.filter((thought) =>
    thought.data.tags?.includes(selectedTag.value),
  );
});

const normalizeDate = (value: Date | string) => {
  return value instanceof Date ? value : new Date(value);
};

const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(normalizeDate(date));
};

const loadMoreThoughts = async () => {
  if (!hasMore.value) return;

  const currentLength = displayedThoughts.value.length;
  const nextThoughts = filteredThoughts.value.slice(
    currentLength,
    currentLength + BATCH_SIZE,
  );

  if (nextThoughts.length === 0) {
    hasMore.value = false;
  } else {
    displayedThoughts.value.push(...nextThoughts);
    lastAnimatedIndex.value = currentLength;
    await animateNewThoughts();
  }
};

const animateNewThoughts = async () => {
  await nextTick();

  const itemsToAnimate = document.querySelectorAll(".thought.animate-in");

  if (itemsToAnimate.length > 0) {
    gsap.fromTo(
      itemsToAnimate,
      {
        opacity: 0,
        y: 12,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.08,
      },
    );
  }
};

const setupIntersectionObserver = () => {
  if (!sentinel.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreThoughts();
      }
    },
    {
      rootMargin: "120px",
    },
  );

  observer.value.observe(sentinel.value);
};

const cleanup = () => {
  if (observer.value) {
    observer.value.disconnect();
  }
};

const resetList = async () => {
  cleanup();
  displayedThoughts.value = [];
  hasMore.value = true;
  lastAnimatedIndex.value = 0;
  await nextTick();
  await loadMoreThoughts();
  setupIntersectionObserver();
};

onMounted(async () => {
  await loadMoreThoughts();
  setupIntersectionObserver();
});

onUnmounted(() => {
  cleanup();
});

watch(
  filteredThoughts,
  async () => {
    await resetList();
  },
  { immediate: false },
);

watch(
  () => props.thoughts,
  async () => {
    await resetList();
  },
);
</script>

<style scoped>
.thought.animate-in {
  opacity: 0;
  transform: translateY(12px);
}
</style>
