<template>
  <footer class="bg-white dark:bg-gray-800 border-t">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div class="flex items-center justify-between">
        <div>
          <slot name="left" />
        </div>
        <div>
          <slot name="right" />
        </div>
      </div>
    </div>
  </footer>
</template>
