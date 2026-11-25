import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flame,
  Mic,
  Sparkles,
  Target,
} from "lucide-react";
import { useDashboardData } from "../hooks/useDashboardData";
import StatsCard from "../components/dashboard/StatsCard";
import InterviewCard from "../components/dashboard/InterviewCard";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import PerformanceChart from "../components/dashboard/PerformanceChart";

// The interview setup page can read ?mode= to preselect the flow.
const quickStartOptions = [
  {
    key: "resume",
    icon: FileText,
    title: "Resume-Based Interview",
    description: "Practice with questions built around your own background.",
    steps: [
      "Upload your resume",
      "AI analyzes your skills, projects, education, and experience",
      "Get personalized technical and HR questions",
    ],
    ctaLabel: "Start with resume",
    to: "/dashboard/interview?mode=resume",
  },
  {
    key: "jd",
    icon: Briefcase,
    title: "Job Description Interview",
    description: "Prepare for a specific role you're applying to.",
    steps: [
      "Upload your resume",
      "Paste the job description",
      "AI generates role-specific interview questions",
    ],
    ctaLabel: "Match a job",
    to: "/dashboard/interview?mode=jd",
  },
  {
    key: "general",
    icon: Sparkles,
    title: "General Mock Interview",
    description: "Jump into a session without any setup documents.",
    steps: [
      "Select a domain and difficulty",
      "Choose an interview type",
      "Start your mock interview",
    ],
    ctaLabel: "Start mock interview",
    to: "/dashboard/interview?mode=general",
  },
];

function SectionHeading({ id, children, description }) {
  return (
    <div className="mb-4">
      <h2 id={id} className="text-base font-semibold text-white">
        {children}
      </h2>
      {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { loading, error, data } = useDashboardData();
  const [params] = useSearchParams();
  const query = params.get("q") ?? "";

  const stats = data?.stats;
  const completionRate =
    stats && stats.totalInterviews > 0
      ? Math.round((stats.completedInterviews / stats.totalInterviews) * 100)
      : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track your preparation and start your next practice session.
          </p>
        </div>
        <Link
          to="/dashboard/interview"
          className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
        >
          <Mic size={16} aria-hidden="true" />
          New Interview
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200"
        >
          <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          <p>We couldn't load your dashboard data. Please refresh and try again.</p>
        </div>
      )}

      <section aria-label="Statistics">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            loading={loading}
            icon={ClipboardList}
            label="Total Interviews"
            value={stats?.totalInterviews}
            hint={stats && `+${stats.interviewsThisWeek} this week`}
            trend="up"
          />
          <StatsCard
            loading={loading}
            icon={CheckCircle2}
            label="Interviews Completed"
            value={stats?.completedInterviews}
            hint={stats && `${completionRate}% completion rate`}
          />
          <StatsCard
            loading={loading}
            icon={Target}
            label="Average Interview Score"
            value={stats?.averageScore}
            suffix="/ 100"
            hint={stats && `+${stats.averageScoreChange} pts vs last month`}
            trend="up"
          />
          <StatsCard
            loading={loading}
            icon={Flame}
            label="Preparation Streak"
            value={stats?.streakDays}
            suffix={stats?.streakDays === 1 ? "day" : "days"}
            hint={stats && `Longest: ${stats.longestStreakDays} days`}
          />
        </div>
      </section>

      <section aria-labelledby="quick-start-heading">
        <SectionHeading id="quick-start-heading" description="Pick how you'd like to practice today.">
          Quick Start Interview
        </SectionHeading>
        <div className="grid gap-4 lg:grid-cols-3">
          {quickStartOptions.map(({ key, ...option }) => (
            <InterviewCard key={key} {...option} />
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentInterviews interviews={data?.interviews} loading={loading} query={query} />
        </div>
        <div className="xl:col-span-2">
          <PerformanceChart performance={data?.performance} loading={loading} />
        </div>
      </div>
    </div>
  );
}