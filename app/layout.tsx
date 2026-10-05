import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Builder & ATS Screener",
  description: "Create targeted resumes and check them against job descriptions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
