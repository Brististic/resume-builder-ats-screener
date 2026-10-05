import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const resume = await prisma.resume.findUnique({
      where: { id },
      include: { applications: true },
    });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("GET /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const resume = await prisma.resume.update({
      where: { id },
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

    return NextResponse.json(resume);
  } catch (error) {
    console.error("PATCH /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/resumes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
