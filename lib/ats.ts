export type ResumeSnapshot = {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
};

export type AtsResult = {
  score: number;
  summary: string;
  keywordMatches: string[];
  missingKeywords: string[];
};

export type AtsCheck = {
  label: string;
  ok: boolean;
  message: string;
};

export type AtsAnalysis = {
  score: number;
  summary: string;
  keywordMatches: string[];
  missingKeywords: string[];
  checks: AtsCheck[];
  suggestions: string[];
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "from",
  "has",
  "have",
  "he",
  "her",
  "his",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "or",
  "our",
  "that",
  "the",
  "their",
  "they",
  "this",
  "to",
  "we",
  "with",
  "you",
  "your",
  "us",
  "was",
  "were",
  "will",
  "into",
  "about",
  "through",
  "within",
  "across",
  "using",
  "over",
  "under",
  "after",
  "before",
  "during",
  "without",
  "can",
  "could",
  "should",
  "would",
  "must",
  "need",
  "able",
  "also",
  "each",
  "more",
  "most",
  "such",
  "than",
  "them",
  "then",
  "there",
  "these",
  "those",
  "where",
  "while",
  "not",
  "any",
  "same",
  "very",
  "been",
  "being",
  "other",
]);

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean)
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

function getJobKeywords(jobDescription: string) {
  const terms = normalizeText(jobDescription);
  const frequency = new Map<string, number>();

  for (const term of terms) {
    frequency.set(term, (frequency.get(term) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, 24);
}

function hasMetrics(text: string) {
  return /\b\d+(%|\+|x|k|m|\s*(years|months|days|hours|clients|users|projects|teams))\b/i.test(text) || /\b\d+\s*(\+\s*)?(customers|users|clients|projects|teams)\b/i.test(text);
}

export function analyzeResumeAgainstJob(resume: ResumeSnapshot, jobDescription: string): AtsAnalysis {
  const fullText = [
    resume.role,
    resume.summary,
    resume.skills,
    resume.experience,
    resume.education,
    resume.location,
  ].join(" ");

  const resumeTerms = new Set(normalizeText(fullText));
  const jobKeywords = getJobKeywords(jobDescription);

  if (jobKeywords.length === 0) {
    return {
      score: 100,
      summary: "No job description was provided. Score defaults to 100%.",
      keywordMatches: [],
      missingKeywords: [],
      checks: [
        { label: "Keyword coverage", ok: true, message: "No job description was entered." },
        { label: "Impact", ok: true, message: "No content to evaluate yet." },
        { label: "ATS formatting", ok: true, message: "Basic format is still safe for screening." },
      ],
      suggestions: [
        "Paste a target job description to see keyword gaps.",
        "Add a tailored summary that mirrors the role's core responsibilities.",
      ],
    };
  }

  const keywordMatches = jobKeywords.filter((keyword) => resumeTerms.has(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeTerms.has(keyword));
  const score = Math.min(100, Math.round((keywordMatches.length / jobKeywords.length) * 100));

  const keywordCoverageOk = score >= 70;
  const quantifiedImpactOk = hasMetrics(resume.experience) || hasMetrics(resume.summary);
  const atsSafeFormat = !/\|\|\||\[.*\]|<table|<img|text-box|columns|graphics/i.test(resume.experience + resume.summary + resume.skills);

  const summaryText =
    score >= 80
      ? "Your resume aligns strongly with the target role and contains most of the critical keywords."
      : score >= 60
        ? "Your resume is reasonably aligned, but adding a few more role-specific keywords will improve ATS matching."
        : score >= 40
          ? "Your resume needs stronger keyword coverage to improve ATS matching against the job description."
          : "Your resume has weak keyword overlap with the role. Tightening language to the job description is recommended.";

  const checks: AtsCheck[] = [
    {
      label: "Keyword coverage",
      ok: keywordCoverageOk,
      message: keywordCoverageOk ? "Most critical keywords are present." : "Add more matching terms from the job description.",
    },
    {
      label: "Impact",
      ok: quantifiedImpactOk,
      message: quantifiedImpactOk ? "Experience includes measurable outcomes and impact." : "Add numbers, percentages, or scope to show measurable value.",
    },
    {
      label: "ATS formatting",
      ok: atsSafeFormat,
      message: atsSafeFormat ? "The format is simple and ATS-friendly." : "Avoid column-heavy or graphic-heavy formatting.",
    },
  ];

  const suggestions: string[] = [];

  if (!keywordCoverageOk) {
    suggestions.push(`Add more of these keywords: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }

  if (!quantifiedImpactOk) {
    suggestions.push("Add measurable results such as % improvements, time saved, or scale handled.");
  }

  if (resume.summary.trim().length < 120) {
    suggestions.push("Expand the summary with 2–3 tailored statements that mirror the responsibilities in the job description.");
  }

  if (resume.skills.toLowerCase().includes("skills") || resume.skills.length < 30) {
    suggestions.push("Turn the skills section into a keyword-rich list of tools, systems, and capabilities tied to the role.");
  }

  if (suggestions.length === 0) {
    suggestions.push("This resume is already well aligned. Keep the same structure and apply it to each target role.");
  }

  return {
    score,
    summary: summaryText,
    keywordMatches,
    missingKeywords: missingKeywords.slice(0, 10),
    checks,
    suggestions: suggestions.slice(0, 5),
  };
}

export function calculateAtsScore(resume: ResumeSnapshot, jobDescription: string): AtsResult {
  const analysis = analyzeResumeAgainstJob(resume, jobDescription);
  return {
    score: analysis.score,
    summary: analysis.summary,
    keywordMatches: analysis.keywordMatches,
    missingKeywords: analysis.missingKeywords,
  };
}
