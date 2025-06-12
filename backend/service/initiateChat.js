import { GoogleGenAI } from '@google/genai';
import { v4 } from 'uuid';
export const genAI = new GoogleGenAI({ apiKey: "AIzaSyAIq7WN9y2Pa4jRNbiHMm33hg0xHB682sc" });
const activeSessionStorage = new Map(); // In-memory storage for active sessions
export const refinementProgressDetails = new Map(); // In-memory storage for refinement progress details


export async function getOrCreateChat(sessionId, session) {
    if (session == "OLD") {
        const chat = await activeSessionStorage.get(sessionId);
        return chat;
    } else {
        // If no session, create a new chat
        const newSession = genAI.chats.create({
            model: "gemini-2.5-flash-preview-05-20"
        })
        activeSessionStorage.set(sessionId, newSession)
        return newSession;
    }
}