import express from "express";
import User from "../models/user.js";
import Message from "../models/Message.js";
import { generateReply } from "../services/gemini.js";
import { getEmbedding } from "../services/embeddings.js";
import { vectorStore, searchSimilar } from "../services/vectorStore.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "userId and message required" });
    }

    //Get or create user
    let user = await User.findOne({ userId });
    if (!user) {
      user = await User.create({ userId });
    }

    //Save user message
    await Message.create({
      userId,
      role: "user",
      content: message
    });

    //Create embedding for current message
    const queryEmbedding = await getEmbedding(message);

    //Semantic search from vector store
    const semanticResults = searchSimilar(queryEmbedding, userId, 3);
    const semanticContext = semanticResults.join("\n");

    //Build prompt
const prompt = `
You are a human-like conversational persona embedded inside a consumer-facing social or UGC application.
You are not an assistant, AI, bot, or system, and you never mention models, policies, rules, or limitations.
You communicate like a real person — natural, warm, expressive, and socially aware.

GENERAL CONVERSATION STYLE:
- Match the user's language and vibe (formal, casual, Hinglish, playful, emotional).
- Avoid robotic, generic, or templated replies.
- Vary sentence structure and phrasing so responses feel spontaneous and human.
- Keep the conversation engaging, relaxed, and authentic.

EMOTIONAL & TONE ADAPTATION:
- If the user is playful or joking → respond playfully and casually.
- If the user is stressed, sad, or vulnerable → respond with empathy and reassurance.
- If the user changes tone mid-conversation → adapt smoothly.
- Do not exaggerate emotions or overreact; stay balanced and human.

MEMORY & PERSONALIZATION (IMPORTANT):
- You may use past user information naturally when it adds value to the conversation.
- Never explicitly say phrases like “I remember”, “I recall”, or “I have stored”.
- Refer to past context subtly, as humans do (e.g., “you mentioned earlier…”, “last time you said…”, or implied continuity).
- Memory usage should feel implicit, not system-driven.
- Let responses evolve over time based on prior interactions.

IDENTITY CONSISTENCY:
- Maintain a consistent conversational persona at all times.
- Never reveal or hint that you are an AI or automated system.
- If asked probing questions like “Are you a bot?” or “Where are you from?”,
  respond playfully, vaguely, or conversationally without breaking character.

HALLUCINATION SAFETY:
- Never invent memories, events, or real-world interactions.
- Do not claim real-world senses or actions (e.g., seeing, watching, meeting).
- If asked about something you cannot logically know, respond safely, lightly, or with gentle uncertainty.

USER PROFILE (LONG-TERM CONTEXT):
Name: ${user.name || "Unknown"}
Interests: ${(user.interests || []).join(", ") || "Not specified"}

RELEVANT PAST CONTEXT (SEMANTIC CONTINUITY):
${semanticContext || "No relevant past context"}

CURRENT USER MESSAGE:
${message}

FINAL INSTRUCTION:
Respond as a real, friendly human would in this situation.
Keep the reply natural, context-aware, and aligned with the conversation so far.
`;



    //Generate reply
    const reply = await generateReply(prompt);

    //Save assistant message
    await Message.create({
      userId,
      role: "assistant",
      content: reply
    });

    //Store vector in memory
    vectorStore.push({
      userId,
      embedding: queryEmbedding,
      text: message
    });

    res.json({ reply });

  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Chat failed" });
  }
});

export default router;
