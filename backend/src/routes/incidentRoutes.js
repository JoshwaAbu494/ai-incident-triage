const express = require('express');
const router = express.Router();
const {
  analyzeIncident,
  listIncidents,
  getIncidentById,
} = require('../controllers/incidentController');

router.post('/analyze', analyzeIncident);
router.get('/', listIncidents);
router.get('/:id', getIncidentById);

module.exports = router;
