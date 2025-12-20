import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'

interface MoodLog {
  id: string
  userId: string
  mood: string
  createdAt: Timestamp
  date: string
  sessionId: string
}

export const useMoodLog = () => {
  const { $auth, $firestore } = useNuxtApp()

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

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  const logMood = async (mood: string) => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    const today = new Date()
    const dateString = today.toISOString().split('T')[0] 

    try {
      const moodLogData = {
        userId: user.uid,
        mood,
        createdAt: Timestamp.now(),
        date: dateString,
        sessionId: generateSessionId(),
      }

      const docRef = await addDoc(collection($firestore, 'moodLogs'), moodLogData)
      return docRef.id
    } catch (error) {
      console.error('Error logging mood:', error)
      throw error
    }
  }

  const hasMoodLoggedToday = async (): Promise<boolean> => {
    const user = await waitForAuth()
    if (!user) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(
        moodLogsRef,
        where('userId', '==', user.uid),
        where('createdAt', '>=', Timestamp.fromDate(today))
      )

      const snapshot = await getDocs(q)
      return !snapshot.empty
    } catch (error) {
      console.error('Error checking mood log:', error)
      return false
    }
  }

  const getUserMoodLogs = async () => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(moodLogsRef, where('userId', '==', user.uid))

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error('Error fetching mood logs:', error)
      throw error
    }
  }

  const getLatestMoodLog = async (): Promise<MoodLog | null> => {
    const user = await waitForAuth()
    if (!user) throw new Error('User not authenticated')

    try {
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(
        moodLogsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      )

      const snapshot = await getDocs(q)
      if (snapshot.empty) return null

      const doc = snapshot.docs[0]
      return {
        id: doc?.id,
        ...doc?.data(),
      } as MoodLog
    } catch (error) {
      console.error('Error fetching latest mood log:', error)
      throw error
    }
  }

  return {
    logMood,
    hasMoodLoggedToday,
    getUserMoodLogs,
    getLatestMoodLog,
  }
}
