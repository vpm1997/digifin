import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  ScanLine,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import { auditText } from '../../shared/auditCore.js';
import { buildDisputeLetter } from '../../shared/disputeTemplate.js';

const OFFLINE = import.meta.env.VITE_OFFLINE_AUDIT === 'true';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const severityStyles = {
  high: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
};

const categoryLabels = {
  interest: 'Interest',
  penalty: 'Penalty',
  maintenance_fee: 'Maintenance fee',
  processing_fee: 'Processing fee',
  other_fee: 'Fee',
  duplicate: 'Duplicate charge',
};

function errorMessageFor(error) {
  if (error instanceof TypeError) {
    return 'Could not reach the audit API. Start it with "npm run dev:all", or try again.';
  }
  return error.message || 'Something went wrong.';
}

async function postJSON(url, body) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

/* ------------------------------------------------------------------ */

function Dropzone({ onFile, onSample, dragging, setDragging }) {
  const inputRef = useRef(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
        dragging
          ? 'border-emerald-400 bg-emerald-500/10'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20'
      }`}
    >
      <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-5">
        <UploadCloud className="h-7 w-7 text-emerald-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1.5">
        Drop your statement here
      </h3>
      <p className="text-sm text-slate-400 mb-6">
        CSV or TXT · up to 1 MB · parsed in memory, never stored
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
        >
          <ScanLine className="h-4 w-4" /> Choose a file
        </button>
        <button
          onClick={onSample}
          className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
        >
          <Sparkles className="h-4 w-4 text-emerald-400" /> Use sample statement
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = '';
        }}
      />

      <p className="mt-6 text-[11px] text-slate-500">
        Expected columns: <span className="font-mono">date, description, amount</span>{' '}
        — or <span className="font-mono">debit / credit</span>. PDF support coming
        soon.
      </p>
    </div>
  );
}

function SummaryTile({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-extrabold ${accent || 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function FindingRow({ finding, onDraft, disabled }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <h4 className="text-sm font-bold text-white">{finding.title}</h4>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                severityStyles[finding.severity] || severityStyles.medium
              }`}
            >
              {finding.severity}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
              {categoryLabels[finding.category] || 'Charge'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{finding.reason}</p>
          <p className="mt-2 text-[11px] text-slate-500">
            {finding.date || finding.rawDate || 'Date unknown'}
            {finding.occurrences > 1 ? ` · ${finding.occurrences} occurrences` : ''}
            {finding.citation ? ` · ${finding.citation}` : ''}
          </p>
        </div>

        <div className="sm:text-right shrink-0 sm:pl-4">
          <p className="text-lg font-extrabold text-white">
            {inr.format(Number(finding.amount) || 0)}
          </p>
          <button
            onClick={() => onDraft(finding)}
            disabled={disabled}
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 disabled:opacity-50 transition-colors"
          >
            {disabled ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <FileText className="h-3.5 w-3.5" />
            )}
            Draft dispute
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function AuditDemo() {
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);

  const [dispute, setDispute] = useState(null); // { finding, text, source }
  const [disputeLoading, setDisputeLoading] = useState(false);
  const [disputeError, setDisputeError] = useState(null);
  const [copied, setCopied] = useState(false);

  async function runAudit(text, filename) {
    setStatus('processing');
    setError(null);
    setResult(null);
    try {
      if (text.length > 1_000_000) throw new Error('File is larger than 1 MB.');
      if (OFFLINE) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setResult(auditText(text, filename));
        setStatus('done');
        return;
      }
      const data = await postJSON('/api/audit', { filename, text });
      setResult(data);
      setStatus('done');
    } catch (err) {
      setError(errorMessageFor(err));
      setStatus('error');
    }
  }

  async function onFile(file) {
    if (!file) return;
    if (file.size > 1_000_000) {
      setError('File is larger than 1 MB.');
      setStatus('error');
      return;
    }
    const text = await file.text();
    runAudit(text, file.name);
  }

  async function useSample() {
    setStatus('processing');
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `${import.meta.env.BASE_URL}samples/sample-statement.csv`,
      );
      if (!res.ok) throw new Error('Could not load the sample statement.');
      const text = await res.text();
      runAudit(text, 'sample-statement.csv');
    } catch (err) {
      setError(errorMessageFor(err));
      setStatus('error');
    }
  }

  async function draftDispute(finding) {
    setDispute({ finding, text: '', source: null });
    setDisputeLoading(true);
    setDisputeError(null);
    setCopied(false);
    if (OFFLINE) {
      setDispute({
        finding,
        text: buildDisputeLetter({
          finding,
          account: '••••4821',
          holderName: 'Account holder',
          bank: 'the bank',
        }),
        source: 'template',
      });
      setDisputeLoading(false);
      return;
    }
    try {
      const data = await postJSON('/api/dispute', {
        finding,
        account: '••••4821',
        holderName: 'Account holder',
        bank: 'the bank',
      });
      setDispute({ finding, text: data.letter, source: data.source });
    } catch (err) {
      setDisputeError(errorMessageFor(err));
    } finally {
      setDisputeLoading(false);
    }
  }

  function closeDispute() {
    setDispute(null);
    setDisputeError(null);
    setCopied(false);
  }

  useEffect(() => {
    if (!dispute) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') closeDispute();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispute]);

  function reset() {
    setStatus('idle');
    setResult(null);
    setError(null);
  }

  async function copyLetter() {
    if (!dispute?.text) return;
    try {
      await navigator.clipboard.writeText(dispute.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function downloadLetter() {
    if (!dispute?.text) return;
    const blob = new Blob([dispute.text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dispute-${dispute.finding.id || 'charge'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      {status === 'idle' && (
        <Dropzone
          onFile={onFile}
          onSample={useSample}
          dragging={dragging}
          setDragging={setDragging}
        />
      )}

      {status === 'processing' && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-14 text-center">
          <Loader2 className="mx-auto h-9 w-9 text-emerald-400 animate-spin mb-5" />
          <h3 className="text-lg font-bold text-white mb-1.5">
            Auditing your statement…
          </h3>
          <p className="text-sm text-slate-400">
            {OFFLINE
              ? 'Running locally in your browser — nothing leaves your device.'
              : 'Parsing transactions, matching fees and checking interest math.'}
          </p>
          <div className="max-w-md mx-auto mt-8 space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-white/5 animate-pulse"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 px-6 py-10 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-400 mb-4" />
          <h3 className="text-lg font-bold text-white mb-1.5">Audit failed</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">{error}</p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Try again
          </button>
        </div>
      )}

      {status === 'done' && result && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-sm font-semibold text-white truncate">
                {result.filename}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {result.source === 'claude' ? (
                  <>
                    <Sparkles className="h-3 w-3" /> Claude
                  </>
                ) : result.source === 'browser' ? (
                  <>In-browser</>
                ) : (
                  <>Rule engine</>
                )}
              </span>
            </div>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" /> New audit
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <SummaryTile
              label="Health score"
              value={`${result.summary.score}/100`}
              accent={
                result.summary.score >= 75
                  ? 'text-emerald-400'
                  : result.summary.score >= 50
                    ? 'text-amber-400'
                    : 'text-rose-400'
              }
            />
            <SummaryTile
              label="Potential recovery"
              value={inr.format(result.summary.potentialRecovery)}
              accent="text-emerald-400"
            />
            <SummaryTile
              label="Flagged charges"
              value={result.summary.findingCount}
            />
            <SummaryTile
              label="Transactions scanned"
              value={result.summary.transactionsScanned}
            />
          </div>

          {result.summary.period?.from && (
            <p className="text-[11px] text-slate-500 mb-4">
              Statement period: {result.summary.period.from} →{' '}
              {result.summary.period.to}
            </p>
          )}

          {result.warning && (
            <p className="mb-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200">
              {result.warning}
            </p>
          )}

          {result.findings.length === 0 ? (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-10 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-lg font-bold text-white mb-1.5">
                No illegitimate charges found
              </h3>
              <p className="text-sm text-slate-400">
                We scanned {result.summary.transactionsScanned} transactions and
                found nothing worth disputing.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.findings.map((finding) => (
                <FindingRow
                  key={finding.id}
                  finding={finding}
                  onDraft={draftDispute}
                  disabled={disputeLoading}
                />
              ))}
            </div>
          )}

          <p className="mt-4 text-[11px] text-slate-500">
            This is an automated review, not legal advice. Verify findings against
            your signed MITC before escalating.
          </p>
        </div>
      )}

      {/* Dispute modal */}
      {dispute && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <button
            aria-label="Close dispute letter"
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={closeDispute}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dispute-title"
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/5 shrink-0">
              <div className="min-w-0">
                <h3 id="dispute-title" className="text-sm font-bold text-white">
                  Dispute letter
                </h3>
                <p className="text-[11px] text-slate-500 truncate">
                  {dispute.finding.title} ·{' '}
                  {inr.format(Number(dispute.finding.amount) || 0)}
                  {dispute.source === 'claude' ? ' · Claude' : ''}
                </p>
              </div>
              <button
                onClick={closeDispute}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-5 py-4 overflow-y-auto">
              {disputeLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-400 py-10 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                  Drafting your dispute…
                </div>
              )}
              {disputeError && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-300">
                  {disputeError}
                </div>
              )}
              {!disputeLoading && dispute.text && (
                <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-slate-300">
                  {dispute.text}
                </pre>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 px-5 py-4 border-t border-white/5 shrink-0">
              <button
                onClick={copyLetter}
                disabled={!dispute.text}
                className="inline-flex items-center gap-1.5 border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-full text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={downloadLetter}
                disabled={!dispute.text}
                className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-full text-xs font-bold disabled:opacity-40 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Download .txt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
