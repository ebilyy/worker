<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <LayoutHeader />

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <CommonFooter>
      <template #left>
        <div class="flex items-center gap-x-2">
          <UIcon
            name="i-heroicons-briefcase"
            class="h-6 w-6"
          />
          <span class="font-semibold">JobPortal</span>
        </div>
      </template>
      <template #right>
        <div class="flex items-center gap-x-4">
          <NuxtLink
            to="/about"
            class="text-sm"
            >About</NuxtLink
          >
          <NuxtLink
            to="/privacy"
            class="text-sm"
            >Privacy</NuxtLink
          >
          <NuxtLink
            to="/terms"
            class="text-sm"
            >Terms</NuxtLink
          >
        </div>
      </template>
    </CommonFooter>
  </div>
</template>

<script setup lang="ts">
// No additional script needed since auth logic is in the Header component
</script>
