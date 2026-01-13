<template>
  <div
    class="marquee-wrapper overflow-hidden"
    @mouseenter="pauseAnimation"
    @mouseleave="resumeAnimation"
  >
    <div ref="marqueeContent" class="marquee-content flex">
      <div ref="marqueeItem" class="marquee-item shrink-0">
        <slot />
      </div>
      <div class="marquee-item shrink-0" aria-hidden="true">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    speed?: number;
  }>(),
  {
    speed: 50,
  }
);

const marqueeContent = ref<HTMLElement>();
const marqueeItem = ref<HTMLElement>();
let animation: gsap.core.Tween | null = null;
let resizeObserver: ResizeObserver | null = null;

const pauseAnimation = () => {
  animation?.pause();
};

const resumeAnimation = () => {
  animation?.resume();
};

const initAnimation = () => {
  if (!marqueeContent.value || !marqueeItem.value) return;

  // Kill existing animation if any
  if (animation) {
    animation.kill();
    animation = null;
  }

  // Measure the width of the first marquee item
  const itemWidth = marqueeItem.value.offsetWidth;

  if (itemWidth === 0) return;

  // Set initial position
  gsap.set(marqueeContent.value, { x: 0 });

  // Create infinite animation
  animation = gsap.to(marqueeContent.value, {
    x: -itemWidth,
    duration: itemWidth / props.speed, // Adjust speed: pixels per second
    ease: "none",
    repeat: -1,
  });
};

onMounted(async () => {
  await nextTick();

  initAnimation();

  // Set up ResizeObserver to recompute animation on resize
  if (marqueeItem.value) {
    resizeObserver = new ResizeObserver(() => {
      initAnimation();
    });
    resizeObserver.observe(marqueeItem.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (animation) {
    animation.kill();
    animation = null;
  }
  if (marqueeContent.value) {
    gsap.killTweensOf(marqueeContent.value);
  }
});
</script>

<style scoped>
.marquee-content {
  will-change: transform;
}
</style>
