import type { Metadata } from "next";
import Link from "next/link";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Resume Tailor Studio",
  description: "Build optimized resumes and track your job applications with ATS matching",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-slate-200 bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-slate-900">
                <span className="text-cyan-600">✦</span> Resume Tailor
              </Link>

              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                  Dashboard
                </Link>
                <Link href="/resumes" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                  Resumes
                </Link>
                <Link href="/compare" className="text-sm font-medium text-slate-700 hover:text-slate-900 transition">
                  Compare
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900 transition"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </nav>

        <div>{children}</div>

        <footer className="border-t border-slate-200 bg-slate-50 py-8 mt-16">
          <div className="mx-auto max-w-7xl px-4 text-center text-sm text-slate-600">
            <p>Resume Tailor Studio — Build better resumes, land better jobs.</p>
            <p className="mt-2 text-xs text-slate-500">Open source • Built with Next.js, Prisma, SQLite</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
