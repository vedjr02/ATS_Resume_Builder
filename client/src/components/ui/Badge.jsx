export default function Badge({ children, variant = 'default' }) {
  const styles = {
    default: 'border-white/10 bg-white/[0.04] text-zinc-300',
    brand: 'border-brand-400/20 bg-brand-500/10 text-brand-200',
    mint: 'border-mint-400/20 bg-mint-500/10 text-mint-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wider backdrop-blur-md ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
