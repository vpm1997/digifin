import { Activity, Cpu, Wallet, Zap } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const steps = [
  {
    icon: Wallet,
    title: 'Sync securely',
    description:
      'Connect via trusted Account Aggregators or drop in your e-statements. Read-only, always.',
  },
  {
    icon: Cpu,
    title: 'AI reads the fine print',
    description:
      'Claude models parse your bank contracts, fee schedules and terms in seconds.',
  },
  {
    icon: Activity,
    title: 'Every line audited',
    description:
      'Each transaction is checked for valid fees and mathematically correct interest.',
  },
  {
    icon: Zap,
    title: 'Take action',
    description:
      'Approve auto-drafted escalation emails and watch your refunds land.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative py-24 lg:py-32 border-y border-white/5 bg-white/[0.015] overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-[40rem] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          eyebrow="The process"
          title="Four steps to financial peace of mind."
          subtitle="From statement to settlement, the whole thing takes minutes — not months."
        />

        <div className="relative grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0" />
          {steps.map((step, i) => (
            <div key={step.title} className="relative group">
              <div className="relative z-10 mx-auto lg:mx-0 h-16 w-16 mb-6">
                <div className="h-16 w-16 rounded-2xl border border-white/10 bg-slate-900 flex items-center justify-center group-hover:border-emerald-500/40 group-hover:bg-emerald-500/5 transition-colors">
                  <step.icon className="h-7 w-7 text-emerald-400" />
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
