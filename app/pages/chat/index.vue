<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <ChatHeader @toggle-sidebar="sidebarOpen = true" @sos-click="sosModalOpen = true" />

    <!-- Sidebar -->
    <ChatSidebar
      :is-open="sidebarOpen"
      :chats="chats"
      :active-chat-id="activeChatId"
      :user-name="userName"
      :user-email="userEmail"
      @close="sidebarOpen = false"
      @new-chat="handleNewChat"
      @select-chat="handleSelectChat"
      @logout="handleLogout"
    />

    <!-- SOS Modal -->
    <SOSModal :is-open="sosModalOpen" @close="sosModalOpen = false" />

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      <!-- Welcome message if no messages -->
      <div
        v-if="messages.length === 0 && !isLoading"
        class="flex flex-col items-center justify-center h-full text-center px-6"
      >
        <div
          class="w-16 h-16 xs:w-20 xs:h-20 rounded-full bg-[#80BA41]/20 flex items-center justify-center mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 xs:w-10 xs:h-10 text-[#80BA41]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h2 class="text-lg xs:text-xl font-semibold text-gray-800 mb-2">Welcome to MindWell</h2>
        <p class="text-sm xs:text-base text-gray-500 max-w-xs">
          I'm here to support you. Share how you're feeling, and let's talk through it together.
        </p>
      </div>

      <!-- Messages -->
      <template v-else>
        <ChatBubble
          v-for="message in messages"
          :key="message.id"
          :message="message.content || ' '"
          :is-user="message.role === 'user'"
          :timestamp="message.timestamp?.toDate ? message.timestamp.toDate() : new Date()"
          :is-crisis="message.isCrisis"
        />
      </template>

      <!-- Typing indicator -->
      <TypingIndicator v-if="isBotTyping" />
    </div>

    <!-- Input -->
    <ChatInput :disabled="isBotTyping || isLoading" @send="handleSendMessage" />
  </div>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'
import type { Message, Chat } from '~/composables/useChat'

definePageMeta({
  layout: 'app',
  path: '/chat',
})

const { $auth } = useNuxtApp()
const router = useRouter()
const {
  createChat,
  getUserChats,
  sendMessage,
  saveBotMessage,
  getChatMessages,
  subscribeToMessages,
  getTodayChat,
} = useChat()

// State
const sidebarOpen = ref(false)
const sosModalOpen = ref(false)
const messages = ref<Message[]>([])
const chats = ref<Chat[]>([])
const activeChatId = ref('')
const isLoading = ref(true)
const isBotTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// User info
const userName = computed(() => $auth.currentUser?.displayName || 'User')
const userEmail = computed(() => $auth.currentUser?.email || '')

// Unsubscribe function for real-time listener
let unsubscribeMessages: (() => void) | null = null

// Scroll to bottom of messages
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// Load chats and initialize
onMounted(async () => {
  try {
    // Load user's chat history
    chats.value = await getUserChats()

    // Check for today's chat or create new one
    let todayChat = await getTodayChat()
    if (!todayChat) {
      const newChatId = await createChat()
      todayChat = { id: newChatId } as Chat
      chats.value = await getUserChats() // Refresh list
    }

    activeChatId.value = todayChat.id

    // Subscribe to messages
    unsubscribeMessages = subscribeToMessages(activeChatId.value, newMessages => {
      messages.value = newMessages
      scrollToBottom()
    })
  } catch (error) {
    console.error('Error initializing chat:', error)
  } finally {
    isLoading.value = false
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (unsubscribeMessages) {
    unsubscribeMessages()
  }
})

// Handle sending a message
const handleSendMessage = async (content: string) => {
  if (!activeChatId.value) return

  try {
    // Send user message
    await sendMessage(activeChatId.value, content)
    scrollToBottom()

    // Show typing indicator
    isBotTyping.value = true

    // Call your Cloud Function here to get AI response
    // For now, we'll simulate with a timeout
    // Replace this with actual Cloud Function call
    const botResponse = await getBotResponse(content)

    // Save bot response
    await saveBotMessage(activeChatId.value, botResponse.message, botResponse.isCrisis)
  } catch (error) {
    console.error('Error sending message:', error)
    // Save error message
    await saveBotMessage(
      activeChatId.value,
      "I'm sorry, I'm having trouble responding right now. Please try again.",
      false
    )
  } finally {
    isBotTyping.value = false
    scrollToBottom()
  }
}

// Placeholder for Cloud Function call - replace with actual implementation
const getBotResponse = async (
  userMessage: string
): Promise<{ message: string; isCrisis: boolean }> => {
  // TODO: Replace with actual Cloud Function call
  // const response = await $fetch('/api/chat', { method: 'POST', body: { message: userMessage, chatId: activeChatId.value } })

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Simple placeholder response
  const responses = [
    'Thank you for sharing that with me. How does that make you feel?',
    "I hear you. It sounds like you're going through a lot right now.",
    "That's completely valid. Would you like to explore that feeling a bit more?",
    'I appreciate you opening up. What do you think might help in this situation?',
    "It takes courage to talk about these things. I'm here for you.",
  ]

  return {
    message:
      responses[Math.floor(Math.random() * responses.length)] ||
      "I'm here to listen. Please share more.",
    isCrisis: false,
  }
}

// Handle new chat creation
const handleNewChat = async () => {
  try {
    sidebarOpen.value = false
    isLoading.value = true

    // Unsubscribe from current chat
    if (unsubscribeMessages) {
      unsubscribeMessages()
    }

    // Create new chat
    const newChatId = await createChat()
    activeChatId.value = newChatId
    messages.value = []

    // Refresh chat list
    chats.value = await getUserChats()

    // Subscribe to new chat messages
    unsubscribeMessages = subscribeToMessages(newChatId, newMessages => {
      messages.value = newMessages
      scrollToBottom()
    })
  } catch (error) {
    console.error('Error creating new chat:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle selecting a chat from sidebar
const handleSelectChat = async (chatId: string) => {
  if (chatId === activeChatId.value) {
    sidebarOpen.value = false
    return
  }

  try {
    sidebarOpen.value = false
    isLoading.value = true

    // Unsubscribe from current chat
    if (unsubscribeMessages) {
      unsubscribeMessages()
    }

    activeChatId.value = chatId

    // Load messages for selected chat
    messages.value = await getChatMessages(chatId)
    scrollToBottom()

    // Subscribe to real-time updates
    unsubscribeMessages = subscribeToMessages(chatId, newMessages => {
      messages.value = newMessages
      scrollToBottom()
    })
  } catch (error) {
    console.error('Error selecting chat:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle logout
const handleLogout = async () => {
  try {
    await signOut($auth)
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>
