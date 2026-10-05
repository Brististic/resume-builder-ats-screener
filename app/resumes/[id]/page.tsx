"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { analyzeResumeAgainstJob, type ResumeSnapshot } from "@/lib/ats";
import { createApplication, deleteApplication, fetchApplications, fetchResume, updateApplication, updateResume, type Resume } from "@/lib/api";

type JobStatus = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Saved";

export default function ResumeEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const resumeId = params.id;

  // Resume state
  const [resume, setResume] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Applications state
  const [applications, setApplications] = useState<any[]>([]);
  const [company, setCompany] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState<JobStatus>("Saved");
  const [notes, setNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Load resume and applications on mount
  useEffect(() => {
    loadResumeAndApplications();
  }, [resumeId]);

  const loadResumeAndApplications = async () => {
    try {
      setLoading(true);
      const resumeData = await fetchResume(resumeId);
      setResume(resumeData);
      setJobDescription(""); // User can enter a job description

      const appsData = await fetchApplications(resumeId);
      setApplications(appsData);
    } catch (err) {
      setError("Failed to load resume. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save resume after 1 second of inactivity
  useEffect(() => {
    if (!resume) return;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        await updateResume(resumeId, resume);
      } catch (err) {
        console.error("Auto-save failed:", err);
      } finally {
        setSaving(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [resume, resumeId]);

  const updateField = (field: keyof Resume, value: string) => {
    if (resume) {
      setResume({ ...resume, [field]: value });
    }
  };

  const handleAddApplication = async () => {
    if (!company.trim() || !jobRole.trim()) {
      return;
    }

    try {
      const resumeSnapshot: ResumeSnapshot = {
        name: resume?.name || "",
        email: resume?.email || "",
        phone: resume?.phone || "",
        location: resume?.location || "",
        role: resume?.role || "",
        summary: resume?.summary || "",
        skills: resume?.skills || "",
        experience: resume?.experience || "",
        education: resume?.education || "",
      };

      const analysis = analyzeResumeAgainstJob(resumeSnapshot, jobDescription);

      const app = await createApplication(resumeId, {
        company: company.trim(),
        role: jobRole.trim(),
        status,
        score: analysis.score,
        notes: notes.trim() || "",
        url: jobUrl.trim(),
        appliedAt: new Date().toISOString().slice(0, 10),
      });

      setApplications([app, ...applications]);
      setCompany("");
      setJobRole("");
      setJobUrl("");
      setNotes("");
      setStatus("Saved");
      setShowAddForm(false);
    } catch (err) {
      setError("Failed to add application. Please try again.");
      console.error(err);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: JobStatus) => {
    try {
      const updated = await updateApplication(resumeId, appId, { status: newStatus });
      setApplications(applications.map((a) => (a.id === appId ? updated : a)));
    } catch (err) {
      setError("Failed to update application. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteApplication(resumeId, appId);
      setApplications(applications.filter((a) => a.id !== appId));
    } catch (err) {
      setError("Failed to delete application. Please try again.");
      console.error(err);
    }
  };

  const resumeSnapshot: ResumeSnapshot | null = resume
    ? {
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        role: resume.role,
        summary: resume.summary,
        skills: resume.skills,
        experience: resume.experience,
        education: resume.education,
      }
    : null;

  const analysis = useMemo(() => (resumeSnapshot && jobDescription ? analyzeResumeAgainstJob(resumeSnapshot, jobDescription) : null), [resumeSnapshot, jobDescription]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600">Loading resume...</div>
        </div>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600">
            Resume not found.
            <Link href="/resumes" className="mt-4 block text-cyan-600 hover:text-cyan-700">
              Back to resumes
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 to-slate-800 p-6 text-white shadow-soft sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-cyan-300">Resume Tailor Studio</p>
              <h1 className="mt-2 text-3xl font-bold">Edit Resume</h1>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {saving && <span className="text-sm text-cyan-300">Auto-saving...</span>}
              <Link href="/resumes" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20">
                Back to resumes
              </Link>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          {/* Resume Form */}
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
              <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={8} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" placeholder="Paste a job description to see ATS match..." />
            </div>
          </section>

          {/* ATS Analysis Sidebar */}
          <aside className="space-y-6">
            {analysis && (
              <>
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
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Matched</p>
                      <p className="mt-2 text-lg font-bold text-emerald-900">{analysis.keywordMatches.length}</p>
                    </div>
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Missing</p>
                      <p className="mt-2 text-lg font-bold text-amber-900">{analysis.missingKeywords.length}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-semibold">Top missing keywords</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.missingKeywords.length > 0 ? analysis.missingKeywords.slice(0, 12).map((keyword) => (
                      <span key={keyword} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{keyword}</span>
                    )) : <p className="text-sm text-slate-500">No gaps detected.</p>}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-soft">
                  <h3 className="text-lg font-semibold">Suggestions</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    {analysis.suggestions.map((suggestion) => (
                      <li key={suggestion} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-cyan-500" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </aside>
        </div>

        {/* Applications Section */}
        <section className="mt-8 rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Job applications</h2>
            <p className="mt-2 text-sm text-slate-600">Track applications for this resume</p>
          </div>

          {!showAddForm ? (
            <button onClick={() => setShowAddForm(true)} className="mb-6 rounded-full bg-cyan-600 px-6 py-3 font-medium text-white transition hover:bg-cyan-500">
              + Add application
            </button>
          ) : (
            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-4 font-semibold text-slate-900">New application</h3>

              <div className="grid gap-3 md:grid-cols-2">
                <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />
                <input value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="Role" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />
                <input value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="Job URL (optional)" className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500 md:col-span-2" />
                <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500">
                  <option value="Saved">Status: Saved</option>
                  <option value="Applied">Status: Applied</option>
                  <option value="Interviewing">Status: Interviewing</option>
                  <option value="Offer">Status: Offer</option>
                  <option value="Rejected">Status: Rejected</option>
                </select>
              </div>

              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Notes, follow-ups, recruiter info..." className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-cyan-500" />

              <div className="mt-4 flex gap-2">
                <button type="button" onClick={handleAddApplication} className="flex-1 rounded-xl bg-cyan-600 px-4 py-2.5 font-medium text-white transition hover:bg-cyan-500">
                  Save application
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {applications.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">No applications yet for this resume.</div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div key={app.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{app.company}</h3>
                      <p className="text-sm text-slate-600">{app.role}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-semibold text-cyan-800">{app.score}% ATS</span>
                      <select value={app.status} onChange={(e) => handleStatusChange(app.id, e.target.value as JobStatus)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-cyan-500">
                        <option value="Saved">Saved</option>
                        <option value="Applied">Applied</option>
                        <option value="Interviewing">Interviewing</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                      <button type="button" onClick={() => handleDeleteApplication(app.id)} className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100">
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">Applied: {app.appliedAt}</p>
                  {app.notes && <p className="mt-2 text-sm text-slate-600">{app.notes}</p>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
