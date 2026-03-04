<template>
  <!-- Backdrop -->
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="$emit('close')" />
  </Transition>

  <!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-56 xs:w-80 lg:w-90 bg-white z-50 rounded-tr-[50px] rounded-br-[50px] flex flex-col shadow-xl transition-transform duration-300 ease-in-out will-change-transform"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Search Bar -->
    <div class="xs:px-5 px-4 xs:pt-12 pt-10 pb-4">
      <div class="relative">
        <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 text-white/80"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search"
          class="w-full pl-10 pr-4 py-2.5 bg-[#80BA41] text-white placeholder-white/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6fa535]"
        />
      </div>
    </div>

    <div class="mx-4 xs:mx-5 border-t border-[#80BA41]"></div>

    <!-- New Chat Button -->
    <div class="xs:px-5 px-4 py-4">
      <button
        class="flex items-center gap-2 text-[#80BA41] hover:text-[#6fa535] transition-colors text-xs xs:text-sm font-medium"
        @click="$emit('newChat')"
      >
        <img :src="newChatIcon" alt="New Chat" class="w-4 h-4" />

        New Chat
      </button>
    </div>

    <!-- Divider -->
    <div class="xs:mx-5 mx-4 border-t border-[#80BA41]"></div>

    <!-- Chat History -->
    <div class="flex-1 overflow-y-auto px-5 py-2">
      <p
        v-if="filteredChats.length === 0"
        class="text-gray-500 text-center text-xs xs:text-sm py-4"
      >
        {{ searchQuery ? 'No chats found' : 'No previous chats' }}
      </p>

      <div v-else class="space-y-1">
        <div
          v-for="chat in filteredChats"
          :key="chat.id"
          class="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0"
        >
          <!-- Editing mode -->
          <input
            v-if="editingChatId === chat.id"
            ref="renameInputRef"
            v-model="editingTitle"
            type="text"
            class="flex-1 text-sm text-gray-800 border border-[#80BA41] rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#80BA41]"
            @keyup.enter="confirmRename(chat.id)"
            @keyup.escape="cancelRename"
            @blur="confirmRename(chat.id)"
          />

          <!-- Display mode -->
          <button
            v-else
            class="flex-1 text-left text-sm text-gray-800 truncate hover:text-[#80BA41] transition-colors"
            :class="{ 'text-[#80BA41] font-medium': chat.id === activeChatId }"
            @click="$emit('selectChat', chat.id)"
            @dblclick.stop="startRename(chat)"
          >
            {{ chat.title || 'New Chat' }}
          </button>

          <div class="flex items-center">
            <!-- Rename button -->
            <button
              v-if="editingChatId !== chat.id"
              class="ml-1 p-1.5 text-gray-400 hover:text-[#80BA41] hover:bg-green-50 rounded transition-colors"
              title="Rename chat"
              @click.stop="startRename(chat)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>

            <!-- Delete button -->
            <button
              class="ml-1 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              @click.stop="promptDelete(chat.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-5 border-t border-[#80BA41]"></div>

    <!-- User Profile -->
    <div class="xs:px-5 px-4 py-4 xs:pb-7.5 pb-5">
      <button class="w-full flex items-center gap-3" @click="$emit('goToProfile')">
        <img :src="profileIcon" alt="" />
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-medium text-[#80BA41] truncate">{{ userName }}</p>
        </div>
        <img :src="rightArrowIcon" alt="right arrow" class="w-4 h-4 xs:w-5 xs:h-5 text-[#80BA41]" />
      </button>
    </div>

    <!-- User Profile -->
    <div class="xs:px-5 px-4 xs:pb-7.5 pb-5">
      <button class="w-full flex items-center gap-3" @click="$emit('goToMoodMeter')">
        <img :src="moodMeterIcon" alt="" />
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-medium text-[#80BA41] truncate">Mood Meter</p>
        </div>
        <img :src="rightArrowIcon" alt="right arrow" class="w-4 h-4 xs:w-5 xs:h-5 text-[#80BA41]" />
      </button>
    </div>

    <!-- User Profile -->
    <div class="xs:px-5 px-4 xs:pb-7.5 pb-6">
      <button class="w-full flex items-center gap-3" @click="$emit('goToLogoutModal')">
        <img :src="logOutIcon" alt="" />
        <div class="flex-1 min-w-0 text-left">
          <p class="text-sm font-medium text-[#DD0025] truncate">Log out</p>
        </div>
        <img :src="redArrowIcon" alt="right arrow-red" class="w-4 h-4 xs:w-5 xs:h-5" />
      </button>
    </div>
  </aside>

  <!-- Delete Confirmation Popup -->
  <Transition name="fade">
    <div
      v-if="deletingChatId"
      class="fixed inset-0 bg-black/40 z-60 flex items-center justify-center px-6"
      @click.self="cancelDelete"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 max-w-72 xs:max-w-80 w-full text-center">
        <p class="text-sm xs:text-base font-semibold text-gray-800 mb-2">Delete Chat?</p>
        <p class="text-xs xs:text-sm text-gray-500 mb-6">
          This chat will be removed from your history. You won't see it anymore.
        </p>
        <div class="flex gap-3">
          <button
            class="flex-1 py-2 rounded-lg text-xs xs:text-sm font-medium border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors"
            @click="cancelDelete"
          >
            Cancel
          </button>
          <button
            class="flex-1 py-2 rounded-lg text-xs xs:text-sm font-medium bg-[#DD0025] text-white hover:bg-red-700 transition-colors"
            @click="confirmDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import newChatIcon from '../../assets/svg/new-chat.svg'
import profileIcon from '../../assets/svg/profile.svg'
import rightArrowIcon from '../../assets/svg/right-arrow.svg'
import redArrowIcon from '../../assets/svg/red-arrow.svg'
import moodMeterIcon from '../../assets/svg/mood-meter.svg'
import logOutIcon from '../../assets/svg/logout.svg'

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

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'newChat'): void
  (e: 'selectChat', chatId: string): void
  (e: 'deleteChat', chatId: string): void
  (e: 'renameChat', chatId: string, newTitle: string): void
  (e: 'goToProfile'): void
  (e: 'goToMoodMeter'): void
  (e: 'goToLogoutModal'): void
}>()

const searchQuery = ref('')
const editingChatId = ref<string | null>(null)
const editingTitle = ref('')
const renameInputRef = ref<HTMLInputElement[] | null>(null)
const deletingChatId = ref<string | null>(null)

const startRename = (chat: Chat) => {
  editingChatId.value = chat.id
  editingTitle.value = chat.title || ''
  nextTick(() => {
    if (renameInputRef.value && renameInputRef.value.length > 0) {
      renameInputRef.value[0]?.focus()
      renameInputRef.value[0]?.select()
    }
  })
}

const confirmRename = (chatId: string) => {
  const trimmed = editingTitle.value.trim()
  if (trimmed && editingChatId.value === chatId) {
    emit('renameChat', chatId, trimmed)
  }
  editingChatId.value = null
  editingTitle.value = ''
}

const cancelRename = () => {
  editingChatId.value = null
  editingTitle.value = ''
}

const promptDelete = (chatId: string) => {
  deletingChatId.value = chatId
}

const confirmDelete = () => {
  if (deletingChatId.value) {
    emit('deleteChat', deletingChatId.value)
    deletingChatId.value = null
  }
}

const cancelDelete = () => {
  deletingChatId.value = null
}

const filteredChats = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.chats
  }
  const query = searchQuery.value.toLowerCase()
  return props.chats.filter(chat => {
    const title = (chat.title || 'New Chat').toLowerCase()
    return title.includes(query)
  })
})
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
</style>
