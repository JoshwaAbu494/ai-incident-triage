import { useState } from 'react';

function AnalyzeIncident() {
  const [repositoryName, setRepositoryName] = useState('sample-repository');
  const [title, setTitle] = useState('');
  const [log, setLog] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    // Wiring this up to the real backend call is Phase 11.
    console.log({ repositoryName, title, log });
  }

  return (
    <div className="page">
      <h1>Analyze Incident</h1>
      <form onSubmit={handleSubmit} className="incident-form">
        <label>
          Repository Name
          <input value={repositoryName} onChange={(e) => setRepositoryName(e.target.value)} />
        </label>
        <label>
          Error Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="User API Error" />
        </label>
        <label>
          Error Log
          <textarea value={log} onChange={(e) => setLog(e.target.value)} rows={8} placeholder="Paste the raw stack trace here" />
        </label>
        <button type="submit">Analyze</button>
      </form>
    </div>
  );
}

export default AnalyzeIncident;
