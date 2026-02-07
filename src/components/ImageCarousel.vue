<template>
  <div :class="['not-prose', $attrs.class]">
    <div
      :id="carouselId"
      ref="rootEl"
      :class="[
        'group relative overflow-hidden transition-shadow duration-200 outline-none touch-pan-y',
        props.disableFocusRing
          ? ''
          : 'focus-within:ring-2 focus-within:ring-amber-500',
      ]"
      role="radiogroup"
      :aria-label="alt"
      tabindex="0"
      :style="{
        '--carousel-index': index,
        '--carousel-count': total,
        '--carousel-drag': '0px',
        '--carousel-gap': '40px',
      }"
      @keydown="handleKeydown"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerUp"
    >
      <!-- Track -->
      <div
        ref="trackEl"
        :class="[
          'track flex w-full gap-10',
          props.centerSlides ? 'items-center' : 'items-start',
          shouldAnimate || swipeAnimating
            ? 'transition-transform duration-500 ease-out'
            : '',
        ]"
      >
        <slot />
      </div>

      <!-- Controls (fade in on hover/focus) -->
      <div
        class="pointer-events-none absolute inset-0 flex items-center justify-between px-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <button
          type="button"
          aria-label="Previous image"
          class="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          @click="move(-1)"
        >
          <i
            class="ri-arrow-left-s-line text-2xl leading-none"
            aria-hidden="true"
          ></i>
        </button>

        <button
          type="button"
          aria-label="Next image"
          class="pointer-events-auto inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors duration-150 hover:bg-black/60 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          @click="move(1)"
        >
          <i
            class="ri-arrow-right-s-line text-2xl leading-none"
            aria-hidden="true"
          ></i>
        </button>
      </div>
    </div>

    <!-- Dots indicator -->
    <div
      v-if="props.showDots"
      class="dots-container mt-4 flex justify-center gap-2"
    >
      <button
        v-for="idx in total"
        :key="idx"
        type="button"
        :class="[
          'dot',
          'bg-shade-primary/15',
          'h-2',
          'w-2',
          'rounded-full',
          'transition-colors',
          'duration-300',
          'ease-in-out',
          'dark:bg-neutral-700',
          'cursor-pointer',
          'hover:opacity-80',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-amber-500',
          { active: currentSlide === idx },
        ]"
        :aria-label="`Go to slide ${idx}`"
        @click="goToSlide(idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { prefersReducedMotion } from "../utils/prefersReducedMotion";

interface Props {
  alt?: string;
  id?: string;
  animate?: boolean;
  activeIndex?: number;
  showDots?: boolean;
  disableFocusRing?: boolean;
  centerSlides?: boolean;
  swipeAnimate?: boolean;
}

const emit = defineEmits<{
  (event: "change", index: number): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  alt: "Carousel image",
  animate: true,
  showDots: false,
  disableFocusRing: false,
  centerSlides: false,
  swipeAnimate: true,
});

const rootEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);

const index = ref(1);
const isAnimating = ref(false);
const total = ref(0);
const swipeAnimating = ref(false);

const shouldAnimate = computed(() => {
  return props.animate && !prefersReducedMotion();
});

const shouldAnimateSwipe = computed(() => {
  return props.swipeAnimate && !prefersReducedMotion();
});

const carouselId = computed(() => {
  if (props.id) {
    return props.id.toString().replace(/[^a-zA-Z0-9_-]/g, "-");
  }
  // Generate a simple ID based on component instance
  return `ic-${Math.random().toString(36).substring(2, 9)}`;
});

const currentSlide = computed(() => {
  if (index.value === 0) return total.value;
  if (index.value > total.value) return 1;
  return index.value;
});

function setIndex(nextIndex: number, animate = true) {
  if (!trackEl.value || !rootEl.value) return;

  if (!animate) {
    trackEl.value.classList.add("is-snapping");
  }

  index.value = nextIndex;

  if (!animate) {
    // Wait for Vue to update the DOM (CSS variable) before forcing reflow
    nextTick(() => {
      if (!trackEl.value) return;

      // Force reflow
      void trackEl.value.offsetHeight;

      // Restore transition on next frame to avoid animating the snap.
      requestAnimationFrame(() => {
        if (!trackEl.value) return;
        trackEl.value.classList.remove("is-snapping");
      });
    });
  }
}

let currentTransitionHandler: ((event?: TransitionEvent) => void) | null = null;
let activePointerId: number | null = null;
let dragStartX = 0;
let dragStartY = 0;
let dragDeltaX = 0;
let isPointerDown = false;
let isHorizontalDrag = false;
let hasLockedDirection = false;
let rafId: number | null = null;
const dragSensitivity = 0.18;
const minDragThreshold = 40;

function move(dir: number, options?: { forceAnimate?: boolean }) {
  if (!trackEl.value || !rootEl.value) return;

  const animate =
    typeof options?.forceAnimate === "boolean"
      ? options.forceAnimate
      : shouldAnimate.value;

  if (!animate) {
    const nextIndex = index.value + dir;
    setIndex(nextIndex, false);
    if (index.value === 0 || index.value === total.value + 1) {
      const target = index.value === 0 ? total.value : 1;
      setIndex(target, false);
    }
    return;
  }

  if (isAnimating.value) {
    // Handle rapid clicking through boundaries (seamless loop)
    if (index.value === total.value + 1 && dir === 1) {
      // Snap to start (1) instantly
      trackEl.value.classList.add("is-snapping");
      rootEl.value.style.setProperty("--carousel-index", "1");
      void trackEl.value.offsetHeight; // Force reflow
      trackEl.value.classList.remove("is-snapping");
      index.value = 1;
    } else if (index.value === 0 && dir === -1) {
      // Snap to end (total) instantly
      trackEl.value.classList.add("is-snapping");
      rootEl.value.style.setProperty("--carousel-index", String(total.value));
      void trackEl.value.offsetHeight; // Force reflow
      trackEl.value.classList.remove("is-snapping");
      index.value = total.value;
    }

    // Cancel current transition handler if exists
    if (currentTransitionHandler) {
      trackEl.value.removeEventListener(
        "transitionend",
        currentTransitionHandler,
      );
      currentTransitionHandler = null;
    }
  }

  isAnimating.value = true;
  swipeAnimating.value = options?.forceAnimate === true;
  setIndex(index.value + dir, true);

  const onEnd = (event?: TransitionEvent) => {
    if (!trackEl.value) return;
    if (event && event.propertyName !== "transform") return;

    trackEl.value.removeEventListener("transitionend", onEnd);
    if (currentTransitionHandler === onEnd) {
      currentTransitionHandler = null;
    }

    if (index.value === 0 || index.value === total.value + 1) {
      const target = index.value === 0 ? total.value : 1;
      setIndex(target, false);
    }
    isAnimating.value = false;
    swipeAnimating.value = false;
  };

  currentTransitionHandler = onEnd;
  trackEl.value.addEventListener("transitionend", onEnd);
}

function goToSlide(targetSlide: number) {
  if (isAnimating.value || targetSlide === index.value) return;

  if (!shouldAnimate.value) {
    setIndex(targetSlide, false);
    if (index.value === 0 || index.value === total.value + 1) {
      const target = index.value === 0 ? total.value : 1;
      setIndex(target, false);
    }
    return;
  }

  const diff = targetSlide - index.value;
  if (Math.abs(diff) === 1) {
    // Adjacent slide, use normal move
    move(diff);
  } else {
    // Non-adjacent, animate directly
    if (!trackEl.value) return;
    isAnimating.value = true;
    setIndex(targetSlide, true);

    const onEnd = () => {
      if (!trackEl.value) return;
      trackEl.value.removeEventListener("transitionend", onEnd);
      if (index.value === 0 || index.value > total.value + 1) {
        const target = index.value === 0 ? total.value : 1;
        setIndex(target, false);
      }
      isAnimating.value = false;
    };

    trackEl.value.addEventListener("transitionend", onEnd, { once: true });
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    move(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    move(1);
  }
}

function setDragOffset(nextOffset: number) {
  if (!rootEl.value) return;
  rootEl.value.style.setProperty("--carousel-drag", `${nextOffset}px`);
}

function setDraggingState(isDragging: boolean) {
  if (!trackEl.value) return;
  trackEl.value.classList.toggle("is-dragging", isDragging);
}

function resetDragState(cancelAnimation = true) {
  if (cancelAnimation && rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  activePointerId = null;
  isPointerDown = false;
  isHorizontalDrag = false;
  hasLockedDirection = false;
  dragStartX = 0;
  dragStartY = 0;
  dragDeltaX = 0;
}

function handlePointerDown(event: PointerEvent) {
  if (isAnimating.value) return;
  if (!event.isPrimary) return;
  if (event.pointerType === "mouse") return;

  activePointerId = event.pointerId;
  isPointerDown = true;
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  dragDeltaX = 0;
  isHorizontalDrag = false;
  hasLockedDirection = false;

  rootEl.value?.setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!isPointerDown) return;
  if (activePointerId !== event.pointerId) return;
  if (!rootEl.value || !trackEl.value) return;

  const deltaX = event.clientX - dragStartX;
  const deltaY = event.clientY - dragStartY;
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (!hasLockedDirection) {
    if (absX < 4 && absY < 4) return;
    hasLockedDirection = true;
    isHorizontalDrag = absX > absY;
  }

  if (!isHorizontalDrag) return;

  event.preventDefault();
  dragDeltaX = deltaX;
  setDraggingState(true);
  setDragOffset(dragDeltaX);
}

function handlePointerUp(event: PointerEvent) {
  if (!isPointerDown) return;
  if (activePointerId !== event.pointerId) return;
  if (!rootEl.value || !trackEl.value) {
    resetDragState();
    return;
  }

  rootEl.value.releasePointerCapture(event.pointerId);

  if (!isHorizontalDrag) {
    resetDragState();
    return;
  }

  const width = rootEl.value.clientWidth || 1;
  const threshold = Math.max(minDragThreshold, width * dragSensitivity);
  const shouldMove = Math.abs(dragDeltaX) > threshold;
  const direction = dragDeltaX < 0 ? 1 : -1;

  setDraggingState(false);
  rafId = requestAnimationFrame(() => {
    setDragOffset(0);
    if (shouldMove) {
      move(direction, { forceAnimate: shouldAnimateSwipe.value });
    }
  });

  resetDragState(false);
}

onMounted(() => {
  if (!trackEl.value) return;

  // Unwrap Astro slot if present so slides are direct children
  const astroSlot = trackEl.value.querySelector("astro-slot");

  if (astroSlot && astroSlot.parentElement === trackEl.value) {
    while (astroSlot.firstChild) {
      trackEl.value.insertBefore(astroSlot.firstChild, astroSlot);
    }
    astroSlot.remove();
  }

  // Get original slide elements (from slot)
  const originalSlides = Array.from(trackEl.value.children) as HTMLElement[];

  if (originalSlides.length === 0) {
    console.warn("ImageCarousel: No slides found in slot");
    return;
  }

  total.value = originalSlides.length;

  // Wrap each slide in a container div if not already wrapped
  const wrappedSlides: HTMLElement[] = [];
  originalSlides.forEach((slide) => {
    // Check if already wrapped (has flex class and is a direct child)
    if (
      slide.classList.contains("flex") &&
      slide.classList.contains("w-full") &&
      slide.classList.contains("flex-none")
    ) {
      slide.classList.add("justify-center");
      wrappedSlides.push(slide);
    } else {
      // Wrap the slide
      const wrapper = document.createElement("div");
      wrapper.className = "flex w-full flex-none justify-center";
      slide.parentNode?.insertBefore(wrapper, slide);
      wrapper.appendChild(slide);
      wrappedSlides.push(wrapper);
    }
  });

  // Clone last slide and prepend
  const lastSlide = wrappedSlides[wrappedSlides.length - 1];
  const clonedLast = lastSlide.cloneNode(true) as HTMLElement;
  trackEl.value.insertBefore(clonedLast, wrappedSlides[0]);

  // Clone first slide and append
  const firstSlide = wrappedSlides[0];
  const clonedFirst = firstSlide.cloneNode(true) as HTMLElement;
  trackEl.value.appendChild(clonedFirst);

  // Initialize to show first real slide (index 1, which is now at position 1 after prepending clone)
  const initialIndex =
    typeof props.activeIndex === "number"
      ? Math.min(Math.max(props.activeIndex, 1), total.value)
      : 1;
  setIndex(initialIndex, false);
});

onUnmounted(() => {
  // Cleanup if needed
});

watch(
  () => props.activeIndex,
  (next) => {
    if (typeof next !== "number" || !total.value) return;
    const target = Math.min(Math.max(next, 1), total.value);
    setIndex(target, false);
  },
);

watch(
  () => currentSlide.value,
  (next, prev) => {
    if (next === prev) return;
    emit("change", next);
  },
);

defineExpose({ move, goToSlide });
</script>

<style>
@import "../styles/global.css";

.track {
  transform: translateX(
    calc(
      (var(--carousel-index) * (-100% - var(--carousel-gap))) +
        var(--carousel-drag)
    )
  );
}

.track.is-snapping {
  transition: none !important;
}

.track.is-dragging {
  transition: none !important;
}

.dot.active {
  @apply bg-neutral-900 dark:bg-neutral-100;
}
</style>
