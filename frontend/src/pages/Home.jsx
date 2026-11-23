import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/* ---------- content ---------- */

const modes = [
  {
    name: "Resume interview",
    body: "Questions come from your own projects, internships and tech stack. Say you used Redis, and you will be asked why.",
    needs: "Your resume",
  },
  {
    name: "Resume + job description",
    body: "Paste a job posting. IntervAI compares it with your resume, finds the skills you are missing and asks about those first.",
    needs: "Resume and a job post",
  },
  {
    name: "General interview",
    body: "Technical, HR, DSA and CS fundamentals, for when you want practice on a topic and not on your resume.",
    needs: "Nothing to upload",
  },
];

const steps = [
  {
    title: "Upload your resume",
    body: "We read the PDF and pull out your skills, projects, internships, education and certifications.",
  },
  {
    title: "Pick an interview type",
    body: "Resume-based, resume plus a job description, or a general technical or HR round.",
  },
  {
    title: "Answer out loud or in text",
    body: "Each answer shapes the next question. A weak answer gets a follow-up. A strong one gets a harder question.",
  },
  {
    title: "Read your report",
    body: "A score for every question, your strengths and weak spots, and what to study before the next attempt.",
  },
];

const criteria = [
  { label: "Technical accuracy", score: 8 },
  { label: "Conceptual understanding", score: 7 },
  { label: "Relevance to the question", score: 9 },
  { label: "Communication", score: 6 },
  { label: "Problem solving", score: 5 },
];

/* ---------- hero: a short interview, played once ---------- */

function InterviewPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStep(4);
      return;
    }
    const timers = [600, 2200, 4200, 5800].map((ms, i) =>
      setTimeout(() => setStep(i + 1), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const show = (n) =>
    `transition-opacity duration-500 ${step >= n ? "opacity-100" : "opacity-0"}`;

  return (
    <div
      className="rounded-md border border-ink/80 bg-white"
      aria-label="Example of an IntervAI interview"
    >
      <div className="flex items-center justify-between border-b border-ink/15 px-5 py-3 text-sm text-ink/60">
        <span>Resume interview · Question 3 of 10</span>
        <span>Difficulty: medium</span>
      </div>

      <div className="space-y-6 px-5 py-6">
        <div className={show(1)}>
          <p className="mb-1 text-sm font-semibold text-cobalt">Interviewer</p>
          <p className="leading-relaxed">
            Your Chat App project stores sessions in Redis. Why Redis, and not
            just keep them in server memory?
          </p>
        </div>

        <div className={show(2)}>
          <p className="mb-1 text-sm font-semibold text-ink/60">You</p>
          <p className="leading-relaxed text-ink/90">
            Memory is lost on restart, and every server instance would have its
            own copy. Redis is shared, so any instance can read the session, and
            keys can expire on their own.
          </p>
        </div>

        <div className={`${show(3)} rounded border-l-4 border-cobalt bg-paper px-4 py-3`}>
          <p className="text-sm font-semibold">Feedback · 7 / 10</p>
          <p className="mt-1 text-[15px] leading-relaxed">
            You covered shared state and expiry correctly. You did not mention{" "}
            <mark className="bg-marker px-0.5">
              what happens when Redis goes down
            </mark>
            .
          </p>
        </div>

        <div className={show(4)}>
          <p className="mb-1 text-sm font-semibold text-cobalt">Interviewer</p>
          <p className="leading-relaxed">
            Right. So if Redis goes down mid-session, what do your logged-in
            users see?
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

export default function Home() {
  return (
    <div className="min-h-screen bg-paper font-body text-ink antialiased">
      {/* nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="font-display text-2xl font-bold tracking-tight">
          IntervAI
        </Link>
        <nav className="flex items-center gap-1 text-[15px] sm:gap-2">
          <a href="#how" className="hidden px-3 py-2 hover:text-cobalt sm:block">
            How it works
          </a>
          <a href="#modes" className="hidden px-3 py-2 hover:text-cobalt sm:block">
            Interview types
          </a>
          <Link to="/login" className="px-3 py-2 hover:text-cobalt">
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded bg-ink px-4 py-2 font-medium text-white hover:bg-cobalt"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main>
        {/* hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-24 pt-12 lg:grid-cols-[1fr_1.05fr] lg:pt-20">
          <div>
            <h1 className="font-display text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Get questioned on your own resume before the real interview does.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
              Upload your resume and answer interview questions built from your
              projects. Every answer is scored, and weak ones get a follow-up.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <Link
                to="/register"
                className="rounded bg-cobalt px-6 py-3.5 font-semibold text-white hover:bg-ink"
              >
                Start a mock interview
              </Link>
              <a href="#how" className="font-medium underline underline-offset-4 hover:text-cobalt">
                See how a session works
              </a>
            </div>
          </div>

          <InterviewPreview />
        </section>

        {/* interview types */}
        <section id="modes" className="border-t border-ink/15">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="max-w-xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Three ways to practice
            </h2>

            <div className="mt-10">
              {modes.map((m) => (
                <div
                  key={m.name}
                  className="grid gap-2 border-t border-ink/15 py-7 md:grid-cols-[1fr_1.6fr_auto] md:gap-10"
                >
                  <h3 className="font-display text-xl font-semibold">{m.name}</h3>
                  <p className="max-w-lg leading-relaxed text-ink/75">{m.body}</p>
                  <p className="text-sm text-ink/55 md:text-right">{m.needs}</p>
                </div>
              ))}
              <div className="border-t border-ink/15" />
            </div>
          </div>
        </section>

        {/* how it works: a real sequence, so numbered */}
        <section id="how" className="border-t border-ink/15 bg-white">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1.6fr]">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              What happens in a session
            </h2>

            <ol className="space-y-9">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="font-display text-3xl font-bold leading-none text-cobalt">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-1 max-w-md leading-relaxed text-ink/75">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* report */}
        <section className="border-t border-ink/15">
          <div className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                A report that says what to fix
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-ink/75">
                Each answer is judged on five things. After the session you see
                where you were strong, where you lost marks, and what to revise
                before trying again. Your history stays on your dashboard, so
                you can check whether you are improving.
              </p>
            </div>

            <div className="rounded-md border border-ink/80 bg-white p-6">
              <p className="mb-5 text-sm text-ink/55">Example report</p>
              <ul className="space-y-4">
                {criteria.map((c) => (
                  <li key={c.label}>
                    <div className="mb-1.5 flex justify-between text-[15px]">
                      <span>{c.label}</span>
                      <span className="font-semibold">{c.score}/10</span>
                    </div>
                    <div className="h-2 rounded-full bg-ink/10">
                      <div
                        className="h-2 rounded-full bg-cobalt"
                        style={{ width: `${c.score * 10}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* honest monitoring note */}
        <section className="border-t border-ink/15">
          <div className="mx-auto max-w-6xl px-6 py-14">
            <p className="max-w-2xl leading-relaxed text-ink/75">
              <span className="font-semibold text-ink">About monitoring.</span>{" "}
              Voice answers, tab-switch warnings and background-noise alerts
              are there to make practice feel like the real thing. They are
              logged in your report as feedback for you. A browser cannot prove
              whether someone cheated, and IntervAI does not claim to.
            </p>
          </div>
        </section>

        {/* closing call to action */}
        <section className="bg-ink text-white">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-center">
            <h2 className="max-w-lg font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Upload your resume and answer your first question.
            </h2>
            <Link
              to="/register"
              className="rounded bg-marker px-7 py-3.5 font-semibold text-ink hover:bg-white"
            >
              Create an account
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-8 text-sm text-ink/60">
        <span className="font-display font-semibold text-ink">IntervAI</span>
        <span>Your Interview. Your Future.</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
}