import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

function IncidentResult() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/incidents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Incident not found');
        return res.json();
      })
      .then((data) => {
        setIncident(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="page"><h1>Incident Result</h1><p>Loading...</p></div>;
  if (error) return <div className="page"><h1>Incident Result</h1><p>Error: {error}</p></div>;
  if (incident.status === 'failed') {
    return (
      <div className="page">
        <h1>Incident Result</h1>
        <p style={{ color: 'var(--sev-high)' }}>
          Analysis failed for this incident. This usually means the error log didn't contain
          enough information for the agents to identify a root cause.
        </p>
      </div>
    );
  }
  if (incident.status === 'pending') {
    return <div className="page"><h1>Incident Result</h1><p>Analysis still in progress or failed to save. Try refreshing.</p></div>;
  }
  if (!incident.analysis) {
    return <div className="page"><h1>Incident Result</h1><p>No analysis available for this incident.</p></div>;
  }

  const { logAnalysis, ragAnalysis, fixSuggestion } = incident.analysis;
  const confidencePct = Math.round(ragAnalysis.confidence * 100);

  return (
    <div className="page">
      <h1>Incident Result</h1>

      <section className="card">
        <div className={`triage-tag severity-${logAnalysis.severity}`}>
          <span className="triage-tag-type">{logAnalysis.errorType}</span>
          <span className="triage-tag-label">{logAnalysis.severity}</span>
        </div>
        <h2>Incident Summary</h2>
        <p><strong>Error Type</strong> {logAnalysis.errorType}</p>
        <p><strong>Severity</strong> {logAnalysis.severity}</p>
      </section>

      <section className="card">
        <span className="eyebrow">Stage 01 — Log Analyzer</span>
        <h2>Log Analysis</h2>
        <p><strong>File</strong> {logAnalysis.file}</p>
        <p><strong>Function</strong> {logAnalysis.functionName}</p>
        <p><strong>Line</strong> {logAnalysis.line}</p>
      </section>

      <section className="card">
        <span className="eyebrow">Stage 02 — Codebase RAG Analyzer</span>
        <h2>Root Cause Analysis</h2>
        <p>{ragAnalysis.rootCause}</p>
        <div className="meter"><div className="meter-fill" style={{ width: `${confidencePct}%` }} /></div>
        <p className="meter-label">{confidencePct}% confidence</p>
      </section>

      <section className="card">
        <span className="eyebrow">Stage 03 — Fix Suggestion Agent</span>
        <h2>Suggested Fix</h2>
        <p><strong>Original</strong></p>
        <pre>{fixSuggestion.originalCode}</pre>
        <p><strong>Suggested</strong></p>
        <pre>{fixSuggestion.suggestedCode}</pre>
        <p><strong>Explanation</strong> {fixSuggestion.explanation}</p>
      </section>

      <section className="card">
        <h2>Test Suggestion</h2>
        <p>{fixSuggestion.testSuggestion}</p>
      </section>
    </div>
  );
}

export default IncidentResult;
