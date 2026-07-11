const {
  createIncident,
  getAllIncidents,
  findIncidentById,
} = require('../services/incidentStore');

// POST /api/incidents/analyze
function analyzeIncident(req, res) {
  const { title, log } = req.body;

  if (!title || !log) {
    return res.status(400).json({ error: 'title and log are required' });
  }

  const incident = createIncident(title, log);

  // The agent pipeline (orchestrator + 3 agents) isn't connected yet —
  // that's Phase 8. For now we just save the incident and confirm receipt.
  res.status(201).json({
    incidentId: incident.id,
    status: incident.status,
    message: 'Incident saved. Analysis pipeline connects in Phase 8.',
  });
}

// GET /api/incidents
function listIncidents(req, res) {
  res.json(getAllIncidents());
}

// GET /api/incidents/:id
function getIncidentById(req, res) {
  const incident = findIncidentById(Number(req.params.id));

  if (!incident) {
    return res.status(404).json({ error: 'Incident not found' });
  }

  res.json(incident);
}

module.exports = { analyzeIncident, listIncidents, getIncidentById };
