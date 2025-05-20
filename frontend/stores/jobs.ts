import { defineStore } from 'pinia'
import type { Job, JobFilters } from '@/types/job'

interface JobsState {
  jobs: Job[]
  featuredJobs: Job[]
  currentJob: Job | null
  loading: boolean
  error: string | null
  filters: JobFilters
  totalJobs: number
  currentPage: number
  itemsPerPage: number
}

export const useJobsStore = defineStore('jobs', {
  state: (): JobsState => ({
    jobs: [],
    featuredJobs: [],
    currentJob: null,
    loading: false,
    error: null,
    filters: {
      search: '',
      location: '',
      category: '',
      type: '',
      experience: '',
      salary: {
        min: null,
        max: null
      }
    },
    totalJobs: 0,
    currentPage: 1,
    itemsPerPage: 10
  }),

  getters: {
    hasJobs: (state) => state.jobs.length > 0,
    hasFeaturedJobs: (state) => state.featuredJobs.length > 0,
    totalPages: (state) => Math.ceil(state.totalJobs / state.itemsPerPage)
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setFilters(filters: Partial<JobFilters>) {
      this.filters = { ...this.filters, ...filters }
    },

    setPage(page: number) {
      this.currentPage = page
    },

    async fetchJobs() {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/jobs', {
          params: {
            page: this.currentPage,
            limit: this.itemsPerPage,
            ...this.filters
          }
        })

        this.jobs = response.jobs
        this.totalJobs = response.total
        return response
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to fetch jobs')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchFeaturedJobs() {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/jobs/featured')
        this.featuredJobs = response.jobs
        return response
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to fetch featured jobs')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async fetchJobById(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch(`/api/jobs/${id}`)
        this.currentJob = response
        return response
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to fetch job')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async createJob(job: Omit<Job, 'id' | 'created_at' | 'updated_at'>) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch('/api/jobs', {
          method: 'POST',
          body: job
        })
        return response
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to create job')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async updateJob(id: string, job: Partial<Job>) {
      this.setLoading(true)
      this.setError(null)

      try {
        const response = await $fetch(`/api/jobs/${id}`, {
          method: 'PATCH',
          body: job
        })
        return response
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to update job')
        throw error
      } finally {
        this.setLoading(false)
      }
    },

    async deleteJob(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        await $fetch(`/api/jobs/${id}`, {
          method: 'DELETE'
        })
        this.jobs = this.jobs.filter((job) => job.id !== id)
      } catch (error) {
        this.setError(error instanceof Error ? error.message : 'Failed to delete job')
        throw error
      } finally {
        this.setLoading(false)
      }
    }
  }
})
