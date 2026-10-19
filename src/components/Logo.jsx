import { ShieldCheck } from 'lucide-react';

export default function Logo() {
  return (
    <a href="#" className="flex items-center gap-2.5 group">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 group-hover:opacity-70 transition-opacity" />
        <div className="relative bg-gradient-to-br from-emerald-400 to-teal-600 p-2 rounded-xl">
          <ShieldCheck className="h-5 w-5 text-slate-950" strokeWidth={2.5} />
        </div>
      </div>
      <span className="text-xl font-extrabold tracking-tight text-white">
        DigiFin
        <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
          Saviour
        </span>
      </span>
    </a>
  );
}
