<template>
  <div class="relative h-screen w-screen overflow-hidden">
    <div class="absolute -top-1 -right-1 object-cover z-10">
      <img class="md:hidden" :src="topSVG" alt="" />
      <img src="topSVGMd" alt="" />
    </div>
    <!-- Background layer with opacity -->
    <div
      class="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <div class="absolute inset-0 flex flex-col justify-center items-center z-10">
      <img :src="logo" alt="MindWell Logo" />
    </div>

    <div class="absolute -bottom-1 object-cover w-[105%] z-10">
      <img :src="footerSVG" alt="" />
    </div>
  </div>
</template>

<script setup>
import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/svg/logo.svg'
import footerSVG from '../assets/svg/Blue-blob.svg'
import topSVG from '../assets/svg/green-blob.svg'
import topSVGMd from '../assets/svg/green-blob-big.svg'
</script>
