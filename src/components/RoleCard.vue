<template>
  <div class="rounded-lg bg-white p-5 shadow-sm dark:bg-neutral-900">
    <div class="flex items-center gap-4">
      <div
        class="bg-shade-primary/3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full dark:bg-neutral-700"
      >
        <i
          :class="icon"
          class="text-xl text-neutral-700 dark:text-neutral-300"
        ></i>
      </div>
      <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {{ title }}
      </h3>
    </div>
    <p
      class="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400"
    >
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  title: string;
  description: string;
}

defineProps<Props>();
</script>
