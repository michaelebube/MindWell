<template>
  <div class="flex w-full" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] xs:max-w-[70%] px-4 py-3 xs:text-sm text-xs"
      :class="bubbleClasses"
    >
      <p class="whitespace-pre-wrap break-words">{{ message }}</p>
      <span
        class="text-[10px] xs:text-xs mt-1 block opacity-70"
        :class="isUser ? 'text-right' : 'text-left'"
      >
        {{ formattedTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
  isUser: boolean
  timestamp?: Date
  isCrisis?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  timestamp: () => new Date(),
  isCrisis: false,
})

const bubbleClasses = computed(() => {
  if (props.isUser) {
    return 'bg-[#80BA41] text-white rounded-2xl rounded-br-sm'
  }
  if (props.isCrisis) {
    return 'bg-[#C62828] text-white rounded-2xl rounded-bl-sm'
  }
  return 'bg-[#E8E8E8] text-gray-800 rounded-2xl rounded-bl-sm'
})

const formattedTime = computed(() => {
  const date = props.timestamp instanceof Date ? props.timestamp : new Date(props.timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
})
</script>