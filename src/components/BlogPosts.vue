<template>
  <div class="mt-8 grid gap-10">
    <article
      v-for="(post, index) in displayedPosts"
      :key="post.id"
      class="blog-post flex gap-4"
      :class="{ 'animate-in': index >= lastAnimatedIndex }"
    >
      <div class="flex w-2/3 flex-col gap-2">
        <a
          :href="`/blog/${post.id}/`"
          class="text-2xl font-bold tracking-tight underline-offset-4 hover:underline"
        >
          {{ post.data.title }}
        </a>
        <span class="text-sm text-neutral-600 dark:text-neutral-400">
          {{ formatDate(post.data.pubDate) }}
        </span>
        <p
          class="text-base leading-relaxed text-neutral-700 dark:text-neutral-300"
          style="
            -webkit-line-clamp: 3;
            line-clamp: 3;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            overflow: hidden;
          "
        >
          {{ post.body }}
        </p>
      </div>
      <div class="w-1/3">
        <a v-if="post.data.image" :href="`/blog/${post.id}/`" class="block">
          <div class="aspect-3/2 overflow-hidden rounded-lg">
            <img
              :src="post.data.image.src"
              :alt="post.data.title"
              class="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </a>
      </div>
    </article>

    <!-- Sentinel element for intersection observer -->
    <div ref="sentinel" class="h-10"></div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { prefersReducedMotion } from "../utils/prefersReducedMotion";

interface BlogPost {
  id: string;
  data: {
    title: string;
    pubDate: Date;
    image?: {
      src: string;
      width: number;
      height: number;
      format: string;
    };
  };
  body?: string;
}

const props = defineProps<{
  posts: BlogPost[];
}>();

const displayedPosts = ref<BlogPost[]>([]);
const hasMore = ref(true);
const sentinel = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
const lastAnimatedIndex = ref(0);
const BATCH_SIZE = 10;

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const loadMorePosts = async () => {
  if (!hasMore.value) return;

  const currentLength = displayedPosts.value.length;
  const nextPosts = props.posts.slice(
    currentLength,
    currentLength + BATCH_SIZE,
  );

  if (nextPosts.length === 0) {
    hasMore.value = false;
  } else {
    displayedPosts.value.push(...nextPosts);
    // Mark the start of newly loaded posts for animation
    lastAnimatedIndex.value = currentLength;
    // Animate the new posts
    await animateNewPosts();
  }
};

const animateNewPosts = async () => {
  await nextTick();

  const postsToAnimate = document.querySelectorAll(".blog-post.animate-in");

  if (postsToAnimate.length === 0) return;

  if (prefersReducedMotion()) {
    // Skip animation, show posts immediately
    gsap.set(postsToAnimate, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    postsToAnimate,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.05,
    },
  );
};

const setupIntersectionObserver = () => {
  if (!sentinel.value) return;

  observer.value = new IntersectionObserver(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMorePosts();
      }
    },
    {
      rootMargin: "100px",
    },
  );

  observer.value.observe(sentinel.value);
};

const cleanup = () => {
  if (observer.value) {
    observer.value.disconnect();
  }
  const postsToAnimate = document.querySelectorAll(".blog-post.animate-in");
  gsap.killTweensOf(postsToAnimate);
};

// Initialize with first batch
onMounted(async () => {
  await loadMorePosts();
  setupIntersectionObserver();
});

onUnmounted(() => {
  cleanup();
});

// Watch for posts changes (in case they get updated)
watch(
  () => props.posts,
  async (newPosts) => {
    if (newPosts && newPosts.length > 0 && displayedPosts.value.length === 0) {
      await loadMorePosts();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.blog-post.animate-in {
  opacity: 0;
  transform: translateY(20px);
}
</style>
