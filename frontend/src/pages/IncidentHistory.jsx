import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = 'http://localhost:4000';

function IncidentHistory() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/incidents`)
      .then((res) => res.json())
      .then((data) => {
        setIncidents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><h1>Incident History</h1><p>Loading...</p></div>;

  return (
    <div className="page">
      <h1>Incident History</h1>
      <table className="incident-table">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Status</th><th>Created</th></tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id}>
              <td>{incident.id}</td>
              <td><Link to={`/incidents/${incident.id}`}>{incident.title}</Link></td>
              <td>{incident.status}</td>
              <td>{new Date(incident.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default IncidentHistory;
