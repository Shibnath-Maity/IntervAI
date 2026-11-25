import { Link } from "react-router-dom";
import { ArrowRight, FileSearch, Mic, SearchX } from "lucide-react";

const MAX_ROWS = 5;

const statusStyles = {
  Completed: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  "In progress": "bg-indigo-500/10 text-indigo-300 ring-indigo-400/20",
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDuration(minutes) {
  return minutes ? `${minutes} min` : "—";
}

function scoreColor(score) {
  if (score >= 80) return "text-emerald-300";
  if (score >= 65) return "text-amber-300";
  return "text-rose-300";
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        statusStyles[status] || "bg-white/5 text-slate-300 ring-white/10"
      }`}
    >
      {status}
    </span>
  );
}

function ReportLink({ interview }) {
  const available = interview.status === "Completed";

  if (!available) {
    return <span className="text-xs text-slate-600">Not available</span>;
  }

  return (
    <Link
      to={`/dashboard/history/${interview.id}`}
      aria-label={`View report for ${interview.title}`}
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/10 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
    >
      View Report
      <ArrowRight size={14} aria-hidden="true" />
    </Link>
  );
}

function SkeletonRows() {
  return (
    <div aria-hidden="true" className="animate-pulse divide-y divide-white/5">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="flex items-center gap-4 px-6 py-4">
          <div className="h-4 w-1/3 rounded bg-white/10" />
          <div className="h-4 w-20 rounded bg-white/5" />
          <div className="ml-auto h-4 w-16 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ filtered }) {
  const Icon = filtered ? SearchX : FileSearch;

  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-white">
        {filtered ? "No interviews match your search" : "No interviews yet"}
      </h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">
        {filtered
          ? "Try a different title, type or status."
          : "Complete your first mock interview and your results will show up here."}
      </p>
      {filtered ? (
        <Link
          to="/dashboard"
          className="mt-5 text-sm font-medium text-indigo-300 hover:text-indigo-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
        >
          Clear search
        </Link>
      ) : (
        <Link
          to="/dashboard/interview"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
        >
          <Mic size={16} aria-hidden="true" />
          Start your first interview
        </Link>
      )}
    </div>
  );
}

export default function RecentInterviews({ interviews = [], loading = false, query = "" }) {
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? interviews.filter((item) =>
        [item.title, item.type, item.status].some((field) => field.toLowerCase().includes(needle)),
      )
    : interviews;
  const rows = matches.slice(0, MAX_ROWS);

  return (
    <section
      aria-labelledby="recent-interviews-heading"
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <div>
          <h2 id="recent-interviews-heading" className="text-base font-semibold text-white">
            Recent Interviews
          </h2>
          {needle && !loading && (
            <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
              {matches.length} {matches.length === 1 ? "result" : "results"} for “{query.trim()}”
            </p>
          )}
        </div>
        {interviews.length > 0 && (
          <Link
            to="/dashboard/history"
            className="inline-flex items-center gap-1 rounded-md text-sm font-medium text-slate-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
      </div>

      {loading ? (
        <SkeletonRows />
      ) : rows.length === 0 ? (
        <EmptyState filtered={interviews.length > 0} />
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th scope="col" className="px-6 py-3 font-medium">Interview</th>
                  <th scope="col" className="px-3 py-3 font-medium">Type</th>
                  <th scope="col" className="px-3 py-3 font-medium">Date</th>
                  <th scope="col" className="px-3 py-3 font-medium">Duration</th>
                  <th scope="col" className="px-3 py-3 font-medium">Score</th>
                  <th scope="col" className="px-3 py-3 font-medium">Status</th>
                  <th scope="col" className="px-6 py-3 text-right font-medium">
                    <span className="sr-only">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="max-w-[16rem] truncate px-6 py-3.5 font-medium text-slate-100">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">{item.type}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">{formatDate(item.date)}</td>
                    <td className="whitespace-nowrap px-3 py-3.5 text-slate-400">
                      {formatDuration(item.durationMin)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      {item.score == null ? (
                        <span className="text-slate-600">—</span>
                      ) : (
                        <span className={`font-semibold ${scoreColor(item.score)}`}>{item.score}</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3.5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-3.5 text-right">
                      <ReportLink interview={item} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <ul className="divide-y divide-white/5 md:hidden">
            {rows.map((item) => (
              <li key={item.id} className="space-y-3 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{item.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {item.type} · {formatDate(item.date)} · {formatDuration(item.durationMin)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Score{" "}
                    {item.score == null ? (
                      <span className="text-slate-600">—</span>
                    ) : (
                      <span className={`text-sm font-semibold ${scoreColor(item.score)}`}>{item.score}</span>
                    )}
                  </p>
                  <ReportLink interview={item} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}