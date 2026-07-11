const { getUserProfile } = require('../services/userService');

// Controller layer — in the real triage backend this same layer
// wraps Express route handlers. Kept framework-free here so the
// sample repo has zero dependencies and runs with plain `node`.
async function getProfile(userId) {
  const profile = getUserProfile(userId);
  return profile;
}

module.exports = { getProfile };