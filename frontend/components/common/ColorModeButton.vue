<template>
  <UButton
    :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
    color="gray"
    variant="ghost"
    aria-label="Toggle color mode"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
  const colorMode = useColorMode()

  const toggleColorMode = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
</script>
