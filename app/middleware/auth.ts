import { collection, query, where, getDocs } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $auth, $firestore } = useNuxtApp()
  const user = $auth.currentUser

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password']
  const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/auth/')

  // If user is authenticated and trying to access auth pages
  if (user && (to.path === '/login' || to.path === '/register')) {
    try {
      // Check if user has logged mood today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(
        moodLogsRef,
        where('userId', '==', user.uid),
        where('createdAt', '>=', today.toISOString())
      )
      
      const snapshot = await getDocs(q)
      
      // If mood logged today, go to chat page, otherwise mood-log page
      if (snapshot.empty) {
        return navigateTo('/mood-log')
      } else {
        return navigateTo('/chat')
      }
    } catch (error) {
      console.error('Error checking mood log:', error)
      // Default to mood-log on error
      return navigateTo('/mood-log')
    }
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
