<template>
  <div class="relative min-h-screen tablet-lock-height flex flex-col overflow-hidden">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <img
      class="xs:mt-6 mt-5 mx-auto sm:ml-4 sm:mt-0 xs:w-25 xs:h-25 w-20 h-20 relative z-10 shrink-0"
      :src="logo"
      alt="MindWell Logo"
    />

    <img
      class="hidden sm:block absolute -top-14 w-35 md:w-44 md:h-44 lg:h-50 lg:w-50 xl:h-60 xl:w-60 h-35 right-0"
      :src="topSVG"
      alt=""
    />

    <div
      class="flex-1 min-h-0 relative z-10 flex flex-col overflow-y-auto *:flex-1 *:flex *:flex-col"
    >
      <slot />
    </div>

    <img
      class="absolute bottom-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="bottomBlueBlob"
      alt=""
    />

    <img
      class="absolute bottom-0 right-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="rightSideBlue"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/svg/logo.svg'
import topSVG from '../assets/svg/green_blob_big.svg'
import bottomBlueBlob from '../assets/svg/bottomBlueSVG.svg'
import rightSideBlue from '../assets/svg/rightSideBlue.svg'
</script>

<style scoped></style>
