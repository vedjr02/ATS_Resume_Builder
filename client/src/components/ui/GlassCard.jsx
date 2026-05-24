export default function GlassCard({ children, className = '', glow = false }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 hover:border-white/[0.14] hover:bg-white/[0.05] ${glow ? 'shadow-card-glow' : 'shadow-card'} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
