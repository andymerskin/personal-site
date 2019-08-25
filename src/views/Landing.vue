<template>
  <div id="landing">
    <div class="container mx-auto">
      <div
        id="intro"
        class="w-full md:w-2/3 lg:w-1/2 mx-auto mt-8 px-4 md:px-0">
        <ui-illustration />
      </div>
      <div class="w-full px-4">
        <transition appear name="fade-up" mode="out-in">
          <h1
            :key="headline"
            class="headline flex justify-center items-center text-center text-3xl md:text-5xl font-bold tracking-tight text-grey-darkest mt-4"
            @click="advanceHeadline()">
            {{ headline }}
          </h1>
        </transition>
        <h2
          class="text-lg sm:text-2xl md:text-3xl font-sans font-normal text-black text-left leading-normal mt-6 md:mt-8">
          I'm a
          <span class="font-bold">designer & engineer</span>
          creating digital experiences that are backed by thoughtful research,
          delightful user interactions, unified visual language, and well
          organized and optimized code.
        </h2>
        <contact-info class="mt-8 md:mt-12" />
      </div>
      <div id="work" class="w-full px-4 mt-12 md:mt-24">
        <work />
      </div>
      <div class="px-4 mt-12 text-xs text-grey-darkest text-center">&copy; {{year}} Andy Merskin</div>
    </div>
  </div>
</template>

<script>
import ContactInfo from '@/components/ContactInfo.vue'
import UiIllustration from '@/components/UiIllustration.vue'
import Work from '@/components/Work.vue'

const headlines = [
  `Hi, I'm Andy 👋`,
  'UI/UX Designer & Engineer.',
  "Have your 🎂 and eat it too—it's no lie.",
  '¿Design & code, por qué no los dos?',
  "It's the best of both worlds. 🦄"
]

export default {
  name: 'Landing',
  components: {
    ContactInfo,
    UiIllustration,
    Work
  },
  data() {
    return {
      headlines,
      headlineIndex: 0,
      headlineInterval: null
    }
  },
  computed: {
    headline() {
      return this.headlines[this.headlineIndex % this.headlines.length]
    },
    year() {
      return new Date().getFullYear()
    }
  },
  mounted() {
    this.startHeadlineRotation()
  },
  methods: {
    advanceHeadline() {
      this.headlineIndex++
      this.startHeadlineRotation()
    },
    startHeadlineRotation() {
      if (this.headlineInterval) {
        clearInterval(this.headlineInterval)
      }

      this.headlineInterval = setInterval(() => {
        this.headlineIndex++
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
