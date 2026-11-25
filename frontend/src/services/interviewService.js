/**
 * MOCK interview service.
 *
 * No network requests are made and no endpoints are assumed. Interviews are kept
 * in memory and mirrored to sessionStorage so a page refresh doesn't lose them.
 *
 * When the backend exists, keep these four exports and their return shapes and
 * replace the bodies with real requests:
 *   createInterview(config)            -> interview
 *   getInterview(id)                   -> interview | null   (make async if needed)
 *   submitInterview(id, payload)       -> result
 *   getInterviewTitle(config)          -> string
 */
import {
  DOMAIN_QUESTIONS,
  GENERIC_TECHNICAL,
  HR_QUESTIONS,
  JD_QUESTIONS,
  RESUME_QUESTIONS,
} from "../data/mockQuestions";
import { QUESTION_COUNT_BY_DIFFICULTY } from "../data/interviewOptions";

const STORAGE_KEY = "intervai:mock-interviews";
const memory = {};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function readStore() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function save(interview) {
  memory[interview.id] = interview;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStore(), [interview.id]: interview }));
  } catch {
    /* storage unavailable — the in-memory copy still works for this tab */
  }
}

function interleave(a, b) {
  const out = [];
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

export function getInterviewTitle(config) {
  if (config.mode === "resume") return "Resume-Based Interview";
  if (config.mode === "jd") return "Job Description Interview";
  return `${config.domain} — ${config.type}`;
}

export function buildQuestions(config) {
  const count = QUESTION_COUNT_BY_DIFFICULTY[config.difficulty] ?? 5;
  const lead =
    config.mode === "resume"
      ? RESUME_QUESTIONS.map((text) => ({ text, category: "Resume" }))
      : config.mode === "jd"
        ? JD_QUESTIONS.map((text) => ({ text, category: "Job fit" }))
        : [];

  const technical = [...(DOMAIN_QUESTIONS[config.domain] ?? []), ...GENERIC_TECHNICAL].map((text) => ({
    text,
    category: "Technical",
  }));
  const hr = HR_QUESTIONS.map((text) => ({ text, category: "HR" }));

  let rest;
  if (config.type === "Technical") rest = technical;
  else if (config.type === "HR / Behavioral") rest = hr;
  else rest = interleave(technical, hr);

  return [...lead, ...rest].slice(0, count).map((question, index) => ({ id: `q${index + 1}`, ...question }));
}

export async function createInterview(config) {
  await wait(500);
  const interview = {
    id: `mock_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    config,
    title: getInterviewTitle(config),
    questions: buildQuestions(config),
    createdAt: new Date().toISOString(),
    result: null,
  };
  save(interview);
  return interview;
}

export function getInterview(id) {
  return memory[id] ?? readStore()[id] ?? null;
}

/**
 * PLACEHOLDER scoring: based only on answer length, so the results screen can be
 * built. Real scoring will come from the AI backend.
 */
export async function submitInterview(id, { answers, durationSec }) {
  await wait(700);
  const interview = getInterview(id);
  if (!interview) throw new Error("Interview not found");

  const wordCounts = answers.map((text) => (text.trim() ? text.trim().split(/\s+/).length : 0));
  const answered = wordCounts.filter((count) => count > 0).length;
  const perQuestion = wordCounts.map((count) => (count === 0 ? 0 : Math.min(95, 45 + count * 1.5)));
  const average = perQuestion.length
    ? perQuestion.reduce((sum, value) => sum + value, 0) / perQuestion.length
    : 0;
  const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

  const result = {
    mock: true,
    overall: clamp(average),
    answered,
    total: answers.length,
    durationSec,
    wordCounts,
    breakdown: [
      { label: "Technical Skills", value: clamp(average + 3) },
      { label: "Communication", value: clamp(average - 2) },
      { label: "Problem Solving", value: clamp(average + 1) },
      { label: "Confidence", value: clamp(average - 5) },
    ],
  };

  save({ ...interview, result });
  return result;
}