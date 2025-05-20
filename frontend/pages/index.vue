<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16 sm:py-24">
      <div class="text-center">
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          Find Your Next IT Job in Ukraine
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
          Connect with top tech companies and discover opportunities that match your skills and
          aspirations.
        </p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
          <UButton
            size="lg"
            color="primary"
            label="Find Jobs"
          />
          <UButton
            size="lg"
            variant="ghost"
            label="Post a Job"
          />
        </div>
      </div>
    </section>

    <!-- Featured Jobs Section -->
    <section class="py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">Featured Jobs</h2>
        <p class="mt-4 text-gray-600 dark:text-gray-400">
          Explore the latest opportunities from top companies
        </p>
      </div>

      <!-- TODO: Replace with actual job listings -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="i in 3"
          :key="i"
        >
          <template #header>
            <div class="flex items-center gap-4">
              <UAvatar
                src=""
                size="lg"
                alt="Company logo"
              />
              <div>
                <h3 class="font-semibold">Senior Frontend Developer</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
              </div>
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              We're looking for an experienced Frontend Developer to join our team...
            </p>

            <div class="flex flex-wrap gap-2">
              <UBadge
                color="primary"
                variant="soft"
                label="Vue.js"
              />
              <UBadge
                color="primary"
                variant="soft"
                label="TypeScript"
              />
              <UBadge
                color="primary"
                variant="soft"
                label="Nuxt.js"
              />
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-500 dark:text-gray-400">Kyiv, Ukraine</span>
              <UButton
                color="primary"
                variant="ghost"
                to="/jobs/1"
                label="View Details"
              />
            </div>
          </template>
        </UCard>
      </div>

      <div class="mt-12 text-center">
        <UButton
          variant="ghost"
          to="/jobs"
          label="View All Jobs"
        />
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-gray-100 dark:bg-gray-800">
      <div class="text-center">
        <h2 class="text-3xl font-bold">Why Choose Us</h2>
        <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div class="flex justify-center">
              <Icon
                name="heroicons:briefcase"
                class="h-8 w-8 text-primary-500"
              />
            </div>
            <h3 class="mt-4 text-xl font-semibold">1000+</h3>
            <p class="text-gray-600 dark:text-gray-400">Active Jobs</p>
          </div>
          <div>
            <div class="flex justify-center">
              <Icon
                name="heroicons:building-office"
                class="h-8 w-8 text-primary-500"
              />
            </div>
            <h3 class="mt-4 text-xl font-semibold">500+</h3>
            <p class="text-gray-600 dark:text-gray-400">Companies</p>
          </div>
          <div>
            <div class="flex justify-center">
              <Icon
                name="heroicons:users"
                class="h-8 w-8 text-primary-500"
              />
            </div>
            <h3 class="mt-4 text-xl font-semibold">10,000+</h3>
            <p class="text-gray-600 dark:text-gray-400">IT Specialists</p>
          </div>
          <div>
            <div class="flex justify-center">
              <Icon
                name="heroicons:check-badge"
                class="h-8 w-8 text-primary-500"
              />
            </div>
            <h3 class="mt-4 text-xl font-semibold">98%</h3>
            <p class="text-gray-600 dark:text-gray-400">Success Rate</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div class="text-center">
        <UButton
          color="primary"
          variant="solid"
          label="Get Started"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    layout: 'default'
  })

  useHead({
    title: 'Home'
  })
</script>
