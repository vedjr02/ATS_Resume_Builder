export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-obsidian-950/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 text-center md:flex-row md:text-left lg:px-8">
        <div>
          <p className="text-sm font-semibold text-zinc-200">ATS Resume Tailor</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-zinc-500">
            Your resume and job description are processed in-memory and never stored on disk.
          </p>
        </div>
        <p className="text-xs tabular-nums text-zinc-600">© {new Date().getFullYear()} · Built for precision applications</p>
      </div>
    </footer>
  );
}
