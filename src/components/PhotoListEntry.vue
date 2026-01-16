<template>
  <!-- prettier-ignore-attribute class -->
  <button
    type="button"
    class="
    relative
    aspect-video
    overflow-hidden
    outline-none
    rounded-lg
    cursor-pointer

    hover:ring-2
    hover:ring-offset-2
    hover:ring-neutral-800

    dark:hover:ring-white
    dark:hover:ring-offset-neutral-800
    "
    :aria-label="`Open photo: ${photo.caption}`"
    @click="emit('open', index)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
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
  photo: PhotoItem;
  index: number;
}>();

const emit = defineEmits<{
  (event: "open", index: number): void;
}>();
</script>
