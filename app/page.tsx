import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
            Resume Tailor <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">Studio</span>
          </h1>
          <p className="text-xl text-slate-600 mb-4 max-w-2xl mx-auto">
            Build targeted resumes for every job application. Get real-time ATS scores and track your progress.
          </p>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Optimize keywords • Compare resumes • Export PDFs • Track applications
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard"
              className="inline-block rounded-lg bg-cyan-600 px-8 py-3 font-semibold text-white hover:bg-cyan-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/resumes"
              className="inline-block rounded-lg border-2 border-slate-300 px-8 py-3 font-semibold text-slate-900 hover:border-slate-400 transition"
            >
              Create Resume
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">ATS Matching</h3>
              <p className="text-slate-600">Get instant ATS scores for any job description. Identify missing keywords and optimize your resume.</p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Track Progress</h3>
              <p className="text-slate-600">Manage multiple resumes and applications in one dashboard. Monitor your job search progress.</p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-lg">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Export & Share</h3>
              <p className="text-slate-600">Generate professional PDFs and easily share your resumes with recruiters.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
