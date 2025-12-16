<template>
    <div class="relative" :class="bg">

        <div class="absolute -top-1 -right-1 object-cover">
            <img :src="topSVG" alt="">
        </div>
        <!-- Background layer with opacity -->
        <div class="absolute inset-0 opacity-5 bg-cover bg-center bg-no-repeat" :style="{backgroundImage: `url(${bgImg})`}"></div>
        
        <div class="absolute inset-0 flex flex-col justify-center items-center z-10">
            <img  :src="logo" alt="MindWell Logo">

        
        </div>

        <div class="absolute -bottom-1 object-cover w-full">
            <img :src="footerSVG" alt="">
        </div>
    </div>
</template>

<script setup>
import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/logo.svg'
import footerSVG from '../assets/Blue-blob.svg'
import topSVG from '../assets/green-blob.svg'

    const bg = `min-h-screen`
</script>

