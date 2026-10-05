"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchResumes, type Resume } from "@/lib/api";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
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
    } catch (err) {
      setError("Failed to load dashboard. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalResumes: resumes.length,
    totalApplications: resumes.reduce((acc, r) => acc + (r.applications?.length || 0), 0),
    averageScore: resumes.length > 0
      ? Math.round(
          resumes.reduce((acc, r) => acc + (r.applications?.reduce((s, a) => s + a.score, 0) || 0), 0) /
          (resumes.reduce((acc, r) => acc + (r.applications?.length || 0), 0) || 1)
        )
      : 0,
    applicationsByStatus: {
      Applied: resumes.reduce((acc, r) => acc + (r.applications?.filter(a => a.status === "Applied").length || 0), 0),
      Interviewing: resumes.reduce((acc, r) => acc + (r.applications?.filter(a => a.status === "Interviewing").length || 0), 0),
      Offer: resumes.reduce((acc, r) => acc + (r.applications?.filter(a => a.status === "Offer").length || 0), 0),
      Rejected: resumes.reduce((acc, r) => acc + (r.applications?.filter(a => a.status === "Rejected").length || 0), 0),
      Saved: resumes.reduce((acc, r) => acc + (r.applications?.filter(a => a.status === "Saved").length || 0), 0),
    },
  };

  const recentApplications = resumes
    .flatMap((r) => (r.applications || []).map((a) => ({ ...a, resumeId: r.id, resumeName: r.name })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600">Loading dashboard...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 to-slate-800 p-8 text-white shadow-soft">
          <h1 className="text-4xl font-bold">Job Application Dashboard</h1>
          <p className="mt-2 text-slate-300">Track your resume performance and application progress</p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate-600">Total Resumes</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalResumes}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate-600">Total Applications</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate-600">Avg ATS Score</p>
            <p className="mt-2 text-3xl font-bold text-cyan-600">{stats.averageScore}%</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate-600">Offers</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">{stats.applicationsByStatus.Offer}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-soft">
            <p className="text-sm font-medium text-slate-600">In Progress</p>
            <p className="mt-2 text-3xl font-bold text-amber-600">{stats.applicationsByStatus.Interviewing}</p>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-semibold text-blue-800">Applied</p>
            <p className="mt-2 text-2xl font-bold text-blue-900">{stats.applicationsByStatus.Applied}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-semibold text-amber-800">Interviewing</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">{stats.applicationsByStatus.Interviewing}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm font-semibold text-emerald-800">Offer</p>
            <p className="mt-2 text-2xl font-bold text-emerald-900">{stats.applicationsByStatus.Offer}</p>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-800">Rejected</p>
            <p className="mt-2 text-2xl font-bold text-red-900">{stats.applicationsByStatus.Rejected}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-800">Saved</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.applicationsByStatus.Saved}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Applications */}
          <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Recent applications</h2>
            {recentApplications.length === 0 ? (
              <p className="text-sm text-slate-500">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <div key={`${app.resumeId}-${app.id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                    <div>
                      <p className="font-medium text-slate-900">{app.company}</p>
                      <p className="text-xs text-slate-500">
                        {app.role} • {app.resumeName} • {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-cyan-100 px-2 py-1 text-xs font-semibold text-cyan-800">{app.score}%</span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                        app.status === "Offer"
                          ? "bg-emerald-100 text-emerald-800"
                          : app.status === "Interviewing"
                            ? "bg-amber-100 text-amber-800"
                            : app.status === "Rejected"
                              ? "bg-red-100 text-red-800"
                              : app.status === "Applied"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-slate-100 text-slate-800"
                      }`}>{app.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resume List */}
          <div className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="mb-6 text-xl font-semibold text-slate-900">Your resumes</h2>
            {resumes.length === 0 ? (
              <Link href="/resumes" className="inline-block rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500">
                Create first resume
              </Link>
            ) : (
              <div className="space-y-2">
                {resumes.map((resume) => (
                  <Link
                    key={resume.id}
                    href={`/resumes/${resume.id}`}
                    className="block rounded-xl border border-slate-200 p-3 transition hover:bg-slate-50"
                  >
                    <p className="font-medium text-slate-900">{resume.name}</p>
                    <p className="text-xs text-slate-600">{resume.role}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {resume.applications?.length || 0} applications
                    </p>
                  </Link>
                ))}
                <Link
                  href="/resumes"
                  className="block rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-sm font-medium text-slate-600 transition hover:border-slate-400 hover:text-slate-700"
                >
                  + New resume
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
