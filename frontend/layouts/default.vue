<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UHeader
      :links="navigationLinks"
      :class="{ 'border-b': scrolled }"
      class="sticky top-0 z-50 transition duration-300 ease-in-out"
    >
      <template #logo>
        <NuxtLink
          to="/"
          class="flex items-center gap-x-2"
        >
          <Icon
            name="heroicons:briefcase"
            class="h-6 w-6"
          />
          <span class="font-semibold">IT Jobs</span>
        </NuxtLink>
      </template>

      <template #right>
        <ColorModeButton />
        <template v-if="!isAuthenticated">
          <UButton
            to="/auth/login"
            variant="ghost"
            label="Log In"
          />
          <UButton
            to="/auth/register"
            variant="solid"
            color="primary"
            label="Sign Up"
          />
        </template>
        <template v-else>
          <UDropdown :items="userMenuItems">
            <UAvatar
              :src="userAvatar"
              :alt="userName"
              size="sm"
            />
          </UDropdown>
        </template>
      </template>
    </UHeader>

    <main class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>

    <Footer>
      <template #left>
        <div class="flex items-center gap-x-2">
          <Icon
            name="heroicons:briefcase"
            class="h-6 w-6"
          />
          <span class="font-semibold">IT Jobs</span>
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
    </Footer>
  </div>
</template>

<script setup lang="ts">
  import { useWindowScroll } from '@vueuse/core'
  import type { DropdownItem } from '@/types/ui'

  const { y } = useWindowScroll()
  const scrolled = computed(() => y.value > 0)

  // TODO: Replace with actual auth store
  const isAuthenticated = ref(false)
  const userName = ref('John Doe')
  const userAvatar = ref('')

  const navigationLinks = [
    {
      label: 'Jobs',
      to: '/jobs'
    },
    {
      label: 'Companies',
      to: '/companies'
    },
    {
      label: 'For Employers',
      to: '/employers'
    }
  ]

  const userMenuItems: DropdownItem[][] = [
    [
      {
        label: 'Profile',
        icon: 'i-heroicons-user',
        to: '/profile'
      },
      {
        label: 'Settings',
        icon: 'i-heroicons-cog-6-tooth',
        to: '/settings'
      },
      {
        label: 'Sign Out',
        icon: 'i-heroicons-arrow-right-on-rectangle',
        click: () => {
          // TODO: Implement sign out
        }
      }
    ]
  ]
</script>
