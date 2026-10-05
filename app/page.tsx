"use client";

import { useEffect, useMemo, useState } from "react";
import { analyzeResumeAgainstJob, type ResumeSnapshot } from "@/lib/ats";

type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Saved";

type JobApplication = {
  id: string;
  company: string;
  role: string;
  status: JobStatus;
  appliedAt: string;
  score: number;
  notes: string;
  url: string;
};

const defaultResume: ResumeSnapshot = {
  name: "Your Name",
  email: "you@example.com",
  phone: "+1 (555) 123-4567",
  location: "City, State",
  role: "Software Engineer",
  summary:
    "Results-driven software engineer with 3+ years of experience building scalable web applications, improving performance, and collaborating with cross-functional teams. Strong in JavaScript, TypeScript, React, Node.js, PostgreSQL, and customer-facing product delivery.",
  skills: "JavaScript, TypeScript, React, Node.js, PostgreSQL, REST APIs, AWS, Git, Agile, Testing, Performance Optimization",
  experience:
    "Software Engineer | Company Name\n- Built and maintained full-stack features used by 10k+ customers across web and mobile products.\n- Improved application response times by 35% by optimizing API calls and frontend rendering.\n- Collaborated with product managers and designers to ship features from discovery to deployment.\n- Wrote unit and integration tests to reduce regressions and improve release confidence.",
  education: "B.S. in Computer Science, University Name",
};

const defaultJobDescription = `We are hiring a Software Engineer to build scalable customer-facing applications and backend services. Candidates should have strong experience in JavaScript, TypeScript, React, Node.js, REST APIs, PostgreSQL, AWS, testing, and collaboration with product teams. The ideal candidate is proactive, solves customer problems, and can work in an agile environment.`;

const defaultJobs: JobApplication[] = [
  {
    id: "sample-1",
    company: "Northstar Labs",
    role: "Senior Frontend Engineer",
    status: "Applied",
    appliedAt: new Date().toISOString().slice(0, 10),
    score: 88,
    notes: "Great keyword match; keep resume tailored to frontend and product work.",
    url: "https://example.com/job/1",
  },
  {
    id: "sample-2",
    company: "Atlas Cloud",
    role: "Full Stack Engineer",
    status: "Interviewing",
    appliedAt: new Date(Date.now() - 86400000 * 4).toISOString().slice(0, 10),
    score: 81,
    notes: "Interview scheduled; emphasize backend scaling experience.",
    url: "https://example.com/job/2",
  },
];

export default function HomePage() {
  const [resume, setResume] = useState<ResumeSnapshot>(defaultResume);
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [jobs, setJobs] = useState<JobApplication[]>(defaultJobs);
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("Saved");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const savedResume = window.localStorage.getItem("resume-builder-resume");
    const savedJob = window.localStorage.getItem("resume-builder-job");
    const savedJobs = window.localStorage.getItem("resume-builder-jobs");

    if (savedResume) {
      setResume(JSON.parse(savedResume));
    }

    if (savedJob) {
      setJobDescription(savedJob);
    }

    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("resume-builder-resume", JSON.stringify(resume));
  }, [resume]);

  useEffect(() => {
    window.localStorage.setItem("resume-builder-job", jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    window.localStorage.setItem("resume-builder-jobs", JSON.stringify(jobs));
  }, [jobs]);

  const analysis = useMemo(() => analyzeResumeAgainstJob(resume, jobDescription), [resume, jobDescription]);

  const updateField = (field: keyof ResumeSnapshot, value: string) => {
    setResume((current) => ({ ...current, [field]: value }));
  };

  const handleAddJob = () => {
    if (!company.trim() || !jobRole.trim()) {
      return;
    }

    const newJob: JobApplication = {
      id: `${Date.now()}`,
      company: company.trim(),
      role: jobRole.trim(),
      status,
      appliedAt: new Date().toISOString().slice(0, 10),
      score: analysis.score,
      notes: notes.trim() || "No notes yet",
      url: jobUrl.trim(),
    };

    setJobs((current) => [newJob, ...current]);
    setCompany("");
    setJobRole("");
    setJobUrl("");
    setNotes("");
    setStatus("Saved");
  };

  const handleStatusChange = (id: string, nextStatus: JobStatus) => {
    setJobs((current) => current.map((job) => (job.id === id ? { ...job, status: nextStatus } : job)));
  };

  const handleDeleteJob = (id: string) => {
    setJobs((current) => current.filter((job) => job.id !== id));
  };

  const counts = useMemo(
    () => ({
      total: jobs.length,
      applied: jobs.filter((job) => job.status === "Applied").length,
      interviewing: jobs.filter((job) => job.status === "Interviewing").length,
      offers: jobs.filter((job) => job.status === "Offer").length,
      rejected: jobs.filter((job) => job.status === "Rejected").length,
    }),
    [jobs],
  );

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-slate-950 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Personal job search</p>
              <h1 className="mt-2 text-3xl font-bold">Resume Tailor Studio</h1>
            </div>
            <button
              type="button"
              onClick={() => {
                setResume(defaultResume);
                setJobDescription(defaultJobDescription);
                setJobs(defaultJobs);
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

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-600">Application tracker</p>
              <h2 className="mt-2 text-2xl font-bold">Job applications</h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total</p>
                <p className="text-lg font-bold text-slate-800">{counts.total}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Applied</p>
                <p className="text-lg font-bold text-slate-800">{counts.applied}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Interview</p>
                <p className="text-lg font-bold text-slate-800">{counts.interviewing}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Offers</p>
                <p className="text-lg font-bold text-slate-800">{counts.offers}</p>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-center">
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Rejected</p>
                <p className="text-lg font-bold text-slate-800">{counts.rejected}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-4 text-lg font-semibold">Add application</h3>

              <div className="space-y-3">
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />
                <input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="Role" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />
                <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="Job URL (optional)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />

                <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500">
                  <option value="Saved">Saved</option>
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Notes, follow-ups, recruiters, dates..." className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />

                <button type="button" onClick={handleAddJob} className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-medium text-white transition hover:bg-cyan-500">
                  Save application
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {jobs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  No applications yet. Add your first job to track outreach and interviews.
                </div>
              ) : (
                jobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{job.company}</h3>
                        <p className="text-sm text-slate-600">{job.role}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-xs font-semibold text-cyan-800">{job.score}% ATS</span>
                        <button type="button" onClick={() => handleDeleteJob(job.id)} className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">Delete</button>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <span>Applied: {job.appliedAt}</span>
                      </div>

                      <select value={job.status} onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)} className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-cyan-500">
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    {job.url ? (
                      <a href={job.url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-medium text-cyan-700 hover:text-cyan-800">
                        View job posting
                      </a>
                    ) : null}

                    <p className="mt-3 text-sm text-slate-600">{job.notes}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
