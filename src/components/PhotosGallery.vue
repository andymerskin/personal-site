<template>
  <div>
    <div class="grid gap-6 sm:grid-cols-2">
      <PhotoListEntry
        v-for="(photo, index) in photos"
        :key="photo.id"
        :photo="photo"
        :index="index"
        class="photo-entry"
        :class="{ 'animate-in': !hasAnimated }"
        @open="openOverlay"
      >
        <img
          v-bind="photo.thumbAttrs"
          :alt="`${photo.caption} (${photo.year})`"
          class="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </PhotoListEntry>
    </div>

    <PhotoOverlay
      :photos="photos"
      :isOpen="isOpen"
      :activeIndex="activeIndex"
      @close="closeOverlay"
      @change="handleOverlayChange"
    />
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { prefersReducedMotion } from "../utils/prefersReducedMotion";
import PhotoListEntry from "./PhotoListEntry.vue";
import PhotoOverlay from "./PhotoOverlay.vue";

interface PhotoItem {
  id: string;
  caption: string;
  year: number;
  thumbAttrs: ImageMetadata;
  fullAttrs: ImageMetadata;
}

const props = defineProps<{
  photos: PhotoItem[];
}>();

const isOpen = ref(false);
const activeIndex = ref(1);
const hasAnimated = ref(false);

const animatePhotos = async () => {
  await nextTick();
  const items = document.querySelectorAll(".photo-entry.animate-in");
  if (items.length === 0) return;

  if (prefersReducedMotion()) {
    // Skip animation, show photos immediately
    gsap.set(items, { opacity: 1, y: 0 });
    hasAnimated.value = true;
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.05,
      onComplete: () => {
        hasAnimated.value = true;
      },
    },
  );
};

const getPhotoIdFromUrl = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get("item");
};

const getIndexFromPhotoId = (photoId: string) =>
  props.photos.findIndex((photo) => photo.id === photoId);

const setUrlItemParam = (
  photoId: string | null,
  method: "push" | "replace",
  state?: unknown,
) => {
  const url = new URL(window.location.href);
  if (photoId) {
    url.searchParams.set("item", photoId);
  } else {
    url.searchParams.delete("item");
  }

  const fn = method === "push" ? history.pushState : history.replaceState;
  fn.call(history, state ?? history.state, "", url.toString());
};

const syncFromUrl = () => {
  const photoId = getPhotoIdFromUrl();
  if (!photoId) {
    isOpen.value = false;
    return;
  }

  const index = getIndexFromPhotoId(photoId);
  if (index === -1) {
    isOpen.value = false;
    return;
  }

  activeIndex.value = index + 1;
  isOpen.value = true;
};

const openOverlay = (index: number) => {
  const photo = props.photos[index];
  if (!photo) return;
  setUrlItemParam(photo.id, "push", {
    photoOverlay: true,
    photoId: photo.id,
  });
  activeIndex.value = index + 1;
  isOpen.value = true;
};

const closeOverlay = () => {
  const photoId = getPhotoIdFromUrl();
  if (!photoId) {
    isOpen.value = false;
    return;
  }

  setUrlItemParam(null, "replace", null);
  isOpen.value = false;
};

const handleOverlayChange = (nextIndex: number) => {
  if (!isOpen.value) return;
  const photo = props.photos[nextIndex - 1];
  if (!photo) return;
  activeIndex.value = nextIndex;
  setUrlItemParam(photo.id, "replace");
};

const handlePopState = () => {
  syncFromUrl();
};

onMounted(() => {
  syncFromUrl();
  window.addEventListener("popstate", handlePopState);
  animatePhotos();
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", handlePopState);
  const items = document.querySelectorAll(".photo-entry.animate-in");
  gsap.killTweensOf(items);
});
</script>

<style scoped>
.photo-entry.animate-in {
  opacity: 0;
  transform: translateY(20px);
}
</style>
