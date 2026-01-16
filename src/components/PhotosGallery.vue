<template>
  <div>
    <div class="grid gap-6 sm:grid-cols-2">
      <PhotoListEntry
        v-for="(photo, index) in photos"
        :key="photo.id"
        :photo="photo"
        :index="index"
        @open="openOverlay"
      >
        <img
          v-bind="photo.thumbAttrs"
          :alt="photo.caption"
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
import { onBeforeUnmount, onMounted, ref } from "vue";
import PhotoListEntry from "./PhotoListEntry.vue";
import PhotoOverlay from "./PhotoOverlay.vue";

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
}>();

const isOpen = ref(false);
const activeIndex = ref(1);

const getPhotoIdFromUrl = () => {
  const url = new URL(window.location.href);
  return url.searchParams.get("photo");
};

const getIndexFromPhotoId = (photoId: string) =>
  props.photos.findIndex((photo) => photo.id === photoId);

const setUrlPhotoParam = (
  photoId: string | null,
  method: "push" | "replace",
  state?: unknown,
) => {
  const url = new URL(window.location.href);
  if (photoId) {
    url.searchParams.set("photo", photoId);
  } else {
    url.searchParams.delete("photo");
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
  setUrlPhotoParam(photo.id, "push", { photoOverlay: true, photoId: photo.id });
  activeIndex.value = index + 1;
  isOpen.value = true;
};

const closeOverlay = () => {
  const photoId = getPhotoIdFromUrl();
  if (!photoId) {
    isOpen.value = false;
    return;
  }

  setUrlPhotoParam(null, "replace", null);
  isOpen.value = false;
};

const handleOverlayChange = (nextIndex: number) => {
  if (!isOpen.value) return;
  const photo = props.photos[nextIndex - 1];
  if (!photo) return;
  activeIndex.value = nextIndex;
  setUrlPhotoParam(photo.id, "replace");
};

const handlePopState = () => {
  syncFromUrl();
};

onMounted(() => {
  syncFromUrl();
  window.addEventListener("popstate", handlePopState);
});

onBeforeUnmount(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>
