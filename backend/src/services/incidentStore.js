// Temporary in-memory store. Replaced with real PostgreSQL queries
// in Phase 9 — function names below stay the same so swapping the
// implementation later won't require touching the controller.

let incidents = [];
let nextId = 1;

function createIncident(title, log) {
  const incident = {
    id: nextId++,
    title,
    raw_log: log,
    status: 'pending',
    analysis: null,
    created_at: new Date().toISOString(),
  };
  incidents.push(incident);
  return incident;
}

function updateIncidentStatus(id, status, analysis) {
  const incident = incidents.find((i) => i.id === id);
  if (incident) {
    incident.status = status;
    incident.analysis = analysis;
  }
  return incident;
}

function getAllIncidents() {
  return incidents;
}

function findIncidentById(id) {
  return incidents.find((incident) => incident.id === id);
}

module.exports = { createIncident, updateIncidentStatus, getAllIncidents, findIncidentById };
