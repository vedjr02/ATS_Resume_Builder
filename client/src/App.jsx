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
