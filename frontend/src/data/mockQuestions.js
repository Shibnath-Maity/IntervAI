/**
 * MOCK QUESTION BANK — stands in for the AI question generator.
 * The real backend will analyse the resume / job description; until then
 * these fixed questions keep the interview flow testable end to end.
 */

export const DOMAIN_QUESTIONS = {
  "Frontend Development": [
    "Explain how the browser renders a page, from HTML to pixels.",
    "What causes unnecessary re-renders in React, and how do you prevent them?",
    "How would you make a complex web page accessible to keyboard and screen-reader users?",
  ],
  "Backend Development": [
    "How do you design a REST API that stays easy to evolve?",
    "Explain database indexing and when an index can hurt performance.",
    "How would you handle authentication and session security in an API?",
  ],
  "Full Stack Development": [
    "Walk me through how a request travels from the browser to the database and back.",
    "How do you decide what logic belongs on the client versus the server?",
    "How would you structure error handling across the frontend and backend?",
  ],
  "Data Structures & Algorithms": [
    "When would you choose a hash map over a balanced tree?",
    "Explain how you would detect a cycle in a linked list.",
    "How do you reason about time and space complexity of a recursive solution?",
  ],
  "System Design": [
    "Design a URL shortener. What are the main components and trade-offs?",
    "How would you scale a read-heavy service to ten times its current traffic?",
    "Explain caching strategies and how you would handle cache invalidation.",
  ],
  "Data Science & ML": [
    "How do you detect and handle overfitting in a model?",
    "Explain the bias–variance trade-off with an example.",
    "How would you evaluate a classifier on an imbalanced dataset?",
  ],
  "DevOps & Cloud": [
    "Describe a CI/CD pipeline you would set up for a small team.",
    "How do containers differ from virtual machines?",
    "How would you monitor a production service and decide when to alert?",
  ],
};

export const GENERIC_TECHNICAL = [
  "Tell me about a technical problem you solved recently and how you approached it.",
  "How do you debug an issue you cannot reproduce locally?",
  "How do you decide when code is good enough to ship?",
  "What is a technology you learned recently, and how did you go about learning it?",
];

export const HR_QUESTIONS = [
  "Tell me about yourself.",
  "Why do you want this role, and why now?",
  "Describe a time you disagreed with a teammate. How did you handle it?",
  "Tell me about a mistake you made and what you learned from it.",
  "Where do you see yourself in three years?",
  "How do you handle tight deadlines and competing priorities?",
];

export const RESUME_QUESTIONS = [
  "Walk me through the project on your resume you are most proud of. What was your contribution?",
  "Which skill listed on your resume would you say is your strongest, and how have you used it?",
];

export const JD_QUESTIONS = [
  "Based on this job description, which requirement do you meet best, and what is your evidence?",
  "Which requirement in this job description is your biggest gap, and how would you close it?",
];