"use client";

import { useEffect, useState } from "react";

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

export default function DashboardPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [filterStatus, setFilterStatus] = useState<JobStatus | "All">("All");

  useEffect(() => {
    const savedJobs = window.localStorage.getItem("resume-builder-jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }
  }, []);

  const filteredJobs = filterStatus === "All" ? jobs : jobs.filter((job) => job.status === filterStatus);

  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "Applied").length,
    interviewing: jobs.filter((j) => j.status === "Interviewing").length,
    offers: jobs.filter((j) => j.status === "Offer").length,
    rejected: jobs.filter((j) => j.status === "Rejected").length,
    avgScore: jobs.length > 0 ? Math.round(jobs.reduce((sum, j) => sum + j.score, 0) / jobs.length) : 0,
  };

  const statusColors: Record<JobStatus, string> = {
    Saved: "bg-slate-100 text-slate-700",
    Applied: "bg-blue-100 text-blue-700",
    Interviewing: "bg-amber-100 text-amber-700",
    Offer: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-soft">
          <h1 className="text-4xl font-bold">Job Search Dashboard</h1>
          <p className="mt-2 text-slate-300">Track your applications and monitor progress</p>
        </header>

        <div className="mb-8 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-2xl bg-white p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-slate-500">Total apps</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.total}</p>
          </div>
          <div className="rounded-2xl bg-blue-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-blue-600">Applied</p>
            <p className="mt-2 text-3xl font-bold text-blue-900">{stats.applied}</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-amber-600">Interview</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">{stats.interviewing}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-emerald-600">Offers</p>
            <p className="mt-2 text-3xl font-bold text-emerald-900">{stats.offers}</p>
          </div>
          <div className="rounded-2xl bg-red-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-red-600">Rejected</p>
            <p className="mt-2 text-3xl font-bold text-red-900">{stats.rejected}</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.15em] text-cyan-600">Avg ATS</p>
            <p className="mt-2 text-3xl font-bold text-cyan-900">{stats.avgScore}%</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Applications</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Applied", "Interviewing", "Offer", "Rejected", "Saved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as JobStatus | "All")}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    filterStatus === status ? "bg-slate-900 text-white" : "border border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
              <p>No applications found.</p>
              <a href="/" className="mt-4 inline-block text-cyan-600 hover:text-cyan-700">
                Go to Resume Tailor →
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{job.company}</h3>
                        <p className="text-sm text-slate-600">{job.role}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Applied: {job.appliedAt}</p>
                    {job.notes && <p className="mt-2 text-sm text-slate-600">{job.notes}</p>}
                    {job.url && (
                      <a href={job.url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-cyan-600 hover:text-cyan-700">
                        View posting →
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-slate-500">ATS Score</p>
                      <p className="text-2xl font-bold text-cyan-600">{job.score}%</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[job.status]}`}>{job.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <a href="/" className="inline-block rounded-full bg-slate-900 px-8 py-3 font-medium text-white transition hover:bg-slate-800">
            Edit Resume & Add Applications
          </a>
        </div>
      </div>
    </main>
  );
}
