<template>
  <header class="header flex justify-between items-center py-4 px-4 fixed pin-t pin-x" :style="headerCssVars">
    <span class="text-grey-darkest">Andy Merskin</span>
    <label for="menu-checkbox" class="menu-button cursor-pointer md:hidden">
      <i class="fas fa-bars"></i>
    </label>
    <input type="checkbox"
      class="menu-checkbox hidden"
      id="menu-checkbox"
      role="button"
      ref="menuCheckbox">
    <nav class="nav" ref="nav">
      <button class="pin-t pin-r absolute w-8 h-8 mt-2 mr-2 md:hidden">
        <i class="fas fa-times text-2xl text-grey"
        @click="closeMenu()"></i>
      </button>
      <ul class="nav-items list-reset">
        <li>
          <a href="/andymerskin_resume_2019.pdf" target="_blank"
          title="View Resume PDF">View Resume</a>
        </li>
        <li>
          <a href="mailto:andymerskin@gmail.com"
          title="Email Andy Merskin">Get In Touch</a>
        </li>
        <li>
          <a href="https://www.github.com/docmars/"
          target="_blank"
          title="Andy Merskin on GitHub"><i class="fab fa-github"></i>GitHub</a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/andymerskin/"
          target="_blank"
          title="Andy Merskin on LinkedIn"><i class="fab fa-linkedin"></i>LinkedIn</a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import { clamp } from 'lodash';

export default {
  data() {
    return {
      scrollY: 0,
      height: 0
    }
  },
  computed: {
    headerCssVars() {
      const max = this.height / 4
      const scrollProgress = this.scrollY / max
      const maxShadowAlpha = 0.15;
      return {
        '--bg-alpha': clamp(scrollProgress, 0, 1),
        '--shadow-alpha': clamp(scrollProgress * maxShadowAlpha, 0, maxShadowAlpha)
      }
    }
  },
  created() {
    this.handleScroll()
    this.handleResize()
    window.addEventListener('scroll', this.handleScroll)
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleScroll() {
      window.requestAnimationFrame(() => {
        this.scrollY = window.scrollY
      })
    },
    handleResize() {
      window.requestAnimationFrame(() => {
        this.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      })
    },
    closeMenu() {
      this.$refs.menuCheckbox.checked = false;
    }
  }
}
</script>

<style lang="scss">
.header {
  --bg-alpha: 0.6;
  --shadow-alpha: 0.2;
  background-color: rgba(255, 255, 255, var(--bg-alpha));
  box-shadow: rgba(0,0,0,var(--shadow-alpha)) 0 5px 10px 0;
  z-index: 1;
}

.nav {
  @apply w-full bg-white shadow px-4 py-4 absolute pin-t pin-x;
  opacity: 0;
  transform: translateY(-100%);
  // transition: all 0.15s config('ease.easeInQuart');
}

.menu-checkbox:checked + .nav {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.3s config('ease.easeOutQuart');
}

.nav-items a {
  @apply block py-4 text-blue no-underline inline-flex flex-row-reverse;

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
  }

  .nav-items {
    @apply text-sm flex justify-end;
  }

  .nav-items li + li {
    margin-left: 1.5rem;
  }

  .nav-items a {
    @apply py-0 flex-row;

    i {
      @apply mr-2 ml-0;
    }
  }

  .nav-items a:hover {
    @apply underline;
  }
}
</style>
