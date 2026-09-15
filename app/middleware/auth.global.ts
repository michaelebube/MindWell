import { onAuthStateChanged, type User } from 'firebase/auth'

const publicRoutes = new Set(['/', '/login', '/register', '/forgot-password', '/sos'])
const authRoutes = new Set(['/login', '/register', '/forgot-password', '/auth/forgot-password'])

const waitForAuthUser = async (): Promise<User | null> => {
  const { $auth } = useNuxtApp()

  if ($auth.currentUser) {
    return $auth.currentUser
  }

  return await new Promise(resolve => {
    const unsubscribe = onAuthStateChanged($auth, user => {
      unsubscribe()
      resolve(user)
    })
  })
}

export default defineNuxtRouteMiddleware(async to => {
  if (import.meta.server) {
    return
  }

  const user = await waitForAuthUser()
  const isPublicRoute = publicRoutes.has(to.path) || to.path.startsWith('/auth/')
  const isAuthRoute = authRoutes.has(to.path)

  if (user && isAuthRoute) {
    return navigateTo('/chat')
  }

  if (!user && !isPublicRoute) {
    return navigateTo('/login')
  }
})
