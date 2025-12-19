<template>
  <div class="fixed inset-0 flex items-center justify-center px-6 overflow-hidden">
    <div
      class="bg-[#FBFBFB] xs:px-6 px-8 xs:py-6 py-5 shadow-[5.5px_5.5px_27.5px_0px_rgba(0,0,0,0.25)] rounded-[10px] xs:max-w-80 max-w-60 text-center"
    >
      <p class="xs:text-xl text-[#80BA41] text-sm xs:leading-6 leading-5">
        How do you feel right now, <span class="font-semibold">{{ userName }}</span
        >?
      </p>
      <div class="flex justify-between items-start xs:py-8 py-5">
        <button
          v-for="mood in moods"
          :key="mood.value"
          :disabled="loading"
          class="rounded-lg xs:text-base text-[#80BA41] text-sm font-medium transition-all duration-200 flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleMoodSelect(mood.value)"
        >
          <img :src="mood.icon" alt="" class="xs:h-14 xs:w-14 w-8 h-8" />
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
const error = ref<string | null>(null)

const handleMoodSelect = async (mood: string) => {
  selectedMood.value = mood
  loading.value = true
  error.value = null

  try {
    await logMood(mood)
    // Redirect to mood-feedback page after successful mood log
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
