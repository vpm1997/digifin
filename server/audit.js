import Anthropic from '@anthropic-ai/sdk';
import { parseStatement, ruleAudit, summarize } from '../shared/auditCore.js';

export { parseStatement, ruleAudit } from '../shared/auditCore.js';

/* ------------------------------------------------------------------ */
/*  Errors                                                             */
/* ------------------------------------------------------------------ */

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

/* ------------------------------------------------------------------ */
/*  Claude-powered audit                                               */
/* ------------------------------------------------------------------ */

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';

function extractJSON(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('No JSON object in model response');
  }
  return JSON.parse(text.slice(start, end + 1));
}

function clampNumber(value, min, max, fallback = 0) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeAiFindings(raw) {
  if (!Array.isArray(raw)) return [];
  const validCategories = new Set([
    'interest',
    'penalty',
    'maintenance_fee',
    'processing_fee',
    'other_fee',
    'duplicate',
  ]);

  return raw
    .filter((f) => f && typeof f.title === 'string' && Number.isFinite(Number(f.amount)))
    .map((f, i) => ({
      id: `ai_${i + 1}`,
      category: validCategories.has(f.category) ? f.category : 'other_fee',
      title: String(f.title).slice(0, 160),
      description: String(f.description ?? f.title).slice(0, 500),
      amount: Math.abs(Number(f.amount)),
      severity: ['high', 'medium', 'low'].includes(f.severity) ? f.severity : 'medium',
      confidence: clampNumber(f.confidence, 0, 1, 0.75),
      date: typeof f.date === 'string' ? f.date.slice(0, 10) : null,
      occurrences: clampNumber(f.occurrences, 1, 100, 1),
      reason: String(f.reason ?? 'Flagged by AI review.').slice(0, 600),
      citation: String(f.citation ?? 'Banking Codes & Standards').slice(0, 200),
    }))
    .sort((a, b) => b.amount - a.amount);
}

async function aiAudit(transactions, holderName) {
  const client = new Anthropic();
  const sample = transactions.slice(0, 120).map((t) => ({
    date: t.rawDate || t.date,
    description: t.description,
    amount: t.amount,
  }));

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 2500,
    system:
      'You are a meticulous consumer-banking auditor in India. You inspect statements for illegitimate fees, incorrect interest, avoidable penalties and duplicate charges. Respond with strict JSON only. Never invent transactions that are not present.',
    messages: [
      {
        role: 'user',
        content: `Audit the bank statement transactions below${holderName ? ` for ${holderName}` : ''}.

Transactions (amount is negative for debits, positive for credits):
${JSON.stringify(sample)}

Return JSON shaped exactly like:
{"findings":[{"category":"interest|penalty|maintenance_fee|processing_fee|other_fee|duplicate","title":"short title","description":"what happened","amount":1234,"severity":"high|medium|low","confidence":0.0-1.0,"date":"YYYY-MM-DD or null","occurrences":1,"reason":"why this is likely illegitimate and how to dispute it","citation":"relevant rule or schedule"}]}

Rules:
- Only include debits that are plausibly illegitimate or incorrect. Exclude ordinary purchases, ATM withdrawals, investments and credits.
- Amount must be a positive number in INR and must not exceed the actual debit.
- If nothing is wrong, return {"findings":[]}.
- Do not include commentary outside the JSON.`,
      },
    ],
  });

  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return normalizeAiFindings(extractJSON(text).findings);
}

/* ------------------------------------------------------------------ */
/*  Public entry point                                                 */
/* ------------------------------------------------------------------ */

export async function auditStatement({ filename = 'statement.csv', text, holderName = '' } = {}) {
  if (!text || typeof text !== 'string' || !text.trim()) {
    throw new HttpError(400, 'A CSV or TXT statement is required.');
  }
  if (text.length > 1_000_000) {
    throw new HttpError(413, 'Statement is too large. Maximum size is 1 MB.');
  }

  const transactions = parseStatement(text);
  if (!transactions.length) {
    throw new HttpError(
      422,
      'No transactions found. Expect a header row with date, description and amount (or debit/credit).',
    );
  }

  const base = ruleAudit(transactions);
  const result = {
    source: 'rules',
    filename,
    findings: base.findings,
    summary: base.summary,
  };

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const findings = await aiAudit(transactions, holderName);
      result.findings = findings;
      result.source = 'claude';
      result.model = MODEL;
      result.summary = summarize(findings, transactions);
    } catch (error) {
      console.warn('[audit] Claude audit failed, using rule engine:', error.message);
      result.warning = 'AI review unavailable — deterministic rule engine used.';
    }
  }

  return result;
}
