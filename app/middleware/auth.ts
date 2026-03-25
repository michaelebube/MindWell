export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp()
  const user = $auth.currentUser

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/auth/')

  // If user is authenticated and trying to access auth pages, redirect to chat
  if (user && (to.path === '/login' || to.path === '/register' || to.path === '/forgot-password' || to.path === '/auth/forgot-password')) {
    return navigateTo('/chat')
  }

  // If the route is public, allow access
  if (isPublicRoute) {
    return
  }

  // For protected routes, check authentication
  if (!user) {
    return navigateTo('/login')
  }
})
