import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const applications = await prisma.jobApplication.findMany({
      where: { resumeId: id },
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/resumes/[id]/applications error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();

    const application = await prisma.jobApplication.create({
      data: {
        resumeId: id,
        company: data.company,
        role: data.role,
        status: data.status || "Saved",
        score: data.score || 0,
        notes: data.notes || "",
        url: data.url || "",
        appliedAt: data.appliedAt || new Date().toISOString().slice(0, 10),
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/resumes/[id]/applications error:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}
