<template>
  <div class="flex flex-col flex-1">
    <div class="sm:flex-1 flex flex-col items-center justify-center px-6">
      <!-- Green message card -->
      <div
        class="bg-[#80BA41] mt-4 text-[#FBFBFB]/90 xs:px-18 lg:py-10 xl:px-6 px-12 xs:py-6 py-5 rounded-lg xs:max-w-80 max-w-72 sm:max-w-96 md:max-w-104 lg:max-w-md xl:max-w-120 text-center mb-8 flex flex-col gap-2"
        :class="{ 'sm:hidden': registrationState === 'success' || registrationState === 'error' }"
      >
        <!-- Default State -->
        <template v-if="registrationState === 'idle'">
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-5 mb-4">
            What would you like me to call you, friend ?
          </p>
          <img :src="DownArrowIcon" alt="Down Arrow" width="16" height="16" class="mx-auto mb-4" />
          <p class="xs:text-[16px] text-sm xs:leading-5 leading-4">
            You don't have to use your real name if you're not comfortable. This is a safe,
            judgment‑free space.
          </p>
        </template>

        <!-- Success State -->
        <template v-else-if="registrationState === 'success'">
          <p class="xs:text-lg text-[16px] xs:leading-6 leading-5 text-center tracking-wide">
            Yayy!!! Welcome to MindWell,<br />
            <span class="font-semibold">{{ formData.name }}.</span>
          </p>
          <p class="mt-5 xs:text-lg text-[16px] xs:leading-6 leading-5 text-center tracking-wide">
            You're going to love it here.
          </p>
          <img :src="blueHeartIcon" alt="" class="mx-auto -mb-5" />
        </template>

        <!-- Error State -->
        <template v-else-if="registrationState === 'error'">
          <div class="my-10">
            <p class="xs:text-lg text-[16px] xs:leading-6 leading-5">
              It's okay — don't feel bad. Let's try again together.
            </p>
            <img :src="huggingIcon" alt="Hugging Icon" class="mx-auto xs:w-14 xs:h-14 mt-7" />
          </div>
        </template>
      </div>

      <!-- Form container -->
      <div
        class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 sm:max-w-96 md:max-w-104 lg:max-w-md xl:max-w-120 space-y-3 rounded-xl px-6 py-8 lg:py-12 xl:py-8 mb-10 xs:mb-0 sm:mb-36"
      >
        <!-- Success Message -->
        <div v-if="registrationState === 'success'" class="text-center text-white py-14 sm:py-10">
          <p class="xs:text-2xl text-lg font-bold">Account <span class="block">Created</span></p>
          <img :src="greenTick" alt="Green Tick" class="mx-auto mt-2 xs:w-14 xs:h-14" />

          <!-- Combined content for sm+ screens -->
          <div class="hidden sm:block">
            <hr class="border-white/ border-2 my-16 mx-auto rounded-lg w-full" />
            <p class="text-base sm:text-[16px] leading-1 tracking-wide text-[#FBFBFB] font-normal">
              Yayy!!! Welcome to MindWell,
              <span class="font-semibold">{{ formData.name }} .</span>
            </p>
            <p class="mt-2 text-[#FBFBFB] text-base sm:text-[16px] font-normal tracking-wide">
              You're going to love it here.
            </p>
            <img :src="greenHeartIcon" alt="" class="mx-auto mt-6 w-8 h-8" />
          </div>
        </div>

        <!-- Error Message -->
        <div
          v-else-if="registrationState === 'error'"
          class="text-center text-white py-16 sm:py-10 flex flex-col gap-1"
        >
          <p class="xs:text-xl text-lg font-bold xs:leading-6 sm:text-2xl leading-5">Error</p>
          <img
            :src="errorIcon"
            alt="Error Icon"
            class="mx-auto mt-2 xs:w-14 xs:h-14 sm:h-18 sm:w-18"
          />
          <p class="sm:hidden xs:text-lg text-[16px] mt-2 xs:leading-6 leading-5 font-medium">
            Please try again
          </p>

          <!-- Combined content for sm+ screens -->
          <div class="hidden sm:block">
            <hr class="border-white/ border-2 my-16 mx-auto rounded-lg w-full" />
            <p class="text-base sm:text-[16px] leading-6 tracking-wide text-[#FBFBFB] font-normal">
              It's okay — don't feel bad. Let's try again together.
            </p>
            <img :src="huggingIcon" alt="Hugging Icon" class="mx-auto mt-6 w-10 h-10" />
          </div>
        </div>

        <!-- Form -->
        <form v-else class="flex flex-col gap-3 space-y-3" @submit.prevent="handleRegister">
          <div class="flex flex-col gap-1.5">
            <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs" for="name"
              >Anonymous Name</label
            >
            <input
              id="name"
              v-model="formData.name"
              type="text"
              autocomplete="off"
              required
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 border border-gray-300 rounded-lg xs:text-sm text-xs text-[#80BA41] focus:outline-none bg-gray-100 focus:ring-2 focus:ring-[#80BA41]"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-[#FBFBFB] opacity-60 xs:text-sm font-extralight text-xs" for="email"
              >Email</label
            >
            <input
              id="email"
              v-model="formData.email"
              type="email"
              autocomplete="off"
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
              autocomplete="new-password"
              required
              minlength="6"
              class="w-full xs:px-4 px-3 xs:py-3 py-2.5 text-[#80BA41] border border-gray-300 rounded-lg xs:text-sm text-xs bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#80BA41]"
            />
          </div>

          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="w-full bg-[#80BA41] text-white xs:py-3 py-2.5 rounded-lg xs:text-sm text-xs font-semibold hover:bg-[#6fa535] transition-colors mt-2 disabled:cursor-not-allowed"
            :class="{
              'bg-[#99A987] hover:bg-[#8a9a6f]': !isFormValid,
              'opacity-50': loading,
            }"
          >
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import DownArrowIcon from '../../assets/svg/down-arrow.svg'
import greenTick from '../../assets/svg/green_tick.svg'
import huggingIcon from '../../assets/svg/noto_people-hugging.svg'
import errorIcon from '../../assets/svg/error.svg'
import blueHeartIcon from '../../assets/svg/blue-heart.svg'
import greenHeartIcon from '../../assets/svg/greenheart.svg'

definePageMeta({
  layout: 'auth',
  path: '/register',
})

const { $auth, $firestore } = useNuxtApp()
const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
})

const loading = ref(false)
const registrationState = ref<'idle' | 'success' | 'error'>('idle')

const isFormValid = computed(() => {
  return (
    formData.value.email.trim() !== '' &&
    formData.value.password.trim() !== '' &&
    formData.value.name.trim() !== ''
  )
})

const handleRegister = async () => {
  try {
    loading.value = true
    registrationState.value = 'idle'

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      $auth,
      formData.value.email,
      formData.value.password
    )

    // Update user profile with display name
    await updateProfile(userCredential.user, {
      displayName: formData.value.name,
    })

    // Try to save user data to Firestore (optional - won't fail registration if it errors)
    try {
      await setDoc(doc($firestore, 'users', userCredential.user.uid), {
        name: formData.value.name,
        email: formData.value.email,
        createdAt: new Date().toISOString(),
      })
     
    } catch (firestoreErr) {
      console.warn('Firestore save failed (non-critical):', firestoreErr)
    }

    // Show success state
    registrationState.value = 'success'

    // Wait 3 seconds then redirect (user is already authenticated)
    setTimeout(() => {
      router.push('/mood-log')
    }, 3000)
  } catch (err) {
    console.error('Registration error:', err)

    // Show error state
    registrationState.value = 'error'

    // Wait 3 seconds, then reset to form
    setTimeout(() => {
      registrationState.value = 'idle'
      loading.value = false
    }, 3000)
  }
}
</script>
