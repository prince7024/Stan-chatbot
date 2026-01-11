import axios from "axios";

const EMBED_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent";

export async function getEmbedding(text) {
  const response = await axios.post(
    `${EMBED_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      content: {
        parts: [{ text }]
      }
    }
  );

  return response.data.embedding.values;
}
