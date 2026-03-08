/**
 * MindWell Firebase Cloud Functions
 * Main entry point for all cloud functions
 */

import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { onRequest } from 'firebase-functions/v2/https'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { detectIntent, type DialogflowResponse } from './services/dialogflowService'
import { generatePersonalizedResponse, shouldUseLLM } from './services/llmService'
import { detectCrisisKeywords, getCrisisResponse } from './utils/crisisDetection'

// Initialize Firebase Admin
initializeApp()
const db = getFirestore()

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
  userId: string
}>(
  {
    // Optional: Add rate limiting and other options
    enforceAppCheck: false, // Set to true in production with App Check
    cors: true,
    // Grant access to secret values declared via defineSecret('SYSTEM_PROMPT')
    secrets: ['SYSTEM_PROMPT'],
  },
  async (request): Promise<ChatResponse> => {
    // Verify authentication
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const { message, chatId, userId } = request.data

    if (!message || typeof message !== 'string') {
      throw new HttpsError('invalid-argument', 'Message is required')
    }

    if (!chatId || typeof chatId !== 'string') {
      throw new HttpsError('invalid-argument', 'Chat ID is required')
    }

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
        console.log('Dialogflow result:', {
          intent: dialogflowResponse.intent,
          confidence: dialogflowResponse.confidence,
          isFallback: dialogflowResponse.isFallback,
          isCrisis: dialogflowResponse.isCrisis,
          sentimentScore: dialogflowResponse.sentimentScore,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude,
          responseTextPreview: dialogflowResponse.responseText?.slice?.(0, 200),
        })
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
        // Get user's mood context for personalization
        const moodContext = await getMoodContext(userId)

        // Generate LLM response with intent-specific guidance
        const personalizedMessage = await generatePersonalizedResponse(
          message,
          dialogflowResponse.intent,
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
          intent: dialogflowResponse.intent,
          sentimentScore: dialogflowResponse.sentimentScore,
          sentimentMagnitude: dialogflowResponse.sentimentMagnitude,
        })

        return {
          message: personalizedMessage,
          isCrisis: false,
          intent: dialogflowResponse.intent,
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
      throw new HttpsError('internal', 'Failed to process message')
    }
  }
)

/**
 * Webhook endpoint for Dialogflow CX fulfillment
 * This allows Dialogflow to call back to your function for custom logic
 */
export const dialogflowWebhook = onRequest(
  {
    cors: true,
    // webhook may call LLM personalization — include secret dependency
    secrets: ['SYSTEM_PROMPT'],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed')
      return
    }

    try {
      const body = req.body

      // Extract session info
      const sessionInfo = body.sessionInfo || {}
      const parameters = sessionInfo.parameters || {}
      const chatId = (parameters.chatId as string) || ''
      const tag = body.fulfillmentInfo?.tag || ''
      const text = body.text || ''

      console.log('Webhook received:', { tag, text, parameters })

      // Handle different fulfillment tags
      let responseText = ''
      let targetPage = ''
      const sessionParams: Record<string, unknown> = {}

      switch (tag) {
        case 'get-mood-context':
          // Fetch user's recent mood data for context
          const moodUserId = parameters.userId as string
          if (moodUserId) {
            const moodContext = await getMoodContext(moodUserId)
            sessionParams.moodContext = moodContext
            responseText = moodContext
              ? `I see you've been feeling ${moodContext.recentMood}. Let's talk about that.`
              : 'How have you been feeling lately?'
          }
          break

        case 'crisis-escalation':
          // Handle crisis escalation
          responseText = getCrisisResponse(text)
          // Route to crisis page in Dialogflow
          break

        case 'personalized-response':
          // LLM-enhanced personalization with intent context
          const intentName = (parameters.intentName as string) || 'default'
          const webhookUserId = parameters.userId as string
          const webhookMoodContext = webhookUserId ? await getMoodContext(webhookUserId) : null
          responseText = await generatePersonalizedResponse(
            text,
            intentName,
            parameters,
            chatId,
            webhookMoodContext
          )
          break

        default:
          // No special handling, let Dialogflow continue normally
          res.json({})
          return
      }

      // Build webhook response
      const webhookResponse: Record<string, unknown> = {
        fulfillmentResponse: {
          messages: [
            {
              text: {
                text: [responseText],
              },
            },
          ],
        },
      }

      // Add session parameters if any
      if (Object.keys(sessionParams).length > 0) {
        webhookResponse.sessionInfo = {
          parameters: sessionParams,
        }
      }

      // Add target page if specified
      if (targetPage) {
        webhookResponse.targetPage = targetPage
      }

      res.json(webhookResponse)
    } catch (error) {
      console.error('Webhook error:', error)
      res.status(500).json({ error: 'Webhook processing failed' })
    }
  }
)

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
