import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { updatedAt: "desc" },
      include: { applications: true },
    });
    return NextResponse.json(resumes);
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const resume = await prisma.resume.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
        role: data.role,
        summary: data.summary,
        skills: data.skills,
        experience: data.experience,
        education: data.education,
      },
    });

    return NextResponse.json(resume, { status: 201 });
  } catch (error) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json({ error: "Failed to create resume" }, { status: 500 });
  }
}
