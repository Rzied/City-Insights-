export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-ink dark:text-white">{value}</p>
    </div>
  );
}
