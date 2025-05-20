export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuthStore()

  // If the user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
