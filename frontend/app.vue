<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  // Global app setup
  useHead({
    titleTemplate: '%s - IT Job Search Platform'
  })
</script>

<style>
  html,
  body {
    @apply antialiased;
  }

  .page-enter-active,
  .page-leave-active {
    transition: all 0.2s;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
</style>
