const { analyzeLog } = require('./logAnalyzer');
const { analyzeCodebase } = require('./codebaseRagAgent');
const { suggestFix } = require('./fixSuggestionAgent');

// Runs the three agents in sequence, each one's output feeding the next.
// No parallelism, no branching — deliberately simple so the flow stays
// easy to trace and explain.
async function analyzeIncident(incident) {
  const logAnalysis = await analyzeLog(incident);
  const ragAnalysis = await analyzeCodebase(logAnalysis);
  const fixSuggestion = await suggestFix(logAnalysis, ragAnalysis);

  return {
    logAnalysis,
    ragAnalysis,
    fixSuggestion,
  };
}

module.exports = { analyzeIncident };
