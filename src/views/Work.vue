<template>
  <div id="work">
    <div class="work-hero relative w-full">
      <div ref="headerBg"
        class="work-hero-bg absolute pin"
        :style="workHeroStyles"></div>
      <div class="work-hero-cover absolute pin flex justify-center items-center">
        <img ref="headerIcon"
          :src="current.cover"
          class="work-hero-cover-image"
          :alt="`${current.name} Logo`">
      </div>
      <!-- <div class="work-hero-cover absolute pin"
        :style="workCoverStyles"
        ref="headerIcon"></div> -->
    </div>
    <div class="container mx-auto mt-16">
      <h1 ref="headerText" 
        class="text-center text-3xl md:text-5xl font-bold tracking-tight text-grey-darkest"
        v-html="current.name"></h1>
    </div>
  </div>
</template>

<script>
import { TweenMax, Power4, CSSPlugin } from 'gsap/all';
import work from '@/work.js'

const gsapPlugins = [ CSSPlugin ];

export default {
  data() {
    return {
      work
    }
  },
  computed: {
    workId() {
      return this.$route.params.id
    },
    current() {
      return this.work.find(item => item.id === this.workId)
    },
    workCoverStyles() {
      const cover = this.current.cover
      const background = `url(${cover}) no-repeat bottom 20% center/auto 61.8%`
      return {
        background
      }
    },
    workHeroStyles() {
      let background = ''
      const item = this.current
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
    workHeroBgColor() {
      const bg = this.current.backgroundColor;
      const bgColorIsArray = Array.isArray(bg)
      return bgColorIsArray ? bg[0] : bg
    }
  },
  mounted() {
    this.animateHeader()
  },
  methods: {
    animateHeader() {
      const bg = this.$refs.headerBg
      const icon = this.$refs.headerIcon
      const text = this.$refs.headerText
      const boxShadowColor = this.workHeroBgColor

      const duration = f => 0.3 * f
      const delay = f => 0.1 * f

      TweenMax.fromTo(bg, duration(2), {
        // boxShadow: '0 0 0 2px transparent'
        opacity: 0
      }, {
        // boxShadow: `0 0 0 2px ${boxShadowColor}`,
        opacity: 1,
        ease: Power4.easeOut,
        delay: delay(3)
      })
      
      TweenMax.from(bg, duration(3), {
        scale: 0.8,
        // backgroundColor: 'transparent',
        ease: Power4.easeInOut,
        delay: delay(4)
      })

      TweenMax.fromTo(icon, duration(4), {
        opacity: 0,
        y: '50%'
      },
      {
        opacity: 1,
        y: '25%',
        ease: Power4.easeOut,
        delay: delay(5)
      })

      TweenMax.from(text, duration(5), {
        opacity: 0,
        y: '100%',
        ease: Power4.easeOut,
        delay: delay(6)
      })
    }
  }
}
</script>

<style lang="scss">
.work-hero {
  padding-bottom: percentage(2/3);
}

.work-hero-bg {
  transform-origin: 50% bottom;
  box-shadow: none;
}

.work-hero-cover {
  // transform: scale(1.5) translateY(0%);
  z-index: 1;
  pointer-events: none;
}

.work-hero-cover-image {
  height: 100%;
  // height: percentage(3/4);
  // transform: translateY(25%);
  // transform-origin: 50% bottom;
}

@screen sm {
  .work-hero {
    padding-bottom: percentage(1/3);
  }
}

@screen lg {
  .work-hero {
    padding-bottom: percentage(1/4);
  }
}
</style>