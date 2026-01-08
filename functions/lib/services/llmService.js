"use strict";
/**
 * LLM Service - Google Gemini Integration
 * Handles personalized response generation for MindWell
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTENT_GUIDANCE = void 0;
exports.generatePersonalizedResponse = generatePersonalizedResponse;
exports.shouldUseLLM = shouldUseLLM;
const genai_1 = require("@google/genai");
const params_1 = require("firebase-functions/params");
const params_2 = require("firebase-functions/params");
const chatHistory_1 = require("../chatHistory");
// Define Gemini API key param
const geminiApiKey = (0, params_1.defineString)('GEMINI_API_KEY');
const SYSTEM_PROMPT_SECRET = (0, params_2.defineSecret)('SYSTEM_PROMPT');
// Fallback system prompt: prefer environment variable set in Cloud Run or
// the SECRET `SYSTEM_PROMPT` defined via `defineSecret` above.
const SYSTEM_PROMPT_FALLBACK = process.env.SYSTEM_PROMPT || process.env.CHATBOT_SYSTEM_PROMPT || '';
async function getSystemPrompt() {
    try {
        // in deployed function, use secret.value()
        const secretVal = SYSTEM_PROMPT_SECRET?.value?.();
        if (secretVal)
            return secretVal;
    }
    catch (e) {
        // ignore - will use fallback
    }
    return SYSTEM_PROMPT_FALLBACK;
}
// Intent-specific guidance for Nigerian student context
const INTENT_GUIDANCE = {
    'greeting.intent': "Respond warmly to the greeting. Ask how they're doing today in a caring, friendly way. Make them feel welcome to share.",
    'issue.strike': "Focus on the frustration of delays and feeling 'stuck' due to ASUU/NASU strikes. Validate their frustration about wasted time, uncertain graduation dates, and the feeling of life being on hold.",
    'emotion.stress.academic': "Focus on academic pressure - exams, carry-over fears, GPs, and deadlines. Acknowledge the intense pressure of Nigerian university grading systems. Remind them one result doesn't define their future.",
    'emotion.sadness': "Focus on their low mood with gentle empathy. Help them feel heard and validated. Ask what's been weighing on them without pushing too hard.",
    'emotion.sapa': "Focus on financial stress and 'Sapa'. Be extra empathetic about the current economic situation in Nigeria. Acknowledge that money wahala is real and affects mental health. Don't minimize their struggle.",
    'emotion.anxiety': "Focus on anxiety and worry symptoms. Help them identify what's triggering the anxious feelings. Validate that it's okay to feel overwhelmed.",
    'emotion.post-graduation-fears': "Focus on fears about life after school - job market wahala, NYSC, career uncertainty. Acknowledge the tough Nigerian job market but encourage hope. Many graduates face this fear.",
    'emotions.positive': "Celebrate their positive mood! Reinforce the good feelings. Ask what's been going well and encourage them to hold onto these moments.",
    'issue.family_pressure': "Focus on family expectations and pressure. Many Nigerian students face intense expectations from parents about grades, career choices, and life decisions. Validate that this pressure is real and heavy.",
    'issues.social': "Focus on social challenges - friendships, fitting in, campus life, or feeling isolated. University social dynamics can be tough. Validate their experience.",
    'help.request': "The user is asking for help or advice. Focus on understanding what specific help they need first. Ask clarifying questions before offering guidance. Be supportive, not preachy.",
    'default': "Focus on general emotional support and active listening. Ask clarifying questions to understand their situation better. Validate their feelings first."
};
exports.INTENT_GUIDANCE = INTENT_GUIDANCE;
// Crisis keywords
const CRISIS_KEYWORDS = [
    'kill myself', 'suicide', 'suicidal', 'end my life', 'want to die',
    'wanna die', 'better off dead', 'no reason to live', 'end it all',
    'hurt myself', 'harm myself', 'self-harm', 'cut myself', 'overdose',
    "can't go on", 'not worth living', 'take my life',
    'wan kpai', 'i wan kpai', 'wan die', 'i wan die', 'i go kpai',
    'make i kpai', 'wan end am', 'i wan end am', 'no wan live',
    'i no wan live again', 'life no get meaning', 'wetin be the point',
    'nobody go miss me', 'i fit harm myself', 'na only death remain',
    'i don tire for this life', 'make everything just end',
    'comot for this world', 'e better make i die'
];
const CRISIS_SAFE_RESPONSE = `I hear that you're going through something really difficult right now, and I'm concerned about you.

Please reach out to someone who can help:
📞 Nigeria Suicide Prevention: 0800-123-4567
📞 SURPIN Helpline: +234 806 210 6493

You don't have to face this alone. Would you like to talk about connecting with professional support?`;
function containsCrisisLanguage(text) {
    const normalizedText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => normalizedText.includes(keyword));
}
function buildHistory(systemPrompt, recentMessages) {
    return [
        {
            role: 'user',
            parts: [{ text: systemPrompt }],
        },
        {
            role: 'model',
            parts: [{ text: 'Understood. I will follow all guidelines.' }],
        },
        ...recentMessages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }],
        })),
    ];
}
// Retry wrapper for Gemini calls with exponential backoff + jitter
async function callGeminiWithRetries(chat, userMessage, maxRetries = 3) {
    let attempt = 0;
    const baseDelay = 500; // ms
    while (true) {
        try {
            const result = await chat.sendMessage({ message: userMessage });
            return result;
        }
        catch (err) {
            attempt++;
            const status = err?.status || err?.statusCode || err?.code || err?.response?.status;
            // Do not retry on client errors (4xx)
            if (status && status >= 400 && status < 500)
                throw err;
            if (attempt > maxRetries)
                throw err;
            const jitter = Math.floor(Math.random() * 300);
            const delay = Math.pow(2, attempt - 1) * baseDelay + jitter;
            await new Promise((r) => setTimeout(r, delay));
        }
    }
}
/**
 * Generate a personalized response using Google Gemini
 */
async function generatePersonalizedResponse(userMessage, intentName, parameters, chatId, moodContext) {
    // SAFETY CHECK 1: Check user message for crisis language
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
    const recentMessages = await (0, chatHistory_1.getRecentMessagesForLLM)(chatId || '');
    // Build the system prompt
    const base = (await getSystemPrompt()).replace('{intentName}', intentName)
        .replace('{specificGuidance}', specificGuidance)
        .replace('{moodContext}', moodString);
    const systemPrompt = base + '\n\nBe concise: keep replies ≤ 80 words';
    try {
        // Initialize Gemini
        const genAI = new genai_1.GoogleGenAI({
            apiKey: geminiApiKey.value()
        });
        // Create chat with system instruction in the first message
        const chat = genAI.chats.create({
            model: 'gemini-2.5-flash', // Use the latest available model
            config: {
                temperature: 0.7,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 300,
            },
            // Include system prompt as the first message in history
            history: buildHistory(systemPrompt, recentMessages),
        });
        // Send the user message (with retries for transient failures)
        const result = await callGeminiWithRetries(chat, userMessage, 3);
        const response = result.text;
        // SAFETY CHECK 2: Check LLM output for crisis language
        if (response && containsCrisisLanguage(response)) {
            console.log('Crisis language detected in LLM output - returning safe fallback');
            return getFallbackResponse(intentName);
        }
        return response || getFallbackResponse(intentName);
    }
    catch (error) {
        console.error('Gemini API error:', error);
        return getFallbackResponse(intentName);
    }
}
/**
 * Get a fallback response based on intent when LLM fails
 */
function getFallbackResponse(intentName) {
    const fallbacks = {
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
function shouldUseLLM(intentName) {
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
//# sourceMappingURL=llmService.js.map