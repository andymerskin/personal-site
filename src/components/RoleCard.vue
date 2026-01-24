<template>
  <div class="card-base">
    <div class="flex items-center gap-4">
      <div
        class="bg-shade-primary/3 flex h-12 w-12 shrink-0 items-center justify-center rounded-full dark:bg-neutral-700"
      >
        <component
          :is="iconComponent"
          class="h-6 w-6 text-neutral-700 dark:text-neutral-300"
        />
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
import { Code, Palette, Trophy, UserCheck, Users } from "lucide-vue-next";
import { computed } from "vue";

interface Props {
  icon: string;
  title: string;
  description: string;
}

const props = defineProps<Props>();

const iconMap = {
  "user-check": UserCheck,
  users: Users,
  palette: Palette,
  code: Code,
  trophy: Trophy,
};

const iconComponent = computed(
  () => iconMap[props.icon as keyof typeof iconMap] || UserCheck,
);
</script>
