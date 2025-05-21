<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight">Set new password</h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Please enter your new password below.
        </p>
      </div>

      <UCard>
        <form
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <UFormGroup
            label="New password"
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

          <div>
            <UButton
              type="submit"
              color="primary"
              block
              :loading="authStore.isLoading"
              :disabled="authStore.isLoading"
            >
              Reset password
            </UButton>
          </div>

          <UAlert
            v-if="authStore.error"
            type="error"
            :title="authStore.error"
          />

          <UAlert
            v-if="success"
            type="success"
            title="Password reset successful"
            description="Your password has been reset. You can now log in with your new password."
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
  title: 'Reset Password'
})

const route = useRoute()
const authStore = useAuthStore()
const success = ref(false)

const form = reactive({
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  password: '',
  confirmPassword: ''
})

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  })

const handleSubmit = async () => {
  // Reset errors
  errors.password = ''
  errors.confirmPassword = ''
  success.value = false

  try {
    // Validate form
    resetPasswordSchema.parse(form)

    // Reset password
    await authStore.resetPassword(route.params.token as string, form.password)
    success.value = true

    // Redirect to login after 3 seconds
    setTimeout(() => {
      navigateTo('/auth/login')
    }, 3000)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        if (err.path[0] === 'password') {
          errors.password = err.message
        }
        if (err.path[0] === 'confirmPassword') {
          errors.confirmPassword = err.message
        }
      })
    }
  }
}
</script> 