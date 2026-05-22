import { useState } from 'react';
import { useCooldown } from './hooks/useCooldown.js';
import { isRateLimitMessage } from './utils/rateLimit.js';

const STATUS_STEPS = [
  'Analyzing job description…',
  'Rewriting resume with Gemini…',
  'Building LaTeX from template…',
  'Compiling PDF on Overleaf…',
  'Done!',
];

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function scrollToForm() {
  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
}

function downloadPdfFromBase64(pdfBase64) {
  const byteCharacters = atob(pdfBase64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tailored_resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

async function generateResume(jobDescription, currentResume, onStatus) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobDescription, currentResume }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Streaming not supported by the browser.');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;
  let error = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const payload = JSON.parse(line.slice(6));
        if (payload.type === 'status') {
          onStatus(payload.step, payload.message);
        } else if (payload.type === 'result') {
          result = payload;
        } else if (payload.type === 'error') {
          error = payload.message;
        }
      } catch {
        // ignore malformed SSE chunks
      }
    }
  }

  if (error) throw new Error(error);
  if (!result || result.status !== 'success') {
    throw new Error('Generation failed. Please try again.');
  }

  return result;
}

export default function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [currentResume, setCurrentResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { cooldownSec, startCooldown, isCoolingDown } = useCooldown();

  const isValid = jobDescription.trim().length > 0 && currentResume.trim().length > 0;
  const isGenerateDisabled = !isValid || loading || isCoolingDown;

  const handleGenerate = async () => {
    if (!isValid || loading || isCoolingDown) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setStatusStep(0);

    try {
      const data = await generateResume(jobDescription, currentResume, (step) => {
        setStatusStep(step);
      });
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      if (isRateLimitMessage(message)) {
        startCooldown();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    if (isCoolingDown) return;
    setError(null);
    setResult(null);
    setStatusStep(0);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white">
            ATS Resume Tailor
          </span>
          <button
            onClick={scrollToForm}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark"
          >
            Generate Resume
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-orb absolute inset-0" />
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
            Beat the ATS.{' '}
            <span className="bg-gradient-to-r from-accent-light to-violet-400 bg-clip-text text-transparent">
              Land the interview.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
            Paste your resume and a job description. Get a perfectly tailored,
            keyword-optimized, recruiter-ready PDF in under a minute — powered by Gemini.
          </p>
          <button
            onClick={scrollToForm}
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition hover:bg-accent-dark hover:shadow-accent/40"
          >
            Tailor My Resume →
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-surface-border bg-surface-raised/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-10 text-center text-2xl font-bold text-white">How it works</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { step: '1', title: 'Paste your resume & the JD' },
              { step: '2', title: 'Gemini rewrites & optimizes for ATS' },
              { step: '3', title: 'Download your tailored PDF' },
            ].map((card) => (
              <div
                key={card.step}
                className="rounded-2xl border border-surface-border bg-surface p-6 transition hover:border-accent/40"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent-light">
                  {card.step}
                </div>
                <p className="font-medium text-gray-200">{card.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator Form */}
      <section id="generator" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-2 text-center text-3xl font-bold text-white">
            Generate your tailored resume
          </h2>
          <p className="mb-10 text-center text-gray-400">
            Fill in both fields below to get started.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label
                htmlFor="job-description"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Job Description
              </label>
              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here…"
                className="min-h-[320px] w-full resize-y rounded-xl border border-surface-border bg-surface-raised p-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="current-resume"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                Your Current Resume
              </label>
              <textarea
                id="current-resume"
                value={currentResume}
                onChange={(e) => setCurrentResume(e.target.value)}
                placeholder="Paste your current resume text here…"
                className="min-h-[320px] w-full resize-y rounded-xl border border-surface-border bg-surface-raised p-4 text-sm text-gray-100 placeholder-gray-500 outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="inline-flex min-w-[240px] items-center justify-center gap-3 rounded-xl bg-accent px-10 py-4 text-base font-semibold text-white shadow-lg shadow-accent/20 transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading && <Spinner />}
              {loading
                ? 'Generating…'
                : isCoolingDown
                  ? `Wait ${cooldownSec}s…`
                  : 'Generate ATS Resume'}
            </button>

            {isCoolingDown && !loading && (
              <p className="mt-4 text-sm text-amber-300/90">
                Gemini rate limit reached. Please wait {cooldownSec}s before trying again.
              </p>
