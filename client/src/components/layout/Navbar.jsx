import Button from '../ui/Button.jsx';
import { scrollToForm } from '../../lib/scroll.js';

function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-violet-500/10 shadow-inner">
        <div className="h-3 w-3 rounded-sm bg-gradient-to-br from-brand-300 to-violet-300 shadow-glow-sm" />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight text-white">ATS Resume Tailor</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">By Ved</p>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-obsidian-950/70 backdrop-blur-2xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <LogoMark />
        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-zinc-400 transition hover:text-white">
            How it works
          </a>
          <a href="#features" className="text-sm font-medium text-zinc-400 transition hover:text-white">
            Features
          </a>
          <a href="#generator" className="text-sm font-medium text-zinc-400 transition hover:text-white">
            Generator
          </a>
        </div>
        <Button variant="primary" size="sm" onClick={scrollToForm}>
          Generate Resume
        </Button>
      </div>
    </nav>
  );
}
