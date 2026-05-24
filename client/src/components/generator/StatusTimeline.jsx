import Spinner from '../ui/Spinner.jsx';
import { STATUS_STEPS } from '../../constants/content.js';

export default function StatusTimeline({ statusStep }) {
  return (
    <div className="mx-auto w-full max-w-md animate-fade-up">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
        Processing pipeline
      </p>
      <div className="space-y-1">
        {STATUS_STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isActive = statusStep === stepNum;
          const isDone = statusStep > stepNum;
          const isPending = statusStep < stepNum;

          return (
            <div
              key={step}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm transition-all duration-500 ${
                isActive
                  ? 'border border-brand-400/20 bg-brand-500/10 text-brand-100'
                  : isDone
                    ? 'text-emerald-400/90'
                    : isPending
                      ? 'text-zinc-600'
                      : 'text-zinc-400'
              }`}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center">
                {isDone ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-300">
                    ✓
                  </span>
                ) : isActive ? (
                  <Spinner className="h-4 w-4 text-brand-300" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-zinc-700" />
                )}
              </div>
              <span className={isActive ? 'font-medium' : ''}>{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
