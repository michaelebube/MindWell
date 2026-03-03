<template>
  <div class="flex flex-col flex-1">
    <div class="sm:flex-1 flex flex-col items-center justify-center px-6">
      <!-- Green message card -->
      <div
        class="bg-[#80BA41] mt-4 text-[#FBFBFB]/90 xs:px-18 px-12 xs:py-6 py-5 md:py-8 lg:py-12 rounded-lg xs:max-w-80 max-w-72 sm:max-w-96 md:max-w-104 lg:max-w-lg xl:max-w-136 text-center mb-8 flex flex-col gap-2"
      >
        <!-- Default State -->
        <template v-if="resetState !== 'success'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">Forgot your password?</p>
          <img :src="DownArrowIcon" alt="Down Arrow" width="16" height="16" class="mx-auto mb-4" />
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-4">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </template>

        <!-- Success State -->
        <template v-else-if="resetState === 'success'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 my-6">
            Check your email! We've sent you a password reset link.
          </p>
        </template>

        <!-- Error State -->
        <template v-else-if="resetState === 'error'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 my-6">
            {{ errorMessage }}
          </p>
        </template>
      </div>

      <!-- Form container -->
      <div
        class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 sm:max-w-96 md:max-w-104 lg:max-w-lg xl:max-w-136 space-y-3 rounded-xl px-6 py-8 md:py-10 lg:py-12 mb-10 xs:mb-0 sm:mb-24 relative"
      >
        <!-- Success grey overlay -->
        <div
          v-if="resetState === 'success'"
          class="absolute inset-0 bg-gray-400/80 rounded-xl z-10 cursor-not-allowed h-full"
        />

        <div
          v-if="resetState === 'success'"
          class="absolute top-0 left-0 right-0 bg-[#2E7D32] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown z-20"
        >
          Submitted!
        </div>

        <!-- Error Banner -->
        <div
          v-if="resetState === 'error'"
          class="absolute top-0 left-0 right-0 bg-[#C62828] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown"
        >
          oppss.. please try again.
        </div>

        <!-- Form -->
        <form
          class="flex flex-col gap-3 space-y-3"
          :class="{ 'mt-6': resetState !== 'idle' }"
          @submit.prevent="handlePasswordReset"
        >
          <div class="flex flex-col gap-1.5">
            <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs" for="email"
              >Email Address</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              placeholder="Enter your email"
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-[#80BA41] text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !emailIsNotEmpty"
            class="w-full bg-[#80BA41] text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs font-semibold hover:bg-[#6fa535] transition-colors mt-2 disabled:cursor-not-allowed"
            :class="{
              'bg-[#99A987] hover:bg-[#8a9a6f]': !emailIsNotEmpty,
              'opacity-50': loading,
            }"
          >
            {{ loading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <!-- Link back to Login -->
          <div class="text-center mt-4">
            <p class="text-[#FBFBFB] opacity-60 xs:text-sm text-xs">
              Remember your password?
              <NuxtLink to="/login" class="text-[#80BA41] font-semibold hover:underline">
                Sign In
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { sendPasswordResetEmail } from 'firebase/auth'
import DownArrowIcon from '../../assets/svg/down-arrow.svg'

definePageMeta({
  layout: 'auth',
  path: '/forgot-password',
})

const { $auth } = useNuxtApp()

const email = ref('')
const loading = ref(false)
const resetState = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const emailIsNotEmpty = computed(() => email.value.trim() !== '')

const handlePasswordReset = async () => {
  try {
    loading.value = true
    resetState.value = 'idle'
    errorMessage.value = ''

    // Get the current origin (works in dev and production)
    const continueUrl = window.location.origin + '/login'

    // Send password reset email with continue URL
    await sendPasswordResetEmail($auth, email.value, {
      url: continueUrl, // User will be redirected here after reset
      handleCodeInApp: false,
    })

    resetState.value = 'success'
    email.value = ''
    setTimeout(() => {
      resetState.value = 'idle'
    }, 5000)
  } catch (err: any) {
    console.error('Password reset error:', err)

    switch (err.code) {
      case 'auth/invalid-email':
        errorMessage.value = 'Please enter a valid email address.'
        break
      case 'auth/user-not-found':
        // For security, show success anyway
        resetState.value = 'success'
        setTimeout(() => {
          resetState.value = 'idle'
          loading.value = false
        }, 5000)
        return
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many requests. Please try again later.'
        break
      case 'auth/network-request-failed':
        errorMessage.value = 'Network error. Please check your connection.'
        break
      default:
        errorMessage.value = 'Something went wrong. Please try again.'
    }

    resetState.value = 'error'

    setTimeout(() => {
      resetState.value = 'idle'
      loading.value = false
    }, 3000)
  } finally {
    if (resetState.value !== 'error') {
      loading.value = false
    }
  }
}
</script>
