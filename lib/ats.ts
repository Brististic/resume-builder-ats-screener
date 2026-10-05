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
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([term]) => term)
    .slice(0, 20);
}

export function calculateAtsScore(resume: ResumeSnapshot, jobDescription: string): AtsResult {
  const fullText = [
    resume.name,
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
      summary: "No job description was provided, so the ATS score is set to 100% by default.",
      keywordMatches: [],
      missingKeywords: [],
    };
  }

  const keywordMatches = jobKeywords.filter((keyword) => resumeTerms.has(keyword));
  const missingKeywords = jobKeywords.filter((keyword) => !resumeTerms.has(keyword));
  const score = Math.min(100, Math.round((keywordMatches.length / jobKeywords.length) * 100));

  let summary = "Your resume is aligned with the role but could use more keyword coverage.";

  if (score >= 80) {
    summary = "Your resume strongly aligns with the target role and includes most of the important keywords.";
  } else if (score >= 60) {
    summary = "Your resume is reasonably aligned, but adding a few more role-specific keywords will improve ATS matching.";
  } else if (score >= 40) {
    summary = "Your resume needs stronger keyword coverage to improve ATS matching against the job description.";
  } else {
    summary = "Your resume has a weak keyword match to the role. Consider rewording experience and skills to match the job requirements more closely.";
  }

  return {
    score,
    summary,
    keywordMatches,
    missingKeywords: missingKeywords.slice(0, 10),
  };
}
