<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Reset your password</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Enter your email address and we'll send you a link to reset your password.
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

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="authStore.isLoading"
              :disabled="authStore.isLoading"
            >
              Send reset link
            </UButton>
          </div>

          <div class="text-center">
            <NuxtLink
              to="/auth/login"
              class="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Back to login
            </NuxtLink>
          </div>

          <UAlert
            v-if="authStore.error"
            type="error"
            :title="authStore.error"
          />

          <UAlert
            v-if="success"
            type="success"
            title="Password reset link sent"
            description="Please check your email for instructions to reset your password."
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
  title: 'Forgot Password'
})

const authStore = useAuthStore()
const success = ref(false)

const form = reactive({
  email: ''
})

const errors = reactive({
  email: ''
})

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
})

const handleSubmit = async () => {
  // Reset errors
  errors.email = ''
  success.value = false

  try {
    // Validate form
    forgotPasswordSchema.parse(form)

    // Request password reset
    await authStore.requestPasswordReset(form.email)
    success.value = true
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] === 'email') {
          errors.email = err.message
        }
      })
    }
  }
}
</script> 