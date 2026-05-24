import Button from '../ui/Button.jsx';
import { downloadPdfFromBase64 } from '../../lib/api.js';

export default function ResultPanel({ result }) {
  if (!result) return null;

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-up">
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-8 text-center">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-500/15">
            <svg className="h-7 w-7 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-emerald-100">Your tailored resume is ready</h3>
          <p className="mt-2 text-sm text-emerald-200/70">
            Keyword-aligned, ATS-optimized, and compiled to PDF.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button variant="success" onClick={() => downloadPdfFromBase64(result.pdfBase64)}>
              Download PDF
            </Button>
            <a
              href={result.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-300/90 underline decoration-emerald-400/40 underline-offset-4 transition hover:text-emerald-200 hover:decoration-emerald-300"
            >
              Open in Overleaf
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
