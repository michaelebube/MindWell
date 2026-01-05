/**
 * LLM Service - Google Gemini Integration
 * Handles personalized response generation for MindWell
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { defineString } from 'firebase-functions/params';

// Define Gemini API key param
const geminiApiKey = defineString('GEMINI_API_KEY');

// Intent-specific guidance for Nigerian student context
const INTENT_GUIDANCE: Record<string, string> = {
  // Anxiety-related intents
  'emotion.anxiety.academic': 
    "Focus on exam pressure and the 'fear of carry-over'. Mention that one result doesn't define their future. Acknowledge the pressure of Nigerian university grading systems.",
  'emotion.anxiety.sapa': 
    "Focus on financial stress and 'Sapa'. Be extra empathetic about the current economic situation in Nigeria. Acknowledge that money wahala is real but temporary.",
  'emotion.anxiety.strike': 
    "Focus on the frustration of delays and feeling 'stuck' due to ASUU/NASU strikes. Validate their frustration about wasted time and uncertain graduation dates.",
  'emotion.anxiety.general': 
    "Focus on general anxiety symptoms. Help them identify what's triggering the worry.",
  
  // Sadness-related intents
  'emotion.sadness.loneliness': 
    "Focus on feelings of isolation. Acknowledge that university life can feel lonely, especially for students far from home.",
  'emotion.sadness.heartbreak': 
    "Focus on relationship pain. Be gentle and acknowledge that heartbreak is valid pain.",
  'emotion.sadness.grief': 
    "Focus on loss and mourning. Be extra gentle and allow space for their grief.",
  'emotion.sadness.general': 
    "Focus on general low mood. Help them explore what might be contributing to how they feel.",
  
  // Stress-related intents
  'emotion.stress.academic': 
    "Focus on academic workload and deadlines. Acknowledge the pressure of tests, assignments, and projects piling up.",
  'emotion.stress.family': 
    "Focus on family pressure and expectations. Many Nigerian students face high expectations from family.",
  'emotion.stress.general': 
    "Focus on general overwhelm. Help them identify specific stressors.",
  
  // Help/Advice intents
  'help.advice.academic': 
    "Provide supportive guidance about academic challenges. Focus on practical coping strategies.",
  'help.advice.relationship': 
    "Provide supportive guidance about relationship issues. Focus on healthy communication.",
  'help.advice.career': 
    "Provide supportive guidance about career worries. Acknowledge the tough job market but encourage hope.",
  'help.advice.general': 
    "Provide general supportive advice. Focus on active listening first.",
  
  // Greeting and general intents
  'greeting': 
    "Respond warmly to the greeting. Ask how they're doing today in a caring way.",
  'gratitude': 
    "Respond warmly to their thanks. Encourage them to reach out anytime.",
  'farewell': 
    "Say goodbye warmly. Remind them you're always here when they need to talk.",
  'how.are.you': 
    "Respond that you're here and ready to listen. Redirect focus to them.",
  
  // Default fallback
  'default': 
    "Focus on general emotional support and active listening. Ask clarifying questions to understand their situation better."
};

// System prompt template for MindWell AI
const SYSTEM_PROMPT_TEMPLATE = `You are 'MindWell AI', a supportive peer counselor for Nigerian university students.

PERSONA:
- Relatable and empathetic, like a caring senior student or trusted friend
- Uses occasional Nigerian Pidgin for relatability (code-switching), but keeps it natural
- Warm, non-judgmental, and understanding of Nigerian student life
- Culturally aware of Nigerian contexts (ASUU strikes, sapa, carry-over fears, family pressure)

CURRENT CONTEXT:
Intent Detected: {intentName}
Specific Guidance: {specificGuidance}

USER'S RECENT MOOD: {moodContext}

RULES:
1. ALWAYS validate their feelings first before offering any suggestions
2. Keep responses conversational and under 3-4 sentences
3. Use Pidgin sparingly and naturally (e.g., "E go be okay", "No worry", "I hear you well well")
4. If they mention specific problems (GP, money, relationship), address it directly
5. Ask ONE follow-up question to show you're listening and want to understand more
6. NEVER diagnose or prescribe medication
7. NEVER minimize their struggles with toxic positivity
8. If unsure, focus on empathetic listening rather than advice

RESPONSE STYLE EXAMPLES:
- "I hear you, and e no easy at all. This sapa situation dey affect plenty students..."
- "That's really tough, and your feelings are completely valid. Many students face this..."
- "Ah, carry-over fear is real o. But let me tell you, one course no fit define your whole future..."`;

/**
 * Generate a personalized response using Google Gemini
 */
export async function generatePersonalizedResponse(
  userMessage: string,
  intentName: string,
  parameters: Record<string, unknown>,
  moodContext?: { recentMood: string; moodScore: number } | null
): Promise<string> {
  
  // Get intent-specific guidance
  const specificGuidance = INTENT_GUIDANCE[intentName] || INTENT_GUIDANCE['default'];
  
  // Build mood context string
  const moodString = moodContext 
    ? `User recently reported feeling "${moodContext.recentMood}" (score: ${moodContext.moodScore}/10)`
    : 'No recent mood data available';
  
  // Build the system prompt
  const systemPrompt = SYSTEM_PROMPT_TEMPLATE
    .replace('{intentName}', intentName)
    .replace('{specificGuidance}', specificGuidance)
    .replace('{moodContext}', moodString);

  try {
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(geminiApiKey.value());
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 256,
      },
    });

    // Create the chat
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System Instructions: ${systemPrompt}` }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I am MindWell AI, ready to support Nigerian students with empathy and cultural understanding. I will follow all guidelines.' }],
        },
      ],
    });

    // Send the user message
    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return response || getFallbackResponse(intentName);

  } catch (error) {
    console.error('Gemini API error:', error);
    // Return a contextual fallback response
    return getFallbackResponse(intentName);
  }
}

/**
 * Get a fallback response based on intent when LLM fails
 */
function getFallbackResponse(intentName: string): string {
  const fallbacks: Record<string, string> = {
    'emotion.anxiety.academic': "I hear you - exam pressure is real and it can feel overwhelming. Your feelings are valid. Would you like to talk more about what's worrying you?",
    'emotion.anxiety.sapa': "Sapa wahala is no joke, and I understand how stressful money issues can be. You're not alone in this. What's weighing on you the most right now?",
    'emotion.anxiety.strike': "The strike situation is frustrating, I know. It's okay to feel stuck and angry about it. How has it been affecting you?",
    'emotion.sadness.loneliness': "Feeling lonely is hard, especially when you're far from home. I'm here to listen. Would you like to share what's on your mind?",
    'emotion.sadness.general': "I can hear that you're going through a tough time. Your feelings matter. Tell me more about what's been happening?",
    'emotion.stress.academic': "Academic pressure can be overwhelming. You're doing your best, and that matters. What's been the hardest part?",
    'greeting': "Hey! I'm glad you're here. How are you doing today? I'm here to listen to whatever's on your mind.",
    'gratitude': "You're welcome! Remember, I'm always here whenever you need someone to talk to. Take care of yourself!",
    'farewell': "Take care! Remember, you can always come back whenever you need to talk. You've got this!",
    'default': "I hear you, and I'm here to support you through this. Would you like to tell me more about what's going on?"
  };

  return fallbacks[intentName] || fallbacks['default'];
}

/**
 * Check if an intent should use LLM responses (non-crisis intents)
 */
export function shouldUseLLM(intentName: string): boolean {
  // Crisis intents should NOT use LLM - they need predefined safe responses
  const crisisIntents = [
    'crisis',
    'crisis.self-harm',
    'crisis.suicidal',
    'crisis.emergency',
    'self-harm',
    'suicidal',
    'emergency'
  ];

  const lowerIntent = intentName.toLowerCase();
  return !crisisIntents.some(crisis => lowerIntent.includes(crisis));
}

export { INTENT_GUIDANCE };
