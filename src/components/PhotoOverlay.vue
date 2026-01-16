<template>
  <Teleport to="body">
    <div
      :class="[
        'fixed inset-0 z-50 bg-primary/80 backdrop-blur-lg dark:bg-neutral-950/90',
        isOpen ? 'flex' : 'hidden',
      ]"
      role="dialog"
      aria-modal="true"
      :aria-hidden="!isOpen"
    >
      <button
        type="button"
        class="absolute inset-0 z-0 cursor-zoom-out"
        aria-label="Close photo overlay"
        @click="handleBackdropClick"
      ></button>

      <div
        class="relative z-10 flex h-full w-full items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 pointer-events-none"
      >
        <div class="w-full max-w-[98vw] pointer-events-auto" @click="handleContentClick">
          <ImageCarousel
            ref="carouselRef"
            :animate="false"
            :activeIndex="activeIndex"
            :showDots="false"
            :disableFocusRing="true"
            :centerSlides="true"
            alt="Photo"
          >
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="flex w-full flex-none"
            >
              <div class="flex w-full flex-col items-center gap-4">
                <img
                  v-bind="photo.fullAttrs"
                  :alt="photo.caption"
                  class="h-auto max-h-[92vh] w-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <p class="text-base text-neutral-900 dark:text-neutral-50">
                  {{ photo.caption }}
                </p>
              </div>
            </div>
          </ImageCarousel>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted, watch } from "vue";
import ImageCarousel from "./ImageCarousel.vue";

interface PhotoItem {
  id: string;
  caption: string;
  thumbAttrs: {
    src: string;
    srcset?: string;
    sizes?: string;
    width: number;
    height: number;
  };
  fullAttrs: {
    src: string;
    width: number;
    height: number;
  };
}

const props = defineProps<{
  photos: PhotoItem[];
  isOpen: boolean;
  activeIndex: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
}>();

const carouselRef = ref<InstanceType<typeof ImageCarousel> | null>(null);

const emitClose = () => emit("close");
const handleBackdropClick = (event: MouseEvent) => {
  emitClose();
};
const handleContentClick = (event: MouseEvent) => {
  event.stopPropagation();
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!props.isOpen) return;

  if (event.key === "Escape") {
    event.preventDefault();
    emitClose();
    return;
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    carouselRef.value?.move(-1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    carouselRef.value?.move(1);
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    document.body.classList.toggle("overflow-hidden", isOpen);
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  document.body.classList.remove("overflow-hidden");
});
</script>
