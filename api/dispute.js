import { generateDispute } from '../server/dispute.js';
import { HttpError } from '../server/audit.js';
import { applyCors } from '../server/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.setHeader?.('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  try {
    const result = await generateDispute(req.body ?? {});
    return res.status(200).json(result);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error('[api/dispute]', error);
    return res.status(status).json({ error: error.message || 'Could not draft dispute.' });
  }
}
