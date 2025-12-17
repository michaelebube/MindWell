import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'

export const useMoodLog = () => {
  const { $auth, $firestore } = useNuxtApp()

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  const logMood = async (mood: string) => {
    if (!$auth.currentUser) throw new Error('User not authenticated')

    const today = new Date()
    const dateString = today.toISOString().split('T')[0] // YYYY-MM-DD

    try {
      const moodLogData = {
        userId: $auth.currentUser.uid,
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
    if (!$auth.currentUser) return false

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    try {
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(
        moodLogsRef,
        where('userId', '==', $auth.currentUser.uid),
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
    if (!$auth.currentUser) throw new Error('User not authenticated')

    try {
      const moodLogsRef = collection($firestore, 'moodLogs')
      const q = query(moodLogsRef, where('userId', '==', $auth.currentUser.uid))

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

  return {
    logMood,
    hasMoodLoggedToday,
    getUserMoodLogs,
  }
}
