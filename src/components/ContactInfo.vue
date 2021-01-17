<template>
  <div class="flex flex-col sm:flex-row sm:justify-center items-center">
    <a
      href="mailto:andymerskin@gmail.com"
      target="_blank"
      title="Email Andy Merskin"
      class="hire-me-link bg-blue-500 hover:bg-blue-600 hover:shadow-lg focus:ring text-bg py-4 px-6 rounded-full"><i class="mr-2 far fa-paper-plane"></i>Hire Andy</a>
    <a
      href="./andymerskin_resume_2019.pdf"
      target="_blank"
      class="text-blue-500 hover:underline mt-4 sm:ml-8 sm:mt-0"><i class="mr-2 fas fa-file-alt"></i>View Resume</a>
  </div>
</template>

<style lang="scss">
.hire-me-link {
  &:hover .fa-paper-plane,
  &:focus .fa-paper-plane {
    @apply transition-all duration-300 ease-in-quart;
    transform: translate(100%, -100%);
    opacity: 0;
    transition-delay: 300ms;
  }

  .fa-paper-plane {
    @apply transition-all duration-700 ease-out-quart;
  }
}
</style>
