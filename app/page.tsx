"use client";

import { useEffect, useMemo, useState } from "react";
import { calculateAtsScore, type ResumeSnapshot } from "@/lib/ats";

const defaultResume: ResumeSnapshot = {
  name: "Jordan Lee",
  email: "jordan.lee@email.com",
  phone: "(555) 123-4567",
  location: "Austin, TX",
  role: "Product Designer",
  summary:
    "Product designer with 5+ years of experience building human-centered digital products for SaaS teams. Skilled in UX research, wireframing, design systems, and cross-functional collaboration.",
  skills: "UX Research, Figma, Design Systems, Prototyping, User Testing, Product Strategy, Analytics",
  experience:
    "Senior Product Designer | Northstar Labs\n- Led end-to-end redesign of a B2B analytics dashboard, improving activation by 19%.\n- Partnered with PMs, engineers, and researchers to ship features using a design system and rapid prototyping.\n- Built usability test plans and synthesized findings into actionable product recommendations.",
  education: "B.A. in Interaction Design, University of Texas",
};

const defaultJobDescription = `We are looking for a product designer who can create intuitive, polished web experiences and collaborate with cross-functional teams. The ideal candidate has experience with UX research, design systems, prototyping, user testing, analytics, and product strategy. Must be able to turn customer insights into prioritized product decisions and communicate clearly with stakeholders.`;

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

  const result = useMemo(() => calculateAtsScore(resume, jobDescription), [resume, jobDescription]);

  const updateField = (field: keyof ResumeSnapshot, value: string) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-slate-950 p-6 text-white shadow-soft sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-300">Open source</p>
              <h1 className="mt-2 text-3xl font-bold">Resume Builder & ATS Screener</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setResume(defaultResume);
                setJobDescription(defaultJobDescription);
              }}
              className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Reset sample
            </button>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-semibold">Resume details</h2>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                Full name
                <input
                  value={resume.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Email
                <input
                  value={resume.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Phone
                <input
                  value={resume.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                Location
                <input
                  value={resume.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Target role
                <input
                  value={resume.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Professional summary
                <textarea
                  value={resume.summary}
                  onChange={(e) => updateField("summary", e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Skills
                <input
                  value={resume.skills}
                  onChange={(e) => updateField("skills", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Experience
                <textarea
                  value={resume.experience}
                  onChange={(e) => updateField("experience", e.target.value)}
                  rows={7}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                Education
                <textarea
                  value={resume.education}
                  onChange={(e) => updateField("education", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-blue-500"
                />
              </label>
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-4">
              <h3 className="mb-3 text-base font-semibold text-slate-800">Job description</h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-blue-500"
              />
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">ATS score</h2>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{result.score}%</span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-orange-500"
                  style={{ width: `${result.score}%` }}
                />
              </div>

              <p className="mt-4 text-sm text-slate-600">{result.summary}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Matched</p>
                  <p className="mt-2 text-lg font-bold text-emerald-900">{result.keywordMatches.length} keywords</p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Missing</p>
                  <p className="mt-2 text-lg font-bold text-amber-900">{result.missingKeywords.length} keywords</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Keyword match</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {result.keywordMatches.length > 0 ? (
                  result.keywordMatches.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No strong keyword matches found yet.</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Suggested improvements</h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.slice(0, 5).map((keyword) => (
                    <li key={keyword} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-orange-400" />
                      <span>Add more mentions of “{keyword}” in your summary, skills, or experience.</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No major keyword gaps detected.</li>
                )}
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-xl font-semibold">Resume preview</h2>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{resume.name}</h3>
                <p className="text-sm text-slate-600">{resume.role}</p>
              </div>
              <div className="text-right text-sm text-slate-600">
                <p>{resume.email}</p>
                <p>{resume.phone}</p>
                <p>{resume.location}</p>
              </div>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Summary</h4>
              <p className="mt-2 text-sm text-slate-700">{resume.summary}</p>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Skills</h4>
              <p className="mt-2 text-sm text-slate-700">{resume.skills}</p>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Experience</h4>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">{resume.experience}</p>
            </div>

            <div className="mt-5">
              <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Education</h4>
              <p className="mt-2 text-sm text-slate-700">{resume.education}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
