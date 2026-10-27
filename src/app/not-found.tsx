import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 shadow-sm">
        <Home className="w-8 h-8" />
      </div>
      <span className="text-emerald-700 font-semibold tracking-wider text-sm uppercase mb-2">
        404 - Property Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
        Looking for a Home in Nigeria?
      </h1>
      <p className="text-slate-600 max-w-md mb-8 text-base">
        The listing or page you are looking for may have been leased, sold, or moved to a new address.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg shadow-sm transition-all text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/#listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium rounded-lg transition-all text-sm"
        >
          <Search className="w-4 h-4" />
          Browse Properties
        </Link>
      </div>
    </div>
  );
}
