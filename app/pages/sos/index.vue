<template>
  <div class="min-h-screen relative flex flex-col">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>
    <!-- Header -->
    <div class="flex items-center justify-between md:justify-normal xs:px-4 xl:px-8 px-3 pt-8 pb-2 z-10">
      <button aria-label="Go Back" @click="goBack">
        <div
          class="bg-[#1565C0] w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer"
        >
          <img :src="backArrowIcon" alt="Back Arrow" class="w-9 h-9 p-2" />
        </div>
      </button>
      <img :src="logo" alt="MindWell Logo" class="-mr-2 w-20 h-20 md:w-28 md:h-28 xl:w-32 xl:h-32 md:absolute md:left-1/2 md:top-3 md:-translate-x-1/2" />
    </div>



    <!-- Content -->
    <div class="flex-1 md:flex md:flex-col md:max-w-3/4 md:mx-auto overflow-y-auto px-3 xs:px-4 py-4 md:py-8 xl:py-12 space-y-3 xs:space-y-4 z-10">
     
      <!-- SOS Support Title -->
      <div class="flex items-center md:justify-center gap-3">
        <div
          class="w-7 h-7 flex items-center justify-center rounded-md md:hidden bg-[#C62828]/20 transition-colors"
          aria-label="Emergency SOS"
        >
          <span class="text-white font-bold text-[12px] tracking-wide">SOS</span>
        </div>
        <h1 class="text-lg font-bold text-[#80BA41]">SOS SUPPORT</h1>
      </div>

      <!-- You're Not Alone Section -->
      <div class="bg-[#80BA41] rounded-sm xs:rounded-md p-5 lg:p-8 text-white">
        <h2 class="text-sm font-semibold text-center mb-5 lg:text-lg">You're Not Alone Right Now.</h2>
        <p class="text-[13px] text-center lg:text-[16px] leading-relaxed mb-4">
          It looks like you may be feeling overwhelmed or in danger of hurting yourself. I'm really
          glad you're here. Your life matters, and help is available right now.
        </p>
        <p class="text-[13px] text-center lg:text-[16px] leading-relaxed">
          You don't have to go through this alone. There are real people who care about you and want
          to support you through this moment.
        </p>
      </div>

      <!-- Emergency Services Section -->
      <div class="bg-[#2558A6] rounded-sm xs:rounded-md p-5 lg:p-8 text-[#FBFBFB]">
        <h3 class="text-[13px] lg:text-[16px] text-center mb-3 tracking-wide leading-relaxed">
          If You Are in Immediate Danger
        </h3>
        <p class="text-[13px] lg:text-[16px]  text-center mb-5 leading-relaxed tracking-wide">
          Please contact your local emergency number right now.
        </p>
        <div class="border-t border-white/30 pt-3">
          <p class="text-[13px] lg:text-[16px] text-center mb-1">Emergency Services:</p>
          <p class="text-3xl font-bold lg:text-4xl text-center">911</p>
        </div>
      </div>

      <!-- Helplines Section -->
      <div class="bg-[#2558A6] rounded-sm xs:rounded-md p-5 lg:p-8 text-[#FBFBFB]">
        <div class="border-b border-white/30 pb-3">
          <h3 class="text-sm font-semibold lg:text-lg text-center">
            Speak to a trained listener immediately:
          </h3>
        </div>

        <!-- Suicide & Crisis Helpline -->
        <div class="text-center pt-3 mb-4">
          <p class="text-[13px] lg:text-[16px] text-[#80BA41] mb-1">Suicide & Crisis Helpline (24/7)</p>
          <a
            href="tel:080-01-2304-029"
            class="text-xs lg:text-sm font-semibold flex items-center justify-center gap-2"
          >
            080-01-2304-029
            <img :src="callIcon" alt="call-icon" class="w-4 h-4 lg:w-6 lg:h-6" />
          </a>
        </div>

        <!-- Mental Health Support Line -->
        <div class="text-center">
          <p class="text-[13px] lg:text-[16px] text-[#80BA41] mb-1">Mental Health Support Line</p>
          <a
            href="tel:080-01-2304-029"
            class="text-xs lg:text-sm font-semibold flex items-center justify-center gap-2"
          >
            080-01-2304-029
            <img :src="callIcon" alt="call-icon" class="w-4 h-4 lg:w-6 lg:h-6" />
          </a>
        </div>
      </div>

      <!-- Bottom Message -->
      <div class="bg-[#80BA41] rounded-sm xs:rounded-md p-5 lg:p-8 mb-4 md:mb-18 xl:mb-16 text-center shadow-sm">
        <p class="text-sm text-[#FBFBFB] lg:text-lg font-medium leading-relaxed">
          You don't have to know what to say. Just letting someone know you're struggling is enough.
        </p>
        <div class="mt-3 flex justify-center">
          <img :src="loveSOSIcon" alt="love-icon" class="w-7 h-7 lg:w-9 lg:h-9" />
        </div>
      </div>
    </div>
    <img
      class="absolute bottom-0 hidden md:block md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="bottomBlueBlob"
      alt=""
    />

    <img
      class="absolute bottom-0 right-0 hidden md:block md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="rightSideBlue"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import logo from '../../assets/svg/logo.svg'
import loveSOSIcon from '../../assets/svg/love-sos.svg'
import callIcon from '../../assets/svg/call-icon.svg'
import bgImg from '../../assets/images/bgImage.png'
import backArrowIcon from '../../assets/svg/back-arrow.svg'
import bottomBlueBlob from '../../assets/svg/bottomBlueSVG.svg'
import rightSideBlue from '../../assets/svg/rightSideBlue.svg'

definePageMeta({
  layout: 'app',
  path: '/sos',
})

const router = useRouter()
const route = useRoute()

const goBack = () => {
  // Try to go back; if the route doesn't change, fallback to chat page
  const currentPath = route.fullPath
  router.back()

  setTimeout(() => {
    if (router.currentRoute.value.fullPath === currentPath) {
      navigateTo('/chat')
    }
  }, 300)
}
</script>
