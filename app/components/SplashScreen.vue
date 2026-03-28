<template>
  <div class="relative min-h-screen tablet-lock-height w-screen overflow-hidden">
    <div class="absolute lg:hidden -top-4 -right-1 object-cover z-10">
      <img :src="topSVG" alt="" />
    </div>
    <div class="absolute hidden lg:block -top-5 -right-10 object-cover z-10">
      <img :src="topSVGLg" alt="" class="w-65" />
    </div>
    <!-- Background layer with opacity -->
    <div
      class="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <div class="absolute inset-0 flex flex-col justify-center items-center z-10">
      <img :src="logo" alt="MindWell Logo" class="md:w-75 md:h-75 lg:h-105 lg:w-105" />
    </div>

    <div class="absolute sm:hidden -bottom-1 object-cover w-[105%] z-10">
      <img :src="footerSVG" alt="" />
    </div>

    <div
      class="absolute lg:-bottom-6 xl:-bottom-12 hidden sm:flex bottom-0 object-cover w-[105%] z-10"
    >
      <img class="" :src="footerSVGLg" alt="" />
    </div>
  </div>
</template>

<script setup>
import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/svg/logo.svg'
import footerSVG from '../assets/svg/Blue-blob.svg'
import topSVG from '../assets/svg/green-blob.svg'
import topSVGLg from '../assets/svg/green_blob_big.svg'
import footerSVGLg from '../assets/svg/blue-blob_big.svg'
</script>
