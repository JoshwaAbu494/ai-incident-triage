CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  raw_log TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analysis_results (
  id SERIAL PRIMARY KEY,
  incident_id INTEGER NOT NULL REFERENCES incidents(id),
  log_analysis JSONB,
  rag_analysis JSONB,
  fix_suggestion JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
