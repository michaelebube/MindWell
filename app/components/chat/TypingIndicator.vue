<template>
  <div class="flex justify-start">
    <div class="bg-[#E8E8E8] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
      <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
      <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full animation-delay-200"></span>
      <span class="typing-dot w-2 h-2 bg-gray-500 rounded-full animation-delay-400"></span>
    </div>
  </div>
</template>

<style scoped>
.typing-dot {
  animation: typing-bounce 1.4s ease-in-out infinite;
}
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-400 { animation-delay: 0.4s; }

@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
</style>