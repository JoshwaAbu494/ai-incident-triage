// POST /api/repository/index
function indexRepository(req, res) {
  const { repositoryName } = req.body;

  if (!repositoryName) {
    return res.status(400).json({ error: 'repositoryName is required' });
  }

  // Real indexing (reading files, chunking, embeddings, vector DB)
  // isn't built yet — that's Phase 5.
  res.status(202).json({
    repositoryName,
    status: 'not_implemented',
    message: 'Repository indexing connects in Phase 5.',
  });
}

module.exports = { indexRepository };
