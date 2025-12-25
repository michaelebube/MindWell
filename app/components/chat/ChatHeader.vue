<template>
  <header class="bg-white border-b border-gray-200 px-4 py-3 xs:py-4 flex items-center justify-between">
    <!-- Hamburger Menu -->
    <button
      @click="$emit('toggleSidebar')"
      class="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="Toggle sidebar"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Title -->
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 xs:w-9 xs:h-9 rounded-full bg-[#80BA41] flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>
      <span class="font-semibold text-gray-800 xs:text-base text-sm">MindWell</span>
    </div>

    <!-- SOS Button -->
    <button
      class="w-10 h-10 flex items-center justify-center rounded-lg bg-[#C62828] hover:bg-[#B71C1C] transition-colors"
      aria-label="Emergency SOS"
      @click="$emit('sosClick')"
    >
      <span class="text-white font-bold text-xs">SOS</span>
    </button>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'toggleSidebar'): void
  (e: 'sosClick'): void
}>()
</script>