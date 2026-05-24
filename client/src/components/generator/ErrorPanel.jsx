import Button from '../ui/Button.jsx';

export default function ErrorPanel({ error, onRetry, cooldownSec, isCoolingDown }) {
  if (!error) return null;

  return (
    <div className="mx-auto w-full max-w-lg animate-fade-up">
      <div className="relative overflow-hidden rounded-2xl border border-red-500/25 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent p-8 text-center">
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-red-400/10 blur-3xl" />
        <div className="relative">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/15">
            <svg className="h-7 w-7 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-50">Something went wrong</h3>
          <p className="mt-3 text-sm leading-relaxed text-red-200/75">{error}</p>
          <div className="mt-6">
            <Button variant="secondary" onClick={onRetry} disabled={isCoolingDown}>
              {isCoolingDown ? `Wait ${cooldownSec}s` : 'Try again'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
