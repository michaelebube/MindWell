<template>
  <div class="px-4 py-3 xs:py-4">
    <form class="flex gap-2 xs:gap-3" @submit.prevent="handleSubmit">
      <div class="flex-1 relative">
        <textarea
          ref="textareaRef"
          v-model="message"
          :disabled="disabled"
          placeholder="What's bothering you?"
          rows="1"
          class="w-full px-4 py-2.5 xs:py-3 bg-[#80BA41] rounded-lg resize-none xs:text-sm text-xs focus:outline-none focus:ring-2 focus:ring-[#80BA41] disabled:opacity-50 disabled:cursor-not-allowed max-h-32 placeholder:text-[#FBFBFB]/60 text-[#FBFBFB] overflow-y-auto"
          @keydown="handleKeydown"
          @input="autoResize"
        />
      </div>
      <button
        type="submit"
        :disabled="!canSend || disabled"
        class="w-10 h-10 xs:w-12 xs:h-11 rounded-lg bg-[#2558A6] text-white relative  transition-all duration-200 hover:bg-[#6fa535]  disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <img :src="sendIcon" alt="Send Icon" class="w-5 h-5 xs:w-10 xs:h-9 absolute left-1/2 top-1/2 transform -translate-x-1/3 -translate-y-2/5" />
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import sendIcon from '../../assets/svg/send-icon.svg'
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
