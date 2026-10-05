import { PrismaClient } from "@prisma/client";
import { jsPDF } from "jspdf";

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { resumeId: string } }) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: params.resumeId },
    });

    if (!resume) {
      return new Response("Resume not found", { status: 404 });
    }

    // Create PDF
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const lineHeight = 5;
    let yPosition = margin;

    // Helper to add text with wrapping
    const addText = (text: string, fontSize: number = 11, fontWeight: string = "normal", maxWidth: number = pageWidth - margin * 2) => {
      pdf.setFontSize(fontSize);
      if (fontWeight === "bold") pdf.setFont(undefined, "bold");
      else pdf.setFont(undefined, "normal");

      const lines = pdf.splitTextToSize(text, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
    };

    // Header
    addText(resume.name, 18, "bold");
    addText(`${resume.email} | ${resume.phone} | ${resume.location}`, 9);
    yPosition += 3;

    // Target Role
    addText(`TARGET: ${resume.role}`, 10, "bold");
    yPosition += 3;

    // Professional Summary
    addText("PROFESSIONAL SUMMARY", 11, "bold");
    addText(resume.summary, 10);
    yPosition += 3;

    // Skills
    addText("SKILLS", 11, "bold");
    addText(resume.skills, 10);
    yPosition += 3;

    // Experience
    addText("EXPERIENCE", 11, "bold");
    addText(resume.experience, 10);
    yPosition += 3;

    // Education
    addText("EDUCATION", 11, "bold");
    addText(resume.education, 10);

    // Return as PDF
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${resume.name.replace(/\s+/g, "_")}_resume.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error exporting resume:", error);
    return new Response("Failed to export resume", { status: 500 });
  }
}
