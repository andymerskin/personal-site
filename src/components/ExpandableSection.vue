<template>
  <section
    class="relative expandable-section"
    :class="[
      className,
      isExpanded ? 'is-expanded' : 'is-collapsed',
      !isExpanded && 'overflow-hidden',
    ]"
    :style="containerStyle"
    :data-expanded="isExpanded ? 'true' : 'false'"
  >
    <slot />
    <div
      class="expandable-section__overlay absolute inset-x-0 bottom-0 h-40 transition-opacity"
      :class="isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'"
    >
      <div
        class="flex h-full items-end justify-center bg-linear-to-b from-transparent to-primary dark:to-neutral-950 pb-8"
      >
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-amber-400/50 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-400/40 dark:bg-neutral-950/90 dark:text-neutral-100 dark:hover:border-amber-300 dark:hover:bg-neutral-900"
          :aria-expanded="isExpanded ? 'true' : 'false'"
          @click="expand"
        >
          {{ buttonText }}
          <i class="ri-arrow-down-line text-base" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const props = withDefaults(
  defineProps<{
    maxHeight?: string;
    buttonText?: string;
    class?: string;
  }>(),
  {
    maxHeight: "520px",
    buttonText: "See more skills",
  },
);

const className = props.class;
const isExpanded = ref(false);

const containerStyle = computed(() =>
  isExpanded.value ? undefined : { maxHeight: props.maxHeight },
);

const expand = () => {
  if (isExpanded.value) return;
  isExpanded.value = true;
};
</script>
