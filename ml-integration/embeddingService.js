const GEMINI_EMBED_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';

// Thin wrapper around Gemini's embedding endpoint. Separate provider
// from llmClient.js on purpose — Groq (used for chat) doesn't offer
// a public embeddings API, so this one piece has to live elsewhere.
async function embedText(text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set. Check your .env file.');
  }

  const response = await fetch(GEMINI_EMBED_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'models/gemini-embedding-001',
      content: { parts: [{ text }] },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini embeddings error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.embedding.values;
}

module.exports = { embedText };
