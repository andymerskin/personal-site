<script setup lang="ts">
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

export interface Props {
  heading: string;
}

const props = defineProps<Props>();

const isOpen = ref(false);
const contentRef = ref<HTMLElement>();
const arrowRef = ref<HTMLElement>();
const detailsRef = ref<HTMLDetailsElement>();

const toggleAccordion = () => {
  if (!contentRef.value || !arrowRef.value || !detailsRef.value) return;

  if (isOpen.value) {
    // Closing animation
    gsap.to(contentRef.value, {
      height: 0,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        isOpen.value = false;
        detailsRef.value!.open = false;
      },
    });
    gsap.to(arrowRef.value, {
      rotation: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  } else {
    // Opening animation
    detailsRef.value!.open = true;
    const scrollHeight = contentRef.value.scrollHeight;
    gsap.fromTo(
      contentRef.value,
      { height: 0 },
      {
        height: scrollHeight,
        duration: 0.3,
        ease: "power2.out",
        onComplete: () => {
          // Set to auto height after animation completes
          if (contentRef.value) {
            gsap.set(contentRef.value, { height: "auto" });
          }
          isOpen.value = true;
        },
      },
    );
    gsap.to(arrowRef.value, {
      rotation: 180,
      duration: 0.3,
      ease: "power2.out",
    });
  }
};

onMounted(() => {
  if (detailsRef.value) {
    // Initialize closed state
    detailsRef.value.open = false;
  }
  if (contentRef.value) {
    // Initialize closed state
    gsap.set(contentRef.value, { height: 0 });
  }
  if (arrowRef.value) {
    // Initialize arrow rotation to 0
    gsap.set(arrowRef.value, { rotation: 0 });
  }
});
</script>

<template>
  <details
    ref="detailsRef"
    class="not-prose rounded-lg bg-white shadow-sm dark:bg-neutral-900"
  >
    <summary
      @click.prevent="toggleAccordion"
      class="focus:ring-opacity-50 hover:bg-shade-primary/3 flex w-full cursor-pointer list-none items-center justify-between rounded-lg px-5 py-2 select-none focus:ring-2 focus:ring-amber-500 focus:outline-none dark:hover:bg-neutral-800"
    >
      <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
        {{ heading }}
      </h3>
      <div ref="arrowRef" class="flex items-center">
        <i
          class="ri-arrow-down-s-line text-3xl text-neutral-500 dark:text-neutral-400"
        ></i>
      </div>
    </summary>
    <div ref="contentRef" class="overflow-hidden" style="height: 0">
      <div class="p-5">
        <slot />
      </div>
    </div>
  </details>
</template>
