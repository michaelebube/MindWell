<template>
  <div class="relative">
    <SplashScreen v-if="showSplash" />
    <div v-else class="h-screen flex flex-col relative overflow-hidden">
      <!-- Background -->
      <div
        class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
        :style="{ backgroundImage: `url(${bgImg})` }"
      ></div>

      <!-- Logo -->

      <img
        class="xs:mt-6 mt-5 mx-auto xs:w-25 xs:h-25 w-20 h-20 relative z-10 sm:mt-3 md:ml-3 xl:ml-3"
        :src="logo"
        alt="MindWell Logo"
      />

      <img
        class="absolute hidden md:block md:-top-6 md:-right-1 xl:-top-12 xl:-right-2"
        :src="topSVG"
        alt=""
      />

      <img
        class="hidden sm:block w-150 h-150 opacity-5 absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2"
        :src="logo"
        alt=""
      />

      <!-- Chat bubbles section -->
      <div class="flex-1 min-h-0 flex flex-col relative z-10 overflow-y-auto">
        <div class="tablet-v-center xs:pt-10 pt-5 xs:space-y-7 sm:pt-2 space-y-5">
          <div
            v-for="(statement, index) in displayedStatements"
            :key="index"
            class="bg-[#80BA41] text-white xs:px-6 px-4 xs:py-3 sm:py-4 py-2 lg:py-4 xs:max-w-64 max-w-56 sm:max-w-110 lg:max-w-140 xl:max-w-180 xl:text-center xs:text-sm text-xs sm:text-[15px] lg:text-lg xs:leading-5 leading-4 font-medium"
            :class="
              index % 2 === 0
                ? 'rounded-tr-[40px] rounded-br-xl'
                : 'rounded-tl-[40px] rounded-bl-xl ml-auto'
            "
          >
            {{ statement }}
          </div>
        </div>
      </div>

      <!-- Bottom wave section with content -->
      <div class="relative">
        <!-- Wave image -->
        <img :src="wave" alt="wave" class="absolute bottom-0 left-0 w-full h-auto sm:hidden" />
        <img
          class="absolute hidden sm:block bottom-0 left-0 w-screen max-w-none lg:h-40 sm:h-48 md:h-48 xl:h-48 xl:-bottom-10"
          :src="waveLg"
          alt="waveLg"
        />

        <!-- Content on top of wave -->
        <div
          class="relative z-10 flex flex-col items-center justify-center xs:pb-6 pb-8 sm:flex-row sm:items-center sm:justify-between sm:px-20 sm:pb-6 sm:py-8 md:px-32 lg:px-44 xl:px-60"
        >
          <!-- Left: heading + button -->
          <div class="flex flex-col sm:items-start items-center">
            <h1
              class="text-white xs:text-[16px] text-[14px] lg:text-lg xl:text-xl font-light mb-5 sm:mb-2 flex items-center gap-2"
            >
              We are here to help
              <span><img :src="huggingIcon" alt="Hugging Icon" /></span>
            </h1>

            <NuxtLink
              to="/register"
              class="bg-white text-[#80BA41] xs:px-4 px-5 xs:py-2 py-1.5 sm:px-8 xl:px-6.5 sm:py-2 rounded-xl xs:text-sm text-xs sm:text-sm xl:text-xl font-semibold text-center hover:bg-gray-50 transition-colors mb-2 shadow-lg"
            >
              Let's get started
            </NuxtLink>
          </div>

          <div class="hidden sm:block sm:border sm:border-white h-24"></div>

          <!-- Right: sign-in -->
          <div class="flex flex-col items-center">
            <p
              class="text-white font-light xs:text-sm text-xs sm:text-[16px] md:text-lg xl:text-xl"
            >
              Have an account?
            </p>
            <NuxtLink
              to="/login"
              class="text-[#80BA41] font-semibold sm:block sm:text-center text-xs sm:text-sm lg:text-[16px] mt-1.5 sm:mt-1 xl:text-xl"
            >
              Sign-in
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $auth, $firestore } = useNuxtApp()
import logo from '../assets/svg/logo.svg'
import wave from '../assets/svg/wave.svg'
import bgImg from '../assets/images/bgImage.png'
import huggingIcon from '../assets/svg/noto_people-hugging.svg'
import waveLg from '../assets/svg/wave-big.svg'
import topSVG from '../assets/svg/green-blob.svg'

const showSplash = ref(true)

onMounted(() => {
  // Set timeout to hide splash screen after 3 seconds
  setTimeout(() => {
    showSplash.value = false
  }, 3000)

  // Check screen size
  const checkScreenSize = () => {
    isSmallScreen.value = window.innerWidth <= 344 && window.innerHeight <= 600
    // Minimized laptop: wider than phones but shorter than tablets, just below sm (640px)
    isMiniLaptop.value =
      window.innerWidth >= 480 && window.innerWidth < 640 && window.innerHeight < 750
  }

  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
  })
})

const introductoryStatements = [
  'You’re Not Alone. Your Mental Health Matters.',
  'Take a Deep Breath. Start Your Journey to Wellness.',
  'Small Steps, Big Changes. Prioritize Your Mental Health.',
  'MindWell: Empowering Your Mental Wellness Journey.',
  "Your Mind, Your Wellbeing. We're Here to Help.",
]
// Computed to show 3 messages on small screens, 5 on others
const isSmallScreen = ref(false)
const isMiniLaptop = ref(false)

const displayedStatements = computed(() => {
  if (isMiniLaptop.value) return introductoryStatements.slice(0, 3)
  return isSmallScreen.value ? introductoryStatements.slice(0, 4) : introductoryStatements
})
</script>
