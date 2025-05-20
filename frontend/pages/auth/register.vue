<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Create your account</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <NuxtLink
            to="/auth/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>

      <UCard>
        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <UFormGroup
            label="First name"
            name="firstName"
            :error="errors.firstName"
          >
            <UInput
              v-model="form.firstName"
              type="text"
              name="firstName"
              autocomplete="given-name"
              required
              :error="!!errors.firstName"
            />
          </UFormGroup>

          <UFormGroup
            label="Last name"
            name="lastName"
            :error="errors.lastName"
          >
            <UInput
              v-model="form.lastName"
              type="text"
              name="lastName"
              autocomplete="family-name"
              required
              :error="!!errors.lastName"
            />
          </UFormGroup>

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
              autocomplete="new-password"
              required
              :error="!!errors.password"
            />
          </UFormGroup>

          <UFormGroup
            label="Confirm password"
            name="confirmPassword"
            :error="errors.confirmPassword"
          >
            <UInput
              v-model="form.confirmPassword"
              type="password"
              name="confirmPassword"
              autocomplete="new-password"
              required
              :error="!!errors.confirmPassword"
            />
          </UFormGroup>

          <UFormGroup
            label="Account type"
            name="role"
            :error="errors.role"
          >
            <USelect
              v-model="form.role"
              :options="[
                { label: 'Job Seeker', value: 'JOB_SEEKER' },
                { label: 'HR Professional', value: 'HR' },
                { label: 'Admin', value: 'ADMIN' }
              ]"
              required
              :error="!!errors.role"
            />
          </UFormGroup>

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="authStore.isLoading"
              :disabled="authStore.isLoading"
            >
              Create account
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
    title: 'Create Account'
  })

  const authStore = useAuthStore()

  const form = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'JOB_SEEKER'
  })

  const errors = reactive({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  })

  const registerSchema = z
    .object({
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      email: z.string().email('Please enter a valid email address'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
      confirmPassword: z.string(),
      role: z.enum(['JOB_SEEKER', 'HR', 'ADMIN'])
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword']
    })

  const handleSubmit = async () => {
    // Reset errors
    Object.keys(errors).forEach((key) => {
      errors[key as keyof typeof errors] = ''
    })

    try {
      // Validate form
      registerSchema.parse(form)

      // Attempt registration
      await authStore.register(form.email, form.password, form.firstName, form.lastName, form.role)

      // Redirect on success
      navigateTo('/')
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof typeof errors
          if (field) {
            errors[field] = err.message
          }
        })
      }
    }
  }
</script>
