<template>
  <div :class="className">
    <h1
      class="min-h-40 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-5xl"
    >
      <span class="sr-only">{{ headlines[0] }}</span>
      <span aria-hidden="true" ref="headlineText">{{ headlines[0] }}</span>
    </h1>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { gsap } from "gsap";

const props = withDefaults(
  defineProps<{
    class?: string;
  }>(),
  {},
);

const className = props.class;

const headlines = [
  `Hey! I'm Andy 👋`,
  "Software Engineer & Designer. Solution architect. Team unifier.",
  "Well, a little bit of everything...",
  "Have your 🎂 and eat it too, it's no lie.",
  "Project planning & coordination comes naturally.",
  "I'll sweat the details, while keeping the big picture.",
  "I can help lead and mentor your engineers, too.",
  "Let's chase your dream product with gusto!",
];

const headlineText = ref<HTMLElement>();
let interval: number | undefined;
let tl: gsap.core.Timeline | undefined;

function prefersReducedMotion() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false
  );
}

const setText = (nextIdx: number) => {
  if (headlineText.value) {
    headlineText.value.textContent = headlines[nextIdx] ?? "";
  }
};

const rotateOnce = (currentIdx: number) => {
  if (!headlineText.value) return;

  const nextIdx = (currentIdx + 1) % headlines.length;

  if (prefersReducedMotion()) {
    setText(nextIdx);
    return nextIdx;
  }

  tl?.kill();
  gsap.killTweensOf(headlineText.value);

  tl = gsap
    .timeline({ defaults: { overwrite: "auto" } })
    .to(headlineText.value, {
      duration: 0.3,
      ease: "power4.in",
      opacity: 0,
      yPercent: -33,
    })
    .add(() => {
      setText(nextIdx);
      gsap.set(headlineText.value!, { opacity: 0, yPercent: 33 });
    })
    .to(headlineText.value, {
      duration: 1.0,
      ease: "power4.out",
      opacity: 1,
      yPercent: 0,
    });

  return nextIdx;
};

onMounted(async () => {
  await nextTick();

  if (!headlineText.value || headlines.length < 2) return;

  // Stable initial state.
  gsap.set(headlineText.value, { opacity: 1, yPercent: 0 });

  let idx = 0;
  const rotate = () => {
    idx = rotateOnce(idx) ?? 0;
  };

  interval = window.setInterval(rotate, 3000);
});

onUnmounted(() => {
  if (interval !== undefined) {
    window.clearInterval(interval);
    interval = undefined;
  }
  if (tl) {
    tl.kill();
    tl = undefined;
  }
  if (headlineText.value) {
    gsap.killTweensOf(headlineText.value);
  }
});
</script>

<style scoped>
span[aria-hidden="true"] {
  display: inline-block;
  will-change: transform, opacity;
}
</style>
