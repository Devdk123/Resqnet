type Props = { tone?: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; children: React.ReactNode };

export function StatusBadge({ tone = 'neutral', children }: Props) {
  const toneMap = {
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    danger: 'bg-red-500/10 text-red-300 border border-red-500/30',
    info: 'bg-sky-500/10 text-sky-300 border border-sky-500/30',
    neutral: 'bg-slate-700/50 text-slate-200 border border-slate-600'
  };

  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${toneMap[tone]}`}>{children}</span>;
}
