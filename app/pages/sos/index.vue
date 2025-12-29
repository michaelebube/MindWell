<template>
  <div class="min-h-screen relative flex flex-col">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>
    <!-- Header -->
    <div class="flex items-center justify-between xs:px-4 px-3 pt-8 pb-4">
      <button
        @click="goBack"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-[#80BA41] text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <img :src="logo" alt="MindWell Logo" class="-mr-2 w-20 h-20" />
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-y-auto px-3 xs:px-4 py-4 space-y-3 xs:space-y-4 z-10">
      <!-- SOS Support Title -->
      <div class="flex items-center gap-3">
        <div
          class="w-7 h-7 flex items-center justify-center rounded-md bg-[#C62828]/20 transition-colors"
          aria-label="Emergency SOS"
        >
          <span class="text-white font-bold text-[12px] tracking-wide">SOS</span>
        </div>
        <h1 class="text-lg font-bold text-[#80BA41]">SOS SUPPORT</h1>
      </div>

      <!-- You're Not Alone Section -->
      <div class="bg-[#80BA41] rounded-sm xs:rounded-md p-5 text-white">
        <h2 class="text-sm font-semibold text-center mb-5">You're Not Alone Right Now.</h2>
        <p class="text-[13px] text-center leading-relaxed mb-4">
          It looks like you may be feeling overwhelmed or in danger of hurting yourself. I'm really
          glad you're here. Your life matters, and help is available right now.
        </p>
        <p class="text-[13px] text-center leading-relaxed">
          You don't have to go through this alone. There are real people who care about you and want
          to support you through this moment.
        </p>
      </div>

      <!-- Emergency Services Section -->
      <div class="bg-[#2558A6] rounded-sm xs:rounded-md p-5 text-[#FBFBFB]">
        <h3 class="text-[13px] text-center mb-3 tracking-wide leading-relaxed">
          If You Are in Immediate Danger
        </h3>
        <p class="text-[13px] text-center mb-5 leading-relaxed tracking-wide">
          Please contact your local emergency number right now.
        </p>
        <div class="border-t border-white/30 pt-3">
          <p class="text-[13px] text-center mb-1">Emergency Services:</p>
          <p class="text-3xl font-bold text-center">911</p>
        </div>
      </div>

      <!-- Helplines Section -->
      <div class="bg-[#2558A6] rounded-sm xs:rounded-md p-5 text-[#FBFBFB]">
        <div class="border-b border-white/30 pb-3">
          <h3 class="text-sm font-semibold text-center">
            Speak to a trained listener immediately:
          </h3>
        </div>

        <!-- Suicide & Crisis Helpline -->
        <div class="text-center pt-3 mb-4">
          <p class="text-[13px] text-[#80BA41] mb-1">Suicide & Crisis Helpline (24/7)</p>
          <a
            href="tel:080-01-2304-029"
            class="text-xs font-semibold flex items-center justify-center gap-2"
          >
            080-01-2304-029
            <img :src="callIcon" alt="call-icon" class="w-4 h-4" />
          </a>
        </div>

        <!-- Mental Health Support Line -->
        <div class="text-center">
          <p class="text-[13px] text-[#80BA41] mb-1">Mental Health Support Line</p>
          <a
            href="tel:080-01-2304-029"
            class="text-xs font-semibold flex items-center justify-center gap-2"
          >
            080-01-2304-029
            <img :src="callIcon" alt="call-icon" class="w-4 h-4" />
          </a>
        </div>
      </div>

      <!-- Bottom Message -->
      <div class="bg-[#80BA41] rounded-sm xs:rounded-md p-5 text-center shadow-sm">
        <p class="text-sm text-[#FBFBFB] font-medium leading-relaxed">
          You don't have to know what to say. Just letting someone know you're struggling is enough.
        </p>
        <div class="mt-3 flex justify-center">
          <img :src="loveSOSIcon" alt="love-icon" class="w-7 h-7" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '../../assets/svg/logo.svg'
import loveSOSIcon from '../../assets/svg/love-sos.svg'
import callIcon from '../../assets/svg/call-icon.svg'
import bgImg from '../../assets/images/bgImage.png'

definePageMeta({
  layout: 'app',
  path: '/sos',
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>
