<template>
  <div class="relative min-h-screen overflow-hidden">
    <div
      class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-5"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <div
      class="relative z-10 flex min-h-[calc(100vh-6rem)] items-center justify-center px-6 pb-10 pt-4"
    >
      <div class="flex w-full max-w-5xl flex-col items-center gap-6 lg:items-stretch lg:gap-8">
        <div
          class="w-full rounded-[28px] bg-[#80BA41] px-8 py-8 mb-10 text-center text-[#FBFBFB] shadow-[0_20px_45px_rgba(128,186,65,0.28)] sm:px-12 sm:py-10 lg:flex-1 lg:text-left"
        >
          <p class="text-sm font-semibold uppercase tracking-[0.28em] text-white/75">
            {{ statusLabel }}
          </p>
          <h1 class="mt-4 text-5xl font-semibold leading-none sm:text-6xl">
            {{ statusCode }}
          </h1>
          <p class="mt-6 text-base leading-7 text-white/90 sm:text-lg">
            {{ supportiveMessage }}
          </p>
          <div class="mt-6 flex items-center justify-center gap-3 lg:justify-start">
            <img :src="huggingIcon" alt="Hugging Icon" class="h-10 w-10 sm:h-12 sm:w-12" />
            <span class="text-sm font-light tracking-wide text-white/85 sm:text-base">
              We will help you get back on track.
            </span>
          </div>
        </div>

        <div
          class="w-full rounded-[28px] bg-[#2558A6] px-6 py-8 text-center text-white shadow-[0_22px_50px_rgba(37,88,166,0.25)] sm:px-10 sm:py-10 lg:flex-1 lg:text-left"
        >
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Recovery Path
          </p>
          <h2 class="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">
            {{ headline }}
          </h2>
          <p class="mt-5 text-sm leading-6 text-white/80 sm:text-base sm:leading-7">
            {{ message }}
          </p>

          <div class="mt-8 rounded-2xl bg-white/12 px-5 py-4 text-left backdrop-blur-sm">
            <p class="text-sm font-medium text-white/95">
              {{
                isSignedIn
                  ? 'You are signed in, so we can take you straight back to your chat space.'
                  : 'You are not signed in right now, so the safest path is back to the welcome page.'
              }}
            </p>
          </div>

          <div class="mt-8 flex flex-col items-center gap-6 sm:flex-row lg:items-start">
            <button
              class="w-full rounded-xl bg-white mx-4 px-6 py-3 text-base font-semibold text-[#80BA41] transition-colors hover:bg-[#F6FBEE] sm:w-auto"
              type="button"
              @click="handlePrimaryAction"
            >
              {{ primaryActionLabel }}
            </button>

            <button
              class="w-full rounded-xl border border-white/70 mx-4 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              type="button"
              @click="handleReset"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onAuthStateChanged, type Auth } from 'firebase/auth'
import bgImg from './assets/images/bgImage.png'
import huggingIcon from './assets/svg/noto_people-hugging.svg'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const statusCode = computed(() => props.error?.statusCode ?? 500)
const message = computed(
  () =>
    props.error?.statusMessage ||
    props.error?.message ||
    'Something went wrong while loading this page.'
)
const statusLabel = computed(() =>
  statusCode.value === 404 ? 'Page Not Found' : 'Something Went Wrong'
)
const headline = computed(() =>
  statusCode.value === 404 ? 'This page slipped out of reach.' : 'A small hiccup happened here.'
)
const supportiveMessage = computed(() =>
  statusCode.value === 404
    ? "The page you're looking for isn't available, but you're still in the right place."
    : 'Something interrupted this page, but we can guide you back to a safe place in the app.'
)

const isSignedIn = ref(false)

const primaryActionLabel = computed(() => (isSignedIn.value ? 'Go to Chat' : 'Go to Home'))
const primaryActionPath = computed(() => (isSignedIn.value ? '/chat' : '/'))

onMounted(() => {
  const { $auth } = useNuxtApp()

  isSignedIn.value = Boolean(($auth as Auth).currentUser)

  const unsubscribe = onAuthStateChanged($auth as Auth, user => {
    isSignedIn.value = Boolean(user)
  })

  onUnmounted(() => {
    unsubscribe()
  })
})

const handlePrimaryAction = () => clearError({ redirect: primaryActionPath.value })
const handleReset = () => clearError({ redirect: primaryActionPath.value })
</script>
