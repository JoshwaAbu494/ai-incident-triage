// Loads configuration needed to connect to external services.
// A real deployment would load these from a .env file; this
// sample repo reads process.env directly to stay dependency-free.

// BUG: no check that DATABASE_URL is actually set. If it's
// missing, this silently returns undefined, and the real failure
// only shows up later, far from its actual cause.
function getDatabaseUrl() {
  return process.env.DATABASE_URL;
}

function connectToDatabase() {
  const url = getDatabaseUrl();
  console.log(`Connecting to ${url.split('@')[1]}...`);
}

module.exports = { getDatabaseUrl, connectToDatabase };