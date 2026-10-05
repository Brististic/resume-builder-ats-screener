"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createResume, deleteResume, fetchResumes, type Resume } from "@/lib/api";

const defaultResume = {
  name: "Your Name",
  email: "you@example.com",
  phone: "+1 (555) 123-4567",
  location: "City, State",
  role: "Software Engineer",
  summary: "Results-driven software engineer with 3+ years of experience building scalable web applications, improving performance, and collaborating with cross-functional teams. Strong in JavaScript, TypeScript, React, Node.js, PostgreSQL, and customer-facing product delivery.",
  skills: "JavaScript, TypeScript, React, Node.js, PostgreSQL, REST APIs, AWS, Git, Agile, Testing, Performance Optimization",
  experience: "Software Engineer | Company Name\n- Built and maintained full-stack features used by 10k+ customers across web and mobile products.\n- Improved application response times by 35% by optimizing API calls and frontend rendering.\n- Collaborated with product managers and designers to ship features from discovery to deployment.\n- Wrote unit and integration tests to reduce regressions and improve release confidence.",
  education: "B.S. in Computer Science, University Name",
};

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const data = await fetchResumes();
      setResumes(data);
    } catch (err) {
      setError("Failed to load resumes. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const newResume = await createResume(defaultResume);
      router.push(`/resumes/${newResume.id}`);
    } catch (err) {
      setError("Failed to create resume. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      setError("Failed to delete resume. Please try again.");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-gradient-to-r from-slate-950 to-slate-800 p-8 text-white shadow-soft">
          <h1 className="text-4xl font-bold">My Resumes</h1>
          <p className="mt-2 text-slate-300">Manage and optimize your resumes for different roles</p>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <button
          onClick={handleCreateResume}
          disabled={loading}
          className="mb-6 rounded-full bg-cyan-600 px-8 py-3 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-50"
        >
          + Create new resume
        </button>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-600">Loading resumes...</div>
        ) : resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            <p>No resumes yet. Create your first one to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {resumes.map((resume) => (
              <div key={resume.id} className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{resume.name}</h2>
                  <p className="text-sm text-slate-600">{resume.role}</p>
                  <p className="mt-1 text-xs text-slate-500">Created {new Date(resume.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <Link href={`/resumes/${resume.id}`} className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-500">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
