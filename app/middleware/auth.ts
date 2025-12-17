export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register']
  
  // Check if the route is public or in the auth folder
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/auth/')

  // If the route is public, allow access
  if (isPublicRoute) {
    return
  }

  // For protected routes, check authentication
  const user = $auth.currentUser

  // If not authenticated, redirect to login
  if (!user) {
    return navigateTo('/login')
  }
})
