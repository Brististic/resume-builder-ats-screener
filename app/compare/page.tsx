"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { analyzeResumeAgainstJob, type ResumeSnapshot } from "@/lib/ats";
import { fetchResumes, type Resume } from "@/lib/api";

export default function ComparePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await fetchResumes();
      setResumes(data);
      if (data.length > 0) {
        setSelectedResumeId(data[0].id);
      }
    } catch (err) {
      setError("Failed to load resumes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectedResume = resumes.find((r) => r.id === selectedResumeId);

  const resumeSnapshot: ResumeSnapshot | null = selectedResume
    ? {
        name: selectedResume.name,
        email: selectedResume.email,
        phone: selectedResume.phone,
        location: selectedResume.location,
        role: selectedResume.role,
        summary: selectedResume.summary,
        skills: selectedResume.skills,
        experience: selectedResume.experience,
        education: selectedResume.education,
      }
    : null;

  const analysis = useMemo(
    () => (resumeSnapshot && jobDescription ? analyzeResumeAgainstJob(resumeSnapshot, jobDescription) : null),
    [resumeSnapshot, jobDescription]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600">Loading resumes...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 to-slate-800 p-8 text-white shadow-soft">
          <h1 className="text-4xl font-bold">Resume Comparison Tool</h1>
          <p className="mt-2 text-slate-300">Compare your resume against any job description</p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Resume Selection & Job Description */}
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Select resume</label>
                {resumes.length === 0 ? (
                  <p className="text-sm text-slate-600">
                    No resumes found.{" "}
                    <Link href="/resumes" className="text-cyan-600 hover:text-cyan-700">
                      Create one first
                    </Link>
                  </p>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500"
                  >
                    {resumes.map((resume) => (
                      <option key={resume.id} value={resume.id}>
                        {resume.name} - {resume.role}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Job description</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={15}
                  placeholder="Paste a job description here to see how well your resume matches..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </section>

          {/* Right: Analysis Results */}
          {analysis && (
            <section className="space-y-6">
              {/* ATS Score */}
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h2 className="text-2xl font-bold text-slate-900">ATS Match Score</h2>
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-cyan-600">{analysis.score}%</span>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-600">Match level</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {analysis.score >= 80
                          ? "Excellent"
                          : analysis.score >= 60
                            ? "Good"
                            : analysis.score >= 40
                              ? "Fair"
                              : "Needs work"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-500"
                      style={{ width: `${analysis.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
                <p className="mt-3 text-sm text-slate-600">{analysis.summary}</p>
              </div>

              {/* Matched Keywords */}
              <div className="rounded-3xl bg-emerald-50 p-6 shadow-soft border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900">Matched Keywords</h3>
                <p className="mt-1 text-sm text-emerald-700">Found {analysis.keywordMatches.length} key skills in your resume</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.keywordMatches.slice(0, 20).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-medium text-emerald-900">
                      ✓ {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="rounded-3xl bg-amber-50 p-6 shadow-soft border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900">Missing Keywords</h3>
                <p className="mt-1 text-sm text-amber-700">Add these {analysis.missingKeywords.length} keywords to improve match</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.missingKeywords.slice(0, 20).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-amber-900">
                      ✗ {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="rounded-3xl bg-white p-6 shadow-soft">
                <h3 className="text-lg font-semibold text-slate-900">Recommendations</h3>
                <ul className="mt-4 space-y-2">
                  {analysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-slate-700">
                      <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
