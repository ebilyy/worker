<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        {{ error?.statusCode || '404' }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
        {{ error?.message || 'Page not found' }}
      </p>
      <UButton
        variant="solid"
        label="Back to Home"
        to="/"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    error?: {
      statusCode?: string | number
      message?: string
    }
  }>()
</script>
