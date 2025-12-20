<template>
  <div class="fixed inset-0 overflow-hidden">
    <!-- Main content centered -->
    <div class="flex items-center justify-center px-6 h-full pb-30">
      <main>
        <!-- Loading state -->
        <div v-if="isLoading" class="xs:max-w-70 max-w-60 text-center flex flex-col">
          <div class="mx-auto xs:h-35 xs:w-35 h-16 w-16 mb-4 flex items-center justify-center">
            <div
              class="w-10 h-10 border-4 border-[#80BA41] border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
          <h1
            class="xs:text-4xl text-[#80BA41] text-sm xs:leading-10 leading-5 font-medium font-['Indie_Flower']"
          >
            Taking a moment to check in...
          </h1>
        </div>

        <!-- Mood content -->
        <div v-else class="xs:max-w-80 max-w-60 text-center flex flex-col">
          <img
            :src="moodData?.icon"
            :alt="moodData?.alt"
            class="mx-auto xs:h-35 xs:w-35 h-16 w-16 mb-6"
          />
          <h1
            class="xs:text-4xl text-[#80BA41] text-sm xs:leading-12 xs:tracking-wide leading-5 font-medium font-['Indie_Flower']"
          >
            {{ moodData?.message }}
          </h1>
        </div>
      </main>
    </div>

    <!-- Footer fixed at bottom -->
    <footer class="absolute bottom-0 left-0 right-0">
      <div class="relative">
        <!-- Wave image -->
        <img :src="wave" alt="wave" class="w-full h-auto" />

        <!-- Content on top of wave -->
        <div class="absolute inset-0 flex flex-col items-center justify-center xs:pt-2 pt-1">
          <h1
            class="text-white xs:text-[16px] text-[14px] font-semibold mb-4 flex items-center gap-2"
          >
            We are here to help
            <span class="text-[16px] xs:text-[14px]"
              ><img :src="huggingIcon" alt="Hugging Icon"
            /></span>
          </h1>

          <NuxtLink
            to="/chat"
            class="bg-white text-[#80BA41] xs:px-10 px-8 xs:py-2 py-1 rounded-lg xs:text-sm text-xs font-semibold hover:bg-gray-50 transition-colors mb-2 shadow-lg"
          >
            Let's chat!
          </NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import happyFaceIcon from '../../assets/svg/happy-face.svg'
import sadFaceIcon from '../../assets/svg/sad-face.svg'
import neutralFaceIcon from '../../assets/svg/neutral-face.svg'
import wave from '../../assets/svg/wave.svg'
import huggingIcon from '../../assets/svg/noto_people-hugging.svg'

const { getLatestMoodLog } = useMoodLog()

const userMood = ref('')
const moodMessage = ref('')
const isLoading = ref(true)

definePageMeta({
  layout: 'auth',
  path: '/mood-feedback',
})

const happyMoodCopy = [
  'I am glad your mood feels positive right now.',
  'It is great to see that you are feeling happy right now.',
  'I am happy to hear that you are in a good place at the moment.',
  'It sounds like you are feeling positive today - that is wonderful.',
  'It is nice to know your mood is feeling bright right now.',
]

const sadMoodCopy = [
  'Thanks for checking in. I am here with you.',
  'I see you. Your feelings matter.',
  'It is okay to feel this way. You are not alone.',
  'I am here whenever you are ready.',
]

const moodData = computed(() => {
  switch (userMood.value) {
    case 'Happy':
      return { icon: happyFaceIcon, alt: 'Happy Face', message: moodMessage.value }
    case 'Sad':
      return { icon: sadFaceIcon, alt: 'Sad Face', message: moodMessage.value }
    case 'Neutral':
      return { icon: neutralFaceIcon, alt: 'Neutral Face', message: moodMessage.value }
  }
})

onMounted(async () => {
  try {
    const latestMoodLog = await getLatestMoodLog()
    userMood.value = (latestMoodLog?.mood ?? 'Neutral') as string

    if (userMood.value === 'Happy') {
      const randomIndex = Math.floor(Math.random() * happyMoodCopy.length)
      moodMessage.value = happyMoodCopy[randomIndex]!
    } else if (userMood.value === 'Sad') {
      const randomIndex = Math.floor(Math.random() * sadMoodCopy.length)
      moodMessage.value = sadMoodCopy[randomIndex]!
    } else {
      moodMessage.value =
        'It is okay if you can not explain it right now. Let us figure it out together.'
    }
  } catch (error) {
    console.error('Error loading mood:', error)
    userMood.value = 'Neutral'
    moodMessage.value = 'We are here for you. Let us figure it out together.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped></style>
