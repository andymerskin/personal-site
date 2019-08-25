<template>
  <div class="flex flex-wrap -mx-2 lg:-mx-3">
    <a v-for="item in work"
      :key="item.name"
      :href="item.href"
      :title="'Check out ' + item.name"
      target="_blank"
      class="work-item w-full md:w-1/2 xl:w-1/3 px-2 lg:px-3 mb-4 lg:mb-6">
      <div class="work-item-card flex flex-col items-center p-4">
        <div class="work-item-logo h-24">
          <img v-if="item.logo" :src="item.logo" :alt="item.name" class="h-full">
        </div>
        <div class="work-item-name font-bold text-xl text-grey-darkest mt-4">{{item.name}}</div>
        <div class="work-item-description font-sans text-base text-grey-darkest leading-normal mt-4">{{item.description}}</div>
      </div>
    </a>
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
        const [start, end] = item.backgroundColor
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
  display: block;
  text-decoration: none;
}

.work-item-card {
  @apply rounded-lg;
  border: 1px solid rgba(#684F1D, 0.1);
  transition: all 0.3s config('ease.easeOutQuart');

  &:hover {
    @apply bg-white shadow-lg;
    border-color: rgba(#684F1D, 0.2);
  }
}
</style>
