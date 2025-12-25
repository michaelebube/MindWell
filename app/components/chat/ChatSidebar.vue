<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="$emit('close')" />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <aside v-if="isOpen" class="fixed top-0 left-0 h-full w-72 xs:w-80 bg-white z-50 flex flex-col shadow-xl">
      <!-- Header -->
      <div class="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="font-semibold text-gray-800 xs:text-lg text-base">Chats</h2>
        <button @click="$emit('close')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- New Chat Button -->
      <div class="px-4 py-3">
        <button @click="$emit('newChat')" class="w-full flex items-center gap-3 px-4 py-3 bg-[#80BA41] text-white rounded-xl hover:bg-[#6fa535] transition-colors xs:text-sm text-xs font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>

      <!-- Chat History -->
      <div class="flex-1 overflow-y-auto px-4 py-2">
        <p v-if="chats.length === 0" class="text-gray-500 text-center text-xs xs:text-sm py-4">No previous chats</p>

        <div v-else class="space-y-1">
          <!-- Today's Chats -->
          <div v-if="todayChats.length > 0">
            <p class="text-xs text-gray-400 uppercase font-medium px-2 py-2">Today</p>
            <button
              v-for="chat in todayChats"
              :key="chat.id"
              @click="$emit('selectChat', chat.id)"
              class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{ 'bg-[#80BA41]/10': chat.id === activeChatId }"
            >
              <p class="text-sm text-gray-800 truncate">{{ chat.title || 'New conversation' }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatTime(chat.updatedAt) }}</p>
            </button>
          </div>

          <!-- Previous Chats -->
          <div v-if="previousChats.length > 0">
            <p class="text-xs text-gray-400 uppercase font-medium px-2 py-2 mt-2">Previous</p>
            <button
              v-for="chat in previousChats"
              :key="chat.id"
              @click="$emit('selectChat', chat.id)"
              class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
              :class="{ 'bg-[#80BA41]/10': chat.id === activeChatId }"
            >
              <p class="text-sm text-gray-800 truncate">{{ chat.title || 'New conversation' }}</p>
              <p class="text-xs text-gray-400 mt-0.5">{{ formatDate(chat.updatedAt) }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="px-4 py-4 border-t border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#2558A6] flex items-center justify-center">
            <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-800 truncate">{{ userName }}</p>
            <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
          </div>
          <button @click="$emit('logout')" class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
interface Chat {
  id: string
  title?: string
  updatedAt: Date | { toDate: () => Date }
}

interface Props {
  isOpen: boolean
  chats: Chat[]
  activeChatId?: string
  userName: string
  userEmail: string
}

const props = withDefaults(defineProps<Props>(), { activeChatId: '' })

defineEmits<{
  (e: 'close'): void
  (e: 'newChat'): void
  (e: 'selectChat', chatId: string): void
  (e: 'logout'): void
}>()

const userInitials = computed(() => props.userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2))

const getDate = (timestamp: Date | { toDate: () => Date }): Date => {
  if (timestamp instanceof Date) return timestamp
  if (typeof timestamp?.toDate === 'function') return timestamp.toDate()
  return new Date(timestamp as unknown as string)
}

const isToday = (date: Date): boolean => {
  const today = new Date()
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()
}

const todayChats = computed(() => props.chats.filter((chat) => isToday(getDate(chat.updatedAt))))
const previousChats = computed(() => props.chats.filter((chat) => !isToday(getDate(chat.updatedAt))))

const formatTime = (timestamp: Date | { toDate: () => Date }): string => {
  return getDate(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
}

const formatDate = (timestamp: Date | { toDate: () => Date }): string => {
  return getDate(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }
</style>