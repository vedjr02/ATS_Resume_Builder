import GlassCard from '../ui/GlassCard.jsx';
import { HOW_IT_WORKS } from '../../constants/content.js';

const icons = {
  clipboard: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6M9 8h6M7 4h10a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V6a2 2 0 012-2z" />
  ),
  sparkles: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  ),
  download: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 11.25L12 15.75m0 0l4.5-4.5M12 15.75V3" />
  ),
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-300/80">Process</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Three steps to a tailored resume
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-400">
            No templates to fiddle with. No formatting guesswork. Just focused inputs and a polished PDF out the other side.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {HOW_IT_WORKS.map((item, index) => (
            <GlassCard key={item.step} className="group h-full" glow={index === 1}>
              <div className="mb-5 flex items-center justify-between">
                <span className="font-display text-3xl font-light text-white/20">{item.step}</span>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-brand-200 transition group-hover:border-brand-400/30 group-hover:text-brand-100">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    {icons[item.icon]}
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
