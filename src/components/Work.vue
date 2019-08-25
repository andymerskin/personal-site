<template>
  <div class="flex flex-wrap">
    <router-link
      v-for="item in work"
      :key="item.name"
      :to="{ name: 'work', params: { id: item.id } }"
      class="w-full sm:w-1/2 lg:w-1/3 px-2 lg:px-3 mb-4 lg:mb-6"
      @mousedown="setSelectedItem(item)">
      <div class="work-item">
        <div class="work-item-bg" :style="computeBgStyle(item)"></div>
        <span v-if="!item.cover" class="work-item-name text-4xl sm:text-2xl md:text-4xl lg:text-2xl xl:text-4xl font-bold" :style="{ color: item.color }" v-html="item.name"></span>
        <div v-else class="work-item-cover" :style="computeCoverStyle(item)"></div>
      </div>
    </router-link>
  </div>
</template>

<script>
import work from '@/work.js'
// :to="{ name: 'work', params: { id: item.id } }"
export default {
  data() {
    return {
      work,
      selectedItem: null
    }
  },
  methods: {
    setSelectedItem(item) {
      this.selectedItem = item
    },
    isSelectedItem(item) {
      return item === this.selectedItem
    },
    computeBgStyle(item) {
      let background = ''
      const bgColorIsArray = Array.isArray(item.backgroundColor)

      if (bgColorIsArray) {
        const [start, end] = item.backgroundColor;
        background = `linear-gradient(45deg, ${start}, ${end})`
      } else {
        background = item.backgroundColor
      }

      return {
        background
      }
    },
    computeCoverStyle(item) {
      let background = ''

      if (item.cover) {
        background = `url('${item.cover}') no-repeat center/auto 80%`
      }

      return {
        background
      }
    }
  }
}
</script>

<style lang="scss">
.work-item {
  position: relative;
  padding-top: percentage(2/3);
  text-shadow: 0 3px 3px rgba(black, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    .work-item-bg:not(.scaleFull) {
      @apply shadow-lg;
      transform: scale(1.05);
    }

    .work-item-cover,
    .work-item-name {
      transform: scale(1.15);
      transition: all 1.2s config('ease.easeOutQuart');
    }
  }
}

.work-item-bg,
.work-item-cover {
  @apply absolute pin;
}

.work-item-bg {
  @apply rounded-lg shadow;
  transition: all 0.3s config('ease.easeOutQuart');
  will-change: transform;
}

.work-item-cover,
.work-item-name {
  transition: all 0.3s config('ease.easeOutQuart');
  will-change: transform;
}

.work-item-name {
  @apply absolute pin flex justify-center items-center;
}

// .scaleFull {
//   transform: scale(100);
//   box-shadow: none;
//   transition: all 2s ease;
//   z-index: 1;
// }
</style>

