export const vectorStore = [];

// Cosine similarity
function cosineSimilarity(a, b) {
  let dot = 0;
  let magA = 0;
  let magB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

// Search similar vectors
export function searchSimilar(queryEmbedding, userId, topK = 3) {
  return vectorStore
    .filter(v => v.userId === userId)
    .map(v => ({
      text: v.text,
      score: cosineSimilarity(queryEmbedding, v.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(v => v.text);
}
