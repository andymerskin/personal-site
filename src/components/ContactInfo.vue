<template>
  <div class="flex flex-col sm:flex-row sm:justify-center items-center">
    <a
      href="mailto:andymerskin@gmail.com"
      target="_blank"
      title="Email Andy Merskin"
      class="hire-me-link no-underline bg-blue hover:bg-blue-dark hover:shadow-lg focus:shadow-outline text-bg py-4 px-6 rounded-full"><i class="mr-2 far fa-paper-plane"></i>Hire Andy</a>
    <a
      href="./andymerskin_resume_2019.pdf"
      target="_blank"
      class="text-blue no-underline hover:underline mt-4 sm:ml-8 sm:mt-0"><i class="mr-2 fas fa-file-alt"></i>View Resume</a>
  </div>
</template>

<style lang="scss">
.hire-me-link {
  &:hover .fa-paper-plane,
  &:focus .fa-paper-plane {
    transform: translate(100%, -100%);
    opacity: 0;
    transition: all 0.3s config('ease.easeInQuart') 0.3s;
  }

  .fa-paper-plane {
    transition: all 0.6s config('ease.easeOutQuart');
  }
}
</style>
