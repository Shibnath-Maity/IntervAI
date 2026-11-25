import { useId, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Briefcase, FileText, Loader2, Play, Sparkles } from "lucide-react";
import ResumeUpload from "../components/interview/ResumeUpload";
import SelectField from "../components/interview/SelectField";
import {
  DIFFICULTIES,
  DOMAINS,
  INTERVIEW_TYPES,
  MAX_JD_CHARS,
  MIN_JD_CHARS,
  QUESTION_COUNT_BY_DIFFICULTY,
} from "../data/interviewOptions";
import { createInterview } from "../services/interviewService";

const MODES = [
  {
    key: "resume",
    label: "Resume-Based",
    icon: FileText,
    description: "Upload your resume. AI analyzes your skills, projects, education and experience, then generates personalized technical and HR questions.",
  },
  {
    key: "jd",
    label: "Job Description",
    icon: Briefcase,
    description: "Upload your resume and paste a job description. AI generates role-specific interview questions.",
  },
  {
    key: "general",
    label: "General Mock",
    icon: Sparkles,
    description: "Pick a domain, difficulty and interview type, then start a general mock interview.",
  },
];

const DEFAULT_MODE = "resume";

export default function NewInterview() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const jdId = useId();

  const requestedMode = params.get("mode");
  const mode = MODES.some((item) => item.key === requestedMode) ? requestedMode : DEFAULT_MODE;
  const activeMode = MODES.find((item) => item.key === mode);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [domain, setDomain] = useState(DOMAINS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[1]);
  const [type, setType] = useState(INTERVIEW_TYPES[0]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const needsResume = mode === "resume" || mode === "jd";
  const trimmedJd = jobDescription.trim();

  const selectMode = (key) => {
    setErrors({});
    setSubmitError(null);
    setParams({ mode: key }, { replace: true });
  };

  const handleTabKeyDown = (event) => {
    const index = MODES.findIndex((item) => item.key === mode);
    let next = null;
    if (event.key === "ArrowRight") next = (index + 1) % MODES.length;
    if (event.key === "ArrowLeft") next = (index - 1 + MODES.length) % MODES.length;
    if (next === null) return;
    event.preventDefault();
    selectMode(MODES[next].key);
    document.getElementById(`mode-tab-${MODES[next].key}`)?.focus();
  };

  const validate = () => {
    const found = {};
    if (needsResume && !file) found.resume = "Upload your resume to continue.";
    if (mode === "jd") {
      if (!trimmedJd) found.jd = "Paste the job description to continue.";
      else if (trimmedJd.length < MIN_JD_CHARS)
        found.jd = `Add a bit more detail — at least ${MIN_JD_CHARS} characters (you have ${trimmedJd.length}).`;
    }
    return found;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const interview = await createInterview({
        mode,
        resumeName: needsResume ? file.name : null,
        jobDescription: mode === "jd" ? trimmedJd : null,
        domain: mode === "general" ? domain : null,
        difficulty,
        type,
      });
      navigate(`/dashboard/interview/session/${interview.id}`);
    } catch (error) {
      console.error("Could not start interview", error);
      setSubmitError("We couldn't start your interview. Please try again.");
      setSubmitting(false);
    }
  };

  const questionCount = QUESTION_COUNT_BY_DIFFICULTY[difficulty];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-white">New Interview</h2>
        <p className="mt-1 text-sm text-slate-500">Choose how you want to practice, then set it up.</p>
      </div>

      <div
        role="tablist"
        aria-label="Interview mode"
        onKeyDown={handleTabKeyDown}
        className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 sm:grid-cols-3"
      >
        {MODES.map(({ key, label, icon: Icon }) => {
          const selected = key === mode;
          return (
            <button
              key={key}
              id={`mode-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="mode-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectMode(key)}
              className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 ${
                selected
                  ? "bg-indigo-500/20 text-white ring-1 ring-inset ring-indigo-400/30"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>

      <form
        id="mode-panel"
        role="tabpanel"
        aria-labelledby={`mode-tab-${mode}`}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
      >
        <p className="text-sm leading-relaxed text-slate-400">{activeMode.description}</p>

        {needsResume && (
          <ResumeUpload
            file={file}
            error={errors.resume}
            onChange={(next) => {
              setFile(next);
              setErrors((current) => ({ ...current, resume: undefined }));
            }}
          />
        )}

        {mode === "jd" && (
          <div>
            <label htmlFor={jdId} className="mb-2 block text-sm font-medium text-slate-200">
              Job description
            </label>
            <textarea
              id={jdId}
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value.slice(0, MAX_JD_CHARS));
                setErrors((current) => ({ ...current, jd: undefined }));
              }}
              rows={8}
              placeholder="Paste the full job description here…"
              aria-invalid={Boolean(errors.jd)}
              aria-describedby={errors.jd ? `${jdId}-error` : `${jdId}-count`}
              className={`w-full resize-y rounded-lg border bg-white/[0.04] px-3.5 py-3 text-sm leading-relaxed text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ${
                errors.jd
                  ? "border-rose-400/50 focus:ring-rose-400/20"
                  : "border-white/10 focus:border-indigo-400/50 focus:ring-indigo-400/20"
              }`}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4">
              {errors.jd ? (
                <p id={`${jdId}-error`} role="alert" className="text-sm text-rose-300">
                  {errors.jd}
                </p>
              ) : (
                <span />
              )}
              <p id={`${jdId}-count`} className="shrink-0 text-xs text-slate-500">
                {trimmedJd.length} / {MAX_JD_CHARS}
              </p>
            </div>
          </div>
        )}

        <div className={`grid gap-4 ${mode === "general" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
          {mode === "general" && <SelectField label="Domain" value={domain} onChange={setDomain} options={DOMAINS} />}
          <SelectField label="Difficulty" value={difficulty} onChange={setDifficulty} options={DIFFICULTIES} />
          <SelectField label="Interview type" value={type} onChange={setType} options={INTERVIEW_TYPES} />
        </div>

        {submitError && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200"
          >
            <AlertCircle size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
            <p>{submitError}</p>
          </div>
        )}

        <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            {questionCount} questions · answer by typing{" "}
            <span className="hidden sm:inline">or dictating</span>
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(135deg,#6366f1,#8b5cf6)] px-5 py-2.5 text-sm font-medium text-white shadow-[0_0_24px_rgba(99,102,241,0.25)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} aria-hidden="true" className="animate-spin" />
                Preparing questions…
              </>
            ) : (
              <>
                <Play size={16} aria-hidden="true" />
                Start Interview
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}