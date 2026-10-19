import Logo from './Logo.jsx';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Demo', href: '#demo' },
      { label: 'Security', href: '#features' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Stories', href: '#stories' },
      { label: 'About', href: '#how-it-works' },
      { label: 'Contact', href: '#demo' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'Disclosures', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-slate-500 mt-4 max-w-xs leading-relaxed">
              The AI-powered advocate fighting for consumer fairness in banking.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-bold text-white mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DigiFinSaviour AI. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Not a lender. We audit and advocate — you stay in control.
          </p>
        </div>
      </div>
    </footer>
  );
}
