<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <!-- Password Reset Success Banner -->
      <div
        v-if="showResetSuccess"
        class="bg-[#2E7D32] text-white xs:px-6 px-4 xs:py-4 py-3 rounded-lg xs:max-w-80 sm:max-w-96 md:max-w-104 
        xl:max-w-120 max-w-72 text-center mb-4 animate-bounce"
      >
        <p class="xs:text-[16px] text-sm font-semibold mb-1">✅ Password Reset Successful!</p>
        <p class="xs:text-sm text-xs opacity-90">You can now log in with your new password.</p>
      </div>

      <!-- Green message card -->
      <div
        class="bg-[#80BA41] mt-4 text-[#FBFBFB]/90 xs:px-2 px-3 xs:py-10 py-5 rounded-lg xs:max-w-80 sm:max-w-96 md:max-w-104 
        xl:max-w-120 max-w-72 text-center mb-8 flex flex-col gap-2"
      >
        <!-- Default State -->
        <template v-if="true">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">Welcome back!</p>
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">
            We're glad to see you again. Log in to continue your journey toward better mental health
            — your space is safe and judgment-free.
          </p>
        </template>
      </div>

      <!-- Form container -->
      <div
        class="flex flex-col gap-3 w-full xs:max-w-80 sm:max-w-96 md:max-w-104 
        xl:max-w-120 max-w-72 space-y-3 rounded-xl px-6 pt-4 pb-7 mb-10 xs:mb-0 sm:mb-24 relative overflow-hidden transition-all duration-300 bg-[#2558A6]"
        :class="{ 'pt-12': loginState === 'success' || loginState === 'error' }"
      >
        <div
          :class="{
            'absolute top-0 left-0 w-full h-full bg-gray-300 opacity-75':
              loginState === 'success' || loginState === 'error',
          }"
        ></div>
        <!-- Success Banner -->
        <div
          v-if="loginState === 'success'"
          class="absolute top-0 left-0 right-0 bg-[#2E7D32] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown"
        >
          Log-in successful!
        </div>

        <!-- Error Banner -->
        <div
          v-if="loginState === 'error'"
          class="absolute top-0 left-0 right-0 bg-[#C62828] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown"
        >
          oppss.. please try again.
        </div>

        <!-- Form -->
        <form
          class="flex flex-col gap-3 space-y-3 transition-all duration-300"
          @submit.prevent="handleLogin"
        >
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
              :disabled="loginState === 'success' || loginState === 'error'"
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-[#80BA41] text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label
              class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs"
              for="password"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                :disabled="loginState === 'success' || loginState === 'error'"
                class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41] xs:mb-5 mb-2.5 pr-10 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              />
              <button
                v-if="formData.password.length > 0"
                type="button"
                :disabled="loginState === 'success' || loginState === 'error'"
                class="absolute right-3 top-1/2 -translate-y-6/7 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                :class="{ 'xs:mb-2.5 mb-1.5': true }"
                @click="showPassword = !showPassword"
              >
                <img v-if="showPassword" :src="showPasswordIcon" alt="Show Password Icon" />
                <img v-else :src="hidePasswordIcon" alt="Hide Password Icon" />
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="
                !isFormValid || loading || loginState === 'success' || loginState === 'error'
              "
              class="w-full text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs bg-[#80BA41] hover:bg-[#6fa535] font-semibold transition-colors mt-2 xs:mb-5 mb-3 disabled:cursor-not-allowed"
              :class="{
                'bg-[#99A987] hover:bg-[#8a9a6f]': !isFormValid && loginState === 'idle',
                'bg-gray-400': loginState === 'success' || loginState === 'error',
              }"
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
import showPasswordIcon from '../../assets/svg/show-password.svg'
import hidePasswordIcon from '../../assets/svg/hide-password.svg'

definePageMeta({
  layout: 'auth',
  path: '/login',
})

const { $auth } = useNuxtApp()
const router = useRouter()
const route = useRoute()
const { hasMoodLoggedToday } = useMoodLog()

const formData = ref({
  email: '',
  password: '',
})

const loading = ref(false)
const loginState = ref<'idle' | 'success' | 'error'>('idle')
const showPassword = ref(false)
const showResetSuccess = ref(false)

const isFormValid = computed(() => {
  return formData.value.email.trim() !== '' && formData.value.password.trim() !== ''
})

// Check for password reset redirect on mount
onMounted(() => {
  // Check if user came from password reset
  if (route.query.mode === 'resetPassword') {
    showResetSuccess.value = true

    // Auto-hide success banner after 5 seconds
    setTimeout(() => {
      showResetSuccess.value = false
      // Clean up the URL query parameters
      router.replace('/login')
    }, 5000)
  }
})

const handleLogin = async () => {
  try {
    loading.value = true
    loginState.value = 'idle'

    // Sign in with email and password
    await signInWithEmailAndPassword($auth, formData.value.email, formData.value.password)

    // Show success state
    loginState.value = 'success'

    // Check if user has already logged mood today
    const hasLoggedMood = await hasMoodLoggedToday()

    // Wait 2 seconds then redirect based on mood status
    setTimeout(() => {
      if (hasLoggedMood) {
        router.push('/chat')
      } else {
        router.push('/mood-log')
      }
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
