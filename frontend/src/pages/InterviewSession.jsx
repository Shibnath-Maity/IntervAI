import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock, FileQuestion, Loader2, Mic, MicOff } from "lucide-react";
import useSpeechRecognition from "../hooks/useSpeechRecognition";
import { getInterview, submitInterview } from "../services/interviewService";

const MAX_ANSWER_CHARS = 4000;

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-400 ring-1 ring-inset ring-white/10">
        <FileQuestion size={22} aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-white">Interview not found</h2>
      <p className="mt-1 text-sm text-slate-500">
        This session has expired or doesn't exist. Start a new one to continue.
      </p>
      <Link
        to="/dashboard/interview"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
      >
        Start a new interview
      </Link>
    </div>
  );
}

function Result({ interview, result }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
          <CheckCircle2 size={24} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-xl font-semibold text-white">Interview complete</h2>
        <p className="mt-1 text-sm text-slate-500">{interview.title}</p>

        <p className="mt-6 text-5xl font-semibold tracking-tight text-white">
          {result.overall}
          <span className="ml-1 text-lg font-medium text-slate-500">/ 100</span>
        </p>
        <p className="mt-2 text-sm text-slate-400">
          {result.answered} of {result.total} answered · {formatTime(result.durationSec)}
        </p>
        {result.mock && (
          <p className="mx-auto mt-4 max-w-sm text-xs text-slate-500">
            Placeholder score based on answer length. Real AI feedback arrives once the backend is connected.
          </p>
        )}
      </div>

      <section aria-labelledby="breakdown-heading" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 id="breakdown-heading" className="mb-5 text-base font-semibold text-white">
          Skill breakdown
        </h3>
        <div className="space-y-4">
          {result.breakdown.map((item) => (
            <div key={item.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-slate-300">{item.label}</span>
                <span className="font-medium tabular-nums text-slate-200">{item.value}</span>
              </div>
              <div
                role="progressbar"
                aria-label={item.label}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={item.value}
                className="h-1.5 overflow-hidden rounded-full bg-white/10"
              >
                <div className="h-full rounded-full bg-indigo-400/80" style={{ width: `${item.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="answers-heading" className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h3 id="answers-heading" className="mb-4 text-base font-semibold text-white">
          Questions
        </h3>
        <ol className="divide-y divide-white/5">
          {interview.questions.map((question, index) => (
            <li key={question.id} className="flex items-start justify-between gap-4 py-3 text-sm">
              <span className="text-slate-300">
                <span className="mr-2 text-slate-500">{index + 1}.</span>
                {question.text}
              </span>
              <span className="shrink-0 text-xs text-slate-500">
                {result.wordCounts[index] > 0 ? `${result.wordCounts[index]} words` : "Skipped"}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Link
          to="/dashboard"
          className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
        >
          Back to overview
        </Link>
        <Link
          to="/dashboard/interview"
          className="inline-flex items-center justify-center rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
        >
          Start another interview
        </Link>
      </div>
    </div>
  );
}

export default function InterviewSession() {
  const { id } = useParams();
  const interview = useMemo(() => getInterview(id), [id]);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(interview?.result ? "done" : "active");
  const [result, setResult] = useState(interview?.result ?? null);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState(null);

  const question = interview?.questions[index];

  const appendDictation = (text) => {
    if (!question) return;
    setAnswers((current) => ({
      ...current,
      [question.id]: `${current[question.id] ?? ""}${text}`.slice(0, MAX_ANSWER_CHARS),
    }));
  };
  const speech = useSpeechRecognition(appendDictation);

  useEffect(() => {
    if (!interview || phase !== "active") return undefined;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [interview, phase]);

  if (!interview) return <NotFound />;
  if (phase === "done" && result) return <Result interview={interview} result={result} />;

  const total = interview.questions.length;
  const answer = answers[question.id] ?? "";
  const unanswered = interview.questions.filter((item) => !(answers[item.id] ?? "").trim()).length;
  const isLast = index === total - 1;
  const submitting = phase === "submitting";

  const goTo = (next) => {
    speech.stop();
    setConfirming(false);
    setIndex(next);
  };

  const finish = async () => {
    speech.stop();
    setPhase("submitting");
    setError(null);
    try {
      const outcome = await submitInterview(interview.id, {
        answers: interview.questions.map((item) => answers[item.id] ?? ""),
        durationSec: elapsed,
      });
      setResult(outcome);
      setPhase("done");
    } catch (submitError) {
      console.error("Could not submit interview", submitError);
      setError("We couldn't submit your answers. Please try again.");
      setPhase("active");
    }
  };

  const handleFinishClick = () => {
    if (unanswered > 0 && !confirming) {
      setConfirming(true);
      return;
    }
    finish();
  };

  const handleExit = (event) => {
    const hasProgress = Object.values(answers).some((text) => text.trim());
    if (hasProgress && !window.confirm("Leave this interview? Your answers will be lost.")) event.preventDefault();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold text-white">{interview.title}</h2>
          <p className="text-sm text-slate-500">
            {interview.config.difficulty} · {interview.config.type}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            role="timer"
            aria-label="Elapsed time"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm tabular-nums text-slate-200"
          >
            <Clock size={15} aria-hidden="true" className="text-slate-500" />
            {formatTime(elapsed)}
          </span>
          <Link
            to="/dashboard/interview"
            onClick={handleExit}
            className="rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            Exit
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{total - unanswered} answered</span>
        </div>
        <div
          role="progressbar"
          aria-label="Interview progress"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={index + 1}
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#a78bfa)] transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
        <span className="inline-flex rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
          {question.category}
        </span>
        <h3 id="current-question" className="mt-4 text-lg font-medium leading-snug text-white">
          {question.text}
        </h3>

        <div className="mt-6">
          <label htmlFor="answer" className="sr-only">
            Your answer
          </label>
          <textarea
            id="answer"
            key={question.id}
            value={answer}
            onChange={(event) =>
              setAnswers((current) => ({ ...current, [question.id]: event.target.value.slice(0, MAX_ANSWER_CHARS) }))
            }
            rows={9}
            disabled={submitting}
            placeholder="Type your answer here…"
            aria-describedby="current-question"
            className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm leading-relaxed text-white placeholder:text-slate-500 focus:border-indigo-400/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 disabled:opacity-60"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-500">{countWords(answer)} words</p>
            {speech.supported && (
              <button
                type="button"
                onClick={speech.listening ? speech.stop : speech.start}
                disabled={submitting}
                aria-pressed={speech.listening}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                  speech.listening
                    ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {speech.listening ? <MicOff size={14} aria-hidden="true" /> : <Mic size={14} aria-hidden="true" />}
                {speech.listening ? "Stop dictation" : "Dictate answer"}
              </button>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200"
        >
          <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {confirming && (
        <div role="alert" className="rounded-lg border border-amber-400/20 bg-amber-500/10 p-3 text-sm text-amber-100">
          You have {unanswered} unanswered {unanswered === 1 ? "question" : "questions"}. Finish anyway?
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0 || submitting}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            onClick={handleFinishClick}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                Submitting…
              </>
            ) : confirming ? (
              "Yes, finish"
            ) : (
              "Finish interview"
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="inline-flex items-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60"
          >
            {answer.trim() ? "Next" : "Skip"}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}