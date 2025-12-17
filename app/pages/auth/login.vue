<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <!-- Green message card -->
      <div
        class="bg-[#80BA41] mt-4 text-[#FBFBFB]/90 xs:px-2 px-3 xs:py-10 py-5 rounded-lg xs:max-w-80 max-w-72 text-center mb-8 flex flex-col gap-2"
      >
        <!-- Default State -->
        <template v-if="loginState === 'idle'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">Welcome back!</p>
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">
            We're glad to see you again. Log in to continue your journey toward better mental health
            — your space is safe and judgment-free.
          </p>
        </template>

        <!-- Success State -->
        <template v-else-if="loginState === 'success'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5">
            Welcome back! Redirecting you now...
          </p>
        </template>

        <!-- Error State -->
        <template v-else-if="loginState === 'error'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5">
            Hmm, that didn't work. Please check your email and password and try again.
          </p>
        </template>
      </div>

      <!-- Form container -->
      <div
        class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 space-y-3 rounded-xl px-6 py-8 mb-10 xs:mb-0"
      >
        <!-- Success Message -->
        <div v-if="loginState === 'success'" class="text-center text-white py-4">
          <p class="xs:text-xl text-lg font-semibold">Login Successful</p>
        </div>

        <!-- Error Message -->
        <div v-else-if="loginState === 'error'" class="text-center text-white py-4">
          <p class="xs:text-xl text-lg font-semibold">Login Failed</p>
          <p class="xs:text-sm text-xs mt-2">Please try again</p>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleLogin" class="flex flex-col gap-3 space-y-3">
          <div class="flex flex-col gap-1.5">
            <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs" for="email"
              >Email</label
            >
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="email"
              required
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-[#80BA41] text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs"
              for="password"
              >Password</label
            >
            <input
              id="password"
              v-model="formData.password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41] xs:mb-5 mb-2.5"
            />
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#80BA41] text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs font-semibold hover:bg-[#6fa535] transition-colors mt-2 xs:mb-5 mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? 'Logging in...' : 'Log in' }}
            </button>
            <div class="text-xs xs:text-sm">
              <p class="text-center font-light text-[#FBFBFB]/70">Can't remember your password?</p>
              <NuxtLink
                href="/forgot-password"
                class="text-[#80BA41] font-light flex items-center justify-center"
                >Reset</NuxtLink
              >
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth'

definePageMeta({
  layout: 'auth',
  path: '/login',
})

const { $auth } = useNuxtApp()
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const loginState = ref<'idle' | 'success' | 'error'>('idle')

const handleLogin = async () => {
  try {
    loading.value = true
    loginState.value = 'idle'

    // Sign in with email and password
    await signInWithEmailAndPassword($auth, formData.value.email, formData.value.password)

    // Show success state
    loginState.value = 'success'

    // Wait 2 seconds then redirect
    setTimeout(() => {
      router.push('/onboarding/mood-log')
    }, 2000)
  } catch (err) {
    console.error('Login error:', err)

    // Show error state
    loginState.value = 'error'

    // Wait 3 seconds, then reset to form
    setTimeout(() => {
      loginState.value = 'idle'
      loading.value = false
    }, 3000)
  }
}
</script>
