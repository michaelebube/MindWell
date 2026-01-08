import { getFirestore } from "firebase-admin/firestore";

// Admin SDK must be initialized once in `index.ts` before using services.
// Delay obtaining Firestore until function runtime to avoid import-time access
// before `initializeApp()` has been called.

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export async function getRecentMessagesForLLM(
  chatId: string,
  limit = 6
): Promise<ChatMessage[]> {
  // Get Firestore instance at runtime (after initializeApp() in index.ts)
  const db = getFirestore();

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
