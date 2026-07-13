import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

function AnalyzeIncident() {
  const [title, setTitle] = useState('');
  const [log, setLog] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/incidents/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, log }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      navigate(`/incidents/${data.incidentId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Analyze Incident</h1>
      <form onSubmit={handleSubmit} className="incident-form">
        <label>
          Error Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="User API Error" required />
        </label>
        <label>
          Error Log
          <textarea value={log} onChange={(e) => setLog(e.target.value)} rows={8} placeholder="Paste the raw stack trace here" required />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing... (agents take 10-20s)' : 'Analyze'}
        </button>
        {error && <p style={{ color: '#dc2626' }}>Error: {error}</p>}
      </form>
    </div>
  );
}

export default AnalyzeIncident;
