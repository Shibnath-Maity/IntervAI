import { useId, useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { MAX_RESUME_MB, RESUME_ACCEPT, RESUME_EXTENSIONS } from "../../data/interviewOptions";

function formatSize(bytes) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function validate(file) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!RESUME_EXTENSIONS.includes(extension)) return "Please upload a PDF, DOC or DOCX file.";
  if (file.size > MAX_RESUME_MB * 1024 * 1024) return `File is too large. The limit is ${MAX_RESUME_MB} MB.`;
  if (file.size === 0) return "That file is empty.";
  return null;
}

export default function ResumeUpload({ file, onChange, error }) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState(null);
  const message = localError || error;

  const accept = (candidate) => {
    if (!candidate) return;
    const problem = validate(candidate);
    setLocalError(problem);
    if (!problem) onChange(candidate);
  };

  const remove = () => {
    setLocalError(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <span className="mb-2 block text-sm font-medium text-slate-200">Resume</span>

      {file ? (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-400/20">
            <FileText size={20} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
          </div>
          <button
            type="button"
            onClick={remove}
            aria-label={`Remove ${file.name}`}
            className="rounded-md p-2 text-slate-500 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            accept(event.dataTransfer.files?.[0]);
          }}
          className={`flex cursor-pointer flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center transition focus-within:ring-2 focus-within:ring-indigo-400/60 ${
            dragging
              ? "border-indigo-400 bg-indigo-500/10"
              : message
                ? "border-rose-400/50 bg-rose-500/5"
                : "border-white/15 bg-white/[0.02] hover:border-indigo-400/40 hover:bg-white/[0.04]"
          }`}
        >
          <UploadCloud size={28} aria-hidden="true" className="text-indigo-300" />
          <span className="mt-3 text-sm font-medium text-white">Drop your resume here, or click to browse</span>
          <span className="mt-1 text-xs text-slate-500">PDF, DOC or DOCX · up to {MAX_RESUME_MB} MB</span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept={RESUME_ACCEPT}
            aria-describedby={message ? errorId : undefined}
            aria-invalid={Boolean(message)}
            onChange={(event) => accept(event.target.files?.[0])}
            className="sr-only"
          />
        </label>
      )}

      {message && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-rose-300">
          {message}
        </p>
      )}
    </div>
  );
}