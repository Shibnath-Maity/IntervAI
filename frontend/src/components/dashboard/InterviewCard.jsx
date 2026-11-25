import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

/**
 * A "Quick start" option. Navigates to `to` — the interview setup page can read
 * the `mode` query param (resume | jd | general) to preselect the flow.
 */
export default function InterviewCard({ icon: Icon, title, description, steps = [], ctaLabel, to }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-white/[0.05]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-500/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />

      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))] text-indigo-200 ring-1 ring-inset ring-indigo-400/25">
        <Icon size={22} aria-hidden="true" />
      </span>

      <h3 className="mt-5 text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{description}</p>

      <ul className="mt-5 space-y-2.5">
        {steps.map((step) => (
          <li key={step} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-indigo-400" />
            <span>{step}</span>
          </li>
        ))}
      </ul>

      <Link
        to={to}
        className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:border-indigo-400/50 hover:bg-indigo-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 sm:mt-auto"
      >
        {ctaLabel}
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </article>
  );
}