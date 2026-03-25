<template>
  <div class="h-screen flex items-center justify-center bg-gray-50">
    <p class="text-gray-400 text-sm">Loading chat...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  path: '/chat',
})

const router = useRouter()
const { createChat, getTodayChat, getUserChats } = useChat()

onMounted(async () => {
  try {
    // Find today's chat or create a new one
    let todayChat = await getTodayChat()
    if (!todayChat) {
      const newChatId = await createChat()
      todayChat = { id: newChatId } as any
    }

    // Redirect to the specific chat page
    router.replace(`/chat/${todayChat!.id}`)
  } catch (error) {
    console.error('Error resolving chat:', error)
    // Fallback: create a new chat
    const newChatId = await createChat()
    router.replace(`/chat/${newChatId}`)
  }
})
</script>
