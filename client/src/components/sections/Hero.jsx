import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';
import { HERO_STATS } from '../../constants/content.js';
import { scrollToForm } from '../../lib/scroll.js';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      <div className="hero-mesh pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="noise pointer-events-none absolute inset-0 opacity-[0.035]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
            <Badge variant="brand">ATS-optimized output</Badge>
            <Badge variant="mint">LaTeX → PDF pipeline</Badge>
          </div>

          <h1 className="font-display text-5xl font-semibold tracking-tight text-white sm:text-7xl sm:leading-[1.05]">
            Beat the ATS.
            <span className="mt-2 block bg-gradient-to-r from-brand-200 via-violet-200 to-mint-200 bg-clip-text text-transparent">
              Land the interview.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
            Paste your resume and a job description. Get a keyword-aligned, recruiter-ready PDF in under a minute — crafted with precision, not generic AI filler.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" size="lg" onClick={scrollToForm}>
              Tailor My Resume
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-3 sm:gap-6">
          {HERO_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-5 text-center backdrop-blur-md transition hover:border-white/10 hover:bg-white/[0.04]"
            >
              <p className="font-display text-2xl font-semibold text-white sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
