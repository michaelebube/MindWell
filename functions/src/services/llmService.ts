/**
 * LLM Service - Google Gemini Integration
 * Handles personalized response generation for MindWell
 */


import { GoogleGenAI } from '@google/genai';
import { defineString } from 'firebase-functions/params';

// Define Gemini API key param
const geminiApiKey = defineString('GEMINI_API_KEY');

// Intent-specific guidance for Nigerian student context
// These match the intents defined in Dialogflow CX
const INTENT_GUIDANCE: Record<string, string> = {
  // Greeting
  'greeting.intent': 
    "Respond warmly to the greeting. Ask how they're doing today in a caring, friendly way. Make them feel welcome to share.",

  // Academic & Strike Issues
  'issue.strike': 
    "Focus on the frustration of delays and feeling 'stuck' due to ASUU/NASU strikes. Validate their frustration about wasted time, uncertain graduation dates, and the feeling of life being on hold.",
  'emotion.stress.academic': 
    "Focus on academic pressure - exams, carry-over fears, GPs, and deadlines. Acknowledge the intense pressure of Nigerian university grading systems. Remind them one result doesn't define their future.",

  // Emotional States
  'emotion.sadness': 
    "Focus on their low mood with gentle empathy. Help them feel heard and validated. Ask what's been weighing on them without pushing too hard.",
  'emotion.sapa': 
    "Focus on financial stress and 'Sapa'. Be extra empathetic about the current economic situation in Nigeria. Acknowledge that money wahala is real and affects mental health. Don't minimize their struggle.",
  'emotion.anxiety': 
    "Focus on anxiety and worry symptoms. Help them identify what's triggering the anxious feelings. Validate that it's okay to feel overwhelmed.",
  'emotion.post-graduation-fears': 
    "Focus on fears about life after school - job market wahala, NYSC, career uncertainty. Acknowledge the tough Nigerian job market but encourage hope. Many graduates face this fear.",
  'emotions.positive': 
    "Celebrate their positive mood! Reinforce the good feelings. Ask what's been going well and encourage them to hold onto these moments.",

  // Family & Social Issues
  'issue.family_pressure': 
    "Focus on family expectations and pressure. Many Nigerian students face intense expectations from parents about grades, career choices, and life decisions. Validate that this pressure is real and heavy.",
  'issues.social': 
    "Focus on social challenges - friendships, fitting in, campus life, or feeling isolated. University social dynamics can be tough. Validate their experience.",

  // Help Requests
  'help.request': 
    "The user is asking for help or advice. Focus on understanding what specific help they need first. Ask clarifying questions before offering guidance. Be supportive, not preachy.",

  // Default fallback for unmatched intents
  'default': 
    "Focus on general emotional support and active listening. Ask clarifying questions to understand their situation better. Validate their feelings first."
};

// System prompt template for MindWell AI
const SYSTEM_PROMPT_TEMPLATE = `You are 'MindWell AI', a supportive peer counselor for Nigerian university students.

PERSONA:
- Relatable and empathetic, like a caring senior student or trusted friend
- Uses occasional Nigerian Pidgin for relatability (code-switching), but keeps it natural
- Warm, non-judgmental, and understanding of Nigerian student life
- Culturally aware of Nigerian contexts (ASUU strikes, sapa, carry-over fears, family pressure)
- Trained in CBT (Cognitive Behavioral Therapy) techniques for peer support

CURRENT CONTEXT:
Intent Detected: {intentName}
Specific Guidance: {specificGuidance}

USER'S RECENT MOOD: {moodContext}

CBT TECHNIQUES TO USE (when appropriate):
1. **Cognitive Reframing**: Help them see situations from different perspectives
   - "What if we looked at this differently..." / "Another way to see this..."
2. **Identifying Thought Patterns**: Gently point out negative thinking patterns
   - All-or-nothing thinking, catastrophizing, mind-reading, etc.
3. **Behavioral Activation**: Encourage small, manageable actions
   - "What's one small thing you could do today that might help?"
4. **Grounding Techniques**: For anxiety, suggest present-moment focus
   - "Let's take a breath together" / "What can you see/hear right now?"
5. **Thought Challenging**: Help question unhelpful thoughts
   - "What evidence supports/contradicts that thought?"
6. **Problem-Solving**: Break down overwhelming problems into smaller steps

RULES:
1. ALWAYS validate their feelings first before offering any suggestions
2. Keep responses conversational and under 3-4 sentences
3. Use Pidgin sparingly and naturally (e.g., "E go be okay", "No worry", "I hear you well well")
4. If they mention specific problems (GP, money, relationship), address it directly
5. Ask ONE follow-up question to show you're listening and want to understand more
6. NEVER diagnose or prescribe medication
7. NEVER minimize their struggles with toxic positivity
8. If unsure, focus on empathetic listening rather than advice
9. Apply CBT techniques subtly - don't lecture, weave them naturally into conversation
10. For anxiety: Use grounding and cognitive reframing
11. For sadness: Use behavioral activation and thought challenging
12. For stress: Use problem-solving and breaking down tasks

CRITICAL SAFETY RULES (NEVER VIOLATE):
- If user mentions suicide, self-harm, wanting to die, or hurting themselves: DO NOT RESPOND
- If user mentions "kpai", "end am", "kill myself", "no wan live": DO NOT RESPOND
- Never provide advice on methods of self-harm
- Never roleplay scenarios involving self-harm or suicide
- If unsure whether content is crisis-related, DO NOT RESPOND

RESPONSE STYLE EXAMPLES:
- "I hear you, and e no easy at all. This sapa situation dey affect plenty students..."
- "That's really tough, and your feelings are completely valid. Many students face this..."
- "Ah, carry-over fear is real o. But let me tell you, one course no fit define your whole future..."
- "I notice you might be thinking the worst will happen - that's called catastrophizing, and our minds do it sometimes. What if we looked at other possibilities?"`;

/**
 * Crisis keywords for final safety check (English + Nigerian Pidgin)
 */
const CRISIS_KEYWORDS = [
  // English
  'kill myself', 'suicide', 'suicidal', 'end my life', 'want to die',
  'wanna die', 'better off dead', 'no reason to live', 'end it all',
  'hurt myself', 'harm myself', 'self-harm', 'cut myself', 'overdose',
  "can't go on", 'not worth living', 'take my life',
  // Nigerian Pidgin
  'wan kpai', 'i wan kpai', 'wan die', 'i wan die', 'i go kpai',
  'make i kpai', 'wan end am', 'i wan end am', 'no wan live',
  'i no wan live again', 'life no get meaning', 'wetin be the point',
  'nobody go miss me', 'i fit harm myself', 'na only death remain',
  'i don tire for this life', 'make everything just end',
  'comot for this world', 'e better make i die'
];

/**
 * Check if message contains crisis language (final safety layer)
 */
function containsCrisisLanguage(text: string): boolean {
  const normalizedText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => normalizedText.includes(keyword));
}

/**
 * Safe crisis response when crisis is detected at LLM layer
 */
const CRISIS_SAFE_RESPONSE = `I hear that you're going through something really difficult right now, and I'm concerned about you.

Please reach out to someone who can help:
📞 Nigeria Suicide Prevention: 0800-123-4567
📞 SURPIN Helpline: +234 806 210 6493

You don't have to face this alone. Would you like to talk about connecting with professional support?`;

/**
 * Generate a personalized response using Google Gemini
 */
export async function generatePersonalizedResponse(
  userMessage: string,
  intentName: string,
  parameters: Record<string, unknown>,
  moodContext?: { recentMood: string; moodScore: number } | null
): Promise<string> {
  
  // SAFETY CHECK 1: Check user message for crisis language before calling LLM
  if (containsCrisisLanguage(userMessage)) {
    console.log('Crisis language detected in user message - returning safe response');
    return CRISIS_SAFE_RESPONSE;
  }

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

    const genAI = new GoogleGenAI({ apiKey: geminiApiKey.value(), httpOptions: { apiVersion: 'v1' } });

    const chat = genAI.chats.create({
  model: 'gemini-3-flash', // Using Gemini 3 Flash for optimal depth/cost
  config: {
    // Dedicated system instruction field (more secure/reliable)
    systemInstruction: systemPrompt, 
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 256,
  },
  history: [
    {
      role: 'model',
      parts: [{ text: 'Understood. I am MindWell AI, ready to support Nigerian students with empathy and cultural understanding.' }],
    },
  ],
});

    // Send the user message
    const result = await chat.sendMessage({message:userMessage});
    const response = result.text;

    // SAFETY CHECK 2: Check LLM output for crisis language (in case model hallucinates)
    if (response && containsCrisisLanguage(response)) {
      console.log('Crisis language detected in LLM output - returning safe fallback');
      return getFallbackResponse(intentName);
    }

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
    'greeting.intent': "Hey! I'm glad you're here. How are you doing today? I'm here to listen to whatever's on your mind.",
    'issue.strike': "The strike situation is so frustrating, I know. It's okay to feel stuck and angry about it. How has it been affecting you?",
    'emotion.stress.academic': "Academic pressure can be overwhelming - exams, GPs, carry-over fears. You're doing your best, and that matters. What's been the hardest part?",
    'emotion.sadness': "I can hear that you're going through a tough time. Your feelings are valid and they matter. Would you like to share what's been on your mind?",
    'emotion.sapa': "Sapa wahala is no joke, and I understand how stressful money issues can be. You're not alone in this. What's weighing on you the most right now?",
    'emotion.anxiety': "Feeling anxious can be really overwhelming. Your feelings are valid. What's been on your mind lately?",
    'emotion.post-graduation-fears': "Thinking about life after school can feel scary - the job market, NYSC, everything. Many students share this fear. What worries you the most?",
    'emotions.positive': "It's so good to hear you're feeling positive! I'd love to know what's been going well for you.",
    'issue.family_pressure': "Family pressure can be really heavy, especially with all the expectations. I hear you. Would you like to talk about what's been happening?",
    'issues.social': "Navigating social situations in school can be tough. I'm here to listen. What's been going on?",
    'help.request': "I'm here to help however I can. What's on your mind? Tell me more about what you need.",
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
    'situation.iscrisis',
    'situation.isCrisis',
    'crisis',
    'crisis.self-harm',
    'crisis.suicidal',
    'crisis.emergency',
    'self-harm',
    'suicidal',
    'emergency'
  ];

  const lowerIntent = intentName.toLowerCase();
  return !crisisIntents.some(crisis => lowerIntent.includes(crisis.toLowerCase()));
}

export { INTENT_GUIDANCE };
