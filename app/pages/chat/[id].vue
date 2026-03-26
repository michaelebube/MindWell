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
      @go-to-mood-meter="navigateTo('/mood/mood-meter')"
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
      <ChatTypingIndicator v-if="isBotTyping" class="sm:px-4 lg:px-6" />
    </div>

    <!-- Input -->
    <ChatInput
      class="z-10 sm:mb-12 lg:mb-18 sm:px-8 lg:px-9.5"
      :disabled="isBotTyping || isLoading"
      @send="handleSendMessage"
    />

    <Transition name="wave-default">
      <img
        v-if="!sidebarOpen && !shouldHideBottomWaves"
        class="absolute bottom-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
        :src="bottomBlueBlob"
        alt=""
      />
    </Transition>

    <Transition name="wave-default">
      <img
        v-if="!sidebarOpen && !shouldHideBottomWaves"
        class="absolute bottom-0 right-0 hidden sm:block sm:w-56 sm:h-20 md:w-72 md:h-20 lg:w-86 lg:h-24 xl:w-130 xl:h-16 w-24 h-24"
        :src="rightSideBlue"
        alt=""
      />
    </Transition>

    <Transition name="slide-right">
      <img
        v-if="sidebarOpen"
        class="absolute bottom-0 right-0 hidden sm:block sm:w-1/2 md:w-3/5 xl:w-2/3 sm:h-14 md:h-16 lg:h-20"
        :src="sideBarBottomWave"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { signOut } from 'firebase/auth'
import type { Message, Chat } from '~/composables/useChat'
import bgImg from '../../assets/images/bgImage.png'
import logo from '../../assets/svg/logo.svg'
import bottomBlueBlob from '../../assets/svg/bottomBlueSVG.svg'
import rightSideBlue from '../../assets/svg/rightSideBlue.svg'
import sideBarBottomWave from '../../assets/svg/Sidebar-Blue-Wave.svg'

const route = useRoute()
const router = useRouter()
const { $auth } = useNuxtApp()
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
  softDeleteChat,
} = useChat()

// State
const sidebarOpen = ref(false)
const logoutModalOpen = ref(false)
const messages = ref<Message[]>([])
const chats = ref<Chat[]>([])
const activeChatId = ref(route.params.id as string)
const isLoading = ref(true)
const isBotTyping = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)
const isTouchInputDevice = ref(false)
const isTextFieldFocused = ref(false)

const shouldHideBottomWaves = computed(() => isTouchInputDevice.value && isTextFieldFocused.value)

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

const isEditableTextTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false

  if (target instanceof HTMLTextAreaElement) return true

  if (target instanceof HTMLInputElement) {
    const nonTextInputTypes = new Set([
      'button',
      'checkbox',
      'color',
      'file',
      'hidden',
      'image',
      'radio',
      'range',
      'reset',
      'submit',
    ])
    return !nonTextInputTypes.has(target.type)
  }

  return target.isContentEditable
}

const updateFocusedTextFieldState = () => {
  isTextFieldFocused.value = isEditableTextTarget(document.activeElement)
}

const handleFocusChange = (e: FocusEvent) => {
  if (!isTouchInputDevice.value) {
    isTextFieldFocused.value = false
    return
  }

  if (e.type === 'focusout') {
    // Wait one frame so document.activeElement reflects the next focused element.
    requestAnimationFrame(() => {
      updateFocusedTextFieldState()
    })
    return
  }

  updateFocusedTextFieldState()
}

// Load chats and initialize from route param
onMounted(async () => {
  const supportsTouch = navigator.maxTouchPoints > 0
  const coarsePointer = window.matchMedia('(any-pointer: coarse)').matches
  const noHover = window.matchMedia('(hover: none)').matches
  isTouchInputDevice.value = supportsTouch && (coarsePointer || noHover)

  document.addEventListener('focusin', handleFocusChange)
  document.addEventListener('focusout', handleFocusChange)

  try {
    // Load user's chat history
    chats.value = await getUserChats()

    // Use the chat ID from the route
    const chatId = route.params.id as string
    activeChatId.value = chatId

    // Subscribe to messages for this chat
    unsubscribeMessages = subscribeToMessages(chatId, newMessages => {
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
  document.removeEventListener('focusin', handleFocusChange)
  document.removeEventListener('focusout', handleFocusChange)

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

    // Refresh chat list
    chats.value = await getUserChats()

    // Navigate to the new chat
    router.push(`/chat/${newChatId}`)
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

  sidebarOpen.value = false
  router.push(`/chat/${chatId}`)
}

// Handle delete chat (soft-delete)
const handleDeleteChat = async (chatId: string) => {
  try {
    await softDeleteChat(chatId)

    // Remove from local list
    chats.value = chats.value.filter(c => c.id !== chatId)

    // If we deleted the active chat, switch to another or create new
    if (chatId === activeChatId.value) {
      if (unsubscribeMessages) {
        unsubscribeMessages()
      }

      if (chats.value.length > 0) {
        const nextChat = chats.value[0]!
        router.push(`/chat/${nextChat.id}`)
      } else {
        // No chats left, create a new one
        const newChatId = await createChat()
        chats.value = await getUserChats()
        router.push(`/chat/${newChatId}`)
      }
    }
  } catch (error) {
    console.error('Error deleting chat:', error)
  }
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

<style scoped>
/* Default waves: fade out quickly, fade in after sidebar wave fully leaves */
.wave-default-enter-active {
  transition: opacity 0.25s ease 0.35s;
}
.wave-default-leave-active {
  transition: opacity 0.15s ease;
}
.wave-default-enter-from,
.wave-default-leave-to {
  opacity: 0;
}

/* Sidebar wave: slide in after default waves gone, slide out first on close */
.slide-right-enter-active {
  transition: transform 0.3s ease 0.2s;
}
.slide-right-leave-active {
  transition: transform 0.25s ease;
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
