<template>
  <header class="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition duration-300 ease-in-out" :class="{ 'border-b': scrolled }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo and Navigation -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-primary-600">
              JobPortal
            </NuxtLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink
              to="/"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="route.path === '/' ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/jobs"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="route.path.startsWith('/jobs') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              Jobs
            </NuxtLink>
            <NuxtLink
              to="/companies"
              class="inline-flex items-center px-1 pt-1 border-b-2"
              :class="route.path.startsWith('/companies') ? 'border-primary-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200'"
            >
              Companies
            </NuxtLink>
          </div>
        </div>
        
        <!-- User Actions -->
        <div class="flex items-center">
          <!-- Theme Toggle -->
          <button 
            @click="toggleColorMode"
            class="p-2 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            aria-label="Toggle dark mode"
          >
            <UIcon v-if="colorMode.value === 'dark'" name="i-heroicons-sun" class="w-6 h-6" />
            <UIcon v-else name="i-heroicons-moon" class="w-6 h-6" />
          </button>
          
          <!-- Not Authenticated -->
          <div v-if="!authStore.isAuthenticated" class="ml-6 flex items-center space-x-4">
            <NuxtLink 
              to="/auth/login"
              class="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200"
            >
              Login
            </NuxtLink>
            <UButton 
              to="/auth/register"
              color="primary"
              variant="solid"
              size="sm"
            >
              Sign Up
            </UButton>
          </div>
          
          <!-- Authenticated -->
          <div v-else class="ml-6">
            <UDropdown :items="userMenuItems" :popper="{ placement: 'bottom-end' }">
              <UButton
                color="gray"
                variant="ghost"
                class="flex items-center space-x-2"
              >
                <span class="hidden md:block">{{ authStore.currentUser?.name }}</span>
                <UAvatar
                  :src="authStore.currentUser?.avatar_url || undefined"
                  :text="!authStore.currentUser?.avatar_url ? userInitials : undefined"
                  size="sm"
                  color="primary"
                />
              </UButton>
            </UDropdown>
          </div>
        </div>
        
        <!-- Mobile menu button -->
        <div class="flex items-center sm:hidden">
          <UButton
            color="gray"
            variant="ghost"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md"
            aria-expanded="false"
          >
            <UIcon v-if="!isMobileMenuOpen" name="i-heroicons-bars-3" class="block h-6 w-6" />
            <UIcon v-else name="i-heroicons-x-mark" class="block h-6 w-6" />
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="isMobileMenuOpen" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <NuxtLink
          to="/"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="route.path === '/' ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20'"
          @click="isMobileMenuOpen = false"
        >
          Home
        </NuxtLink>
        <NuxtLink
          to="/jobs"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="route.path.startsWith('/jobs') ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20'"
          @click="isMobileMenuOpen = false"
        >
          Jobs
        </NuxtLink>
        <NuxtLink
          to="/companies"
          class="block pl-3 pr-4 py-2 border-l-4"
          :class="route.path.startsWith('/companies') ? 'border-primary-500 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20'"
          @click="isMobileMenuOpen = false"
        >
          Companies
        </NuxtLink>
        
        <!-- Authentication Links for Mobile -->
        <template v-if="!authStore.isAuthenticated">
          <NuxtLink
            to="/auth/login"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            @click="isMobileMenuOpen = false"
          >
            Login
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            @click="isMobileMenuOpen = false"
          >
            Sign Up
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink
            to="/dashboard"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            @click="isMobileMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/profile"
            class="block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
            @click="isMobileMenuOpen = false"
          >
            Profile
          </NuxtLink>
          <button
            @click="handleLogout"
            class="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/20"
          >
            Logout
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const authStore = useAuthStore()
const route = useRoute()
const colorMode = useColorMode()
const isMobileMenuOpen = ref(false)

// Scroll detection
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 0)

// Toggle color mode
const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

// Generate user initials for the avatar
const userInitials = computed(() => {
  if (!authStore.currentUser) return ''
  
  // Split the name into parts and use the first character of each part
  const nameParts = authStore.currentUser.name.split(' ')
  if (nameParts.length >= 2) {
    return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`
  }
  return nameParts[0].charAt(0)
})

// User dropdown menu items
const userMenuItems = computed(() => [
  [
    {
      label: 'Dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/dashboard'
    },
    {
      label: 'Profile',
      icon: 'i-heroicons-user',
      to: '/profile'
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      click: handleLogout
    }
  ]
])

// Handle logout
const handleLogout = async () => {
  try {
    await authStore.logout()
    navigateTo('/auth/login')
  } catch (error) {
    console.error('Logout failed', error)
  }
  
  // Close mobile menu if open
  isMobileMenuOpen.value = false
}
</script> 