import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { httpsCallable, type Functions } from 'firebase/functions'

export interface Message {
  id: string
  chatId: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Timestamp
  isCrisis?: boolean
}

export interface Chat {
  id: string
  userId: string
  title?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  moodLogId?: string
}

// Response type from Cloud Function
export interface ChatResponse {
  message: string
  isCrisis: boolean
  intent?: string
  confidence?: number
}

export const useChat = () => {
  const { $auth, $firestore, $functions } = useNuxtApp()

  // Helper to wait for auth state to be ready
  const waitForAuth = (): Promise<User | null> => {
    return new Promise((resolve) => {
      if ($auth.currentUser) {
        resolve($auth.currentUser)
      } else {
        const unsubscribe = onAuthStateChanged($auth, (user) => {
          unsubscribe()
          resolve(user)
        })
      }
    })
  }

  // Create a new chat session
  const createChat = async (moodLogId?: string): Promise<string> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      const chatData = {
        userId: user.uid,
        title: '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        moodLogId: moodLogId || null,
      }

      const docRef = await addDoc(collection($firestore, 'chats'), chatData)
      return docRef.id
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }

  // Get all chats for current user
  const getUserChats = async (): Promise<Chat[]> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      const chatsRef = collection($firestore, 'chats')
      const q = query(
        chatsRef,
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[]
    } catch (error) {
      console.error('Error fetching chats:', error)
      throw error
    }
  }

  // Send a message and get AI response
  const sendMessage = async (chatId: string, content: string): Promise<Message> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      // Save user message to Firestore
      const messagesRef = collection($firestore, 'chats', chatId, 'messages')
      const userMessageData = {
        chatId,
        content,
        role: 'user' as const,
        timestamp: Timestamp.now(),
        isCrisis: false,
      }

      const userMsgRef = await addDoc(messagesRef, userMessageData)

        // const response = await getBotResponse(content, chatId)

      // Update chat's updatedAt and title if first message
      const chatRef = doc($firestore, 'chats', chatId)
      const chatUpdate: Record<string, unknown> = { updatedAt: serverTimestamp() }
      
      // Set title from first message (truncated)
      // const messagesRef = collection($firestore, 'chats', chatId, 'messages')
      const messagesSnapshot = await getDocs(query(messagesRef, where('role', '==', 'user')))
      if (messagesSnapshot.size === 1) {
        chatUpdate.title = content.slice(0, 50) + (content.length > 50 ? '...' : '')
      }
      await updateDoc(chatRef, chatUpdate)

      return {
      //     id: 'pending',
      // chatId,
      // content,
      // role: 'user' as const,
      // timestamp: Timestamp.now(),
      // isCrisis: false,
        id: userMsgRef.id,
        ...userMessageData,
      }
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Save bot response (called after Cloud Function returns)
  const saveBotMessage = async (
    chatId: string,
    content: string,
    isCrisis: boolean = false
  ): Promise<Message> => {
    try {
      const messagesRef = collection($firestore, 'chats', chatId, 'messages')
      const botMessageData = {
        chatId,
        content,
        role: 'assistant' as const,
        timestamp: Timestamp.now(),
        isCrisis,
      }

      const botMsgRef = await addDoc(messagesRef, botMessageData)

      return {
        id: botMsgRef.id,
        ...botMessageData,
      }
    } catch (error) {
      console.error('Error saving bot message:', error)
      throw error
    }
  }

  // Get messages for a chat
  const getChatMessages = async (chatId: string): Promise<Message[]> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      const messagesRef = collection($firestore, 'chats', chatId, 'messages')
      const q = query(messagesRef, orderBy('timestamp', 'asc'))

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]
    } catch (error) {
      console.error('Error fetching messages:', error)
      throw error
    }
  }

  // Subscribe to real-time message updates
  const subscribeToMessages = (
    chatId: string,
    callback: (messages: Message[]) => void
  ): (() => void) => {
    const messagesRef = collection($firestore, 'chats', chatId, 'messages')
    const q = query(messagesRef, orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[]
      callback(messages)
    })

    return unsubscribe
  }

  // Get today's chat (if exists)
  const getTodayChat = async (): Promise<Chat | null> => {
    const user = await waitForAuth()
    if (!user) return null

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      const chatsRef = collection($firestore, 'chats')
      const q = query(
        chatsRef,
        where('userId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(today)),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      if (snapshot.empty) return null

      const doc = snapshot.docs[0]
      return {
        id: doc?.id,
        ...doc?.data(),
      } as Chat
    } catch (error) {
      console.error('Error fetching today chat:', error)
      return null
    }
  }

  // Get bot response from Dialogflow via Cloud Function
  const getBotResponse = async (
    userMessage: string,
    chatId: string
  ): Promise<ChatResponse> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      // Call the Cloud Function
      const chatWithDialogflow = httpsCallable<
        { message: string; chatId: string; userId: string },
        ChatResponse
      >($functions as Functions, 'chatWithDialogflow')

      const result = await chatWithDialogflow({
        message: userMessage,
        chatId, // Used as Dialogflow session ID for context continuity
        userId: user.uid,
      })

      return result.data
    } catch (error) {
      console.error('Error getting bot response:', error)
      // Return a fallback response on error
      return {
        message: "I'm sorry, I'm having trouble responding right now. Please try again.",
        isCrisis: false,
      }
    }
  }

  return {
    createChat,
    getUserChats,
    sendMessage,
    saveBotMessage,
    getChatMessages,
    subscribeToMessages,
    getTodayChat,
    getBotResponse,
  }
}