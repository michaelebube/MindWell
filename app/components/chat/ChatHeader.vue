<template>
  <header class="py-3 xs:py-4 flex items-center justify-between">
    <!-- Hamburger Menu -->
    <button
      class="flex items-center justify-center rounded-lg hover:bg-gray-10 transition-colors"
      aria-label="Toggle sidebar"
      @click="$emit('toggleSidebar')"
    >
      <img :src="hamburgerIcon" alt="Hamburger  Menu" class="pt-1.25 lg:w-28" />
    </button>

    <!-- SOS Button -->
    <button
      class="w-10 h-10 mr-4 flex items-center justify-center rounded-lg bg-[#C62828] hover:bg-[#B71C1C] lg:w-12.5 lg:h-12.5 lg:mb-3.5 xl:mb-5 transition-colors"
      aria-label="Emergency SOS"
      @click="$emit('sosClick')"
    >
      <span class="text-white font-bold text-sm lg:text-[16px] tracking-wide">SOS</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import hamburgerIcon from '../../assets/svg/hamburger-icon.svg'
defineEmits<{
  (e: 'toggleSidebar'): void
  (e: 'sosClick'): void
}>()
</script>
