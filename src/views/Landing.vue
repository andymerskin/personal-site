<template>
  <div id="landing">
    <div class="container mx-auto">
      <div id="intro" class="w-full md:w-2/3 lg:w-1/2 mx-auto mt-8 px-4 md:px-0">
        <ui-illustration></ui-illustration>
      </div>
      <div class="w-full px-4">
        <transition appear name="fade-up" mode="out-in">
          <h1 class="headline flex justify-center items-center text-center text-3xl md:text-5xl font-bold tracking-tight text-grey-darkest mt-4"
            :key="headline"
            @click="advanceHeadline()">{{headline}}</h1>
        </transition>
        <h2 class="text-lg sm:text-2xl md:text-3xl font-serif font-normal text-black text-center leading-normal mt-6 md:mt-8">I'm a <span class="font-sans role-title font-bold">UI/UX Designer & Engineer</span> skilled in the art of creating digital experiences that are backed by thoughtful research, delightful user interactions, unified visual language, and well organized and optimized code.</h2>
        <contact-info class="mt-8 md:mt-12"></contact-info>
      </div>
      <div id="work" class="w-full px-4 mt-12 md:mt-24">
        <work></work>
      </div>
    </div>
  </div>
</template>

<script>
import ContactInfo from '@/components/ContactInfo.vue'
import UiIllustration from '@/components/UiIllustration.vue'
import Work from '@/components/Work.vue'

const headlines = [
  'Have your cake and eat it too—it\'s no lie.',
  '¿Design & code, por qué no los dos?',
  'It\'s the best of both worlds.',
  'UI/UX Designer & Engineer.'
];

export default {
  name: 'landing',
  data() {
    return {
      headlines,
      headlineIndex: 0,
      headlineInterval: null
    }
  },
  components: {
    ContactInfo,
    UiIllustration,
    Work
  },
  mounted() {
    this.startHeadlineRotation()
  },
  computed: {
    headline() {
      return this.headlines[this.headlineIndex % this.headlines.length]
    }
  },
  methods: {
    advanceHeadline() {
      this.headlineIndex++;
      this.startHeadlineRotation();
    },
    startHeadlineRotation() {
      if (this.headlineInterval) {
        clearInterval(this.headlineInterval);
      }

      const length = this.headlines.length
      this.headlineInterval = setInterval(() => {
        this.headlineIndex++;
      }, 5000)
    }
  }
}
</script>

<style lang="scss">
.headline {
  @apply leading-tight;
  min-height: 2.5em;
}

.role-title {
  font-size: smaller;
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-33%);
}

.fade-up-enter {
  opacity: 0;
  transform: translateY(33%);
}

.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.fade-up-leave-active {
  transition: all 0.3s config('ease.easeInQuart');
}

.fade-up-enter-active {
  transition: all 1s config('ease.easeOutQuart');
}
</style>
