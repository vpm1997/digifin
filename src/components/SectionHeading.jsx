export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-16">
      {eyebrow && (
        <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-400 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
