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
      @close="isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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

const openOverlay = (index: number) => {
  activeIndex.value = index + 1;
  isOpen.value = true;
};
</script>
