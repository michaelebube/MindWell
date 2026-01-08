"use strict";
/**
 * Dialogflow CX Service
 * Handles communication with Dialogflow CX for intent detection and fulfillment
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectIntent = detectIntent;
exports.sendEvent = sendEvent;
const dialogflow_cx_1 = require("@google-cloud/dialogflow-cx");
const params_1 = require("firebase-functions/params");
// Define config params (set via firebase functions:config:set or .env)
const dialogflowProjectId = (0, params_1.defineString)('DIALOGFLOW_PROJECT_ID');
const dialogflowLocation = (0, params_1.defineString)('DIALOGFLOW_LOCATION', { default: 'us-central1' });
const dialogflowAgentId = (0, params_1.defineString)('DIALOGFLOW_AGENT_ID');
const dialogflowLanguageCode = (0, params_1.defineString)('DIALOGFLOW_LANGUAGE_CODE', { default: 'en' });
/**
 * Detect intent from user message using Dialogflow CX
 */
async function detectIntent(message, sessionId, chatId) {
    const projectId = dialogflowProjectId.value();
    const location = dialogflowLocation.value();
    const agentId = dialogflowAgentId.value();
    const languageCode = dialogflowLanguageCode.value();
    // Create sessions client
    const client = new dialogflow_cx_1.SessionsClient({
        apiEndpoint: `${location}-dialogflow.googleapis.com`,
    });
    // Build session path
    const sessionPath = client.projectLocationAgentSessionPath(projectId, location, agentId, sessionId);
    // Build the request
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
            },
            languageCode,
        },
        queryParams: {
            parameters: {
                fields: {
                    chatId: {
                        stringValue: chatId,
                    }
                }
            }
        }
    };
    try {
        // Send request to Dialogflow CX
        console.log('Dialogflow detectIntent request:', JSON.stringify(request));
        const [response] = await client.detectIntent(request);
        console.log('Dialogflow raw response received');
        try {
            console.log(JSON.stringify(response, null, 2));
        }
        catch (e) {
            console.log('Could not stringify full response for logging', e);
        }
        const queryResult = response.queryResult;
        console.log('Dialogflow CX queryResult is working');
        if (!queryResult) {
            throw new Error('No query result from Dialogflow');
        }
        // Extract response text from fulfillment messages
        let responseText = '';
        if (queryResult.responseMessages && queryResult.responseMessages.length > 0) {
            for (const message of queryResult.responseMessages) {
                if (message.text && message.text.text) {
                    responseText += message.text.text.join('\n');
                }
            }
        }
        // Check if this is a fallback/no-match intent
        const isFallback = queryResult.match?.matchType === 'NO_MATCH' ||
            queryResult.intent?.displayName?.toLowerCase().includes('fallback') ||
            false;
        // Check for crisis intent (you'll define this in Dialogflow CX)
        const isCrisis = queryResult.intent?.displayName?.toLowerCase().includes('crisis') ||
            queryResult.intent?.displayName?.toLowerCase().includes('emergency') ||
            queryResult.intent?.displayName?.toLowerCase().includes('self-harm') ||
            false;
        // Extract intent confidence
        const confidence = queryResult.match?.confidence || 0;
        // Extract parameters
        const parameters = {};
        if (queryResult.parameters?.fields) {
            for (const [key, value] of Object.entries(queryResult.parameters.fields)) {
                parameters[key] = value;
            }
        }
        return {
            responseText: responseText || "I'm here to listen. Could you tell me more?",
            intent: queryResult.intent?.displayName || 'unknown',
            confidence,
            isFallback,
            parameters,
            isCrisis,
        };
    }
    catch (error) {
        console.error('Dialogflow CX error:', error);
        throw error;
    }
}
/**
 * Send an event to Dialogflow CX (useful for triggering specific flows)
 */
async function sendEvent(eventName, sessionId, parameters) {
    const projectId = dialogflowProjectId.value();
    const location = dialogflowLocation.value();
    const agentId = dialogflowAgentId.value();
    const languageCode = dialogflowLanguageCode.value();
    const client = new dialogflow_cx_1.SessionsClient({
        apiEndpoint: `${location}-dialogflow.googleapis.com`,
    });
    const sessionPath = client.projectLocationAgentSessionPath(projectId, location, agentId, sessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                event: eventName,
            },
            languageCode,
        },
    };
    try {
        const [response] = await client.detectIntent(request);
        const queryResult = response.queryResult;
        let responseText = '';
        if (queryResult?.responseMessages) {
            for (const message of queryResult.responseMessages) {
                if (message.text?.text) {
                    responseText += message.text.text.join('\n');
                }
            }
        }
        return {
            responseText,
            intent: queryResult?.intent?.displayName || eventName,
            confidence: 1.0,
            isFallback: false,
            isCrisis: false,
            parameters: parameters || {},
        };
    }
    catch (error) {
        console.error('Dialogflow CX event error:', error);
        throw error;
    }
}
//# sourceMappingURL=dialogflowService.js.map