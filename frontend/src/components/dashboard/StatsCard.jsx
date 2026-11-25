export default function StatsCard({ icon: Icon, label, value, suffix, hint, trend, loading = false }) {
  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="h-9 w-9 rounded-lg bg-white/10" />
        </div>
        <div className="mt-5 h-8 w-20 rounded bg-white/10" />
        <div className="mt-3 h-3 w-24 rounded bg-white/5" />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition duration-200 hover:border-white/20 hover:bg-white/[0.05]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>

      <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
        {value}
        {suffix && <span className="ml-1.5 text-base font-medium text-slate-500">{suffix}</span>}
      </p>

      {hint && (
        <p className={`mt-1.5 text-xs ${trend === "up" ? "text-emerald-400" : "text-slate-500"}`}>
          {hint}
        </p>
      )}
    </div>
  );
}