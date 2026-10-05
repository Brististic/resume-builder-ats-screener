"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeResumeAgainstJob, type ResumeSnapshot } from "@/lib/ats";

const defaultResume: ResumeSnapshot = {
  name: "Your Name",
  email: "you@example.com",
  phone: "+1 (555) 123-4567",
  location: "City, State",
  role: "Software Engineer",
  summary:
    "Results-driven software engineer with 3+ years of experience building scalable web applications, improving performance, and collaborating with cross-functional teams. Strong in JavaScript, TypeScript, backend systems, and customer-facing product delivery.",
  skills: "JavaScript, TypeScript, React, Node.js, PostgreSQL, REST APIs, AWS, Git, Agile, Testing, Performance Optimization",
  experience:
    "Software Engineer | Company Name\n- Built and maintained full-stack features used by 10k+ customers across web and mobile products.\n- Improved application response times by 35% by optimizing API calls and frontend rendering.\n- Collaborated with product managers and designers to ship features from discovery to deployment.\n- Wrote unit and integration tests to reduce regressions and improve release confidence.",
  education: "B.S. in Computer Science, University Name",
};

const defaultJobDescription = `We are hiring a Software Engineer to build scalable customer-facing applications and backend services. Candidates should have strong experience in JavaScript, TypeScript, React, Node.js, REST APIs, PostgreSQL, AWS, testing, and collaboration with product teams. The ideal candidate is proactive, solves customer problems, and can work in an agile environment.`;

export default function HomePage() {
  const [resume, setResume] = useState<ResumeSnapshot>(defaultResume);
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);

  useEffect(() => {
    const savedResume = window.localStorage.getItem("resume-builder-resume");
    const savedJob = window.localStorage.getItem("resume-builder-job");

    if (savedResume) {
      setResume(JSON.parse(savedResume));
    }

    if (savedJob) {
      setJobDescription(savedJob);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("resume-builder-resume", JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    window.localStorage.setItem("resume-builder-job", jobDescription);
  }, [jobDescription]);

  const analysis = useMemo(() => analyzeResumeAgainstJob(resume, jobDescription), [resume, jobDescription]);

  const updateField = (field: keyof ResumeSnapshot, value: string) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-slate-950 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Personal ATS optimizer</p>
              <h1 className="mt-2 text-3xl font-bold">Resume Tailor Studio</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setResume(defaultResume);
                setJobDescription(defaultJobDescription);
              }}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Reset sample
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-semibold">Resume content</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Full name
                <input value={resume.name} onChange={(e) => updateField("name", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Email
                <input value={resume.email} onChange={(e) => updateField("email", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Phone
                <input value={resume.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Location
                <input value={resume.location} onChange={(e) => updateField("location", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Target role
                <input value={resume.role} onChange={(e) => updateField("role", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Professional summary
                <textarea value={resume.summary} onChange={(e) => updateField("summary", e.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Skills
                <input value={resume.skills} onChange={(e) => updateField("skills", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Experience
                <textarea value={resume.experience} onChange={(e) => updateField("experience", e.target.value)} rows={7} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Education
                <textarea value={resume.education} onChange={(e) => updateField("education", e.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-cyan-500" />
              </label>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-3 text-base font-semibold text-slate-800">Target job description</h3>
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={8} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">ATS match</h2>
                <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-bold text-cyan-700">{analysis.score}%</span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-500" style={{ width: `${analysis.score}%` }} />
              </div>

              <p className="mt-4 text-sm text-slate-600">{analysis.summary}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Keyword match</p>
                  <p className="mt-2 text-lg font-bold text-emerald-900">{analysis.keywordMatches.length} matched</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Missing</p>
                  <p className="mt-2 text-lg font-bold text-amber-900">{analysis.missingKeywords.length} terms</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Top missing keywords</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.slice(0, 12).map((keyword) => (
                  <span key={keyword} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{keyword}</span>
                )) : <p className="text-sm text-slate-500">No major keyword gaps detected.</p>}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Quick checks</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {analysis.checks.map((check) => (
                  <li key={check.label} className="flex items-start gap-2">
                    <span className={`mt-1 h-2.5 w-2.5 rounded-full ${check.ok ? "bg-emerald-500" : "bg-amber-500"}`} />
                    <span><strong>{check.label}:</strong> {check.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Suggested improvements</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {analysis.suggestions.length > 0 ? analysis.suggestions.map((suggestion) => (
                <li key={suggestion} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" />
                  <span>{suggestion}</span>
                </li>
              )) : <li className="text-slate-500">Nice job — this resume is already well aligned.</li>}
            </ul>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h3 className="text-lg font-semibold">Resume preview</h3>
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900">{resume.name}</h4>
                  <p className="text-sm text-slate-600">{resume.role}</p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <p>{resume.email}</p>
                  <p>{resume.phone}</p>
                  <p>{resume.location}</p>
                </div>
              </div>

              <div className="mt-5">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Summary</h5>
                <p className="mt-2 text-sm text-slate-700">{resume.summary}</p>
              </div>

              <div className="mt-5">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Skills</h5>
                <p className="mt-2 text-sm text-slate-700">{resume.skills}</p>
              </div>

              <div className="mt-5">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Experience</h5>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{resume.experience}</p>
              </div>

              <div className="mt-5">
                <h5 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Education</h5>
                <p className="mt-2 text-sm text-slate-700">{resume.education}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
