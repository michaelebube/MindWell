<template>
  <div class="min-h-screen relative flex flex-col">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>
    <!-- Header -->
    <div class="flex items-center justify-between xs:px-4 px-3 pt-8 pb-2 z-10">
      <button aria-label="Go Back" @click="goBack">
        <div
          class="bg-[#1565C0] w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer"
        >
          <img :src="backArrowIcon" alt="Back Arrow" class="w-9 h-9 p-2" />
        </div>
      </button>
      <img :src="logo" alt="MindWell Logo" class="-mr-2 w-20 h-20" />
    </div>

    <main class="mt-4 z-10 px-4">
      <!-- Profile Info Section -->
      <section class="flex flex-col items-center">
        <img
          :src="profileCircleIcon"
          alt="Profile Icon"
          class="w-10 h-10 xs:w-14 xs:h-14 text-center"
        />
        <div class="px-7 py-2.5 bg-[#FBFBFB] rounded-[10px] shadow-2xl mt-4 text-center">
          <h2 class="text-xs xs:text-sm font-medium text-[#80BA41] mb-1">Anonymous Username</h2>
          <p class="text-sm xs:text-[16px] font-semibold text-[#2558A6]">{{ userName }}</p>
        </div>

        <div class="px-10 py-4.5 max-w-80 bg-[#FBFBFB] rounded-[10px] shadow-2xl mt-4 text-center">
          <h2 class="text-xs xs:text-sm font-medium text-[#80BA41] mb-1">Email</h2>
          <p class="text-sm xs:text-[16px] font-semibold text-[#2558A6]">{{ userEmail }}</p>
        </div>
      </section>

      <!-- Change Password Section -->
      <section class="z-10 mt-8 xs:mt-14 mb-10">
        <div
          class="mx-auto max-w-68 xs:max-w-80 bg-[#FBFBFB] rounded-[10px] shadow-2xl px-5 py-5 relative overflow-hidden transition-all duration-300"
          :class="{ 'pt-12': formState === 'success' || formState === 'error' }"
        >
          <!-- Overlay when success/error -->
          <div
            :class="{
              'absolute top-0 left-0 w-full h-full bg-gray-300 opacity-75 z-10':
                formState === 'success' || formState === 'error',
            }"
          ></div>

          <!-- Success Banner -->
          <div
            v-if="formState === 'success'"
            class="absolute top-0 left-0 right-0 bg-[#2E7D32] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown z-20"
          >
            Password changed successfully!
          </div>

          <!-- Error Banner -->
          <div
            v-if="formState === 'error'"
            class="absolute top-0 left-0 right-0 bg-[#C62828] text-white text-center rounded-t-lg py-2 xs:text-sm text-xs font-semibold animate-slideDown z-20"
          >
            {{ errorMessage }}
          </div>

          <h2 class="text-[#80BA41] font-medium text-sm text-center mb-4">Change Password</h2>

          <form class="flex flex-col gap-3" @submit.prevent="handleChangePassword">
            <!-- Current Password -->
            <div class="flex flex-col gap-2">
              <label
                class="text-[#80BA41] opacity-90 xs:text-xs font-light text-[10px]"
                for="currentPassword"
              >
                Current Password
              </label>
              <div class="relative">
                <input
                  id="currentPassword"
                  v-model="formData.currentPassword"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  autocomplete="off"
                  required
                  :disabled="formState === 'success' || formState === 'error'"
                  class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-lg xs:text-xs text-[10px] bg-[#FBFBFB] focus:outline-none focus:ring-2 focus:ring-[#80BA41] pr-10 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <button
                  v-if="formData.currentPassword.length > 0"
                  type="button"
                  :disabled="formState === 'success' || formState === 'error'"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="showCurrentPassword = !showCurrentPassword"
                >
                  <img
                    v-if="showCurrentPassword"
                    :src="showPasswordIcon"
                    alt="Show Password Icon"
                  />
                  <img v-else :src="hidePasswordIcon" alt="Hide Password Icon" />
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div class="flex flex-col gap-2">
              <label
                class="text-[#80BA41] opacity-80 xs:text-xs font-light text-[10px]"
                for="newPassword"
              >
                New Password
              </label>
              <div class="relative">
                <input
                  id="newPassword"
                  v-model="formData.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  autocomplete="off"
                  required
                  :disabled="formState === 'success' || formState === 'error'"
                  class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-lg xs:text-xs text-[10px] bg-[#FBFBFB] focus:outline-none focus:ring-2 focus:ring-[#80BA41] pr-10 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <button
                  v-if="formData.newPassword.length > 0"
                  type="button"
                  :disabled="formState === 'success' || formState === 'error'"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="showNewPassword = !showNewPassword"
                >
                  <img v-if="showNewPassword" :src="showPasswordIcon" alt="Show Password Icon" />
                  <img v-else :src="hidePasswordIcon" alt="Hide Password Icon" />
                </button>
              </div>
            </div>

            <!-- Confirm New Password -->
            <div class="flex flex-col gap-2">
              <label
                class="text-[#80BA41] opacity-80 font-light xs:text-xs text-[10px]"
                for="confirmPassword"
              >
                Confirm New Password
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  autocomplete="off"
                  required
                  :disabled="formState === 'success' || formState === 'error'"
                  class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_4px_6px_-1px_rgba(0,0,0,0.1)] rounded-lg xs:text-xs text-[10px] bg-[#FBFBFB] focus:outline-none focus:ring-2 focus:ring-[#80BA41] pr-10 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                />
                <button
                  v-if="formData.confirmPassword.length > 0"
                  type="button"
                  :disabled="formState === 'success' || formState === 'error'"
                  class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <img
                    v-if="showConfirmPassword"
                    :src="showPasswordIcon"
                    alt="Show Password Icon"
                  />
                  <img v-else :src="hidePasswordIcon" alt="Hide Password Icon" />
                </button>
              </div>
            </div>

            <!-- Save Button -->
            <button
              type="submit"
              :disabled="
                !isFormValid || loading || formState === 'success' || formState === 'error'
              "
              class="w-full text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs bg-[#80BA41] hover:bg-[#6fa535] font-semibold transition-colors mt-4 disabled:cursor-not-allowed"
              :class="{
                'bg-[#D9D9D9]': !isFormValid && formState === 'idle',
                'bg-gray-400': formState === 'success' || formState === 'error',
              }"
            >
              {{ loading ? 'Updating...' : 'Save' }}
            </button>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import logo from '../../assets/svg/logo.svg'
import profileCircleIcon from '../../assets/svg/profile-circular-icon.svg'
import bgImg from '../../assets/images/bgImage.png'
import backArrowIcon from '../../assets/svg/back-arrow.svg'
import showPasswordIcon from '../../assets/svg/show-password.svg'
import hidePasswordIcon from '../../assets/svg/hide-password.svg'

const { $auth } = useNuxtApp()

const goBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/chat')
  }
}

const userName = computed(() => $auth.currentUser?.displayName || 'User')
const userEmail = computed(() => $auth.currentUser?.email || '')

// Form state
const formData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loading = ref(false)
const formState = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('Oops.. please try again.')

// Password visibility toggles
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Form validation
const isFormValid = computed(() => {
  return (
    formData.value.currentPassword.trim() !== '' &&
    formData.value.newPassword.trim() !== '' &&
    formData.value.confirmPassword.trim() !== '' &&
    formData.value.newPassword.length >= 6 &&
    formData.value.newPassword === formData.value.confirmPassword
  )
})

// Handle password change
const handleChangePassword = async () => {
  if (!$auth.currentUser || !$auth.currentUser.email) {
    errorMessage.value = 'User not authenticated'
    formState.value = 'error'
    setTimeout(() => {
      formState.value = 'idle'
    }, 3000)
    return
  }

  try {
    loading.value = true
    formState.value = 'idle'

    // Re-authenticate user with current password
    const credential = EmailAuthProvider.credential(
      $auth.currentUser.email,
      formData.value.currentPassword
    )
    await reauthenticateWithCredential($auth.currentUser, credential)

    // Update password
    await updatePassword($auth.currentUser, formData.value.newPassword)

    // Show success state

    formState.value = 'success'
    loading.value = false

    // Reset form after 2 seconds
    setTimeout(() => {
      formState.value = 'idle'
      formData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }, 2000)
  } catch (err: any) {
    console.error('Password change error:', err)

    // Set appropriate error message
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      errorMessage.value = 'Current password is incorrect'
    } else if (err.code === 'auth/weak-password') {
      errorMessage.value = 'New password is too weak'
    } else if (err.code === 'auth/requires-recent-login') {
      errorMessage.value = 'Please log in again to change password'
    } else {
      errorMessage.value = 'Oops.. please try again.'
    }

    // Show error state
    formState.value = 'error'

    // Reset after 3 seconds
    setTimeout(() => {
      formState.value = 'idle'
      loading.value = false
    }, 3000)
  }
}
</script>

<style scoped>
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-slideDown {
  animation: slideDown 0.3s ease-out forwards;
}
</style>
