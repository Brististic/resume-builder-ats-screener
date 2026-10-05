import { analyzeResumeAgainstJob, type ResumeSnapshot } from "@/lib/ats";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resume, jobDescription } = body as {
      resume: ResumeSnapshot;
      jobDescription: string;
    };

    if (!resume || !jobDescription) {
      return NextResponse.json({ error: "Missing resume or job description" }, { status: 400 });
    }

    const analysis = analyzeResumeAgainstJob(resume, jobDescription);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}
