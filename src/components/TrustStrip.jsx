const institutions = [
  'HDFC Bank',
  'ICICI Bank',
  'SBI',
  'Axis Bank',
  'Kotak',
  'CIBIL',
  'Experian',
  'Amex',
];

export default function TrustStrip() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-6">
          Audits statements from 40+ banks &amp; bureaus
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {institutions.map((b) => (
            <span
              key={b}
              className="text-sm lg:text-base font-bold text-slate-300 tracking-tight"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
