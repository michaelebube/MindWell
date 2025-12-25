<template>
  <div class="bg-white border-t border-gray-200 px-4 py-3 xs:py-4">
    <form @submit.prevent="handleSubmit" class="flex items-end gap-2 xs:gap-3">
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="message"
          :disabled="disabled"
          placeholder="Type your message..."
          rows="1"
          class="w-full px-4 py-2.5 xs:py-3 bg-gray-100 rounded-2xl resize-none xs:text-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#80BA41] disabled:opacity-50 disabled:cursor-not-allowed max-h-32 overflow-y-auto"
          @keydown="handleKeydown"
          @input="autoResize"
        />
      </div>
      <button
        type="submit"
        :disabled="!canSend || disabled"
        class="flex-shrink-0 w-10 h-10 xs:w-11 xs:h-11 rounded-full bg-[#80BA41] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#6fa535] disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-5 xs:w-6 xs:h-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

const message = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const canSend = computed(() => message.value.trim().length > 0)

const handleSubmit = () => {
  if (!canSend.value) return
  emit('send', message.value.trim())
  message.value = ''
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 128)}px`
  }
}
</script>