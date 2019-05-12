<template>
  <div id="app">
    <site-header></site-header>
    <router-view />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue';

export default {
  components: {
    SiteHeader
  }
}
</script>


<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,700');
@tailwind preflight;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Work Sans', sans-serif;
}
</style>
