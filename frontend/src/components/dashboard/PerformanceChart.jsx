import { useEffect, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

// Radar geometry (SVG user units)
const VIEW_W = 360;
const VIEW_H = 270;
const CX = VIEW_W / 2;
const CY = 135;
const RADIUS = 85;
const RINGS = [25, 50, 75, 100];

function polar(index, count, radius) {
  const angle = (-90 + (360 / count) * index) * (Math.PI / 180);
  return [CX + radius * Math.cos(angle), CY + radius * Math.sin(angle)];
}

function labelAnchor(index, count) {
  const [x] = polar(index, count, 1);
  if (Math.abs(x - CX) < 0.001) return "middle";
  return x > CX ? "start" : "end";
}

function Delta({ value, previous }) {
  const diff = value - previous;
  if (diff === 0) return <span className="text-xs text-slate-500">no change</span>;

  const up = diff > 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"}`}>
      <Icon size={13} aria-hidden="true" />
      {up ? "+" : ""}
      {diff}
      <span className="sr-only"> points compared with last period</span>
    </span>
  );
}

function Radar({ skills }) {
  const count = skills.length;
  const summary = skills.map((skill) => `${skill.label} ${skill.value}`).join(", ");
  const points = skills.map((skill, index) => polar(index, count, (RADIUS * skill.value) / 100));

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="img"
      aria-label={`Skill radar chart: ${summary}`}
      className="mx-auto h-auto w-full max-w-sm"
    >
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={skills.map((_, i) => polar(i, count, (RADIUS * ring) / 100).join(",")).join(" ")}
          className="fill-none stroke-white/10"
          strokeWidth="1"
        />
      ))}

      {skills.map((_, index) => {
        const [x, y] = polar(index, count, RADIUS);
        return <line key={index} x1={CX} y1={CY} x2={x} y2={y} className="stroke-white/10" strokeWidth="1" />;
      })}

      <polygon
        points={points.map((p) => p.join(",")).join(" ")}
        className="fill-indigo-500/25 stroke-indigo-400"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {points.map(([x, y], index) => (
        <circle key={skills[index].key} cx={x} cy={y} r="4" className="fill-[#0a0e1a] stroke-indigo-300" strokeWidth="2" />
      ))}

      {skills.map((skill, index) => {
        const [x, y] = polar(index, count, RADIUS + 14);
        const anchor = labelAnchor(index, count);
        const dy = index === 0 ? -2 : index === count / 2 ? 12 : 4;
        return (
          <g key={skill.key}>
            <text x={x} y={y + dy} textAnchor={anchor} className="fill-slate-400" fontSize="11.5">
              {skill.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ScoreBar({ label, value, previous, ready, emphasis = false }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className={emphasis ? "text-sm font-semibold text-white" : "text-sm text-slate-300"}>{label}</span>
        <span className="flex items-center gap-2.5">
          <Delta value={value} previous={previous} />
          <span className={`tabular-nums ${emphasis ? "text-lg font-semibold text-white" : "text-sm font-medium text-slate-200"}`}>
            {value}
          </span>
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={`overflow-hidden rounded-full bg-white/10 ${emphasis ? "h-2.5" : "h-1.5"}`}
      >
        <div
          style={{ width: ready ? `${value}%` : "0%" }}
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${
            emphasis ? "bg-[linear-gradient(90deg,#6366f1,#a78bfa)]" : "bg-indigo-400/80"
          }`}
        />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse space-y-6 p-6">
      <div className="mx-auto h-48 w-48 rounded-full bg-white/5" />
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} className="space-y-2">
          <div className="h-3 w-1/3 rounded bg-white/10" />
          <div className="h-2 w-full rounded bg-white/5" />
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart({ performance, loading = false }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return undefined;
    const timer = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <section
      aria-labelledby="performance-heading"
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur"
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <h2 id="performance-heading" className="text-base font-semibold text-white">
          Performance Overview
        </h2>
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400 ring-1 ring-inset ring-white/10">
          Last 30 days
        </span>
      </div>

      {loading || !performance ? (
        <Skeleton />
      ) : (
        <div className="grid gap-8 p-6 md:grid-cols-2 md:items-center xl:grid-cols-1">
          <Radar skills={performance.skills} />

          <div className="space-y-5">
            <ScoreBar
              emphasis
              label="Overall Performance"
              value={performance.overall.value}
              previous={performance.overall.previous}
              ready={ready}
            />
            <div className="h-px bg-white/10" />
            {performance.skills.map((skill) => (
              <ScoreBar
                key={skill.key}
                label={skill.label}
                value={skill.value}
                previous={skill.previous}
                ready={ready}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}