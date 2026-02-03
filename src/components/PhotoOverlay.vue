<template>
  <Teleport to="body">
    <div
      :class="[
        'bg-primary/80 fixed inset-0 z-100 backdrop-blur-lg dark:bg-neutral-950/90',
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

      <button
        type="button"
        class="fixed right-4 top-6 z-100 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 shadow-sm transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:focus-visible:ring-offset-neutral-900"
        aria-label="Close photo overlay"
        @click="emitClose"
      >
        <span class="sr-only">Close</span>
        <i class="ri-close-line text-2xl" aria-hidden="true"></i>
      </button>

      <div
        class="pointer-events-none relative z-10 flex h-full w-full items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12"
      >
        <div class="pointer-events-none w-full max-w-[98vw]">
          <ImageCarousel
            ref="carouselRef"
            class="pointer-events-none"
            :animate="false"
            :activeIndex="activeIndex"
            :showDots="false"
            :disableFocusRing="true"
            :centerSlides="true"
            alt="Photo"
            @change="handleCarouselChange"
          >
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="pointer-events-none flex w-full flex-none"
            >
              <div
                class="pointer-events-none flex w-full flex-col items-center gap-4"
              >
                <img
                  v-bind="photo.fullAttrs"
                  :alt="photo.caption"
                  class="pointer-events-auto h-auto max-h-[92vh] w-full max-w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
                <p
                  class="pointer-events-auto text-base text-neutral-900 dark:text-neutral-50"
                >
                  {{ photo.caption }} • {{ photo.year }}
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
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import ImageCarousel from "./ImageCarousel.vue";

interface PhotoItem {
  id: string;
  caption: string;
  year: number;
  thumbAttrs: ImageMetadata;
  fullAttrs: ImageMetadata;
}

const props = defineProps<{
  photos: PhotoItem[];
  isOpen: boolean;
  activeIndex: number;
}>();

const emit = defineEmits<{
  (event: "close"): void;
  (event: "change", index: number): void;
}>();

const carouselRef = ref<InstanceType<typeof ImageCarousel> | null>(null);

const emitClose = () => emit("close");
const emitChange = (index: number) => emit("change", index);
const handleBackdropClick = (event: MouseEvent) => {
  emitClose();
};

const handleCarouselChange = (nextIndex: number) => {
  if (!props.isOpen) return;
  emitChange(nextIndex);
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
