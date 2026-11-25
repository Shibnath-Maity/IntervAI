/** Options and limits for the New Interview form. Plain data — no backend involved. */

export const DOMAINS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "Data Structures & Algorithms",
  "System Design",
  "Data Science & ML",
  "DevOps & Cloud",
];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export const INTERVIEW_TYPES = ["Technical", "HR / Behavioral", "Mixed"];

export const QUESTION_COUNT_BY_DIFFICULTY = {
  Beginner: 4,
  Intermediate: 5,
  Advanced: 6,
};

export const RESUME_ACCEPT = ".pdf,.doc,.docx";
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];
export const MAX_RESUME_MB = 5;
export const MIN_JD_CHARS = 50;
export const MAX_JD_CHARS = 5000;