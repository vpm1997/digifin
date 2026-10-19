import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  FileText,
  Fingerprint,
  LineChart,
  Lock,
  Scale,
  Search,
} from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const bureauBars = [40, 55, 48, 70, 62, 88, 82];
const securityChips = ['RBI AA compliant', 'AES-256', 'TLS 1.3', 'No resale'];

export default function Features() {
  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The toolkit"
          title="Protection that reads the fine print, so you don't have to."
          subtitle="Four engines working together to find the money your bank quietly kept."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* large: hidden fee */}
          <div className="lg:col-span-2 group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-7 sm:p-9 overflow-hidden hover:border-emerald-500/30 transition-colors">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-6">
                <Search className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Hidden fee detection
              </h3>
              <p className="text-slate-400 leading-relaxed max-w-lg mb-8">
                We parse your bank's MITC agreement and cross-reference every
                charge against your statement to surface fees that were never
                authorised.
              </p>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>TXN 98213 · CHG-CONVENIENCE-FEE</span>
                  <span className="text-emerald-400">₹499</span>
                </div>
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>FLAGGED — not in schedule §4.2</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Scale className="h-3.5 w-3.5" />
                  <span>Dispute auto-drafted for ombudsman</span>
                </div>
              </div>
            </div>
          </div>

          {/* bureau */}
          <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:border-sky-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-sky-500/15 border border-sky-500/20 flex items-center justify-center mb-6">
              <LineChart className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Bureau health audit</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              We reconcile your real payments against CIBIL and Experian reports
              to catch ghost defaults and laggy reporting.
            </p>
            <div className="mt-6 flex items-end gap-1.5 h-16">
              {bureauBars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-md ${
                    i === 5 ? 'bg-sky-400' : 'bg-sky-500/25'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* predictive */}
          <div className="group relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:border-amber-500/30 transition-colors">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-6">
              <BellRing className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Predictive warnings</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              Get alerted days before you breach a minimum balance or trigger a
              late-payment penalty.
            </p>
            <div className="mt-6 rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3">
              <p className="text-[11px] font-semibold text-amber-300">
                Minimum balance at risk
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-amber-500/20 overflow-hidden">
                <div className="h-full w-[78%] rounded-full bg-amber-400" />
              </div>
              <p className="mt-2 text-[10px] text-amber-200/60">
                78% depleted · 3 days left
              </p>
            </div>
          </div>

          {/* large: disputes */}
          <div className="lg:col-span-2 group relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-7 sm:p-9 overflow-hidden hover:border-indigo-500/30 transition-colors">
            <div className="relative grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center mb-6">
                  <Scale className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Automated dispute resolution
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Found an error? We draft the exact, regulation-compliant letters
                  needed to escalate to your bank and the ombudsman — you just hit
                  send.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  <span className="text-[11px] font-semibold text-slate-300">
                    dispute_letter.pdf
                  </span>
                  <span className="ml-auto text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    READY
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[100, 92, 96, 70, 88, 60].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full bg-white/10"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  Ombudsman escalation included
                </div>
              </div>
            </div>
          </div>

          {/* security */}
          <div className="md:col-span-2 lg:col-span-3 group relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 hover:border-emerald-500/30 transition-colors overflow-hidden">
            <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-5 md:flex-1">
                <div className="h-12 w-12 shrink-0 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Lock className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1.5">
                    Bank-grade security
                  </h3>
                  <p className="text-slate-400 leading-relaxed text-sm max-w-md">
                    Read-only access via RBI Account Aggregators. AES-256 at rest,
                    TLS 1.3 in transit, and zero data resale — ever.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-end">
                {securityChips.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-[11px] font-semibold text-emerald-300"
                  >
                    <Fingerprint className="h-3.5 w-3.5" /> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
