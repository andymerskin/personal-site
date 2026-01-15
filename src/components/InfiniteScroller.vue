<template>
  <div ref="container" class="infinite-scroller-container">
    <slot />
    <div ref="sentinel" class="h-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";

interface Props {
  itemClass: string; // Required: className to identify items
  batchSize?: number; // Default: 10
  rootMargin?: string; // Default: "100px"
  animationDuration?: number; // Default: 0.6
  animationStagger?: number; // Default: 0.1
  animationOffset?: number; // Default: 20 (y offset for slide)
}

const props = withDefaults(defineProps<Props>(), {
  batchSize: 10,
  rootMargin: "100px",
  animationDuration: 0.6,
  animationStagger: 0.1,
  animationOffset: 20,
});

const sentinel = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
const container = ref<HTMLElement>();
const allItems = ref<HTMLElement[]>([]);
const displayedCount = ref(0);
const lastAnimatedIndex = ref(0);
const hasMore = ref(true);
const isSentinelIntersecting = ref(false);
const userHasScrolled = ref(false);

const findItems = (): HTMLElement[] => {
  if (!container.value) return [];

  // Query for items using the itemClass prop
  // This will find items even if wrapped by <astro-slot> or other containers
  const items = Array.from(
    container.value.querySelectorAll(`.${props.itemClass}`),
  ) as HTMLElement[];

  return items;
};

const hideItem = (item: HTMLElement) => {
  item.classList.add("infinite-scroller-hidden");
};

const showItem = (item: HTMLElement) => {
  item.classList.remove("infinite-scroller-hidden");
  item.classList.add("infinite-scroller-animate-in");
};

const isLoading = ref(false);

const loadMore = async () => {
  if (!hasMore.value || isLoading.value) {
    return;
  }

  // Prevent loading more than the first batch until the user has actually scrolled
  // This avoids Batch 2 loading immediately if Batch 1 doesn't fill the screen
  if (displayedCount.value >= props.batchSize && !userHasScrolled.value) {
    return;
  }

  isLoading.value = true;

  const nextBatch = allItems.value.slice(
    displayedCount.value,
    displayedCount.value + props.batchSize,
  );

  if (nextBatch.length === 0) {
    hasMore.value = false;
    isLoading.value = false;
    return;
  }

  // Show the next batch
  nextBatch.forEach((item) => {
    showItem(item);
  });

  displayedCount.value += nextBatch.length;

  // Animate the newly shown items (don't await here to allow subsequent loads)
  animateNewItems(nextBatch);

  // Wait a tick to allow layout to update before clearing isLoading
  await nextTick();
  isLoading.value = false;

  // If sentinel is still intersecting after we finished loading,
  // and we have user intent (scroll), load more
  if (isSentinelIntersecting.value && hasMore.value) {
    if (userHasScrolled.value) {
      loadMore();
    }
  }
};

const animateNewItems = async (items: HTMLElement[]) => {
  await nextTick();

  if (items && items.length > 0) {
    gsap.fromTo(
      items,
      {
        opacity: 0,
        y: props.animationOffset,
      },
      {
        opacity: 1,
        y: 0,
        duration: props.animationDuration,
        ease: "power3.out",
        stagger: props.animationStagger,
        onComplete: () => {
          // Remove animate-in class after animation completes
          items.forEach((item) => {
            item.classList.remove("infinite-scroller-animate-in");
          });
        },
      },
    );
  }
};

const handleScroll = () => {
  if (!userHasScrolled.value) {
    userHasScrolled.value = true;

    // If the sentinel was already in view, trigger loadMore now that we have user intent
    if (isSentinelIntersecting.value && hasMore.value && !isLoading.value) {
      loadMore();
    }
  }
};

const setupIntersectionObserver = () => {
  if (!sentinel.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      isSentinelIntersecting.value = target.isIntersecting;

      if (target.isIntersecting && hasMore.value) {
        loadMore();
      }
    },
    {
      rootMargin: props.rootMargin,
    },
  );

  observer.value.observe(sentinel.value);
};

const initialize = async () => {
  // Check if already scrolled (e.g. on page refresh)
  if (typeof window !== "undefined" && window.scrollY > 0) {
    userHasScrolled.value = true;
  }

  // Wait for slot content to render
  await nextTick();

  if (!container.value) {
    return;
  }

  // Find all items
  allItems.value = findItems();

  if (allItems.value.length === 0) {
    // Items might not be ready yet, try again after a short delay
    setTimeout(async () => {
      allItems.value = findItems();
      if (allItems.value.length > 0) {
        await initializeItems();
      }
    }, 100);
    return;
  }

  await initializeItems();
};

const initializeItems = async () => {
  // Hide all items initially
  allItems.value.forEach((item) => {
    hideItem(item);
  });

  // Reset state
  displayedCount.value = 0;
  lastAnimatedIndex.value = 0;
  hasMore.value = true;

  // Add scroll listener
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Load first batch and WAIT for it to be rendered
  await loadMore();

  // ONLY setup observer AFTER the first batch is in place
  setupIntersectionObserver();
};

const cleanup = () => {
  if (observer.value) {
    observer.value.disconnect();
  }
  window.removeEventListener("scroll", handleScroll);
};

onMounted(async () => {
  await initialize();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
:deep(.infinite-scroller-hidden) {
  display: none !important;
}

:deep(.infinite-scroller-animate-in) {
  opacity: 0;
  transform: translateY(20px);
}
</style>
