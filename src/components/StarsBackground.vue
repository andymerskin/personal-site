<template>
  <svg
    ref="svgRef"
    :width="width"
    :height="height"
    :mask="`url(#${maskId})`"
    class="stars-background"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color: white; stop-opacity: 1" />
        <stop offset="100%" style="stop-color: black; stop-opacity: 1" />
      </linearGradient>
      <mask :id="maskId">
        <rect :width="width" :height="height" :fill="`url(#${gradientId})`" />
      </mask>
    </defs>
    <circle
      v-for="(star, index) in stars"
      :key="`star-${index}`"
      :cx="star.x"
      :cy="star.y"
      :r="star.radius"
      :ref="(el) => setCircleRef(el, index)"
      class="star"
    />
  </svg>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { nextTick, onMounted, onUnmounted, ref, useId } from "vue";

interface Star {
  x: number;
  y: number;
  radius: number;
}

interface Props {
  heightFactor?: number;
}

const props = withDefaults(defineProps<Props>(), {
  heightFactor: 0.5,
});

const svgRef = ref<SVGSVGElement>();
const circleRefs = ref<(SVGCircleElement | null)[]>([]);
const stars = ref<Star[]>([]);

// Initialize with safe defaults for SSR
const width = ref(0);
const height = ref(0);

// Generate deterministic IDs for SSR hydration
const componentId = `stars-${useId()}`;
const maskId = `${componentId}-mask`;
const gradientId = `${componentId}-gradient`;

let animationTimeline: gsap.core.Tween | null = null;
let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const setCircleRef = (el: unknown, index: number) => {
  if (el && el instanceof SVGCircleElement) {
    circleRefs.value[index] = el;
  }
};

// Poisson disk sampling using rejection sampling
const generateStars = (): Star[] => {
  const stars: Star[] = [];
  const minDistance = 60; // Minimum distance between stars
  const maxAttempts = 1000; // Prevent infinite loops
  const maxStars = Math.floor((width.value * height.value) / 300); // ~1 star per 300px²
  let attempts = 0;

  while (stars.length < maxStars && attempts < maxAttempts) {
    attempts++;

    const candidate: Star = {
      x: Math.random() * width.value,
      y: Math.random() * height.value + 8,
      radius: 0.5 + Math.random() * 1.5, // 1px to 4px diameter (0.5 to 2px radius)
    };

    // Check if candidate is far enough from existing stars
    const isValid = stars.every((star) => {
      const dx = candidate.x - star.x;
      const dy = candidate.y - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= minDistance;
    });

    if (isValid) {
      stars.push(candidate);
      attempts = 0; // Reset attempts counter on success
    }
  }

  return stars;
};

const initAnimation = async () => {
  await nextTick();

  // Wait for all circles to be rendered
  const validCircles = circleRefs.value.filter(
    (circle): circle is SVGCircleElement => circle !== null,
  );

  if (validCircles.length === 0) return;

  // Kill existing animation if any
  if (animationTimeline) {
    animationTimeline.kill();
    animationTimeline = null;
  }

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    // Set static opacity for reduced motion
    gsap.set(validCircles, { opacity: 0.6 });
    return;
  }

  // Set initial opacity for stars
  gsap.set(validCircles, { opacity: 0 });

  // Create twinkling animation with random delays and durations per star
  const tweens: gsap.core.Tween[] = [];

  validCircles.forEach((circle) => {
    const duration = 1.5 + Math.random() * 3; // Random duration between 1.5 and 4.5s
    const delay = 1 + Math.random() * 2; // Random delay between 1 and 3s

    const tween = gsap.fromTo(
      circle,
      { opacity: 0 },
      {
        opacity: 1,
        duration: duration,
        delay: delay,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
    );

    tweens.push(tween);
  });

  // Store all tweens for cleanup (use first tween as reference for animationTimeline)
  animationTimeline = tweens[0] || null;
};

const handleResize = () => {
  // Debounce resize handler
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    width.value = window.innerWidth;
    height.value = Math.floor(window.innerHeight * props.heightFactor);

    // Regenerate stars and restart animation
    stars.value = generateStars();
    initAnimation();
  }, 150);
};

onMounted(async () => {
  // Set initial dimensions from window (only available in browser)
  width.value = window.innerWidth;
  height.value = Math.floor(window.innerHeight * props.heightFactor);

  // Generate initial stars after dimensions are set
  stars.value = generateStars();

  // Initialize animation after stars are rendered
  await initAnimation();

  // Set up resize listener
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // Clean up resize listener
  window.removeEventListener("resize", handleResize);

  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
    resizeTimeout = null;
  }

  // Clean up GSAP animations
  if (animationTimeline) {
    animationTimeline.kill();
    animationTimeline = null;
  }

  if (svgRef.value) {
    const circles = svgRef.value.querySelectorAll("circle");
    gsap.killTweensOf(circles);
  }
});
</script>

<style scoped>
.stars-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  fill: white;
  will-change: opacity;
  opacity: 0;
}
</style>
