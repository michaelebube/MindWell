<template>
    <div class="relative">
         <div class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat" :style="{backgroundImage: `url(${bgImg})`}"></div>

         <img class="xs:mt-6 mt-5 mx-auto xs:w-25 xs:h-25 w-20 h-20 relative z-10" :src="logo" alt="MindWell Logo">

         <div class="flex-1 relative z-10 flex flex-col overflow-y-auto">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import bgImg from '../assets/images/bgImage.png'
import logo from '../assets/svg/logo.svg'
</script>

<style scoped>

</style>