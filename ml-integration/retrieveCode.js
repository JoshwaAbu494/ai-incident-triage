const fs = require('fs');
const path = require('path');
const { embedText } = require('./embeddingService');

const VECTOR_STORE_PATH = path.join(__dirname, 'vector-index.json');

// Cosine similarity: how closely two vectors point in the same
// direction, regardless of their length. 1 = identical meaning,
// 0 = unrelated, -1 = opposite. Standard way to compare embeddings.
function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function retrieveCode(query, topN = 5) {
  if (!fs.existsSync(VECTOR_STORE_PATH)) {
    throw new Error('No vector index found. Run POST /api/repository/index first.');
  }

  const chunks = JSON.parse(fs.readFileSync(VECTOR_STORE_PATH, 'utf8'));
  const queryEmbedding = await embedText(query);

  const scored = chunks.map((chunk) => ({
    ...chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topN);
}

module.exports = { retrieveCode, cosineSimilarity };
