const { retrieveCode } = require('../ml-integration/retrieveCode');
const { callLLM } = require('../ml-integration/llmClient');

const SYSTEM_PROMPT = `You are a root-cause analysis agent for a DevOps incident triage system.
You are given error information from a log analyzer, plus several candidate code chunks
retrieved from the codebase via semantic search. Determine which chunk is the actual root cause.

Respond with ONLY a JSON object, no markdown, no explanation, in this exact shape:
{
  "rootCause": string,
  "confidence": number,
  "affectedFile": string,
  "relevantCode": string,
  "suggestedAction": string
}

"confidence" is a number between 0 and 1. "relevantCode" should be the exact code snippet
you identified as responsible. If none of the candidates look responsible, say so in
"rootCause" and set "confidence" low.`;

const REQUIRED_FIELDS = ['rootCause', 'confidence', 'affectedFile', 'relevantCode', 'suggestedAction'];

function extractJson(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(cleaned);
}

async function analyzeCodebase(logAnalysis) {
  const { errorType, message, file, functionName, searchQuery } = logAnalysis;

  if (!searchQuery) {
    throw new Error('analyzeCodebase requires searchQuery from Agent 1 output');
  }

  const candidates = await retrieveCode(searchQuery, 5);

  const candidateBlock = candidates
    .map((c, i) => `--- Candidate ${i + 1} (${c.file}:${c.startLine}, similarity ${c.score.toFixed(3)}) ---\n${c.text}`)
    .join('\n\n');

  const userPrompt = `Error type: ${errorType}
Message: ${message}
File from stack trace: ${file}
Function from stack trace: ${functionName}

Candidate code chunks retrieved via semantic search:

${candidateBlock}`;

  const raw = await callLLM([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch (err) {
    throw new Error(`Codebase RAG Analyzer returned invalid JSON: ${raw}`);
  }

  const missing = REQUIRED_FIELDS.filter((f) => !(f in parsed));
  if (missing.length > 0) {
    throw new Error(`Codebase RAG Analyzer response missing fields: ${missing.join(', ')}`);
  }

  return parsed;
}

module.exports = { analyzeCodebase };
