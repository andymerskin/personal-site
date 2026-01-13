<template>
  <div>
    <div class="flex flex-col gap-12">
      <article
        v-for="(recommendation, index) in displayedRecommendations"
        :key="recommendation.id"
        class="recommendation-card"
        :class="{ 'animate-in': index >= lastAnimatedIndex }"
      >
        <TestimonialCard
          :author="recommendation.data.author"
          :photo="recommendation.data.photo"
          :job="recommendation.data.job"
          :isEven="index % 2 === 1"
        >
          <div v-html="recommendation.body"></div>
        </TestimonialCard>
      </article>
    </div>

    <!-- Sentinel element for intersection observer -->
    <div ref="sentinel" class="h-10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";
import TestimonialCard from "./TestimonialCard.astro";

interface Recommendation {
  id: string;
  data: {
    author: string;
    job: string;
    photo: {
      src: string;
      width: number;
      height: number;
    };
  };
  body: string; // pre-rendered HTML
}

const props = defineProps<{
  recommendations: Recommendation[];
}>();

const displayedRecommendations = ref<Recommendation[]>([]);
const hasMore = ref(true);
const sentinel = ref<HTMLElement>();
const observer = ref<IntersectionObserver>();
const lastAnimatedIndex = ref(0);
const BATCH_SIZE = 5;

const loadMoreRecommendations = async () => {
  if (!hasMore.value) return;

  const currentLength = displayedRecommendations.value.length;
  const nextRecommendations = props.recommendations.slice(
    currentLength,
    currentLength + BATCH_SIZE,
  );

  if (nextRecommendations.length === 0) {
    hasMore.value = false;
  } else {
    displayedRecommendations.value.push(...nextRecommendations);
    // Mark the start of newly loaded recommendations for animation
    lastAnimatedIndex.value = currentLength;
    // Animate the new recommendations
    await animateNewRecommendations();
  }
};

const animateNewRecommendations = async () => {
  await nextTick();

  const cardsToAnimate = document.querySelectorAll(".recommendation-card.animate-in");

  if (cardsToAnimate.length > 0) {
    gsap.fromTo(
      cardsToAnimate,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.1,
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
        loadMoreRecommendations();
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
};

// Initialize with first batch
onMounted(async () => {
  await loadMoreRecommendations();
  setupIntersectionObserver();
});

onUnmounted(() => {
  cleanup();
});
</script>

<style scoped>
.recommendation-card.animate-in {
  opacity: 0;
  transform: translateY(20px);
}
</style>