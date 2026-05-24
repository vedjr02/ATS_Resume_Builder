import { useState } from 'react';
import Button from '../ui/Button.jsx';
import TextareaField from '../ui/TextareaField.jsx';
import StatusTimeline from '../generator/StatusTimeline.jsx';
import ResultPanel from '../generator/ResultPanel.jsx';
import ErrorPanel from '../generator/ErrorPanel.jsx';
import { useCooldown } from '../../hooks/useCooldown.js';
import { isRateLimitMessage } from '../../utils/rateLimit.js';
import { generateResume } from '../../lib/api.js';

export default function Generator() {
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
    <section id="generator" className="relative py-24 sm:py-32">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-96 -translate-y-1/2 bg-gradient-radial from-brand-500/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300/80">Generator</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Tailor your resume now
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            Paste both fields below. Your content stays in-memory and is never stored.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <TextareaField
              id="job-description"
              label="Job Description"
              hint="Include role requirements, responsibilities, and preferred skills."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here…"
              disabled={loading}
            />
            <TextareaField
              id="current-resume"
              label="Your Current Resume"
              hint="Plain text only — not LaTeX. Include all sections you want preserved."
              value={currentResume}
              onChange={(e) => setCurrentResume(e.target.value)}
              placeholder="Paste your current resume text here…"
              disabled={loading}
            />
          </div>

          <div className="mt-10 flex flex-col items-center">
            <Button
              variant="primary"
              size="lg"
              loading={loading}
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="min-w-[260px]"
            >
              {loading
                ? 'Generating…'
                : isCoolingDown
                  ? `Wait ${cooldownSec}s…`
                  : 'Generate ATS Resume'}
            </Button>

            {isCoolingDown && !loading && (
              <p className="mt-5 animate-fade-up text-sm text-amber-300/90">
                Rate limit reached — please wait {cooldownSec}s before trying again.
              </p>
            )}

            {loading && (
              <div className="mt-10 w-full">
                <StatusTimeline statusStep={statusStep} />
              </div>
            )}

            {result && !loading && (
              <div className="mt-10 w-full">
                <ResultPanel result={result} />
              </div>
            )}

            {error && !loading && (
              <div className="mt-10 w-full">
                <ErrorPanel
                  error={error}
                  onRetry={handleTryAgain}
                  cooldownSec={cooldownSec}
                  isCoolingDown={isCoolingDown}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
