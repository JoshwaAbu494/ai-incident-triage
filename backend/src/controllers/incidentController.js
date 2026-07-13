const {
  createIncident,
  getAllIncidents,
  findIncidentById,
  updateIncidentStatus,
} = require('../services/incidentStore');
const { analyzeIncident } = require('../../../agents/orchestrator');

// POST /api/incidents/analyze
async function analyzeIncidentHandler(req, res) {
  const { title, log } = req.body;

  if (!title || !log) {
    return res.status(400).json({ error: 'title and log are required' });
  }

  const incident = createIncident(title, log);

  try {
    const analysis = await analyzeIncident({ title, log });
    updateIncidentStatus(incident.id, 'completed', analysis);

    res.status(201).json({
      incidentId: incident.id,
      status: 'completed',
      analysis,
    });
  } catch (err) {
    updateIncidentStatus(incident.id, 'failed', null);
    res.status(500).json({
      incidentId: incident.id,
      status: 'failed',
      error: err.message,
    });
  }
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

module.exports = { analyzeIncident: analyzeIncidentHandler, listIncidents, getIncidentById };
