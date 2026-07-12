const path = require('path');
const fs = require('fs');
const { indexRepository: runIndexing } = require('../../../ml-integration/indexRepository');

const VECTOR_STORE_PATH = path.join(__dirname, '../../../ml-integration/vector-index.json');

// POST /api/repository/index
async function indexRepository(req, res) {
  const { repositoryName } = req.body;

  if (!repositoryName) {
    return res.status(400).json({ error: 'repositoryName is required' });
  }

  const repoPath = path.join(__dirname, '../../../', repositoryName);

  if (!fs.existsSync(repoPath)) {
    return res.status(404).json({ error: `Repository "${repositoryName}" not found at project root` });
  }

  try {
    const chunks = await runIndexing(repoPath);
    fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(chunks, null, 2));

    res.status(200).json({
      repositoryName,
      status: 'indexed',
      chunksIndexed: chunks.length,
    });
  } catch (err) {
    res.status(500).json({ error: `Indexing failed: ${err.message}` });
  }
}

module.exports = { indexRepository };
