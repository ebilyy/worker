export default defineNuxtRouteMiddleware((_to, _from) => {
  const { isAuthenticated } = useAuthStore()

  // If the user is authenticated, redirect to home page
  if (isAuthenticated) {
    return navigateTo('/')
  }
})
