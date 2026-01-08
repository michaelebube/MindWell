"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentMessagesForLLM = getRecentMessagesForLLM;
const firestore_1 = require("firebase-admin/firestore");
async function getRecentMessagesForLLM(chatId, limit = 6) {
    // Get Firestore instance at runtime (after initializeApp() in index.ts)
    const db = (0, firestore_1.getFirestore)();
    const snapshot = await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .limit(limit)
        .get();
    return snapshot.docs
        .map(doc => doc.data())
        .reverse()
        .map(data => ({
        role: data.role === "assistant" ? "model" : "user",
        text: data.content,
    }));
}
//# sourceMappingURL=chatHistory.js.map