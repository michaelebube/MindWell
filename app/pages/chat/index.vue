<template>
  <div class="h-screen flex flex-col bg-gray-50 relative">
    <div
      class="absolute z-0 inset-0 opacity-5 bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${bgImg})` }"
    ></div>

    <!-- Header -->
    <ChatHeader
      class="z-10 sm:px-4 lg:px-6"
      @toggle-sidebar="sidebarOpen = true"
      @sos-click="navigateTo('/sos')"
    />

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
      @delete-chat="handleDeleteChat"
      @rename-chat="handleRenameChat"
      @go-to-profile="navigateTo('/profile')"
      @go-to-mood-meter="navigateTo('/mood-meter')"
      @go-to-logout-modal="logoutModalOpen = true"
    />

    <!-- Logout Modal -->
    <ChatLogoutModal
      :is-open="logoutModalOpen"
      @close="logoutModalOpen = false"
      @confirm="handleLogout"
    />

    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-3 z-10">
      <!-- Welcome message if no messages -->
      <div
        v-if="messages.length === 0 && !isLoading && !isBotTyping"
        class="flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h2 class="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-semibold text-[#80BA41]">
          Welcome, {{ userName }}
        </h2>

        <img
          :src="logo"
          alt="MindWell Logo"
          class="opacity-35 w-50 h-50 sm:w-55 sm lg:w-70 lg:h-70 -mt-5"
        />
      </div>

      <!-- Messages -->
      <template v-if="messages.length > 0">
        <ChatBubble
          v-for="message in messages"
          :key="message.id"
          :message="message.content || ' '"
          :is-user="message.role === 'user'"
          :timestamp="message.timestamp?.toDate ? message.timestamp.toDate() : new Date()"
          :is-crisis="message.isCrisis"
          class="sm:px-4 lg:px-6"
        />
      </template>

      <!-- Typing indicator -->
      <ChatTypingIndicator v-if="isBotTyping" />
    </div>

    <!-- Input -->
    <ChatInput
      class="z-10 sm:mb-12 lg:mb-18 sm:px-8 lg:px-9.5"
      :disabled="isBotTyping || isLoading"
      @send="handleSendMessage"
    />

    <img
      class="absolute bottom-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="bottomBlueBlob"
      alt=""
    />

    <img
      class="absolute bottom-0 right-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
      :src="rightSideBlue"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'
import type { Message, Chat } from '~/composables/useChat'
import bgImg from '../../assets/images/bgImage.png'
import logo from '../../assets/svg/logo.svg'
import bottomBlueBlob from '../../assets/svg/bottomBlueSVG.svg'
import rightSideBlue from '../../assets/svg/rightSideBlue.svg'
import type LogoutModalVue from '~/components/chat/LogoutModal.vue'

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
  getBotResponse,
  renameChat,
} = useChat()

// State
const sidebarOpen = ref(false)
const logoutModalOpen = ref(false)
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

    // Call Cloud Function to get AI response via Dialogflow
    const botResponse = await getBotResponse(content, activeChatId.value)

    // Bot response is written by the server; rely on realtime listener to receive it
  } catch (error) {
    console.error('Error sending message:', error)
    // Optionally show an inline error; do not write assistant messages from client to avoid duplicates
  } finally {
    isBotTyping.value = false
    scrollToBottom()
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

// Handle delete chat
const handleDeleteChat = async (chatId: string) => {
  // TODO: Implement delete chat logic
  console.log('Delete chat:', chatId)
}

// Handle rename chat
const handleRenameChat = async (chatId: string, newTitle: string) => {
  try {
    await renameChat(chatId, newTitle)
    // Update local chat list
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.title = newTitle
    }
  } catch (error) {
    console.error('Error renaming chat:', error)
  }
}

// Handle logout
const handleLogout = async () => {
  try {
    logoutModalOpen.value = false
    sidebarOpen.value = false
    await signOut($auth)
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script>
