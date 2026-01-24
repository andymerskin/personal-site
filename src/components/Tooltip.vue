<template>
  <span @mouseenter="showTooltip" @mouseleave="hideTooltip">
    <slot name="trigger" />
  </span>

  <Teleport to="body">
    <div
      v-if="isVisible"
      class="pointer-events-none fixed z-50"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
        transform: `translateY(-100%)`,
      }"
    >
      <slot />
    </div>
  </Teleport>
</template>

<script setup>
import { onUnmounted, ref } from "vue";

const isVisible = ref(false);
const position = ref({ x: 0, y: 0 });

let animationFrameId = null;

const updatePosition = (event) => {
  position.value = {
    x: event.clientX + 16,
    y: event.clientY - 16,
  };
};

const showTooltip = () => {
  isVisible.value = true;
  document.addEventListener("mousemove", updatePosition);
};

const hideTooltip = () => {
  isVisible.value = false;
  document.removeEventListener("mousemove", updatePosition);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
};

onUnmounted(() => {
  document.removeEventListener("mousemove", updatePosition);
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
});
</script>
