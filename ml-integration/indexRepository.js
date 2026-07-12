const fs = require('fs');
const path = require('path');
const { embedText } = require('./embeddingService');

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);

function findJsFiles(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsFiles(fullPath, fileList);
    } else if (entry.name.endsWith('.js')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// Splits a file into chunks at each top-level function boundary using
// simple brace counting — not a real parser, just enough to find
// "function name(...) { ... }" blocks in straightforward code.
function chunkFile(filePath, repoRoot) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const relativePath = path.relative(repoRoot, filePath).replace(/\\/g, '/');

  const chunks = [];
  let current = null;
  let braceDepth = 0;

  lines.forEach((line, i) => {
    const isFunctionStart = /^(async\s+)?function\s+\w+\s*\(/.test(line.trim());

    if (!current && isFunctionStart) {
      current = { startLine: i + 1, lines: [] };
    }

    if (current) {
      current.lines.push(line);
      braceDepth += (line.match(/{/g) || []).length;
      braceDepth -= (line.match(/}/g) || []).length;

      if (braceDepth <= 0 && current.lines.length > 1) {
        chunks.push({
          file: relativePath,
          startLine: current.startLine,
          text: current.lines.join('\n'),
        });
        current = null;
        braceDepth = 0;
      }
    }
  });

  // Files with no matched functions (e.g. pure data files) get indexed
  // as one whole-file chunk instead of being silently skipped.
  if (chunks.length === 0) {
    chunks.push({ file: relativePath, startLine: 1, text: content });
  }

  return chunks;
}

async function indexRepository(repoPath) {
  const files = findJsFiles(repoPath);
  const allChunks = files.flatMap((file) => chunkFile(file, repoPath));

  const indexed = [];
  for (const chunk of allChunks) {
    const embedding = await embedText(chunk.text);
    indexed.push({ ...chunk, embedding });
  }

  return indexed;
}

module.exports = { indexRepository, findJsFiles, chunkFile };
