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
const container = ref<HTMLElement | null>(null);

let allItems: HTMLElement[] = [];
let displayedCount = 0;
let hasMore = true;
let isSentinelIntersecting = false;
let userHasScrolled = false;
let isLoading = false;
let retryTimeout: ReturnType<typeof setTimeout> | undefined;
let isDisposed = false;

const findItems = (): HTMLElement[] => {
  if (!container.value) return [];

  // Query for items using the itemClass prop
  // This will find items even if wrapped by <astro-slot> or other containers
  const items = Array.from(
    container.value.querySelectorAll(`.${CSS.escape(props.itemClass)}`),
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

const loadMore = async () => {
  if (!hasMore || isLoading) {
    return;
  }

  // Prevent loading more than the first batch until the user has actually scrolled
  // This avoids Batch 2 loading immediately if Batch 1 doesn't fill the screen
  if (displayedCount >= props.batchSize && !userHasScrolled) {
    return;
  }

  isLoading = true;

  const nextBatch = allItems.slice(
    displayedCount,
    displayedCount + props.batchSize,
  );

  if (nextBatch.length === 0) {
    hasMore = false;
    isLoading = false;
    return;
  }

  // Show the next batch
  nextBatch.forEach((item) => {
    showItem(item);
  });

  displayedCount += nextBatch.length;

  // Animate the newly shown items (don't await here to allow subsequent loads)
  animateNewItems(nextBatch);

  // Wait a tick to allow layout to update before clearing isLoading
  await nextTick();
  isLoading = false;

  // If sentinel is still intersecting after we finished loading,
  // and we have user intent (scroll), load more
  if (isSentinelIntersecting && hasMore) {
    if (userHasScrolled) {
      loadMore();
    }
  }
};

const animateNewItems = (items: HTMLElement[]) => {
  nextTick().then(() => {
    if (!items || items.length === 0) return;

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
  });
};

const handleScroll = () => {
  if (!userHasScrolled) {
    userHasScrolled = true;

    // If the sentinel was already in view, trigger loadMore now that we have user intent
    if (isSentinelIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }
};

const setupIntersectionObserver = () => {
  if (!sentinel.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      isSentinelIntersecting = target.isIntersecting;

      if (target.isIntersecting && hasMore) {
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
  if (window.scrollY > 0) {
    userHasScrolled = true;
  }

  // Wait for slot content to render
  await nextTick();

  if (!container.value || isDisposed) {
    return;
  }

  // Find all items
  allItems = findItems();

  if (allItems.length === 0) {
    // Items might not be ready yet, try again after a short delay
    if (retryTimeout) {
      clearTimeout(retryTimeout);
    }
    retryTimeout = setTimeout(async () => {
      if (isDisposed) return;
      allItems = findItems();
      if (allItems.length > 0) {
        await initializeItems();
      }
    }, 100);
    return;
  }

  await initializeItems();
};

const initializeItems = async () => {
  // Hide all items initially
  allItems.forEach((item) => {
    hideItem(item);
  });

  // Reset state
  displayedCount = 0;
  hasMore = true;

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
  if (retryTimeout) {
    clearTimeout(retryTimeout);
  }
  isDisposed = true;
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
}
</style>
