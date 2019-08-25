<template>
  <div>
    <h2 class="text-2xl text-grey-darkest text-center">Principles</h2>
    <div class="flex flex-wrap">
      <!-- <div class="axiom p-2 my-4 w-full md:w-1/2 lg:w-1/3" v-for="axiom in axioms"> -->
      <div v-for="axiom in axioms" :key="axiom" class="axiom p-2 my-4 w-full">
        <div
          class="py-4 font-bold text-grey-darkest text-2xl md:text-3xl lg:text-5xl"
          v-html="axiom"></div>
      </div>
    </div>
  </div>
</template>

<script>
const axioms = [
  `Go MVP, then go BIG`,
  `Keep things DRY <em>#basics</em>`,
  `Trust your gut, and your data`,
  `Be inspired by the best, and only the best`,
  `Creativity is the ability to copy well`,
  `Polished work sells; Scrappy work disappoints`,
  `Refactor until it's right, not until it works`,
  `It's not minimum viable product, it's <em>valuable</em>`,
  `Do what is right, not what is easy`,
  `Design and development are not separate fields`
]

export default {
  data() {
    return {
      axioms
    }
  }
}
</script>

<style></style>
