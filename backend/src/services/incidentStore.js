const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createIncident(title, log) {
  const result = await pool.query(
    `INSERT INTO incidents (title, raw_log, status) VALUES ($1, $2, 'pending') RETURNING *`,
    [title, log]
  );
  return { ...result.rows[0], analysis: null };
}

async function updateIncidentStatus(id, status, analysis) {
  await pool.query(`UPDATE incidents SET status = $1 WHERE id = $2`, [status, id]);

  if (analysis) {
    await pool.query(
      `INSERT INTO analysis_results (incident_id, log_analysis, rag_analysis, fix_suggestion)
       VALUES ($1, $2, $3, $4)`,
      [id, analysis.logAnalysis, analysis.ragAnalysis, analysis.fixSuggestion]
    );
  }
}

// Shared by getAllIncidents and findIncidentById — joins in the latest
// analysis for each incident (if one exists) and reshapes the flat SQL
// row into the { ...incident, analysis: {...} } shape the controller expects.
function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    raw_log: row.raw_log,
    status: row.status,
    created_at: row.created_at,
    analysis: row.log_analysis
      ? {
          logAnalysis: row.log_analysis,
          ragAnalysis: row.rag_analysis,
          fixSuggestion: row.fix_suggestion,
        }
      : null,
  };
}

async function getAllIncidents() {
  const result = await pool.query(`
    SELECT i.*, a.log_analysis, a.rag_analysis, a.fix_suggestion
    FROM incidents i
    LEFT JOIN analysis_results a ON a.incident_id = i.id
    ORDER BY i.id
  `);
  return result.rows.map(mapRow);
}

async function findIncidentById(id) {
  const result = await pool.query(
    `SELECT i.*, a.log_analysis, a.rag_analysis, a.fix_suggestion
     FROM incidents i
     LEFT JOIN analysis_results a ON a.incident_id = i.id
     WHERE i.id = $1`,
    [id]
  );
  return result.rows[0] ? mapRow(result.rows[0]) : undefined;
}

module.exports = { createIncident, updateIncidentStatus, getAllIncidents, findIncidentById };
