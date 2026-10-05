import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string; appId: string } }) {
  try {
    const { appId } = params;
    const data = await request.json();

    const application = await prisma.jobApplication.update({
      where: { id: appId },
      data: {
        status: data.status,
        notes: data.notes,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("PATCH /api/resumes/[id]/applications/[appId] error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string; appId: string } }) {
  try {
    const { appId } = params;

    await prisma.jobApplication.delete({
      where: { id: appId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/resumes/[id]/applications/[appId] error:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}
