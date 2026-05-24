import Spinner from './Spinner.jsx';

const variants = {
  primary:
    'bg-gradient-to-r from-brand-500 via-brand-400 to-violet-400 text-white shadow-glow hover:shadow-glow-lg hover:brightness-110',
  secondary:
    'border border-white/10 bg-white/[0.04] text-zinc-100 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.07]',
  success: 'bg-emerald-500/90 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/20',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/[0.05]',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`group relative inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-white/0 via-white/10 to-white/0" />
      )}
    </button>
  );
}
