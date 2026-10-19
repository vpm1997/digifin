import { ArrowRight, CheckCircle2, Lock, ShieldCheck } from 'lucide-react';

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[30rem] w-[50rem] max-w-full bg-emerald-500/15 blur-[120px] rounded-full" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/25 mb-8">
          <ShieldCheck className="h-7 w-7 text-emerald-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
          Find out what your bank
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            owes you.
          </span>
        </h2>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-9">
          Free first audit. No card, no commitment. Read-only access, encrypted end
          to end.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3.5">
          <a
            href="#demo"
            className="group flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-emerald-500/20"
          >
            Run my free audit
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#features"
            className="flex items-center justify-center gap-2 border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-base transition-all"
          >
            <Lock className="h-[18px] w-[18px] text-slate-400" /> How we protect your
            data
          </a>
        </div>
        <p className="mt-6 text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          RBI Account Aggregator compliant · Read-only access
        </p>
      </div>
    </section>
  );
}
