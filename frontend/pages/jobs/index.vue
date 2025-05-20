<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold">IT Jobs</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Find your next opportunity in tech</p>
    </div>

    <!-- Filters -->
    <UCard class="mb-8">
      <form @submit.prevent="handleSearch">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <UFormGroup label="Search">
            <UInput v-model="filters.search" placeholder="Job title or keywords" icon="i-heroicons-magnifying-glass" />
          </UFormGroup>

          <UFormGroup label="Location">
            <UInput v-model="filters.location" placeholder="City or remote" icon="i-heroicons-map-pin" />
          </UFormGroup>

          <UFormGroup label="Category">
            <USelect v-model="filters.category" :options="[
              { label: 'All Categories', value: '' },
              { label: 'Frontend', value: 'frontend' },
              { label: 'Backend', value: 'backend' },
              { label: 'Full Stack', value: 'fullstack' },
              { label: 'DevOps', value: 'devops' },
              { label: 'Mobile', value: 'mobile' }
            ]" />
          </UFormGroup>

          <UFormGroup label="Job Type">
            <USelect v-model="filters.type" :options="[
              { label: 'All Types', value: '' },
              { label: 'Full Time', value: 'FULL_TIME' },
              { label: 'Part Time', value: 'PART_TIME' },
              { label: 'Contract', value: 'CONTRACT' },
              { label: 'Internship', value: 'INTERNSHIP' }
            ]" />
          </UFormGroup>

          <UFormGroup label="Experience">
            <USelect v-model="filters.experience" :options="[
              { label: 'All Levels', value: '' },
              { label: 'Entry Level', value: 'ENTRY' },
              { label: 'Junior', value: 'JUNIOR' },
              { label: 'Mid Level', value: 'MID' },
              { label: 'Senior', value: 'SENIOR' },
              { label: 'Lead', value: 'LEAD' }
            ]" />
          </UFormGroup>

          <UFormGroup label="Salary Range">
            <div class="flex items-center gap-2">
              <UInput v-model="filters.salary.min" type="number" placeholder="Min" />
              <span>-</span>
              <UInput v-model="filters.salary.max" type="number" placeholder="Max" />
            </div>
          </UFormGroup>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <UButton color="gray" variant="ghost" @click="resetFilters">
            Reset
          </UButton>
          <UButton type="submit" color="primary" :loading="jobsStore.loading">
            Search Jobs
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Results -->
    <div v-if="jobsStore.loading" class="flex justify-center py-12">
      <ULoadingIcon />
    </div>

    <template v-else>
      <!-- Job Cards -->
      <div v-if="jobsStore.hasJobs" class="space-y-4">
        <UCard v-for="job in jobsStore.jobs" :key="job.id"
          :ui="{ divide: 'divide-y divide-gray-200 dark:divide-gray-700' }">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <UAvatar src="" size="lg" alt="Company logo" />
                <div>
                  <h3 class="font-semibold">{{ job.title }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                </div>
              </div>
              <UBadge :color="job.is_remote ? 'green' : 'blue'" variant="soft"
                :label="job.is_remote ? 'Remote' : job.location" />
            </div>
          </template>

          <div class="space-y-4 py-4">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ job.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <UBadge v-for="skill in job.skills.slice(0, 5)" :key="skill" color="primary" variant="soft"
                :label="skill" />
              <UBadge v-if="job.skills.length > 5" color="gray" variant="soft"
                :label="`+${job.skills.length - 5} more`" />
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between py-4">
              <div class="flex items-center gap-4">
                <UBadge :color="job.type === 'FULL_TIME' ? 'primary' : 'gray'" variant="soft" :label="job.type" />
                <UBadge color="yellow" variant="soft" :label="job.experience" />
                <span class="text-sm text-gray-500 dark:text-gray-400">
                  {{
                    job.salary.min && job.salary.max
                      ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}`
                      : 'Salary not specified'
                  }}
                </span>
              </div>
              <UButton color="primary" variant="ghost" :to="`/jobs/${job.id}`" label="View Details" />
            </div>
          </template>
        </UCard>
      </div>

      <div v-else class="py-12 text-center">
        <Icon name="heroicons:document-magnifying-glass" class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-semibold">No jobs found</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search filters or check back later for new opportunities.
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="jobsStore.totalPages > 1" class="mt-8 flex justify-center">
        <UPagination v-model="currentPage" :total="jobsStore.totalJobs" :per-page="jobsStore.itemsPerPage" :ui="{
          wrapper: 'flex items-center gap-1',
          rounded: 'rounded-lg'
        }" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { JobFilters } from '@/types/job'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'IT Jobs'
})

const jobsStore = useJobsStore()

const currentPage = ref(1)
const filters = reactive<JobFilters>({
  search: '',
  location: '',
  category: '',
  type: '',
  experience: '',
  salary: {
    min: null,
    max: null
  }
})

watch(currentPage, async (newPage) => {
  jobsStore.setPage(newPage)
  await jobsStore.fetchJobs()
})

const handleSearch = async () => {
  currentPage.value = 1
  jobsStore.setFilters(filters)
  await jobsStore.fetchJobs()
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    location: '',
    category: '',
    type: '',
    experience: '',
    salary: {
      min: null,
      max: null
    }
  })
  handleSearch()
}

// Initial fetch
onMounted(async () => {
  await jobsStore.fetchJobs()
})
</script>
