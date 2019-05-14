<template>
  <div class="flex flex-wrap">
    <div v-for="item in work"
      :key="item.name"
      class="w-full sm:w-1/2 lg:w-1/3 px-2 lg:px-3 mb-4 lg:mb-6">
      <div class="work-item" :style="computeWorkStyle(item)">
        <span v-if="!item.cover" class="text-4xl sm:text-2xl md:text-4xl lg:text-2xl xl:text-4xl font-bold" v-html="item.name"></span>
      </div>
    </div>
  </div>
</template>

<script>
import work from '@/work.js'

export default {
  data() {
    return {
      work
    }
  },
  methods: {
    computeWorkStyle(item) {
      let background = ''
      const bgColorIsArray = Array.isArray(item.backgroundColor)

      if (bgColorIsArray) {
        const [start, end] = item.backgroundColor;
        background = `linear-gradient(45deg, ${start}, ${end})`
      }

      if (item.cover) {
        if (bgColorIsArray) {
          background = `url('${item.cover}') no-repeat center/auto 80%, ${background}`
        } else {
          background += `url('${item.cover}') no-repeat center/auto 80% ${item.backgroundColor}`
        }
      }

      return {
        background: background,
        color: item.color
      }
    }
  }
}
</script>

<style lang="scss">
.work-item {
  @apply relative rounded-lg shadow;
  padding-top: percentage(2/3);
  text-shadow: 0 3px 3px rgba(black, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    @apply shadow-lg;
  }

  span {
    @apply absolute pin flex justify-center items-center;
  }
}
</style>

