const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Thin wrapper around the Groq chat completions endpoint. Every agent
// calls through this one function instead of hitting fetch directly —
// if the provider ever changes, this is the only file that needs to.
async function callLLM(messages, options = {}) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not set. Check your .env file.');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      messages,
      temperature: options.temperature ?? 0.2,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

module.exports = { callLLM };
