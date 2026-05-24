import { FEATURES } from '../../constants/content.js';

export default function Features() {
  return (
    <section id="features" className="relative py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-white/[0.04] via-transparent to-brand-500/[0.04] p-8 sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mint-300/80">Why this works</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Built for real applications, not demo pages
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                Every generation follows your fixed LaTeX resume structure while rewriting content to match the role you are targeting.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className="rounded-2xl border border-white/[0.06] bg-obsidian-900/50 p-5 transition hover:border-white/10 hover:bg-obsidian-900/80"
                >
                  <div className="mb-3 h-1 w-8 rounded-full bg-gradient-to-r from-brand-400 to-violet-400" />
                  <h3 className="text-sm font-semibold text-white">{feature.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-500">{feature.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
