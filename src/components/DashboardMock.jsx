import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  TrendingDown,
} from 'lucide-react';

const tones = {
  amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  rose: 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  sky: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
};

function AuditRow({ name, note, amount, tag, tone }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
      <div
        className={`h-9 w-9 shrink-0 rounded-lg border flex items-center justify-center ${tones[tone]}`}
      >
        <AlertTriangle className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <p className="text-xs text-slate-500 truncate">{note}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white">{amount}</p>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          {tag}
        </p>
      </div>
    </div>
  );
}

export default function DashboardMock() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-sky-500/20 blur-3xl rounded-full" />

      <div className="relative rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          </div>
          <span className="text-[11px] font-medium text-slate-500">
            audit · oct_2026.pdf
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Financial health score
              </p>
              <div className="flex items-end gap-2 mt-1">
                <span className="text-3xl font-extrabold text-white">82</span>
                <span className="text-xs font-semibold text-emerald-400 mb-1 flex items-center gap-0.5">
                  <TrendingDown className="h-3.5 w-3.5 rotate-180" /> +12
                </span>
              </div>
            </div>
            <div className="relative h-14 w-14">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="3"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke="url(#g1)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="82 100"
                />
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#2dd4bf" />
                  </linearGradient>
                </defs>
              </svg>
              <CheckCircle2 className="absolute inset-0 m-auto h-5 w-5 text-emerald-400" />
            </div>
          </div>

          <div className="rounded-2xl bg-white/[0.03] border border-white/5 px-4">
            <AuditRow
              name="Maintenance surcharge"
              note="Not in MITC §4.2 · 12 Oct"
              amount="₹499"
              tag="Disputable"
              tone="amber"
            />
            <AuditRow
              name="CIBIL late-payment flag"
              note="Paid on time · 03 Sep"
              amount="30 DPD"
              tag="Ghost"
              tone="rose"
            />
            <AuditRow
              name="Interest recalculation"
              note="Charged on charged amount"
              amount="₹1,240"
              tag="Refund"
              tone="sky"
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/5 border border-emerald-500/20 px-4 py-3">
            <div>
              <p className="text-[11px] font-medium text-emerald-300/80">
                Potential recovery
              </p>
              <p className="text-lg font-extrabold text-white">₹1,739</p>
            </div>
            <a
              href="#demo"
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-full transition-colors"
            >
              Draft disputes <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden sm:flex absolute -left-6 top-1/3 items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur px-3.5 py-2.5 shadow-xl">
        <div className="h-8 w-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Fingerprint className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-medium">Encrypted</p>
          <p className="text-xs font-bold text-white">AES-256</p>
        </div>
      </div>
    </div>
  );
}
