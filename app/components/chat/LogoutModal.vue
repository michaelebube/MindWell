<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-60 flex items-center justify-center p-8">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60" @click="$emit('close')" />

      <!-- Modal -->
      <div
        class="relative bg-white rounded-lg shadow-xl w-full max-w-sm px-7 pt-8 pb-12 text-center"
      >
        <!-- Title -->
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Log Out?</h3>

        <!-- Message -->
        <p class="xs:text-lg text-[14px] text-gray-600 mb-6">
          Are you sure about this, {{ userName }}
        </p>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button
            class="flex-1 py-2.5 px-4 rounded-xl bg-[#80BA41] border border-[#80BA41]  font-medium hover:bg-gray-50 transition-colors text-white"
            @click="$emit('close')"
          >
            No
          </button>
          <button
            class="flex-1 py-2.5 px-4 rounded-xl border border-[#DD0025] text-[#DD0025] font-medium hover:bg-red-700 transition-colors"
            @click="$emit('confirm')"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()

const { $auth } = useNuxtApp()
const userName = $auth.currentUser?.displayName || 'friend'
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>
