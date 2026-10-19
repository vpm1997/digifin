import { applyCors } from '../server/cors.js';

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  res.status(200).json({
    ok: true,
    ai: Boolean(process.env.ANTHROPIC_API_KEY),
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5',
  });
}
