/**
 * MOCK DATA — dashboard placeholders.
 *
 * Nothing in this file talks to a backend. It exists so the dashboard UI can be
 * built and reviewed before the interview APIs exist. When real endpoints are
 * ready, replace the body of `useDashboardData` (src/hooks/useDashboardData.js)
 * with real fetches that return the same shape as `getMockDashboardData()`.
 *
 * To preview the empty state, return `interviews: []` from getMockDashboardData.
 */

const daysAgo = (days, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

export const mockStats = {
  totalInterviews: 24,
  completedInterviews: 18,
  averageScore: 78,
  streakDays: 6,
  longestStreakDays: 11,
  interviewsThisWeek: 3,
  averageScoreChange: 4, // points vs. last month
};

export const mockInterviews = [
  {
    id: "int_1042",
    title: "Frontend Developer — Technical Round",
    type: "Resume-Based",
    date: daysAgo(0, 9),
    durationMin: 32,
    score: 84,
    status: "Completed",
  },
  {
    id: "int_1041",
    title: "Behavioral & HR Round",
    type: "General",
    date: daysAgo(1, 18),
    durationMin: 24,
    score: 72,
    status: "Completed",
  },
  {
    id: "int_1040",
    title: "SDE Intern — Job Description Match",
    type: "Job Description",
    date: daysAgo(3, 11),
    durationMin: 41,
    score: 81,
    status: "Completed",
  },
  {
    id: "int_1039",
    title: "System Design Basics",
    type: "General",
    date: daysAgo(4, 16),
    durationMin: null,
    score: null,
    status: "In progress",
  },
  {
    id: "int_1038",
    title: "Data Structures & Algorithms",
    type: "General",
    date: daysAgo(6, 20),
    durationMin: 38,
    score: 69,
    status: "Completed",
  },
  {
    id: "int_1037",
    title: "React Fundamentals",
    type: "Resume-Based",
    date: daysAgo(9, 14),
    durationMin: 29,
    score: 88,
    status: "Completed",
  },
];

export const mockPerformance = {
  overall: { value: 78, previous: 72 },
  skills: [
    { key: "technical", label: "Technical Skills", short: "Technical", value: 84, previous: 79 },
    { key: "communication", label: "Communication", short: "Communication", value: 76, previous: 73 },
    { key: "problemSolving", label: "Problem Solving", short: "Problem solving", value: 80, previous: 74 },
    { key: "confidence", label: "Confidence", short: "Confidence", value: 72, previous: 64 },
  ],
};

export const mockNotifications = [
  {
    id: "n1",
    title: "Report ready",
    body: "Your Frontend Developer interview report is ready to view.",
    time: "2h ago",
  },
  {
    id: "n2",
    title: "Keep your streak alive",
    body: "Complete one session today to reach a 7-day streak.",
    time: "Yesterday",
  },
];

export function getMockDashboardData() {
  return {
    stats: mockStats,
    interviews: mockInterviews,
    performance: mockPerformance,
  };
}