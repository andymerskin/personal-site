<template>
  <header
    class="header flex justify-between items-center py-4 px-4 fixed top-0 inset-x-0"
    :style="headerStyles">
    <span class="header-title text-sm sm:text-base">
      <router-link
        :to="{ name: 'landing' }"
        class="font-bold hover:underline">Andy Merskin</router-link>
      <span v-html="headerRouteName" />
    </span>
    <label for="menu-checkbox" class="menu-button cursor-pointer md:hidden">
      <i class="fas fa-bars" />
    </label>
    <input
      id="menu-checkbox"
      ref="menuCheckbox"
      type="checkbox"
      class="menu-checkbox hidden"
      role="button"
      @change="handleChecked"/>
    <nav
      ref="nav"
      class="nav"
      :class="{ 'nav-transition-in': navTransitionIn }">
      <button class="top-0 right-0 absolute w-8 h-8 mt-2 mr-2 md:hidden">
        <i class="fas fa-times text-2xl text-grey" @click="closeMenu()" />
      </button>
      <ul ref="navItems" class="nav-items list-reset">
        <!-- <li>
          <a href="/andymerskin_resume_2019.pdf" target="_blank"
          title="View Resume PDF">View Resume</a>
        </li>
        <li>
          <a href="mailto:andymerskin@gmail.com"
          title="Email Andy Merskin">Get In Touch</a>
        </li>-->
        <li>
          <a
            href="https://www.github.com/andymerskin/"
            target="_blank"
            title="Andy Merskin on GitHub">
            <i class="fab fa-github" />GitHub
          </a>
        </li>
        <li>
          <a
            href="https://codepen.io/andymerskin/"
            target="_blank"
            title="Andy Merskin on CodePen">
            <i class="fab fa-codepen" />CodePen
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/andymerskin/"
            target="_blank"
            title="Andy Merskin on LinkedIn">
            <i class="fab fa-linkedin" />LinkedIn
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { clamp } from 'lodash'
import { TweenMax, CSSPlugin, Power3 } from 'gsap/all'
import work from '@/work.js'

// eslint-disable-next-line
const gsapPlugins = [CSSPlugin];

export default {
  data() {
    return {
      scrollY: 0,
      height: 0,
      navTransitionIn: false,
      work
    }
  },
  computed: {
    currentWorkItem() {
      if (this.$route.name === 'work') {
        return this.work.find(item => item.id === this.$route.params.id)
      } else {
        return null
      }
    },
    headerStyles() {
      let textShadowValue = null
      let colorValue = null
      if (this.currentWorkItem) {
        const { color, textShadow } = this.currentWorkItem
        textShadowValue = textShadow ? 'rgba(0,0,0,0.1) 0 -1px 0' : null
        colorValue = color
      }
      const max = this.height / 4
      const scrollProgress = this.scrollY / max
      const maxShadowAlpha = 0.15
      return {
        '--bg-alpha': clamp(scrollProgress, 0, 1),
        '--shadow-alpha': clamp(
          scrollProgress * maxShadowAlpha,
          0,
          maxShadowAlpha
        ),
        color: scrollProgress > 0.5 ? '#3D4852' : colorValue,
        textShadow: textShadowValue
      }
    },
    headerRouteName() {
      return this.currentWorkItem ? ` / ${this.currentWorkItem.name}` : null
    }
  },
  created() {
    this.handleScroll()
    this.handleResize()
    this.handleMediaQuery()
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  mounted() {
    this.staggerNavItems({ delay: 1 })
  },
  methods: {
    handleMediaQuery() {
      const mq = window.matchMedia('(min-width: 768px)')
      const updateMedia = mq => {
        if (mq.matches) {
          this.navTransitionIn = false
        } else {
          // delay adding the class to prevent weirdness when resizing the window
          setTimeout(() => {
            this.navTransitionIn = true
          }, 0)
        }
      }
      updateMedia(mq)
      mq.addListener(updateMedia)
    },
    handleScroll() {
      window.requestAnimationFrame(() => {
        this.scrollY = window.scrollY
      })
    },
    handleResize() {
      window.requestAnimationFrame(() => {
        this.height = Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        )
      })
    },
    closeMenu() {
      this.$refs.menuCheckbox.checked = false
    },
    handleChecked() {
      this.staggerNavItems({})
    },
    staggerNavItems({ delay = 0.15 }) {
      this.$nextTick(() => {
        const els = [...this.$refs.navItems.querySelectorAll('li')]
        TweenMax.staggerFromTo(
          els,
          0.3,
          {
            y: -18,
            opacity: 0
          },
          {
            delay,
            y: 0,
            opacity: 1,
            ease: Power3.easeOut,
            stagger: 0.03
          }
        )
      })
    }
  }
}
</script>

<style lang="scss">
.header {
  @apply text-gray-800 transition-colors duration-300 ease-in-out;
  --bg-alpha: 0.6;
  --shadow-alpha: 0.2;
  background-color: rgba(255, 255, 255, var(--bg-alpha));
  box-shadow: rgba(0, 0, 0, var(--shadow-alpha)) 0 5px 10px 0;
  z-index: 1;
}

.header a {
  color: inherit;
}

.nav {
  @apply w-full bg-white shadow px-4 py-4 absolute top-0 inset-x-0;
  opacity: 0;
  transform: translateY(-100%);
}

.nav-transition-in {
  @apply transition-all duration-150 ease-in-quart;
}

.menu-checkbox:checked + .nav {
  @apply transition-all duration-300 ease-out-quart;
  opacity: 1;
  transform: translateY(0);
}

.nav-items li {
  @apply mr-4;
}

.nav-items a {
  @apply py-4 inline-flex flex-row-reverse items-center text-gray-800;

  i {
    @apply ml-2;
  }
}

@screen md {
  .nav {
    @apply w-auto p-0 static shadow-none;
    opacity: 1;
    transform: translateY(0);
    background: none;
    transition: none;
  }

  .nav-items {
    @apply text-sm flex justify-end;
    letter-spacing: -0.02em;
  }

  .nav-items li {
    margin-right: 0;
  }

  .nav-items li + li {
    margin-left: 1.5rem;
  }

  .nav-items a {
    @apply py-0 flex-row;
    color: inherit;

    &:hover {
      @apply underline;
    }

    i {
      @apply mr-1 ml-0;
    }
  }
}
</style>
