import { Link } from "react-router-dom";
import { ArrowLeft, Construction } from "lucide-react";

/**
 * Placeholder for dashboard routes that aren't built yet, so every sidebar
 * link lands somewhere instead of a blank page. Replace per-route as you build them.
 */
export default function ComingSoon({ title, description = "This section is on its way." }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
        <Construction size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
      >
        <ArrowLeft size={15} aria-hidden="true" />
        Back to overview
      </Link>
    </div>
  );
}