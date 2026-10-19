import Anthropic from '@anthropic-ai/sdk';
import { HttpError } from './audit.js';
import { buildDisputeLetter } from '../shared/disputeTemplate.js';

const MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-5';

async function aiLetter({ finding, account, holderName, bank }) {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 1200,
    system:
      'You are an Indian consumer-banking dispute specialist. Draft concise, formal, regulation-aware complaint letters. Output only the letter text — no commentary, no markdown.',
    messages: [
      {
        role: 'user',
        content: `Draft a formal dispute letter to a bank.

Bank: ${bank}
Account (masked): ${account}
Account holder: ${holderName || '[Your name]'}
Charge: ${finding.title}
Amount: ₹${finding.amount}
Date: ${finding.date || 'not provided'}
Category: ${finding.category}
Reason: ${finding.reason || ''}
Citation: ${finding.citation || ''}

Requirements:
- Address it to the bank's escalation team.
- State the disputed amount, the reason it is illegitimate, and the exact resolution requested.
- Request reversal within 7 business days.
- State that escalation to the RBI Banking Ombudsman will follow if unresolved.
- Keep it under 350 words. Do not invent account numbers or facts.`,
      },
    ],
  });

  return message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('')
    .trim();
}

export async function generateDispute({
  finding,
  account = '••••4821',
  holderName = '',
  bank = 'the bank',
} = {}) {
  if (!finding || typeof finding !== 'object' || !finding.title) {
    throw new HttpError(400, 'A finding is required to draft a dispute.');
  }
  if (!Number.isFinite(Number(finding.amount)) || Number(finding.amount) <= 0) {
    throw new HttpError(400, 'Finding amount must be a positive number.');
  }

  const payload = { finding, account, holderName, bank };

  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const letter = await aiLetter(payload);
      return { source: 'claude', model: MODEL, letter };
    } catch (error) {
      console.warn('[dispute] Claude draft failed, using template:', error.message);
    }
  }

  return { source: 'template', letter: buildDisputeLetter(payload) };
}
