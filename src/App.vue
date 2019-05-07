<template>
  <div class="container mx-auto">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,700');
@tailwind preflight;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Work Sans', sans-serif;
}
</style>
