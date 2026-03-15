<template>
  <div class="fixed inset-0 flex items-center justify-center px-6 overflow-hidden">
    <div
      class="bg-[#FBFBFB] xs:px-6 sm:px-8 md:px-10 xl:px-12 px-8 xs:py-6 py-5 shadow-[5.5px_5.5px_27.5px_0px_rgba(0,0,0,0.25)] rounded-[10px] xs:max-w-80 sm:max-w-100 md:max-w-140 lg:max-w-160 xl:max-w-180 max-w-60 text-center"
    >
      <p class="xs:text-xl lg:text-2xl text-[#80BA41] text-sm xs:leading-6 leading-5">
        How do you feel right now, <span class="font-semibold">{{ userName }}</span
        >?
      </p>
      <div class="flex justify-between items-start xs:py-8 sm:pt-12 md:pt-12 py-5">
        <button
          v-for="mood in moods"
          :key="mood.value"
          :disabled="loading"
          class="rounded-lg xs:text-base text-[#80BA41] text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 disabled:cursor-not-allowed relative"
          :class="{ 'opacity-50': loading && selectedMood !== mood.value }"
          @click="handleMoodSelect(mood.value)"
        >
          <!-- Checkmark overlay on selected mood -->
          <div
            v-if="showSuccess && selectedMood === mood.value"
            class="absolute inset-0 flex items-center justify-center"
          >
            <div class="bg-[#80BA41] rounded-full p-2 animate-scale-in">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                  class="animate-check"
                />
              </svg>
            </div>
          </div>
          <img
            :src="mood.icon"
            alt=""
            class="xs:h-14 xs:w-14 w-8 h-8 transition-all duration-200"
            :class="{ 'scale-110': selectedMood === mood.value && loading }"
          />
          <span class="font-normal text-xs xs:text-lg">{{ mood.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import happyFaceIcon from '../../assets/svg/happy-face.svg'
import sadFaceIcon from '../../assets/svg/sad-face.svg'
import neutralFaceIcon from '../../assets/svg/neutral-face.svg'

definePageMeta({
  layout: 'auth',
  path: '/mood-log',
})

const { $auth } = useNuxtApp()
const router = useRouter()
const { logMood } = useMoodLog()

const userName = computed(() => {
  return $auth.currentUser?.displayName || 'friend'
})

const moods = [
  { value: 'Happy', label: 'Happy', icon: happyFaceIcon },
  { value: 'Sad', label: 'Sad', icon: sadFaceIcon },
  { value: 'Neutral', label: 'Not sure', icon: neutralFaceIcon },
]

const selectedMood = ref<string | null>(null)
const loading = ref(false)
const showSuccess = ref(false)
const error = ref<string | null>(null)

const handleMoodSelect = async (mood: string) => {
  selectedMood.value = mood
  loading.value = true
  error.value = null

  try {
    await logMood(mood)
    // Show checkmark animation
    showSuccess.value = true
    // Navigate after animation completes
    setTimeout(() => {
      router.push('/mood-feedback')
    }, 800)
  } catch (err) {
    console.error('Failed to log mood:', err)
    error.value = 'Failed to save mood. Please try again.'
    loading.value = false
    selectedMood.value = null
  }
}
</script>

<style scoped>
@keyframes scale-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes check-draw {
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out forwards;
}

.animate-check {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  animation: check-draw 0.3s ease-out 0.2s forwards;
}
</style>
