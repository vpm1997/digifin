/**
 * Pure audit engine — no Node or browser APIs.
 * Shared by the server, Vercel functions and the in-browser GitHub Pages build.
 */

/* ------------------------------------------------------------------ */
/*  CSV parsing                                                        */
/* ------------------------------------------------------------------ */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (c !== '\r') {
      field += c;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.some((v) => String(v).trim() !== ''));
}

function normalizeHeader(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

function findColumn(headers, candidates) {
  for (const candidate of candidates) {
    const idx = headers.indexOf(candidate);
    if (idx !== -1) return idx;
  }
  return -1;
}

function parseAmount(raw) {
  if (raw == null) return 0;
  let s = String(raw).trim();
  if (!s) return 0;
  const isDebit = /\bdr\b/i.test(s);
  const isNegative = /^\(.*\)$/.test(s) || /^-/.test(s) || isDebit;
  s = s.replace(/[()]/g, '').replace(/[^0-9.]/g, '');
  const n = Number.parseFloat(s);
  if (Number.isNaN(n)) return 0;
  if (isNegative && n > 0) return -n;
  return n;
}

function parseDate(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return null;

  const iso = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (iso) {
    const [, y, m, d] = iso;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (dmy) {
    let [, d, m, y] = dmy;
    if (y.length === 2) y = `20${y}`;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  const parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return null;
}

/**
 * Parse a CSV/text bank statement into normalized transactions.
 * Supported columns: date, description/narration, amount OR debit/credit.
 */
export function parseStatement(text) {
  const rows = parseCSV(String(text).replace(/^\uFEFF/, ''));
  if (!rows.length) return [];

  const headers = rows[0].map(normalizeHeader);
  const hasHeader =
    headers.some((h) => h === 'date' || h.includes('date')) &&
    headers.some(
      (h) =>
        h.includes('description') ||
        h.includes('narration') ||
        h.includes('particular'),
    );

  let dateIdx = 0;
  let descIdx = 1;
  let amountIdx = 2;
  let debitIdx = -1;
  let creditIdx = -1;
  let dataRows = rows;

  if (hasHeader) {
    dataRows = rows.slice(1);
    dateIdx = findColumn(headers, ['date', 'txn date', 'transaction date', 'value date']);
    descIdx = findColumn(headers, [
      'description',
      'narration',
      'details',
      'particulars',
      'transaction',
      'transaction details',
    ]);
    amountIdx = findColumn(headers, ['amount', 'txn amount', 'transaction amount']);
    debitIdx = findColumn(headers, ['debit', 'withdrawal', 'withdrawals', 'dr']);
    creditIdx = findColumn(headers, ['credit', 'deposit', 'deposits', 'cr']);
    if (dateIdx === -1) dateIdx = 0;
    if (descIdx === -1) descIdx = 1;
  }

  const transactions = [];

  for (const row of dataRows) {
    const description = String(row[descIdx] ?? '').trim();
    if (!description) continue;

    let amount;
    if (debitIdx !== -1 || creditIdx !== -1) {
      const debit = debitIdx !== -1 ? parseAmount(row[debitIdx]) : 0;
      const credit = creditIdx !== -1 ? parseAmount(row[creditIdx]) : 0;
      amount = Math.abs(credit) - Math.abs(debit);
    } else {
      amount = parseAmount(row[amountIdx]);
    }
    if (!amount) continue;

    const rawDate = String(row[dateIdx] ?? '').trim();
    transactions.push({
      date: parseDate(rawDate),
      rawDate,
      description,
      amount,
    });
  }

  return transactions;
}

/* ------------------------------------------------------------------ */
/*  Rule-based audit                                                   */
/* ------------------------------------------------------------------ */

const FEE_RULES = [
  {
    category: 'interest',
    label: 'Interest charge',
    re: /\b(interest|int\.|finance charge)\b/i,
    citation: 'RBI Fair Practices Code / loan agreement',
    confidence: 0.86,
  },
  {
    category: 'penalty',
    label: 'Penalty / minimum balance',
    re: /\b(penalty|late fee|late payment|bounce|nsf|overdraft|minimum balance)\b/i,
    citation: 'Banking Codes & Standards – Board for Customer Service',
    confidence: 0.9,
  },
  {
    category: 'maintenance_fee',
    label: 'Maintenance / annual fee',
    re: /\b(maintenance|annual fee|amc|joining fee)\b/i,
    citation: 'MITC – schedule of charges',
    confidence: 0.88,
  },
  {
    category: 'processing_fee',
    label: 'Processing / convenience fee',
    re: /\b(convenience|processing|handling|service charge|service fee)\b/i,
    citation: 'MITC – schedule of charges',
    confidence: 0.9,
  },
  {
    category: 'other_fee',
    label: 'Fee / surcharge',
    re: /\b(fee|charge|surcharge|gst)\b/i,
    citation: 'MITC – schedule of charges',
    confidence: 0.74,
  },
];

function classify(description, amount) {
  if (amount >= 0) return null;
  return FEE_RULES.find((rule) => rule.re.test(description)) ?? null;
}

function severityFor(category, amount) {
  const abs = Math.abs(amount);
  if (category === 'penalty' || abs >= 1000) return 'high';
  if (abs >= 300) return 'medium';
  return 'low';
}

export function summarize(findings, transactions) {
  const dates = transactions
    .map((t) => t.date)
    .filter(Boolean)
    .sort();

  const potentialRecovery = findings.reduce((sum, f) => sum + Number(f.amount || 0), 0);
  const weighted = findings.reduce((sum, f) => {
    if (f.severity === 'high') return sum + 9;
    if (f.severity === 'medium') return sum + 5;
    return sum + 2;
  }, 0);

  return {
    transactionsScanned: transactions.length,
    findingCount: findings.length,
    highSeverityCount: findings.filter((f) => f.severity === 'high').length,
    potentialRecovery: Math.round(potentialRecovery),
    score: Math.max(25, Math.min(96, 100 - weighted)),
    period: {
      from: dates[0] ?? null,
      to: dates[dates.length - 1] ?? null,
    },
  };
}

export function ruleAudit(transactions) {
  const findings = [];
  let id = 0;

  // Group identical debits so repeated charges become one duplicate finding.
  const feeTxns = [];
  for (const txn of transactions) {
    const rule = classify(txn.description, txn.amount);
    if (rule) feeTxns.push({ txn, rule });
  }

  const groups = new Map();
  for (const item of feeTxns) {
    const key = `${item.rule.category}|${item.txn.description.toLowerCase()}|${item.txn.amount}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  for (const group of groups.values()) {
    const { txn, rule } = group[0];
    const amount = Math.abs(txn.amount);

    if (group.length >= 2) {
      id += 1;
      findings.push({
        id: `f_${id}`,
        category: 'duplicate',
        title: `Repeated charge — ${txn.description}`,
        description: `${txn.description} was charged ${group.length} times in the statement period.`,
        amount: amount * (group.length - 1),
        severity: severityFor(rule.category, amount * (group.length - 1)),
        confidence: 0.95,
        date: group[group.length - 1].txn.date,
        occurrences: group.length,
        reason:
          'Identical description and amount repeated. One or more occurrences may be an unauthorised duplicate debit.',
        citation: 'Unauthorised / duplicate debit — RBI grievance redressal',
      });
      continue;
    }

    id += 1;
    findings.push({
      id: `f_${id}`,
      category: rule.category,
      title: txn.description,
      description: `${rule.label} of ₹${amount.toLocaleString('en-IN')} on ${txn.rawDate || txn.date || 'unknown date'}.`,
      amount,
      severity: severityFor(rule.category, amount),
      confidence: rule.confidence,
      date: txn.date,
      occurrences: 1,
      reason:
        rule.category === 'interest'
          ? 'Interest may have been computed on an amount that already included fees or charges. Recalculate from the reducing balance.'
          : rule.category === 'penalty'
            ? 'Penalty appears avoidable or inconsistent with the notified minimum-balance / due-date rules.'
            : 'Charge does not clearly map to an authorised, disclosed fee in the MITC schedule.',
      citation: rule.citation,
    });
  }

  findings.sort((a, b) => b.amount - a.amount);

  return {
    findings,
    transactions,
    summary: summarize(findings, transactions),
  };
}

/**
 * Convenience wrapper for fully client-side auditing.
 */
export function auditText(text, filename = 'statement.csv') {
  if (!text || !String(text).trim()) {
    throw new Error('A CSV or TXT statement is required.');
  }
  const transactions = parseStatement(text);
  if (!transactions.length) {
    throw new Error(
      'No transactions found. Expect a header row with date, description and amount (or debit/credit).',
    );
  }
  const { findings, summary } = ruleAudit(transactions);
  return { source: 'browser', filename, findings, summary };
}
