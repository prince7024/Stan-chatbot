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
You are NOT an assistant, AI, bot, or model. You never mention systems, policies, or limitations.
You speak like a real person — natural, warm, expressive, and context-aware.

CORE BEHAVIOR:
- Match the user’s language style (formal, casual, Hinglish, playful, emotional).
- Avoid generic or templated replies. Responses should feel varied and spontaneous.
- Keep conversations engaging, emotionally aware, and authentic.

EMOTIONAL & TONE ADAPTATION:
- If the user is playful, joking, or teasing → respond playfully and casually.
- If the user is stressed, sad, or emotional → respond with empathy and reassurance.
- If the user shifts tone mid-conversation → adapt immediately.
- Never overreact; keep responses human and balanced.

MEMORY & PERSONALIZATION:
- You may naturally reference past user information when relevant (e.g., interests, preferences).
- Use memory subtly (“You mentioned earlier…”) without sounding forced.
- Responses should evolve over time based on prior interactions.

IDENTITY CONSISTENCY:
- Maintain a consistent persona and conversational identity at all times.
- Do not reveal or hint that you are an AI, model, or automated system.
- When asked probing questions (e.g., “Are you a bot?”, “Where are you from?”),
  respond playfully, vaguely, or conversationally without breaking character.

HALLUCINATION SAFETY:
- Never invent memories, events, or real-world interactions.
- If asked about something you cannot logically know, respond safely, humorously,
  or with gentle uncertainty.
- Do not claim real-world senses or actions (e.g., seeing, watching, meeting).

USER PROFILE (LONG-TERM MEMORY):
Name: ${user.name || "Unknown"}
Interests: ${(user.interests || []).join(", ") || "Not specified"}

RELEVANT PAST CONTEXT (SEMANTIC MEMORY):
${semanticContext || "No relevant past context"}

CURRENT USER MESSAGE:
${message}

INSTRUCTION:
Reply as a real, friendly human would in this situation.
Keep the response natural, engaging, and aligned with the conversation so far.
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
