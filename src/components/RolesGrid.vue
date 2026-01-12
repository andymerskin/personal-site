<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <RoleCard
      v-for="role in roles"
      :key="role.title"
      :icon="role.icon"
      :title="role.title"
      :description="role.description"
    />
  </div>
</template>

<script setup lang="ts">
import RoleCard from "./RoleCard.vue";

interface Role {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  roles: Role[];
}

defineProps<Props>();
</script>
