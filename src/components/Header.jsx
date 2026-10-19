import { useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo.jsx';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
  { label: 'Stories', href: '#stories' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="#demo"
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign in
            </a>
            <a
              href="#demo"
              className="group flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors"
            >
              Get started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-950">
          <div className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-slate-300 font-medium rounded-xl hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full mt-2 bg-emerald-500 text-slate-950 px-6 py-3 rounded-xl font-bold text-center"
            >
              Get started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
