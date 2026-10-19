import { Component } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            The page hit an unexpected error. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-full text-sm font-bold transition-colors"
          >
            <RotateCcw className="h-4 w-4" /> Reload page
          </button>
        </div>
      </div>
    );
  }
}
