import { ArrowRight, Play, Sparkles } from 'lucide-react';
import DashboardMock from './DashboardMock.jsx';

const stats = [
  { value: '₹2.4 Cr+', label: 'Recovered for users' },
  { value: '98%', label: 'Dispute win rate' },
  { value: '14 sec', label: 'Avg. audit time' },
];

export default function Hero() {
  return (
    <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(45,212,191,0.08),transparent_45%),radial-gradient(circle_at_60%_90%,rgba(56,189,248,0.06),transparent_40%)]" />
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent 75%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-7">
              <Sparkles className="h-3.5 w-3.5" />
              AI-powered by Anthropic Claude
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              <span className="text-emerald-400/80">v2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.25rem] font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Your bank is charging
              <br />
              you for things it
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                shouldn't.
              </span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed max-w-xl mb-9">
              DigiFinSaviour audits every statement, cross-checks the fine print,
              and fights back against hidden fees, bogus interest and silent
              credit bureau errors — automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-10">
              <a
                href="#demo"
                className="group flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-7 py-3.5 rounded-full font-bold transition-all shadow-lg shadow-emerald-500/20"
              >
                Run my free audit
                <ArrowRight className="h-[18px] w-[18px] group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#demo"
                className="flex items-center justify-center gap-2.5 border border-white/10 hover:border-white/25 bg-white/5 hover:bg-white/10 text-white px-7 py-3.5 rounded-full font-semibold transition-all"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                See a live demo
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-center gap-8">
                  {i > 0 && <div className="h-8 w-px bg-white/10" />}
                  <div>
                    <p className="text-2xl font-extrabold text-white">{s.value}</p>
                    <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}
