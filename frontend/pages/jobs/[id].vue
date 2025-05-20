<template>
  <div>
    <div
      v-if="jobsStore.loading"
      class="flex justify-center py-12"
    >
      <ULoadingIcon />
    </div>

    <template v-else-if="job">
      <!-- Job Header -->
      <UCard class="mb-8">
        <div class="flex items-start justify-between">
          <div class="flex items-start gap-6">
            <UAvatar
              src=""
              size="2xl"
              alt="Company logo"
            />
            <div>
              <h1 class="text-2xl font-bold">{{ job.title }}</h1>
              <p class="mt-1 text-lg text-gray-600 dark:text-gray-400">Company Name</p>

              <div class="mt-4 flex flex-wrap items-center gap-4">
                <UBadge
                  :color="job.is_remote ? 'green' : 'blue'"
                  variant="soft"
                  :label="job.is_remote ? 'Remote' : job.location"
                />
                <UBadge
                  :color="job.type === 'FULL_TIME' ? 'primary' : 'gray'"
                  variant="soft"
                  :label="job.type"
                />
                <UBadge
                  color="yellow"
                  variant="soft"
                  :label="job.experience"
                />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{
                    job.salary.min && job.salary.max
                      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                      : 'Salary not specified'
                  }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-end gap-4">
            <UButton
              :loading="isLoading"
              @click="handleApply"
            >
              Apply Now
            </UButton>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Posted {{ formatDate(job.created_at) }}
            </p>
          </div>
        </div>
      </UCard>

      <div class="grid gap-8 lg:grid-cols-3">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Job Description</h2>
            </template>
            <div class="prose dark:prose-invert max-w-none">
              {{ job.description }}
            </div>
          </UCard>

          <!-- Requirements -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Requirements</h2>
            </template>
            <ul class="list-disc pl-5 space-y-2">
              <li
                v-for="requirement in job.requirements"
                :key="requirement"
              >
                {{ requirement }}
              </li>
            </ul>
          </UCard>

          <!-- Responsibilities -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Responsibilities</h2>
            </template>
            <ul class="list-disc pl-5 space-y-2">
              <li
                v-for="responsibility in job.responsibilities"
                :key="responsibility"
              >
                {{ responsibility }}
              </li>
            </ul>
          </UCard>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Skills -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Required Skills</h2>
            </template>
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="skill in job.skills"
                :key="skill"
                color="primary"
                variant="soft"
                :label="skill"
              />
            </div>
          </UCard>

          <!-- Benefits -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">Benefits</h2>
            </template>
            <ul class="space-y-2">
              <li
                v-for="benefit in job.benefits"
                :key="benefit"
                class="flex items-center gap-2"
              >
                <Icon
                  name="heroicons:check-circle"
                  class="h-5 w-5 text-green-500"
                />
                <span>{{ benefit }}</span>
              </li>
            </ul>
          </UCard>

          <!-- Company Info -->
          <UCard>
            <template #header>
              <h2 class="text-xl font-semibold">About the Company</h2>
            </template>
            <div class="space-y-4">
              <p class="text-gray-600 dark:text-gray-400">Company description goes here...</p>
              <UButton
                variant="ghost"
                to="/jobs"
                block
              >
                Back to Jobs
              </UButton>
            </div>
          </UCard>
        </div>
      </div>
    </template>

    <div
      v-else
      class="py-12 text-center"
    >
      <Icon
        name="heroicons:exclamation-circle"
        class="mx-auto h-12 w-12 text-gray-400"
      />
      <h3 class="mt-2 text-sm font-semibold">Job not found</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        The job you're looking for doesn't exist or has been removed.
      </p>
      <div class="mt-6">
        <UButton
          color="primary"
          to="/jobs"
          label="Browse Jobs"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const jobsStore = useJobsStore()
  const authStore = useAuthStore()

  const applying = ref(false)

  definePageMeta({
    layout: 'default'
  })

  const job = computed(() => jobsStore.currentJob)

  useHead(() => ({
    title: job.value ? `${job.value.title} - Job Details` : 'Job Not Found'
  }))

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleApply = async () => {
    if (!authStore.isAuthenticated) {
      return navigateTo({
        path: '/auth/login',
        query: { redirect: route.fullPath }
      })
    }

    applying.value = true
    try {
      // TODO: Implement job application logic
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      applying.value = false
    }
  }

  // Fetch job details
  onMounted(async () => {
    try {
      await jobsStore.fetchJobById(route.params.id as string)
    } catch (error) {
      // Error will be handled by the store
    }
  })
</script>
