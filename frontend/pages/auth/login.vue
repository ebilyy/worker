<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Or
          <NuxtLink
            to="/auth/register"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            create a new account
          </NuxtLink>
        </p>
      </div>

      <UCard>
        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <UFormGroup
            label="Email address"
            name="email"
            :error="errors.email"
          >
            <UInput
              v-model="form.email"
              type="email"
              name="email"
              autocomplete="email"
              required
              :error="!!errors.email"
            />
          </UFormGroup>

          <UFormGroup
            label="Password"
            name="password"
            :error="errors.password"
          >
            <UInput
              v-model="form.password"
              type="password"
              name="password"
              autocomplete="current-password"
              required
              :error="!!errors.password"
            />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox
              v-model="form.remember"
              name="remember-me"
              label="Remember me"
            />

            <NuxtLink
              to="/auth/forgot-password"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </NuxtLink>
          </div>

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="authStore.isLoading"
              :disabled="authStore.isLoading"
            >
              Sign in
            </UButton>
          </div>

          <UAlert
            v-if="authStore.error"
            type="error"
            :title="authStore.error"
          />
        </form>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { z } from 'zod'

  definePageMeta({
    layout: 'default',
    middleware: ['guest']
  })

  useHead({
    title: 'Sign In'
  })

  const authStore = useAuthStore()

  const form = reactive({
    email: '',
    password: '',
    remember: false
  })

  const errors = reactive({
    email: '',
    password: ''
  })

  const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })

  const handleSubmit = async () => {
    // Reset errors
    errors.email = ''
    errors.password = ''

    try {
      // Validate form
      loginSchema.parse(form)

      // Attempt login
      await authStore.login(form.email, form.password)

      // Redirect on success
      navigateTo('/')
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          if (err.path[0] === 'email') {
            errors.email = err.message
          }
          if (err.path[0] === 'password') {
            errors.password = err.message
          }
        })
      }
    }
  }
</script>
