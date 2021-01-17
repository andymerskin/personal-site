<template>
  <div id="app">
    <site-header />
    <router-view />
  </div>
</template>

<script>
import SiteHeader from '@/components/SiteHeader.vue'

export default {
  components: {
    SiteHeader
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Work+Sans:400,700|EB+Garamond:400,700');
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  font-size: 18px;
}

body {
  @apply mb-8;
  font-family: 'Work Sans', sans-serif;
  background: theme('colors.bg');
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
