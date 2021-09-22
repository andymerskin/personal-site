<template>
  <div id="landing">
    <div class="container mx-auto">
      <div
        id="intro"
        class="w-full md:w-2/3 lg:w-2/3 xl:w-1/2 mx-auto mt-8 px-4 md:px-0">
        <ui-illustration />
      </div>
      <div class="w-full px-4 lg:px-20">
        <transition appear name="fade-up" mode="out-in">
          <h1
            :key="headline"
            class="headline flex justify-center items-center text-center text-3xl md:text-5xl font-bold tracking-tight text-grey-darkest mt-4"
            @click="advanceHeadline()">
            {{ headline }}
          </h1>
        </transition>
        <h2
          class="description text-left mt-6 md:mt-8">
          I'm a
          <span class="font-bold">designer & engineer</span>
          at <a :href="currentWorkplace.link" class="link">{{currentWorkplace.name}}</a> creating responsive digital experiences, backed by thoughtful research, delightful user interactions, uniﬁed visual language, and well organized and optimized front-end architecture.
        </h2>
        <h3 v-if="lookingForWork"
        class="landing-job bg-white text-base md:text-xl font-sans font-bold text-center leading-normal px-4 py-4 md:py-8 mt-12 md:mt-16">
          I am currently looking for a senior-level UX/UI/Front-end Engineer position!
          <contact-info class="mt-4 md:mt-8" />
        </h3>
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
import config from '@/config'

const headlines = [
  `Hi, I'm Andy 👋`,
  'UI/UX Designer & Engineer.',
  "Have your 🎂 and eat it too—it's no lie.",
  '¿Design & code, por qué no los dos? 🤷🏼‍♂️',
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
      headlineInterval: null,
      lookingForWork: config.lookingForWork || false,
      currentWorkplace: config.currentWorkplace || {},
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

.description {
  @apply text-lg sm:text-2xl md:text-3xl font-sans font-normal;
  line-height: 1.75rem !important;
  
  @screen sm {
    line-height: 2.25rem !important;
  }

  @screen md {
    line-height: 3rem !important;
  }
}

.landing-job {
  @apply rounded-lg;
  background-color: darken(#FFF9F4, 3%);
}

.link {
  @apply text-blue-600;
  background-color: color-mod(theme('colors.blue.500') a(20%));
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
  @apply transition-all duration-300 ease-in-quart;
}

.fade-up-enter-active {
  @apply transition-all duration-1000 ease-out-quart;
}
</style>
