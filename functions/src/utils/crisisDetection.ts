/**
 * Crisis Detection Utility
 * Hybrid approach: keyword matching + LLM-ready context for Nigerian Pidgin support
 */

// Common crisis keywords and phrases in English and Nigerian Pidgin
export const CRISIS_KEYWORDS = {
  // Self-harm / Suicidal ideation - English
  english: [
    'kill myself',
    'end my life',
    'want to die',
    'suicide',
    'self-harm',
    'hurt myself',
    'no reason to live',
    'better off dead',
    'can\'t go on',
    'ending it all',
    'take my life',
    'overdose',
    'cut myself',
  ],
  
  // Nigerian Pidgin variants
  pidgin: [
    'i wan kpai',
    'i wan die',
    'i wan end am',
    'i no wan live again',
    'i go kpai myself',
    'make i just kpai',
    'life no get meaning',
    'everything don spoil',
    'i fit harm myself',
    'na only death remain',
    'nobody go miss me',
    'i don tire for this life',
    'wetin be the point',
    'i wan comot for this world',
    'make i just end am',
    'i no fit continue again',
    'this life no worth am',
    'i wan do myself something',
    'i dey think to harm myself',
    'e better make i die',
    'death better pass this',
    'i no wan wake up again',
    'i wan sleep forever',
    'make everything just end',
    'i wan check out',
  ],
  
  // Hopelessness indicators (both languages)
  hopelessness: [
    'no hope',
    'hopeless',
    'pointless',
    'nothing matters',
    'no future',
    'worthless',
    'burden',
    'nobody cares',
    'alone',
    'no one loves me',
    // Pidgin
    'no hope for me',
    'nothing dey work',
    'nobody love me',
    'i be burden',
    'person no dey for me',
    'i dey alone',
  ],
};

// All keywords flattened for quick lookup
const ALL_CRISIS_KEYWORDS = [
  ...CRISIS_KEYWORDS.english,
  ...CRISIS_KEYWORDS.pidgin,
  ...CRISIS_KEYWORDS.hopelessness,
];

/**
 * Quick keyword-based crisis detection
 * First layer of hybrid approach - fast pattern matching
 */
export function detectCrisisKeywords(message: string): {
  isCrisis: boolean;
  matchedKeywords: string[];
  confidence: 'high' | 'medium' | 'low';
} {
  const normalizedMessage = message.toLowerCase().trim();
  const matchedKeywords: string[] = [];
  
  for (const keyword of ALL_CRISIS_KEYWORDS) {
    if (normalizedMessage.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  }
  
  // Determine confidence based on matches
  let confidence: 'high' | 'medium' | 'low' = 'low';
  
  if (matchedKeywords.length >= 2) {
    confidence = 'high';
  } else if (matchedKeywords.length === 1) {
    // Check if it's a strong indicator
    const strongIndicators = [
      'kill myself', 'suicide', 'i wan kpai', 'i wan die',
      'end my life', 'i wan end am', 'hurt myself', 'harm myself',
    ];
    const hasStrongMatch = matchedKeywords.some(k => 
      strongIndicators.some(s => k.toLowerCase().includes(s))
    );
    confidence = hasStrongMatch ? 'high' : 'medium';
  }
  
  return {
    isCrisis: matchedKeywords.length > 0,
    matchedKeywords,
    confidence,
  };
}

/**
 * Build context prompt for LLM crisis analysis
 * Second layer - for when keyword detection is uncertain
 */
export function buildCrisisAnalysisPrompt(message: string): string {
  return `Analyze the following message for crisis indicators. The user may write in Nigerian Pidgin English, Standard English, or a mix of both (code-switching).

Look for expressions of:
- Self-harm or suicidal ideation
- Severe hopelessness or despair
- Intent to hurt oneself
- Feeling like a burden to others
- Expressing that life has no meaning

Nigerian Pidgin examples of crisis language:
- "I wan kpai" (I want to die)
- "I wan end am" (I want to end it)
- "Life no get meaning" (Life has no meaning)
- "I don tire for this life" (I'm tired of this life)
- "Nobody go miss me" (Nobody will miss me)

User message: "${message}"

Respond with JSON only:
{
  "isCrisis": boolean,
  "confidence": number (0-1),
  "reason": "brief explanation"
}`;
}

/**
 * Crisis response messages (can be customized per intent in Dialogflow)
 */
export const CRISIS_RESPONSES = {
  immediate: `I'm really concerned about what you've shared. Your feelings are valid, and I want you to know that help is available right now.

🆘 **Immediate Support:**
- Nigeria Suicide Prevention: 0800-SUICIDE (0800-784-2433)
- Mental Health Helpline: 09030000741

Would you like me to help you connect with someone who can provide immediate support?`,
  
  pidgin: `I hear you, and wetin you dey feel matter well well. Abeg, make you no carry this load alone.

🆘 **Help Dey Available:**
- Nigeria Suicide Prevention: 0800-SUICIDE (0800-784-2433)
- Mental Health Helpline: 09030000741

You fit talk to person wey go understand. You wan make I help you connect?`,

  followUp: `I'm here with you. Remember, reaching out for help is a sign of strength, not weakness. Would you like to talk more about what you're going through?`,
};

/**
 * Get appropriate crisis response based on message language
 */
export function getCrisisResponse(message: string): string {
  const hasPidgin = CRISIS_KEYWORDS.pidgin.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  return hasPidgin ? CRISIS_RESPONSES.pidgin : CRISIS_RESPONSES.immediate;
}
