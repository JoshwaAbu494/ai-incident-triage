const MOCK_INCIDENTS = [
  { id: 1, title: 'User API Error', status: 'pending', created_at: '2026-07-14T01:40:40Z' },
  { id: 2, title: 'User API Error', status: 'completed', created_at: '2026-07-14T01:40:41Z' },
];

function IncidentHistory() {
  return (
    <div className="page">
      <h1>Incident History</h1>
      <table className="incident-table">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Status</th><th>Created</th></tr>
        </thead>
        <tbody>
          {MOCK_INCIDENTS.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td>{incident.title}</td>
              <td>{incident.status}</td>
              <td>{new Date(incident.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">Real data connects in Phase 11.</p>
    </div>
  );
}

export default IncidentHistory;
