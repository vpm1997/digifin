import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { applyCors } from './cors.js';
import { auditStatement, HttpError } from './audit.js';
import { generateDispute } from './dispute.js';

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use((req, res, next) => {
  if (applyCors(req, res)) return;
  next();
});

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5',
  });
});

app.post('/api/audit', async (req, res) => {
  try {
    const result = await auditStatement(req.body ?? {});
    res.json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('[api/audit]', error);
    res.status(status).json({ error: error.message || 'Audit failed.' });
  }
});

app.post('/api/dispute', async (req, res) => {
  try {
    const result = await generateDispute(req.body ?? {});
    res.json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('[api/dispute]', error);
    res.status(status).json({ error: error.message || 'Could not draft dispute.' });
  }
});

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

const port = Number(process.env.PORT || 8787);

// Serve the built SPA when running as a single Node service (Render, Railway, etc.).
const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
if (process.env.NODE_ENV === 'production' && fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
}

app.listen(port, () => {
  console.log(`DigiFinSaviour API listening on http://localhost:${port}`);
  console.log(
    process.env.ANTHROPIC_API_KEY
      ? 'Claude audit enabled.'
      : 'No ANTHROPIC_API_KEY — using deterministic rule engine (fully functional).',
  );
});
