const { callLLM } = require('../ml-integration/llmClient');

const SYSTEM_PROMPT = `You are a log analysis agent for a DevOps incident triage system.
Given an error title and a raw error log, extract structured information.

Respond with ONLY a JSON object, no markdown formatting, no explanation, in this exact shape:
{
  "errorType": string,
  "message": string,
  "file": string,
  "line": number,
  "functionName": string,
  "severity": "low" | "medium" | "high",
  "searchQuery": string
}

"searchQuery" should be a short string of keywords useful for searching a codebase to find the relevant function.`;

const REQUIRED_FIELDS = [
  'errorType', 'message', 'file', 'line', 'functionName', 'severity', 'searchQuery',
];

// LLMs sometimes wrap JSON in markdown fences even when told not to —
// strip that before parsing instead of letting JSON.parse fail on it.
function extractJson(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(cleaned);
}

async function analyzeLog(incident) {
  const { title, log } = incident;

  if (!title || !log) {
    throw new Error('analyzeLog requires both title and log');
  }

  const userPrompt = `Title: ${title}\n\nLog:\n${log}`;

  const raw = await callLLM([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch (err) {
    throw new Error(`Log Analyzer returned invalid JSON: ${raw}`);
  }

  const missing = REQUIRED_FIELDS.filter((field) => !(field in parsed));
  if (missing.length > 0) {
    throw new Error(`Log Analyzer response missing fields: ${missing.join(', ')}`);
  }

  return parsed;
}

module.exports = { analyzeLog };
