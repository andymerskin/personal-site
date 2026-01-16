<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    password?: string;
    storageKey?: string;
  }>(),
  {
    password: "hello",
    storageKey: "workPrivateUnlocked",
  },
);

const unlocked = ref(false);
const error = ref(false);
const passwordInput = ref("");
const ready = ref(false);
const readStored = () => {
  try {
    return localStorage.getItem(props.storageKey) === "true";
  } catch {
    return false;
  }
};

const persistUnlocked = () => {
  try {
    localStorage.setItem(props.storageKey, "true");
  } catch {
    // Ignore storage failures (private mode, disabled storage, etc.)
  }
};

const submit = () => {
  const value = passwordInput.value.trim();
  if (value === props.password) {
    persistUnlocked();
    unlocked.value = true;
    error.value = false;
  } else {
    error.value = true;
  }
};

onMounted(() => {
  const stored = readStored();
  unlocked.value = stored;
  ready.value = true;
});
</script>

<template>
  <div v-if="ready" class="space-y-8" v-cloak>
    <div v-if="!unlocked" class="card-base w-full md:w-2/3" aria-live="polite">
      <div class="text-xl font-semibold">
        The vault hums. Whisper the secret phrase to unlock the gallery.
      </div>
      <form class="mt-4 space-y-3" @submit.prevent="submit">
        <div>
          <label class="text-sm font-semibold" for="private-password">
            Password
          </label>
          <input
            id="private-password"
            v-model="passwordInput"
            name="password"
            type="password"
            autocomplete="current-password"
            class="mt-2 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:ring-2 focus:ring-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
            required
          />
        </div>
        <button
          type="submit"
          class="focus:ring-opacity-50 inline-flex cursor-pointer items-center gap-1 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-900 no-underline! shadow-sm hover:bg-neutral-50 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
        >
          Unlock the private gallery
        </button>
        <p class="text-sm text-red-600 dark:text-red-400" v-show="error">
          That phrase didn’t open the door. Try again.
        </p>
      </form>
    </div>

    <div v-show="unlocked">
      <slot />
    </div>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}
</style>
