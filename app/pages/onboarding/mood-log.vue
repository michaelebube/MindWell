<template>
  <div class="flex flex-col h-full">
    <div class="flex-1 flex flex-col items-center justify-center px-6">
      <!-- Logo/Icon Section -->
      <div class="mb-8">
        <div class="w-16 h-16 mx-auto">
          <!-- You can replace this with your actual logo -->
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full"
          >
            <circle cx="32" cy="32" r="30" fill="#80BA41" opacity="0.2" />
            <circle cx="32" cy="32" r="24" fill="#80BA41" />
            <path
              d="M32 20C26.48 20 22 24.48 22 30C22 33.5 24.5 36 28 36H36C39.5 36 42 33.5 42 30C42 24.48 37.52 20 32 20Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <!-- Green message card -->
      <div
        class="bg-[#80BA41] text-[#FBFBFB]/90 xs:px-6 px-8 xs:py-6 py-5 rounded-lg xs:max-w-80 max-w-72 text-center mb-8"
      >
        <p class="xs:text-base text-sm xs:leading-5 leading-5">
          How do you feel right now, <span class="font-semibold">{{ userName }}</span
          >?
        </p>
      </div>

      <!-- Mood Options -->
      <div
        class="flex flex-col gap-3 w-full bg-[#2558A6] xs:max-w-80 max-w-72 rounded-xl px-6 py-8 mb-10 xs:mb-0"
      >
        <p class="text-[#FBFBFB] text-center xs:text-sm text-xs font-light mb-2">
          Select how you're feeling:
        </p>

        <div class="flex flex-col gap-3">
          <button
            v-for="mood in moods"
            :key="mood.value"
            :disabled="loading"
            class="w-full bg-white/10 hover:bg-white/20 text-white xs:py-4 py-3 rounded-lg xs:text-base text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 hover:border-white/40"
            :class="{ 'ring-2 ring-[#80BA41]': selectedMood === mood.value }"
            @click="handleMoodSelect(mood.value)"
          >
            <span class="text-2xl">{{ mood.emoji }}</span>
            <span>{{ mood.label }}</span>
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center text-white/70 text-xs mt-2">Saving your mood...</div>

        <!-- Error state -->
        <div v-if="error" class="text-center text-red-300 text-xs mt-2">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'app',
  path: '/mood-log',
})

const { $auth } = useNuxtApp()
const router = useRouter()
const { logMood } = useMoodLog()

const userName = computed(() => {
  return $auth.currentUser?.displayName || 'friend'
})

const moods = [
  { value: 'amazing', label: 'Amazing', emoji: '😊' },
  { value: 'good', label: 'Good', emoji: '🙂' },
  { value: 'okay', label: 'Okay', emoji: '😐' },
  { value: 'not-great', label: 'Not Great', emoji: '😕' },
  { value: 'awful', label: 'Awful', emoji: '😢' },
]

const selectedMood = ref<string | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const handleMoodSelect = async (mood: string) => {
  selectedMood.value = mood
  loading.value = true
  error.value = null

  try {
    await logMood(mood)
    // Redirect to chat page after successful mood log
    setTimeout(() => {
      router.push('/mood-feedback')
    }, 500)
  } catch (err) {
    console.error('Failed to log mood:', err)
    error.value = 'Failed to save mood. Please try again.'
    loading.value = false
    selectedMood.value = null
  }
}
</script>
