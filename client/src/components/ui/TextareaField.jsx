export default function TextareaField({
  id,
  label,
  hint,
  value,
  onChange,
  placeholder,
  disabled,
  minHeight = 'min-h-[340px]',
}) {
  const charCount = value.length;

  return (
    <div className="group/field">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <label htmlFor={id} className="block text-sm font-semibold tracking-wide text-zinc-100">
            {label}
          </label>
          {hint && <p className="mt-1 text-xs leading-relaxed text-zinc-500">{hint}</p>}
        </div>
        <span className="text-xs tabular-nums text-zinc-600 transition-colors group-focus-within/field:text-zinc-400">
          {charCount.toLocaleString()} chars
        </span>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute -inset-px rounded-[1.1rem] bg-gradient-to-br from-brand-500/0 via-brand-400/0 to-violet-500/0 opacity-0 blur-sm transition-all duration-500 group-focus-within/field:from-brand-500/20 group-focus-within/field:via-brand-400/10 group-focus-within/field:to-violet-500/20 group-focus-within/field:opacity-100" />
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`relative w-full resize-y ${minHeight} rounded-2xl border border-white/[0.08] bg-obsidian-800/80 px-5 py-4 text-sm leading-relaxed text-zinc-100 shadow-inner shadow-black/20 placeholder:text-zinc-600 outline-none transition-all duration-300 focus:border-brand-400/40 focus:bg-obsidian-800 focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50`}
        />
      </div>
    </div>
  );
}
