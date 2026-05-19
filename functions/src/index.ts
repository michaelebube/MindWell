/**
 * MindWell Firebase Cloud Functions
 * Main entry point for all cloud functions
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { detectIntent, type DialogflowResponse } from './services/dialogflowService'
import { generatePersonalizedResponse, shouldUseLLM } from './services/llmService'
import { detectCrisisKeywords, getCrisisResponse } from './utils/crisisDetection'

// Initialize Firebase Admin
initializeApp()
const db = getFirestore()

const RATE_LIMIT_WINDOW_MS = 60 * 1000
const RATE_LIMIT_MAX_REQUESTS = 20
const RATE_LIMIT_TTL_MS = 60 * 24 * 60 * 60 * 1000

// Response type for the chat function
interface ChatResponse {
  message: string
  isCrisis: boolean
  intent?: string
  confidence?: number
  sentimentScore?: number | null
  sentimentMagnitude?: number | null
}

/**
 * Main chat function - callable from the frontend
 * Handles user messages, routes to Dialogflow CX, and performs crisis detection
 */
export const chatWithDialogflow = onCall<{
  message: string
  chatId: string
}>(
  {
    enforceAppCheck: false, // Set to true in production with App Check
    cors: true,
    // Grant access to secret values declared via defineSecret('SYSTEM_PROMPT')
    secrets: ['SYSTEM_PROMPT'],
  },
  async (request): Promise<ChatResponse> => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const { message, chatId } = request.data
    const userId = request.auth.uid as string

    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Message is required')
    }

    if (!chatId || typeof chatId !== 'string') {
      throw new HttpsError('invalid-argument', 'Chat ID is required')
    }

    await enforceUserRateLimit(userId)

    // ── Performance tracking ─────────────────────────────────
    const startTime = Date.now()

    const logPerformance = (intent: string, isCrisis: boolean, error = false) => {
      void db.collection('performance_logs').add({
        userId,
        chatId,
        responseTimeMs: Date.now() - startTime,
        intent,
        isCrisis,
        error,
        timestamp: new Date(),
      }).catch((logError) => {
        console.error('Performance logging failed:', logError)
      })
    }
    // ─────────────────────────────────────────────────────────

    // Log user message to Firestore
    try {
      //      console.log('=== CHAT FUNCTION CALLED ===');
      // console.log('chatId:', chatId);
      // console.log('userId:', userId);
      // console.log('message:', message);
      //       await db.collection('chats').doc(chatId).collection('messages').add({
      //           chatId,
      //           content: message,
      //           role: 'user',
      //           timestamp: new Date(),
      //           userId: userId,
      //           isCrisis: false
      //       })

      //         console.log('✅ User message saved to:', `chats/${chatId}/messages`);
      // Step 1: Quick crisis keyword detection (first layer)
      const keywordResult = detectCrisisKeywords(message)

      // If high-confidence crisis detected via keywords, respond immediately
      if (keywordResult.isCrisis && keywordResult.confidence === 'high') {
        console.log('Crisis detected via keywords:', keywordResult.matchedKeywords)

        await db
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            chatId,
            content: getCrisisResponse(message),
            role: 'assistant',
            timestamp: new Date(),
            isCrisis: true,
            intent: 'crisis_detected',
          })

        // Log crisis event for monitoring
        await logCrisisEvent(userId, chatId, message, keywordResult.matchedKeywords)

        await logPerformance('crisis_detected', true)

        return {
          message: getCrisisResponse(message),
          isCrisis: true,
          intent: 'crisis_detected',
          confidence: 1.0,
        }
      }

      // Step 2: Send to Dialogflow CX for intent detection
      let dialogflowResponse: DialogflowResponse

      try {
        dialogflowResponse = await detectIntent(message, chatId, chatId)
      } catch (dialogflowError) {
        console.error('Dialogflow error, using fallback with LLM:', dialogflowError)

        // If Dialogflow fails but we have medium-confidence crisis keywords
        if (keywordResult.isCrisis && keywordResult.confidence === 'medium') {
          const crisisResponse = getCrisisResponse(message)

          // ✅ SAVE BOT RESPONSE
          await db.collection('chats').doc(chatId).collection('messages').add({
            chatId,
            content: crisisResponse,
            role: 'assistant',
            timestamp: new Date(),
            isCrisis: true,
          })

          await logCrisisEvent(userId, chatId, message, keywordResult.matchedKeywords)

          await logPerformance('crisis_fallback', true)

          return {
            message: getCrisisResponse(message),
            isCrisis: true,
            intent: 'crisis_fallback',
            confidence: 0.7,
          }
        }

        // Dialogflow failed - use LLM directly with default intent for testing
        // This allows local testing without Dialogflow deployment
        const moodContext = await getMoodContext(userId)
        const llmResponse = await generatePersonalizedResponse(
          message,
          'default', // Use default guidance when Dialogflow is unavailable
          {},
          chatId || null,
          moodContext
        )

        // ✅ SAVE BOT RESPONSE
        await db.collection('chats').doc(chatId).collection('messages').add({
          chatId,
          content: llmResponse,
          role: 'assistant',
          timestamp: new Date(),
          isCrisis: false,
        })

        await logPerformance('dialogflow_fallback_llm', false)

        return {
          message: llmResponse,
          isCrisis: false,
          intent: 'dialogflow_fallback_llm',
          confidence: 0,
        }
      }

      // Step 3: Check if Dialogflow detected a crisis intent
      if (dialogflowResponse.isCrisis) {
        const response = dialogflowResponse.responseText || getCrisisResponse(message)
        // ✅ SAVE BOT RESPONSE
        await db
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            chatId,
            content: response,
            role: 'assistant',
            timestamp: new Date(),
            isCrisis: true,
            intent: dialogflowResponse.intent,
            sentimentScore: dialogflowResponse.sentimentScore ?? null,
            sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
          })

        await logCrisisEvent(userId, chatId, message, ['dialogflow_crisis_intent'])

        await logPerformance(dialogflowResponse.intent, true)

        return {
          message: dialogflowResponse.responseText || getCrisisResponse(message),
          isCrisis: true,
          intent: dialogflowResponse.intent,
          confidence: dialogflowResponse.confidence,
          sentimentScore: dialogflowResponse.sentimentScore ?? null,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
        }
      }

      // Step 4: Handle low-confidence or fallback responses
      // If Dialogflow has low confidence and we have keyword matches, err on side of caution
      if (dialogflowResponse.isFallback && keywordResult.isCrisis) {
        console.log('Fallback with crisis keywords, treating as potential crisis')

        const response = getCrisisResponse(message)

        // ✅ SAVE BOT RESPONSE
        await db
          .collection('chats')
          .doc(chatId)
          .collection('messages')
          .add({
            chatId,
            content: response,
            role: 'assistant',
            timestamp: new Date(),
            isCrisis: true,
            sentimentScore: dialogflowResponse.sentimentScore ?? null,
            sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
          })

        await logCrisisEvent(userId, chatId, message, keywordResult.matchedKeywords)

        await logPerformance('crisis_fallback_keywords', true)

        return {
          message: response,
          isCrisis: true,
          intent: 'crisis_fallback_keywords',
          confidence: 0.6,
          sentimentScore: dialogflowResponse.sentimentScore ?? null,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
        }
      }

      // Step 5: For non-crisis intents, generate personalized LLM response
      if (shouldUseLLM(dialogflowResponse.intent)) {
        const effectiveIntent = dialogflowResponse.isFallback
          ? 'default'
          : dialogflowResponse.intent
        // Get user's mood context for personalization
        const moodContext = await getMoodContext(userId)

        // Generate LLM response with intent-specific guidance
        const personalizedMessage = await generatePersonalizedResponse(
          message,
          effectiveIntent,
          dialogflowResponse.parameters,
          chatId,
          moodContext,
          {
            score: dialogflowResponse.sentimentScore ?? null,
            magnitude: dialogflowResponse.sentimentMagnitude ?? null,
          }
        )

        console.log('LLM response:', personalizedMessage)

        await db.collection('chats').doc(chatId).collection('messages').add({
          chatId,
          content: personalizedMessage,
          role: 'assistant',
          timestamp: new Date(),
          isCrisis: false,
          intent: effectiveIntent,
          sentimentScore: dialogflowResponse.sentimentScore,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude,
        })

        await logPerformance(effectiveIntent, false)

        return {
          message: personalizedMessage,
          isCrisis: false,
          intent: effectiveIntent,
          confidence: dialogflowResponse.confidence,
          sentimentScore: dialogflowResponse.sentimentScore,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude,
        }
      }

      // Step 6: Return Dialogflow response for any remaining cases
      await db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .add({
          chatId,
          content: dialogflowResponse.responseText,
          role: 'assistant',
          timestamp: new Date(),
          isCrisis: false,
          intent: dialogflowResponse.intent,
          sentimentScore: dialogflowResponse.sentimentScore ?? null,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
        })

      await logPerformance(dialogflowResponse.intent, false)

      return {
        message: dialogflowResponse.responseText,
        isCrisis: false,
        intent: dialogflowResponse.intent,
        confidence: dialogflowResponse.confidence,
        sentimentScore: dialogflowResponse.sentimentScore ?? null,
        sentimentMagnitude: dialogflowResponse.sentimentMagnitude ?? null,
      }
    } catch (error) {
      console.error('Chat function error:', error)
      await logPerformance('error', false, true)
      throw new HttpsError('internal', 'Failed to process message')
    }
  }
)

/**
 * Basic per-user rate limiting using a Firestore document per user.
 */
async function enforceUserRateLimit(userId: string): Promise<void> {
  const now = Date.now()
  const nowDate = new Date(now)
  const expiresAt = new Date(now + RATE_LIMIT_TTL_MS)
  const rateLimitRef = db.collection('rate_limits').doc(userId)

  await db.runTransaction(async tx => {
    const snapshot = await tx.get(rateLimitRef)

    if (!snapshot.exists) {
      tx.set(rateLimitRef, {
        count: 1,
        windowStartMs: now,
        updatedAt: nowDate,
        expiresAt,
      })
      return
    }

    const data = snapshot.data() as { count?: number; windowStartMs?: number }
    const count = typeof data.count === 'number' ? data.count : 0
    const windowStartMs = typeof data.windowStartMs === 'number' ? data.windowStartMs : now
    const isWindowExpired = now - windowStartMs >= RATE_LIMIT_WINDOW_MS

    if (isWindowExpired) {
      tx.set(
        rateLimitRef,
        {
          count: 1,
          windowStartMs: now,
          updatedAt: nowDate,
          expiresAt,
        },
        { merge: true }
      )
      return
    }

    if (count >= RATE_LIMIT_MAX_REQUESTS) {
      throw new HttpsError(
        'resource-exhausted',
        'Too many requests. Please wait a minute and try again.'
      )
    }

    tx.set(
      rateLimitRef,
      {
        count: count + 1,
        updatedAt: nowDate,
        expiresAt,
      },
      { merge: true }
    )
  })
}

/**
 * Log crisis events for monitoring and safety
 */
async function logCrisisEvent(
  userId: string,
  chatId: string,
  message: string,
  triggers: string[]
): Promise<void> {
  try {
    await db.collection('crisis_logs').add({
      userId,
      chatId,
      message,
      triggers,
      timestamp: new Date(),
      handled: true,
    })
    console.log('Crisis event logged for user:', userId)
  } catch (error) {
    console.error('Failed to log crisis event:', error)
    // Don't throw - logging failure shouldn't break the response
  }
}

/**
 * Get user's recent mood context for personalized responses
 */
async function getMoodContext(userId: string): Promise<{
  recentMood: string
  moodScore: number
} | null> {
  try {
    const moodLogs = await db
      .collection('moodLogs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get()

    if (moodLogs.empty) {
      return null
    }

    const latestMood = moodLogs.docs[0].data()
    return {
      recentMood: latestMood.mood || 'neutral',
      moodScore: latestMood.score || 5,
    }
  } catch (error) {
    console.error('Error fetching mood context:', error)
    return null
  }
}
