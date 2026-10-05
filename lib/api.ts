// lib/api.ts
// Helper functions to call the backend API

export type Resume = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  summary: string;
  skills: string;
  experience: string;
  education: string;
  createdAt: string;
  updatedAt: string;
  applications?: JobApplication[];
};

export type JobApplication = {
  id: string;
  resumeId: string;
  company: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected" | "Saved";
  score: number;
  notes: string;
  url: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
};

// RESUMES
export async function fetchResumes(): Promise<Resume[]> {
  const res = await fetch("/api/resumes");
  if (!res.ok) throw new Error("Failed to fetch resumes");
  return res.json();
}

export async function fetchResume(id: string): Promise<Resume> {
  const res = await fetch(`/api/resumes/${id}`);
  if (!res.ok) throw new Error("Failed to fetch resume");
  return res.json();
}

export async function createResume(data: Omit<Resume, "id" | "createdAt" | "updatedAt" | "applications">): Promise<Resume> {
  const res = await fetch("/api/resumes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create resume");
  return res.json();
}

export async function updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update resume");
  return res.json();
}

export async function deleteResume(id: string): Promise<void> {
  const res = await fetch(`/api/resumes/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete resume");
}

// JOB APPLICATIONS
export async function fetchApplications(resumeId: string): Promise<JobApplication[]> {
  const res = await fetch(`/api/resumes/${resumeId}/applications`);
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
}

export async function createApplication(resumeId: string, data: Omit<JobApplication, "id" | "resumeId" | "createdAt" | "updatedAt">): Promise<JobApplication> {
  const res = await fetch(`/api/resumes/${resumeId}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create application");
  return res.json();
}

export async function updateApplication(resumeId: string, appId: string, data: Partial<JobApplication>): Promise<JobApplication> {
  const res = await fetch(`/api/resumes/${resumeId}/applications/${appId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update application");
  return res.json();
}

export async function deleteApplication(resumeId: string, appId: string): Promise<void> {
  const res = await fetch(`/api/resumes/${resumeId}/applications/${appId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete application");
}
