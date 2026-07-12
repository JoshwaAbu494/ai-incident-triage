const { callLLM } = require('../ml-integration/llmClient');

const SYSTEM_PROMPT = `You are a fix suggestion agent for a DevOps incident triage system.
You are given error information and a root-cause analysis. Propose a minimal code fix.

Respond with ONLY a JSON object, no markdown, no explanation, in this exact shape:
{
  "file": string,
  "explanation": string,
  "originalCode": string,
  "suggestedCode": string,
  "testSuggestion": string,
  "risk": "low" | "medium" | "high"
}

Rules:
- Suggest the SMALLEST possible change that fixes the described root cause. Do not
  rewrite the whole function or file — change only what's necessary.
- "originalCode" must be copied exactly from the relevant code you were given, not
  paraphrased or reformatted.
- "explanation" should be 1-2 plain sentences describing what changed and why.
- "testSuggestion" should describe a concrete test case someone could write, not a
  generic statement like "add more tests."
- Never claim you modified any file. You are only proposing a change for a human to review.`;

const REQUIRED_FIELDS = [
  'file', 'explanation', 'originalCode', 'suggestedCode', 'testSuggestion', 'risk',
];

function extractJson(raw) {
  const cleaned = raw.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(cleaned);
}

async function suggestFix(logAnalysis, ragAnalysis) {
  if (!ragAnalysis || !ragAnalysis.relevantCode) {
    throw new Error('suggestFix requires ragAnalysis with relevantCode from Agent 2');
  }

  const userPrompt = `Error type: ${logAnalysis.errorType}
Error message: ${logAnalysis.message}

Root cause: ${ragAnalysis.rootCause}
Affected file: ${ragAnalysis.affectedFile}

Relevant code:
${ragAnalysis.relevantCode}`;

  const raw = await callLLM([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ]);

  let parsed;
  try {
    parsed = extractJson(raw);
  } catch (err) {
    throw new Error(`Fix Suggestion Agent returned invalid JSON: ${raw}`);
  }

  const missing = REQUIRED_FIELDS.filter((f) => !(f in parsed));
  if (missing.length > 0) {
    throw new Error(`Fix Suggestion Agent response missing fields: ${missing.join(', ')}`);
  }

  return parsed;
}

module.exports = { suggestFix };
