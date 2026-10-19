import { Star } from 'lucide-react';
import SectionHeading from './SectionHeading.jsx';

const stories = [
  {
    quote:
      'Found a "processing fee" I had been paying for 14 months. Got ₹6,700 back and the fee removed permanently.',
    name: 'Ananya R.',
    role: 'Salaried · Bengaluru',
    initials: 'AR',
  },
  {
    quote:
      'The bureau audit caught a late-payment flag on a loan I had already closed. My score jumped 40 points after the correction.',
    name: 'Rohit M.',
    role: 'Freelancer · Pune',
    initials: 'RM',
  },
  {
    quote:
      'The dispute letter was ready in seconds and quoted regulations I did not even know existed. Bank reversed the charge in 4 days.',
    name: 'Fatima S.',
    role: 'Small business owner · Hyderabad',
    initials: 'FS',
  },
];

const stars = [...Array(5)];

export default function Stories() {
  return (
    <section
      id="stories"
      className="relative py-24 lg:py-32 border-y border-white/5 bg-white/[0.015]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Real recoveries"
          title="People who stopped paying for mistakes."
        />

        <div className="grid md:grid-cols-3 gap-5">
          {stories.map((s) => (
            <div
              key={s.name}
              className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-7 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex gap-0.5 mb-5">
                {stars.map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-emerald-400 text-emerald-400"
                  />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400/30 to-teal-500/30 border border-white/10 flex items-center justify-center text-xs font-bold text-emerald-300">
                  {s.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{s.name}</p>
                  <p className="text-xs text-slate-500">{s.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
