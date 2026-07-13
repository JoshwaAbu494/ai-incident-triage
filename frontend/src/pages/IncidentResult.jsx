const MOCK_RESULT = {
  logAnalysis: {
    errorType: 'TypeError',
    message: "Cannot read properties of undefined (reading 'name')",
    file: 'src/services/userService.js',
    functionName: 'getUserProfile',
    line: 19,
    severity: 'high',
  },
  ragAnalysis: {
    rootCause: 'The database query can return undefined, but the code accesses user.name without checking whether user exists.',
    confidence: 0.9,
  },
  fixSuggestion: {
    originalCode: 'return user.name;',
    suggestedCode: 'return user?.name ?? null;',
    explanation: 'Added a null check before accessing user.name.',
    testSuggestion: 'Call getUserProfile with a non-existent user ID and verify it returns null instead of throwing.',
  },
};

function IncidentResult() {
  const { logAnalysis, ragAnalysis, fixSuggestion } = MOCK_RESULT;

  return (
    <div className="page">
      <h1>Incident Result</h1>

      <section className="card">
        <h2>Incident Summary</h2>
        <p><strong>Error Type:</strong> {logAnalysis.errorType}</p>
        <p><strong>Severity:</strong> {logAnalysis.severity}</p>
      </section>

      <section className="card">
        <h2>Log Analysis</h2>
        <p><strong>File:</strong> {logAnalysis.file}</p>
        <p><strong>Function:</strong> {logAnalysis.functionName}</p>
        <p><strong>Line:</strong> {logAnalysis.line}</p>
      </section>

      <section className="card">
        <h2>Root Cause Analysis</h2>
        <p>{ragAnalysis.rootCause}</p>
        <p><strong>Confidence:</strong> {Math.round(ragAnalysis.confidence * 100)}%</p>
      </section>

      <section className="card">
        <h2>Suggested Fix</h2>
        <p><strong>Original:</strong></p>
        <pre>{fixSuggestion.originalCode}</pre>
        <p><strong>Suggested:</strong></p>
        <pre>{fixSuggestion.suggestedCode}</pre>
        <p><strong>Explanation:</strong> {fixSuggestion.explanation}</p>
      </section>

      <section className="card">
        <h2>Test Suggestion</h2>
        <p>{fixSuggestion.testSuggestion}</p>
      </section>

      <p className="note">Real data connects in Phase 11.</p>
    </div>
  );
}

export default IncidentResult;
