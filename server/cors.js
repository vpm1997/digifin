/**
 * Minimal CORS helper shared by the Express server and Vercel functions.
 * Set CORS_ORIGIN to a comma-separated allowlist, or leave unset for "*".
 */
export function applyCors(req, res) {
  const allowed = process.env.CORS_ORIGIN;
  const origin = req.headers?.origin;

  if (!allowed) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (origin && allowed.split(',').map((o) => o.trim()).includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return true;
  }
  return false;
}
